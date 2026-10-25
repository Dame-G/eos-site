import { constants, defaults, defineTheme, derivedFrom, groups, inputTokens, type Theme, type ThemeInput } from "@eos-ui/tokens";
import { COLOUR_KEYS, DEFAULT_ACCENT, DEFAULT_BRAND, DEFAULT_DANGER, DEFAULT_GROUND, DEFAULT_SUCCESS, DEFAULT_WARNING, MONO, NEUTRAL, SAFE, SANS, isHex, type State, type Variants } from "./model";

// Turns a state into a theme and into the code that reproduces it.

export interface Built {
  /** The `defineTheme` input that reproduces this state with the least code. */
  input: ThemeInput;
  theme: Theme;
  /** Explicit token overrides: what the inputs do not produce. Empty for every preset and for any state set only through the controls. */
  extra: Record<string, string>;
  /** Every override, before diffing against the derived base. */
  overrides: Record<string, string>;
}

const SHADOWS = ["shadow-frame", "shadow-well", "shadow-float"] as const;
const literal = (v: string) => v.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function followShadows(base: Record<string, string>, next: Record<string, string>): Record<string, string> {
  const swap = new Map<string, string>();
  for (const k of ["border", "ink"]) if (base[k] !== next[k]) swap.set(base[k]!, next[k]!);
  if (!swap.size) return {};
  const re = new RegExp([...swap.keys()].map(literal).join("|"), "g");
  const out: Record<string, string> = {};
  for (const k of SHADOWS) {
    // A library release may drop or rename a shadow token; one that is not there has nothing to follow.
    if (!base[k]) continue;
    const v = base[k].replace(re, (m) => swap.get(m)!);
    if (v !== base[k]) out[k] = v;
  }
  return out;
}


export function build(s: State, name = "my-theme"): Built {
  const input: ThemeInput = { name };
  const hex = (v: string, fallback: string) => (isHex(v) ? v : fallback);
  for (const [k, v, d] of [
    ["brand", s.brand, DEFAULT_BRAND],
    ["accent", s.accent, DEFAULT_ACCENT],
    ["danger", s.danger, DEFAULT_DANGER],
    ["warning", s.warning, DEFAULT_WARNING],
    ["success", s.success, DEFAULT_SUCCESS],
    ["background", s.background, DEFAULT_GROUND.background],
    ["surface", s.surface, DEFAULT_GROUND.surface],
    ["foreground", s.foreground, DEFAULT_GROUND.foreground],
  ] as const) {
    const value = hex(v, d);
    if (value.toLowerCase() !== d.toLowerCase()) input[k] = value;
  }
  const fonts: { sans?: string; mono?: string } = {};
  const sans = s.sans === "custom" ? s.sansCustom.trim() : SANS[s.sans]?.stack;
  const mono = s.mono === "custom" ? s.monoCustom.trim() : MONO[s.mono]?.stack;
  if (sans && sans !== defaults["font-sans"]) fonts.sans = sans;
  if (mono && mono !== defaults["font-mono"]) fonts.mono = mono;
  if (fonts.sans || fonts.mono) input.fonts = fonts;
  if (s.radius !== "default") input.radius = s.radius;
  if (s.textScale !== 100) input.textScale = s.textScale / 100;
  if (s.spaceScale !== 100) input.spaceScale = s.spaceScale / 100;
  // The page and text colours follow the surface when omitted, so they are written whenever that would change what is on screen.
  if (input.surface) {
    if (!input.background && hex(s.background, DEFAULT_GROUND.background).toLowerCase() !== input.surface.toLowerCase()) input.background = hex(s.background, DEFAULT_GROUND.background);
    if (!input.foreground) {
      const fg = hex(s.foreground, DEFAULT_GROUND.foreground);
      if (defineTheme({ surface: input.surface }).tokens["ink"]!.toLowerCase() !== fg.toLowerCase()) input.foreground = fg;
    }
  }
  if (s.scheme === "contrast") input.contrast = "high";
  else if (s.autoContrast) input.contrast = "auto";
  if (s.autoScheme) input.scheme = "auto";
  if (s.density !== "comfortable") input.density = s.density;
  if (s.themePreset !== "none") input.preset = s.themePreset;
  const strokes: NonNullable<ThemeInput["strokes"]> = {};
  if (s.hair !== NEUTRAL.hair) strokes.hair = s.hair;
  if (s.focus !== NEUTRAL.focus) strokes.focus = s.focus;
  // `strokes` takes only hair and focus, which derive the edge and card strokes, so a pinned stroke-edge or stroke-card stays a token.
  const t = { ...s.t };
  if (Object.keys(strokes).length) input.strokes = strokes;
  if (s.motion !== "default") input.motion = s.motion;
  if (s.elevation !== "outline" || input.surface || input.foreground) input.elevation = s.elevation;
  if (s.controlHeight !== NEUTRAL.controlHeight) input.controlHeight = s.controlHeight;

  const base = defineTheme(input).tokens;
  const follow = followShadows(base, { ...base, ...pickColours(t) });
  const overrides: Record<string, string> = { ...follow, ...t };
  const extra: Record<string, string> = {};
  for (const [k, v] of Object.entries(overrides)) if (base[k] !== v && SAFE.test(v)) extra[k] = v;
  if (Object.keys(extra).length) input.tokens = extra as ThemeInput["tokens"];
  return { input, theme: defineTheme(input), extra, overrides };
}

