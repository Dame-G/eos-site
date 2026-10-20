import { constants, contrast, defaults, defineTheme, derivedFrom, groups, inputTokens, type Theme, type ThemeInput } from "@eos-ui/tokens";

type Scheme = "light" | "paper" | "dark" | "contrast" | "custom";
type RadiusStyle = "sharp" | "default" | "round";
type ElevationStyle = "outline" | "lifted" | "bold";
type MotionStyle = "default" | "snappy" | "gentle" | "none";

const VARIANT_VALUES = {
  pad: ["sm", "md", "lg"],
  gap: ["tight", "default", "roomy"],
} as const;

export type Variants = { [K in keyof typeof VARIANT_VALUES]: (typeof VARIANT_VALUES)[K][number] };
export type VariantKey = keyof Variants;

const VARIANT_KEYS = Object.keys(VARIANT_VALUES) as VariantKey[];

export const DEFAULT_VARIANTS: Variants = { pad: "md", gap: "default" };

export interface State {
  /** The preset last applied, `random` after Randomize, or `custom` once anything was edited. */
  preset: string;
  brand: string;
  accent: string;
  danger: string;
  warning: string;
  /** The page ground: the colour behind everything. */
  background: string;
  /** What sits on the page: cards, fields, popovers, panels. */
  surface: string;
  /** Text and lines. */
  foreground: string;
  /** The ground preset last applied, or `custom` once any of the three ground colours was edited. */
  scheme: Scheme;
  radius: RadiusStyle;
  elevation: ElevationStyle;
  motion: MotionStyle;
  /** Percent of the default type scale. */
  textScale: number;
  /** Percent of the default spacing scale. */
  spaceScale: number;
  /** Hairline weight in px. */
  hair: number;
  /** Focus outline weight in px. */
  focus: number;
  /** Height of every tappable control in px. */
  controlHeight: number;
  sans: string;
  sansCustom: string;
  mono: string;
  monoCustom: string;
  locale: string;
  currency: string;
  /** Component props that change the look without changing a token. */
  variants: Variants;
  /** Direct token overrides. They win over everything the other fields produce. */
  t: Record<string, string>;
}

const DEFAULT_BRAND = defaults["brand-blue"];
const DEFAULT_ACCENT = defaults["brand-green"];
const DEFAULT_DANGER = defaults["danger"];
const DEFAULT_WARNING = defaults["warning-strong"];
export const NEUTRAL = { hair: 1, focus: 2, controlHeight: 48 } as const;
const DEFAULT_GROUND = { background: defaults["background"], surface: defaults["surface"], foreground: defaults["ink"] };

interface Ground {
  background: string;
  surface: string;
  foreground: string;
}

const SCHEMES: Record<Exclude<Scheme, "custom">, Ground> = {
  light: { ...DEFAULT_GROUND },
  paper: { background: "#f7f0e3", surface: "#fffdf7", foreground: "#1f1a14" },
  dark: { background: "#0a0e11", surface: "#0f1418", foreground: "#ffffff" },
  contrast: { ...DEFAULT_GROUND },
};

export function groundOf(scheme: Scheme): Ground {
  return scheme === "custom" ? { ...DEFAULT_GROUND } : { ...SCHEMES[scheme] };
}

const withGround = (scheme: Exclude<Scheme, "custom">): Pick<State, "scheme" | keyof Ground> => ({ scheme, ...SCHEMES[scheme] });

