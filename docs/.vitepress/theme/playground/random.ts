import { build } from "./build";
import { checkPairs } from "./contrast";
import { DEFAULT_VARIANTS, initialState, type Ground, type State, type Variants } from "./model";
import { PRESETS } from "./presets";

// Randomize: a coherent look that passes every contrast pair.

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
