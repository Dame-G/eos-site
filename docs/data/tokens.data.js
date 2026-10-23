import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { constants, contrast, defaults, defineTheme, derivedFrom } from "@eos-ui/tokens";

import { INPUT_NOTES, NOT_INPUTS } from "./theme-inputs.js";
import { firstSentence, interfaceMembers } from "./theme-source.js";

const require = createRequire(import.meta.url);
const file = require.resolve("@eos-ui/tokens/tokens.json");

const PARTNERS = {
  "brand-blue": [["ink", "Decoration only"]],
  "brand-green": [["ink", "Decoration only"]],
  primary: [
    ["on-primary", "Primary button label"],
    ["surface", "Links and small primary text"],
  ],
  "on-primary": [["primary", "Primary button label"]],
  secondary: [
    ["on-secondary", "Secondary button label"],
    ["secondary-soft", "Success notice text"],
  ],
  "on-secondary": [["secondary", "Secondary button label"]],
  "secondary-soft": [["secondary", "Success notice text"]],
  danger: [
    ["on-danger", "Danger button label"],
    ["surface", "Error text"],
    ["danger-soft", "Danger notice text"],
  ],
  "on-danger": [["danger", "Danger button label"]],
  "danger-soft": [["danger", "Danger notice text"]],
  "warning-strong": [["warning-soft", "Warning notice text"]],
  "warning-soft": [["warning-strong", "Warning notice text"]],
  background: [
    ["ink", "Text on the page"],
    ["muted", "Secondary text on the page"],
    ["primary", "Links on the page"],
    ["border", "Outline on the page (non-text)"],
  ],
  surface: [["ink", "Body text"]],
  "surface-tint": [["ink", "Text on the tinted ground"]],
  ink: [["surface", "Body text"]],
  muted: [["surface", "Secondary text"]],
  border: [["surface", "Card outline (non-text)"]],
  "border-strong": [["surface", "Control edge (non-text)"]],
  "focus-ring": [["surface", "Focus outline (non-text)"]],
  "focus-field": [["surface", "Text input focus (non-text)"]],
};

const NON_TEXT = new Set(["border", "border-strong", "focus-ring", "focus-field"]);

function resolveColour(name) {
  let v = defaults[name];
  let guard = 0;
  while (typeof v === "string" && v.startsWith("var(--e-") && guard++ < 5) v = defaults[v.slice(8, -1)];
  return v;
}

function level(ratio, nonText) {
  if (nonText) return ratio >= 3 ? "3:1 or more (non-text)" : "Fails 3:1";
  if (ratio >= 7) return "AAA";
  if (ratio >= 4.5) return "AA";
  if (ratio >= 3) return "Large text only";
  return "Fails";
}

/** The inputs come from ThemeInput in the tokens package, so a new input appears here without an edit. */
function themeInputs() {
  const source = readFileSync(join(dirname(file), "theme.ts"), "utf8");
  return interfaceMembers(source, "ThemeInput")
    .filter((m) => !NOT_INPUTS.includes(m.name))
    .map((m) => {
      const note = INPUT_NOTES[m.name];
      const neutral = note?.neutral;
      return [m.name, note?.controls ?? firstSentence(m.doc), typeof neutral === "object" ? defaults[neutral.token] : (neutral ?? "")];
    });
}


const round = (n) => Math.round(n * 10) / 10;

const provenance = (t) => ({
  from: t.from ? t.from.split(",") : [],
  input: Boolean(t.input),
  constant: Boolean(t.constant) || constants.includes(t.name),
});

export default {
  watch: [file],
  load() {
    const json = JSON.parse(readFileSync(file, "utf8"));
    const colours = json.color.tokens.map((t) => {
      const value = resolveColour(t.name);
      const nonText = NON_TEXT.has(t.name);
      const partners = (PARTNERS[t.name] ?? [])
        .map(([other, role]) => {
          const b = resolveColour(other);
          if (!value?.startsWith("#") || !b?.startsWith("#")) return null;
          const ratio = contrast(value, b);
          return { name: other, value: b, role, ratio: round(ratio), level: level(ratio, nonText || /non-text/.test(role)) };
        })
        .filter(Boolean);
      return { name: t.name, value, source: t.value, usage: t.usage, partners, ...provenance(t) };
    });

    const promised = [
      ["ink", "surface", 7, "Body text"],
      ["ink", "surface-tint", 7, "Text on the tinted ground"],
      ["muted", "surface", 4.5, "Secondary text"],
      ["on-primary", "primary", 4.5, "Primary button label, selected day, checked box"],
      ["primary", "surface", 4.5, "Links and small primary text"],
      ["on-secondary", "secondary", 4.5, "Secondary button label"],
      ["on-danger", "danger", 4.5, "Danger button label"],
      ["danger", "surface", 4.5, "Error text"],
      ["danger", "danger-soft", 4.5, "Danger chip, stamp and notice text"],
      ["warning-strong", "warning-soft", 4.5, "Warning chip, stamp and notice text"],
      ["secondary", "secondary-soft", 4.5, "Success chip, stamp and notice text"],
      ["border", "surface", 3, "Card outline (non-text)"],
      ["border-strong", "surface", 3, "Control edge (non-text)"],
      ["ink", "background", 7, "Text on the page"],
      ["muted", "background", 4.5, "Secondary text on the page"],
      ["primary", "background", 4.5, "Links on the page"],
      ["border", "background", 3, "Outline on the page (non-text)"],
    ].map(([fg, bg, min, use]) => {
      const ratio = contrast(resolveColour(fg), resolveColour(bg));
      return { fg, bg, fgValue: resolveColour(fg), bgValue: resolveColour(bg), min, use, ratio: round(ratio), level: level(ratio, min === 3) };
    });

    const theme = defineTheme({ name: "light" });
    const scale = (key) => json[key].tokens.map((t) => ({ name: t.name, value: t.value, usage: t.usage, ...provenance(t) }));
    const inputs = themeInputs().map(([name, controls, neutral]) => ({
      name,
      controls,
      neutral,
      derives: Object.entries(derivedFrom)
        .filter(([, from]) => from.split(",").includes(name))
        .map(([token]) => token),
    }));

    return {
      inputs,
      colours,
      promised,
      issues: theme.issues,
      spacing: scale("spacing"),
      radius: scale("radius"),
      shadow: scale("shadow"),
      fontSize: scale("fontSize"),
      size: scale("size"),
      stroke: scale("stroke"),
      // Newer token groups: the semantic spacing roles (gap, pad, gutter) and the type rhythm. Empty against an older tokens package.
      layout: json.layout ? scale("layout") : [],
      tracking: json.tracking ? scale("tracking") : [],
      leading: json.leading ? scale("leading") : [],
      duration: scale("duration"),
      easing: scale("easing"),
      zIndex: scale("zIndex"),
      zIndexNote: json.zIndex.note,
      families: json.type.families,
      typeGroups: json.type.groups,
    };
  },
};
