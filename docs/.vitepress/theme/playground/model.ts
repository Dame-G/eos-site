import { defaults } from "@eos-ui/tokens";

// The playground's state: its shape, the allowed values and the defaults. No Vue and no theme maths, so every other module can import it.

export type Scheme = "light" | "paper" | "dark" | "contrast" | "custom";
type RadiusStyle = "sharp" | "default" | "round";
type ElevationStyle = "outline" | "lifted" | "bold";
type MotionStyle = "default" | "snappy" | "gentle";
type Density = "comfortable" | "compact";
/** The library's own named look (`defineTheme({ preset })`), or `none` to leave it out. Not the playground preset, which is a whole starting state. */
type ThemePresetChoice = "none" | "paper" | "ink" | "quiet";

export const VARIANT_VALUES = {
  size: ["sm", "md", "lg"],
  gap: ["tight", "default", "roomy"],
} as const;

export type Variants = { [K in keyof typeof VARIANT_VALUES]: (typeof VARIANT_VALUES)[K][number] };
export type VariantKey = keyof Variants;

export const VARIANT_KEYS = Object.keys(VARIANT_VALUES) as VariantKey[];

export const DEFAULT_VARIANTS: Variants = { size: "md", gap: "default" };

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
  /** `compact` tightens the space scale and makes controls the 44px tap target. */
  density: Density;
  /** `scheme: "auto"`: follow the visitor's light or dark preference. Exported, and not drawn in the preview, which shows one theme. */
  autoScheme: boolean;
  /** `contrast: "auto"`: add the high contrast theme under `prefers-contrast: more`. Exported only. */
  autoContrast: boolean;
  /** The library preset the export names, if any. */
  themePreset: ThemePresetChoice;
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

export const DEFAULT_BRAND = defaults["brand"];
export const DEFAULT_ACCENT = defaults["brand-accent"];
export const DEFAULT_DANGER = defaults["danger"];
export const DEFAULT_WARNING = defaults["warning-strong"];
export const NEUTRAL = { hair: 1, focus: 2, controlHeight: 48 } as const;
export const DEFAULT_GROUND = { background: defaults["background"], surface: defaults["surface"], foreground: defaults["ink"] };

export interface Ground {
  background: string;
  surface: string;
  foreground: string;
}

const SCHEMES: Record<Exclude<Scheme, "custom">, Ground> = {
  light: { ...DEFAULT_GROUND },
  paper: { background: "#f7f0e3", surface: "#fffdf7", foreground: "#1f1a14" },
  dark: { background: "#0d0a12", surface: "#14111a", foreground: "#ffffff" },
  contrast: { ...DEFAULT_GROUND },
};

export function groundOf(scheme: Scheme): Ground {
  return scheme === "custom" ? { ...DEFAULT_GROUND } : { ...SCHEMES[scheme] };
}

export const withGround = (scheme: Exclude<Scheme, "custom">): Pick<State, "scheme" | keyof Ground> => ({ scheme, ...SCHEMES[scheme] });

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

export const COLOUR_KEYS = [
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
    density: "comfortable",
    autoScheme: false,
    autoContrast: false,
    themePreset: "none",
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
export const isHex = (v: string) => /^#[0-9a-f]{6}$/i.test(v);
