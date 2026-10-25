import { DEFAULT_VARIANTS, initialState, withGround, type State, type Variants } from "./model";

// The named looks. Each is only the inputs that differ from the defaults.

type PresetSet = Omit<Partial<State>, "variants"> & { variants?: Partial<Variants> };

interface Preset {
  id: string;
  label: string;
  note: string;
  set: PresetSet;
}

export const PRESETS: Preset[] = [
  { id: "eos", label: "eos", note: "The library defaults.", set: {} },
  {
    id: "paper",
    label: "Letterpress",
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
      variants: { size: "lg", gap: "roomy" },
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
      motion: "snappy",
      t: { "stroke-edge": "2px" },
      variants: { size: "lg" },
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
      variants: { size: "sm", gap: "tight" },
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
      variants: { size: "lg", gap: "roomy" },
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
      motion: "snappy",
      variants: { size: "sm", gap: "tight" },
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
      variants: { size: "sm" },
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
      variants: { size: "lg", gap: "roomy" },
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
