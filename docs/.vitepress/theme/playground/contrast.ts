import { contrast, type ContrastIssue } from "@eos-ui/tokens";
import { isHex } from "./model";

// Contrast maths for the playground: the pairs it judges, token resolution and the status lines. Pure, so it is unit tested without a browser.

interface Pair {
  fg: string;
  bg: string;
  min: number;
  role: string;
  /** Not promised by `defineTheme`; shown so a custom palette is judged on the same footing. */
  extra?: boolean;
}

/** The pairs `defineTheme` promises, in its own order, then a few it does not check but the components rely on. */
const PAIRS: Pair[] = [
  { fg: "ink", bg: "surface", min: 7, role: "Body text" },
  { fg: "ink", bg: "surface-tint", min: 7, role: "Text on the tinted ground" },
  { fg: "muted", bg: "surface", min: 4.5, role: "Secondary text" },
  { fg: "on-primary", bg: "primary", min: 4.5, role: "Primary button label" },
  { fg: "primary", bg: "surface", min: 4.5, role: "Links and small primary text" },
  { fg: "on-secondary", bg: "secondary", min: 4.5, role: "Secondary button label" },
  { fg: "on-danger", bg: "danger", min: 4.5, role: "Danger button label" },
  { fg: "danger", bg: "surface", min: 4.5, role: "Error text" },
  { fg: "danger", bg: "danger-soft", min: 4.5, role: "Danger notice text" },
  { fg: "warning-strong", bg: "warning-soft", min: 4.5, role: "Warning notice text" },
  { fg: "success", bg: "success-soft", min: 4.5, role: "Success notice text" },
  { fg: "border", bg: "surface", min: 3, role: "Card outline (non-text)" },
  { fg: "border-strong", bg: "surface", min: 3, role: "Control edge (non-text)" },
  { fg: "ink", bg: "background", min: 7, role: "Text on the page" },
  { fg: "muted", bg: "background", min: 4.5, role: "Secondary text on the page" },
  { fg: "primary", bg: "background", min: 4.5, role: "Links on the page" },
  { fg: "border", bg: "background", min: 3, role: "Outline on the page (non-text)" },
  { fg: "muted", bg: "surface-tint", min: 4.5, role: "Secondary text on the tint", extra: true },
  { fg: "focus-ring", bg: "surface", min: 3, role: "Focus outline (non-text)", extra: true },
  { fg: "focus-field", bg: "surface", min: 3, role: "Input focus edge (non-text)", extra: true },
];

export interface PairResult extends Pair {
  ratio: number;
  pass: boolean;
  fgValue: string;
  bgValue: string;
}

export function resolve(tokens: Record<string, string>, name: string, seen = new Set<string>()): string {
  const v = tokens[name] ?? "";
  const m = /^var\(--e-([a-z0-9-]+)\)$/.exec(v);
  if (!m || seen.has(name)) return v;
  seen.add(name);
  return resolve(tokens, m[1]!, seen);
}

export function checkPairs(tokens: Record<string, string>): PairResult[] {
  const out: PairResult[] = [];
  for (const p of PAIRS) {
    const fgValue = resolve(tokens, p.fg);
    const bgValue = resolve(tokens, p.bg);
    if (!isHex(fgValue) || !isHex(bgValue)) continue;
    const ratio = Math.round(contrast(fgValue, bgValue) * 100) / 100;
    out.push({ ...p, ratio, pass: ratio >= p.min, fgValue, bgValue });
  }
  return out;
}