function pickColours(t: Record<string, string>) {
  const out: Record<string, string> = {};
  for (const k of COLOUR_KEYS) if (t[k]) out[k] = t[k];
  return out;
}

export type ControlTab = "colour" | "shape" | "type" | "space" | "motion";

const TAB_GROUPS: Record<ControlTab, readonly (keyof typeof groups)[]> = {
  colour: ["color"],
  shape: ["radius", "shadow", "stroke"],
  type: ["fontSize"],
  space: ["spacing", "size"],
  motion: ["duration", "easing"],
};

export interface DerivedToken {
  name: string;
  /** The inputs that drive it, in the library's own names. */
  from: string;
}

/** The tokens of a tab that follow an input, with that input. The inputs' own tokens and the constants are left out. */
export function derivedTokens(tab: ControlTab): DerivedToken[] {
  const skip = new Set([...inputTokens, ...constants]);
  return TAB_GROUPS[tab]
    .flatMap((g) => groups[g] as readonly string[])
    .filter((name) => derivedFrom[name] && !skip.has(name))
    .map((name) => ({ name, from: derivedFrom[name]!.split(",").join(", ") }));
}

const q = (v: string) => JSON.stringify(v);
const key = (k: string) => (/^[a-z]+$/i.test(k) ? k : q(k));

export function themeCode(b: Built): string {
  const i = b.input;
  const lines: string[] = [];
  lines.push(`name: ${q(i.name ?? "my-theme")},`);
  if (i.preset) lines.push(`preset: ${q(i.preset)},`);
  if (i.scheme) lines.push(`scheme: ${q(i.scheme)},`);
  if (i.density) lines.push(`density: ${q(i.density)},`);
  for (const k of ["brand", "accent", "danger", "warning", "success", "background", "surface", "foreground"] as const) if (i[k]) lines.push(`${k}: ${q(i[k])},`);
  if (i.radius) lines.push(`radius: ${q(i.radius as string)},`);
  if (i.elevation) lines.push(`elevation: ${q(i.elevation)},`);
  if (i.contrast) lines.push(`contrast: ${q(i.contrast)},`);
  if (i.strokes) lines.push(`strokes: { ${Object.entries(i.strokes).map(([k, v]) => `${k}: ${v}`).join(", ")} },`);
  if (i.fonts) lines.push(`fonts: { ${Object.entries(i.fonts).map(([k, v]) => `${k}: ${q(v)}`).join(", ")} },`);
  if (i.textScale) lines.push(`textScale: ${i.textScale},`);
  if (i.spaceScale) lines.push(`spaceScale: ${i.spaceScale},`);
  if (i.controlHeight) lines.push(`controlHeight: ${i.controlHeight},`);
  if (i.motion) lines.push(`motion: ${q(i.motion)},`);
  if (i.tokens) {
    lines.push("tokens: {");
    for (const [k, v] of Object.entries(i.tokens)) lines.push(`  ${key(k)}: ${q(v as string)},`);
    lines.push("},");
  }
  return `import { createEos, defineTheme } from "@eos-ui/vue";\n\nconst theme = defineTheme({\n${lines.map((l) => "  " + l).join("\n")}\n});\n\napp.use(createEos({ theme }));`;
}

export function cssChanges(b: Built): string {
  const defs = defineTheme().tokens;
  const changed = Object.entries(b.theme.tokens).filter(([k, v]) => defs[k] !== v);
  if (!changed.length) return `:root {\n  /* No changes: these are the defaults. */\n}`;
  return `:root {\n${changed.map(([k, v]) => `  --e-${k}: ${v};`).join("\n")}\n}`;
}

export function cssFull(b: Built): string {
  return b.theme.css({ header: true });
}

const SPACE_GAP = { tight: 3, default: 4, roomy: 6 } as const;
const INLINE_GAP = { tight: 1, default: 2, roomy: 3 } as const;
/** ESurface `padding` for each surface size: the medium one is the default `pad-card`, so it sets nothing. */
const SURFACE_PADDING = { sm: "var(--e-gap-base) var(--e-pad-card)", md: undefined, lg: "section" } as const;

/** The props each variant maps to, as the previews apply them. */
export function variantProps(v: Variants) {
  return {
    padding: SURFACE_PADDING[v.size],
    gap: SPACE_GAP[v.gap],
    inlineGap: INLINE_GAP[v.gap],
  };
}

/** The component props the current look used, one tag per line. Empty when every variant is a default. */
export function variantCode(v: Variants): string {
  const g = SPACE_GAP[v.gap];
  const lines = [
    v.size === "md" ? "" : `<ESurface padding="${SURFACE_PADDING[v.size]}" />`,
    v.gap === "default" ? "" : `<EStack :gap="${g}" />\n<EGrid :gap="${g}" />`,
  ];
  return lines.filter(Boolean).join("\n");
}