export const SANS: Record<string, { label: string; stack: string }> = {
  bricolage: { label: "Bricolage Grotesque (default)", stack: defaults["font-sans"] },
  system: { label: "System UI", stack: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif' },
  humanist: { label: "Humanist", stack: 'Seravek, "Gill Sans Nova", Calibri, "Trebuchet MS", sans-serif' },
  serif: { label: "Serif", stack: 'Georgia, "Times New Roman", serif' },
  verdana: { label: "Verdana", stack: "Verdana, Geneva, sans-serif" },
  custom: { label: "Custom stack", stack: "" },
};
export const MONO: Record<string, { label: string; stack: string }> = {
  geist: { label: "Geist Mono (default)", stack: defaults["font-mono"] },
  system: { label: "System mono", stack: 'ui-monospace, "Cascadia Code", Menlo, Consolas, monospace' },
  courier: { label: "Courier", stack: '"Courier New", Courier, monospace' },
  custom: { label: "Custom stack", stack: "" },
};

export const LOCALES = [
  { value: "en-US", label: "English (United States)" },
  { value: "en-CA", label: "English (Canada)" },
  { value: "fr-CA", label: "French (Canada)" },
  { value: "de-DE", label: "German" },
  { value: "ja-JP", label: "Japanese" },
  { value: "ar-EG", label: "Arabic (right to left)" },
];
export const CURRENCIES = ["USD", "CAD", "EUR", "GBP", "JPY"];

const COLOUR_KEYS = [
  "background",
  "surface",
  "surface-tint",
  "ink",
  "muted",
  "border",
  "border-strong",
  "danger",
  "danger-soft",
  "on-danger",
  "warning-strong",
  "warning-soft",
  "primary",
  "on-primary",
  "secondary",
  "on-secondary",
  "secondary-soft",
  "focus-ring",
  "focus-field",
  "scrim",
];

export function initialState(): State {
  return {
    preset: "eos",
    brand: DEFAULT_BRAND,
    accent: DEFAULT_ACCENT,
    danger: DEFAULT_DANGER,
    warning: DEFAULT_WARNING,
    ...DEFAULT_GROUND,
    scheme: "light",
    radius: "default",
    elevation: "outline",
    motion: "default",
    textScale: 100,
    spaceScale: 100,
    hair: NEUTRAL.hair,
    focus: NEUTRAL.focus,
    controlHeight: NEUTRAL.controlHeight,
    sans: "bricolage",
    sansCustom: "",
    mono: "geist",
    monoCustom: "",
    locale: "en-US",
    currency: "USD",
    variants: { ...DEFAULT_VARIANTS },
    t: {},
  };
}

export const SAFE = /^[^;{}<>\\]*$/;
const isHex = (v: string) => /^#[0-9a-f]{6}$/i.test(v);

interface Built {
  /** The `defineTheme` input that reproduces this state with the least code. */
  input: ThemeInput;
  theme: Theme;
  /** Explicit token overrides: what the inputs do not produce. Empty for every preset and for any state set only through the controls. */
  extra: Record<string, string>;
  /** Every override, before diffing against the derived base. */
  overrides: Record<string, string>;
}

const SHADOWS = ["edge", "well", "float"] as const;
const literal = (v: string) => v.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function followShadows(base: Record<string, string>, next: Record<string, string>): Record<string, string> {
  const swap = new Map<string, string>();
  for (const k of ["border", "ink"]) if (base[k] !== next[k]) swap.set(base[k]!, next[k]!);
  if (!swap.size) return {};
  const re = new RegExp([...swap.keys()].map(literal).join("|"), "g");
  const out: Record<string, string> = {};
  for (const k of SHADOWS) {
    const v = base[k]!.replace(re, (m) => swap.get(m)!);
    if (v !== base[k]) out[k] = v;
  }
  return out;
}

/** Overrides of tokens that have a typed input: lifted out of `t` so the export says `strokes: { edge: 2 }` rather than a raw token. */
const TYPED_STROKES = { "stroke-edge": "edge", "stroke-card": "card" } as const;

export function build(s: State, name = "my-theme"): Built {
  const input: ThemeInput = { name };
  const hex = (v: string, fallback: string) => (isHex(v) ? v : fallback);
  for (const [k, v, d] of [
    ["brand", s.brand, DEFAULT_BRAND],
    ["accent", s.accent, DEFAULT_ACCENT],
    ["danger", s.danger, DEFAULT_DANGER],
    ["warning", s.warning, DEFAULT_WARNING],
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
  const strokes: NonNullable<ThemeInput["strokes"]> = {};
  if (s.hair !== NEUTRAL.hair) strokes.hair = s.hair;
  if (s.focus !== NEUTRAL.focus) strokes.focus = s.focus;
  const t = { ...s.t };
  for (const [token, field] of Object.entries(TYPED_STROKES)) {
    const m = /^(\d+(?:\.\d+)?)px$/.exec(t[token] ?? "");
    if (m && +m[1]! > 0) {
      strokes[field] = +m[1]!;
      delete t[token];
    }
  }
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

type ControlTab = "colour" | "shape" | "type" | "space" | "motion";

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
  { fg: "secondary", bg: "secondary-soft", min: 4.5, role: "Success notice text" },
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

interface PairResult extends Pair {
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

function checkPairs(tokens: Record<string, string>): PairResult[] {
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

type PresetSet = Omit<Partial<State>, "variants"> & { variants?: Partial<Variants> };

interface Preset {
  id: string;
  label: string;
  note: string;
  set: PresetSet;
}

export const PRESETS: Preset[] = [
  { id: "eos", label: "Eos", note: "The library defaults.", set: {} },
  {
    id: "paper",
    label: "Paper",
    note: "Warm ground, serif text, round corners, soft lifted cards.",
    set: {
      brand: "#b4642c",
      accent: "#6b8e23",
      danger: "#a3321f",
      warning: "#7a5a00",
      ...withGround("paper"),
      radius: "round",
      elevation: "lifted",
      sans: "serif",
      textScale: 106,
      spaceScale: 110,
      controlHeight: 52,
      motion: "gentle",
      variants: { pad: "lg", disclosure: "card", gap: "roomy" },
    },
  },
  {
    id: "midnight",
    label: "Midnight",
    note: "Dark ground, light action colours, deep shadows.",
    set: {
      brand: "#4aa3df",
      accent: "#6fd18a",
      danger: "#ff6b61",
      ...withGround("dark"),
      elevation: "lifted",
      sans: "system",
      variants: { surface: "tint", disclosure: "card" },
    },
  },
  {
    id: "contrast",
    label: "High contrast",
    note: "Black edges, bold shadows, heavy focus ring, larger type.",
    set: {
      brand: "#0044cc",
      accent: "#006b2d",
      danger: "#b00020",
      ...withGround("contrast"),
      radius: "sharp",
      elevation: "bold",
      hair: 2,
      focus: 3,
      sans: "verdana",
      textScale: 112,
      controlHeight: 52,
      motion: "none",
      t: { "stroke-edge": "2px" },
      variants: { pad: "lg" },
    },
  },
  {
    id: "sharp",
    label: "Sharp",
    note: "Square corners, heavy lines, crisp offset shadows, quick motion.",
    set: {
      brand: "#c2255c",
      accent: "#2b8a3e",
      radius: "sharp",
      elevation: "bold",
      hair: 2,
      sans: "system",
      mono: "courier",
      spaceScale: 90,
      controlHeight: 44,
      motion: "snappy",
      variants: { pad: "sm", gap: "tight" },
    },
  },
  {
    id: "soft",
    label: "Soft",
    note: "Lavender ground, roomy, round, lifted cards, slow easing.",
    set: {
      brand: "#7048e8",
      accent: "#12a37f",
      scheme: "custom",
      background: "#f4f0ff",
      surface: "#ffffff",
      foreground: "#1d1636",
      radius: "round",
      elevation: "lifted",
      textScale: 106,
      spaceScale: 125,
      controlHeight: 56,
      motion: "gentle",
      variants: { pad: "lg", gap: "roomy" },
    },
  },
  {
    id: "dense",
    label: "Dense",
    note: "Cool grey ground, tight spacing and short controls for data screens.",
    set: {
      brand: "#2563eb",
      accent: "#0f766e",
      scheme: "custom",
      background: "#eef1f5",
      surface: "#ffffff",
      foreground: "#111827",
      radius: "sharp",
      sans: "system",
      spaceScale: 75,
      controlHeight: 40,
      motion: "none",
      variants: { pad: "sm", gap: "tight" },
    },
  },
  {
    id: "terminal",
    label: "Terminal",
    note: "Green on near black, monospace text, square corners.",
    set: {
      brand: "#3ddc84",
      accent: "#ffb454",
      danger: "#ff5f56",
      warning: "#ffd866",
      scheme: "custom",
      background: "#050805",
      surface: "#0b110b",
      foreground: "#d6f5d6",
      radius: "sharp",
      sans: "custom",
      sansCustom: 'ui-monospace, "Cascadia Code", Menlo, Consolas, monospace',
      mono: "system",
      spaceScale: 90,
      controlHeight: 44,
      motion: "snappy",
      variants: { pad: "sm" },
    },
  },
  {
    id: "sunrise",
    label: "Sunrise",
    note: "Warm orange on cream, humanist type, round and roomy.",
    set: {
      brand: "#e8590c",
      accent: "#7048e8",
      danger: "#c92a2a",
      warning: "#8f5b00",
      scheme: "custom",
      background: "#fff4e6",
      surface: "#fffaf3",
      foreground: "#2b1b0e",
      radius: "round",
      elevation: "lifted",
      sans: "humanist",
      textScale: 104,
      spaceScale: 112,
      controlHeight: 52,
      motion: "gentle",
      variants: { pad: "lg", surface: "tint", disclosure: "card", gap: "roomy" },
    },
  },
];

export function applyPreset(s: State, id: string) {
  const p = PRESETS.find((x) => x.id === id) ?? PRESETS[0]!;
  Object.assign(s, initialState(), p.set, {
    preset: p.id,
    t: { ...(p.set.t ?? {}) },
    variants: { ...DEFAULT_VARIANTS, ...p.set.variants },
    locale: s.locale,
    currency: s.currency,
  });
}

const rnd = (a: number, b: number) => a + Math.random() * (b - a);
const int = (a: number, b: number, step = 1) => a + Math.floor(Math.random() * (Math.floor((b - a) / step) + 1)) * step;
const chance = (p: number) => Math.random() < p;
const pickOne = <T>(items: readonly T[]): T => items[Math.floor(Math.random() * items.length)]!;
const weighted = <T>(items: readonly (readonly [T, number])[]): T => {
  let r = Math.random() * items.reduce((n, [, w]) => n + w, 0);
  for (const [v, w] of items) if ((r -= w) < 0) return v;
  return items[0]![0];
};
const wrap = (h: number) => ((h % 360) + 360) % 360;
const apart = (a: number, b: number) => Math.min(wrap(a - b), wrap(b - a));

function hsl(h: number, sat: number, lum: number): string {
  const a = (sat / 100) * Math.min(lum / 100, 1 - lum / 100);
  const f = (n: number) => {
    const k = (n + wrap(h) / 30) % 12;
    const c = lum / 100 - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
    return Math.round(255 * c).toString(16).padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function randomVariants(spaceScale: number): Variants {
  const v: Variants = { ...DEFAULT_VARIANTS };
  const roomy = spaceScale >= 100;
  if (chance(0.5)) v.pad = roomy ? "lg" : "sm";
  if (chance(0.45)) v.gap = roomy ? "roomy" : "tight";
  return v;
}

function randomOnce(): Partial<State> {
  const kind = weighted([["light", 4], ["tinted", 3], ["dark", 3]] as const);
  const base = rnd(0, 360);
  let ground: Ground;
  if (kind === "light") {
    ground = { background: hsl(base, rnd(15, 40), rnd(95, 97.5)), surface: hsl(base, rnd(20, 50), 99), foreground: hsl(base, rnd(25, 45), rnd(9, 14)) };
  } else if (kind === "tinted") {
    ground = { background: hsl(base, rnd(45, 80), rnd(92, 95)), surface: hsl(base, rnd(40, 80), rnd(97.5, 99)), foreground: hsl(base, rnd(35, 55), rnd(9, 14)) };
  } else {
    ground = { background: hsl(base, rnd(20, 40), rnd(4, 8)), surface: hsl(base, rnd(18, 35), rnd(9, 13)), foreground: hsl(base, rnd(10, 30), rnd(90, 96)) };
  }
  const dark = kind === "dark";
  let hue = rnd(0, 360);
  for (let i = 0; i < 20 && (apart(hue, base) < (kind === "tinted" ? 50 : 20) || apart(hue, 5) < 35); i++) hue = rnd(0, 360);
  let hue2 = wrap(hue + rnd(80, 220));
  for (let i = 0; i < 20 && (apart(hue2, 5) < 35 || apart(hue2, hue) < 70); i++) hue2 = rnd(0, 360);
  const spaceScale = int(80, 125, 5);
  return {
    scheme: "custom",
    ...ground,
    brand: hsl(hue, rnd(55, 85), dark ? rnd(58, 68) : rnd(34, 44)),
    accent: hsl(hue2, rnd(45, 75), dark ? rnd(54, 64) : rnd(30, 38)),
    danger: hsl(rnd(352, 368), rnd(65, 80), dark ? rnd(62, 68) : rnd(38, 44)),
    warning: dark ? hsl(rnd(38, 48), rnd(85, 100), rnd(62, 68)) : hsl(rnd(36, 46), 100, rnd(21, 26)),
    radius: weighted([["sharp", 3], ["default", 3], ["round", 4]] as const),
    elevation: weighted([["outline", 4], ["lifted", 4], ["bold", 2]] as const),
    hair: weighted([[1, 6], [1.5, 2], [2, 3]] as const),
    focus: weighted([[2, 7], [3, 3]] as const),
    sans: weighted([["bricolage", 3], ["system", 2], ["humanist", 2], ["serif", 2], ["verdana", 1]] as const),
    mono: weighted([["geist", 3], ["system", 2], ["courier", 1]] as const),
    textScale: chance(0.8) ? int(100, 112, 2) : int(94, 98, 2),
    spaceScale,
    controlHeight: int(44, 56, 2),
    motion: weighted([["default", 4], ["snappy", 3], ["gentle", 3], ["none", 1]] as const),
    variants: randomVariants(spaceScale),
  };
}

function approved(set: Partial<State>): boolean {
  const built = build({ ...initialState(), ...set, t: {} } as State);
  return built.theme.issues.length === 0 && checkPairs(built.theme.tokens).every((r) => r.pass);
}

/** A new random but coherent look: one ground hue, action colours kept off it, variants picked about half the time. It only returns a look where every contrast pair passes, drawing again until one does. */
function randomSet(): Partial<State> {
  for (let i = 0; i < 400; i++) {
    const set = randomOnce();
    if (approved(set)) return set;
  }
  const preset = pickOne(PRESETS.filter((p) => p.id !== "eos"));
  return { ...preset.set, variants: randomVariants(preset.set.spaceScale ?? 100) };
}

/** Applies a random look as `applyPreset` does, with `random` as the preset so no preset chip is selected. */
export function applyRandom(s: State) {
  const r = randomSet();
  Object.assign(s, initialState(), r, {
    preset: "random",
    t: {},
    variants: { ...DEFAULT_VARIANTS, ...r.variants },
    locale: s.locale,
    currency: s.currency,
  });
}

const b64 = {
  enc: (text: string) => btoa(String.fromCharCode(...new TextEncoder().encode(text))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""),
  dec: (s: string) => new TextDecoder().decode(Uint8Array.from(atob(s.replace(/-/g, "+").replace(/_/g, "/")), (c) => c.charCodeAt(0))),
};

/** Only what differs from the defaults, so a link stays short. */
export function encode(s: State): string {
  const d = initialState();
  const diff: Record<string, unknown> = {};
  for (const k of Object.keys(d) as (keyof State)[]) {
    if (k === "t" || k === "variants") continue;
    if (s[k] !== d[k]) diff[k] = s[k];
  }
  const moved: Record<string, string> = {};
  for (const k of VARIANT_KEYS) if (s.variants[k] !== DEFAULT_VARIANTS[k]) moved[k] = s.variants[k];
  if (Object.keys(moved).length) diff["variants"] = moved;
  if (Object.keys(s.t).length) diff["t"] = s.t;
  return Object.keys(diff).length ? b64.enc(JSON.stringify(diff)) : "";
}

const ENUMS: Partial<Record<keyof State, readonly string[]>> = {
  scheme: ["light", "paper", "dark", "contrast", "custom"],
  radius: ["sharp", "default", "round"],
  elevation: ["outline", "lifted", "bold"],
  motion: ["default", "snappy", "gentle", "none"],
  sans: Object.keys(SANS),
  mono: Object.keys(MONO),
};

const RANGES: Partial<Record<keyof State, [number, number]>> = {
  textScale: [50, 200],
  spaceScale: [50, 200],
  hair: [0.5, 8],
  focus: [0.5, 8],
  controlHeight: [32, 72],
};

const COLOUR_FIELDS = new Set(["brand", "accent", "danger", "warning", "background", "surface", "foreground"]);

const LEGACY: { token: string; field: "hair" | "focus" | "controlHeight"; siblings: string[] }[] = [
  { token: "stroke-hair", field: "hair", siblings: ["stroke-edge"] },
  { token: "stroke-focus", field: "focus", siblings: ["focus-gap"] },
  { token: "control-height", field: "controlHeight", siblings: ["chip-height"] },
];

function moveLegacy(s: State) {
  for (const { token, field, siblings } of LEGACY) {
    const m = /^(\d+(?:\.\d+)?)px$/.exec(s.t[token] ?? "");
    const range = RANGES[field]!;
    if (!m || +m[1]! < range[0] || +m[1]! > range[1]) continue;
    s[field] = +m[1]!;
    delete s.t[token];
    const next = defineTheme({ strokes: { hair: s.hair, focus: s.focus }, controlHeight: s.controlHeight }).tokens;
    for (const sib of siblings) {
      const old = (defaults as Record<string, string>)[sib]!;
      if (!(sib in s.t) && next[sib] !== old) s.t[sib] = old;
    }
  }
}

/** Reads a link back into a state. Anything unknown or unsafe is dropped, never trusted. Links made before the inputs existed still load. */
export function decode(code: string): State | null {
  try {
    const raw = JSON.parse(b64.dec(code)) as Record<string, unknown>;
    if ("shadow" in raw && !("elevation" in raw)) raw["elevation"] = raw["shadow"];
    const s = initialState();
    const d = s as unknown as Record<string, unknown>;
    for (const [k, v] of Object.entries(raw)) {
      if (k === "variants") {
        if (v && typeof v === "object")
          for (const [name, val] of Object.entries(v as Record<string, unknown>))
            if (name in VARIANT_VALUES && (VARIANT_VALUES[name as VariantKey] as readonly unknown[]).includes(val)) (s.variants as Record<string, unknown>)[name] = val;
      } else if (k === "t") {
        if (v && typeof v === "object")
          for (const [name, val] of Object.entries(v as Record<string, unknown>))
            if (name in defaults && typeof val === "string" && val.length < 300 && SAFE.test(val)) s.t[name] = val;
      } else if (k in d && typeof v === typeof d[k]) {
        const allowed = ENUMS[k as keyof State];
        if (allowed && !allowed.includes(v as string)) continue;
        if (typeof v === "string" && (v.length > 300 || !SAFE.test(v))) continue;
        if (COLOUR_FIELDS.has(k) && !isHex(v as string)) continue;
        const range = RANGES[k as keyof State];
        if (typeof v === "number" && !(range && v >= range[0] && v <= range[1])) continue;
        d[k] = v;
      }
    }
    moveLegacy(s);
    if (s.scheme !== "custom" && !("background" in raw || "surface" in raw || "foreground" in raw)) Object.assign(s, groundOf(s.scheme));
    return s;
  } catch {
    return null;
  }
}

const q = (v: string) => JSON.stringify(v);
const key = (k: string) => (/^[a-z]+$/i.test(k) ? k : q(k));

export function themeCode(b: Built): string {
  const i = b.input;
  const lines: string[] = [];
  lines.push(`name: ${q(i.name ?? "my-theme")},`);
  for (const k of ["brand", "accent", "danger", "warning", "background", "surface", "foreground"] as const) if (i[k]) lines.push(`${k}: ${q(i[k])},`);
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

/** The props each variant maps to, as the previews apply them. */
export function variantProps(v: Variants) {
  return {
    pad: v.pad,
    gap: SPACE_GAP[v.gap],
    inlineGap: INLINE_GAP[v.gap],
  };
}

/** The component props the current look used, one tag per line. Empty when every variant is a default. */
export function variantCode(v: Variants): string {
  const g = SPACE_GAP[v.gap];
  const lines = [
    v.pad === "md" ? "" : `<ESurface pad="${v.pad}" />`,
    v.gap === "default" ? "" : `<EStack :gap="${g}" />\n<EGrid :gap="${g}" />`,
  ];
  return lines.filter(Boolean).join("\n");
}
