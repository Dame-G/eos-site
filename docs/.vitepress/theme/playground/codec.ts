import { defaults, defineTheme } from "@eos-ui/tokens";
import { DEFAULT_VARIANTS, MONO, SAFE, SANS, VARIANT_KEYS, VARIANT_VALUES, groundOf, initialState, isHex, type State, type VariantKey } from "./model";

// The share link: a state to a short URL-safe string and back. Decoding never trusts its input.

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
  density: ["comfortable", "compact"],
  themePreset: ["none", "paper", "ink", "quiet"],
  elevation: ["outline", "lifted", "bold"],
  motion: ["default", "snappy", "gentle"],
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
    // The library dropped motion "none"; snappy is the shortest feel left.
    if (raw["motion"] === "none") raw["motion"] = "snappy";
    // The surface padding variant followed ESurface `pad` before it became `size`.
    const rv = raw["variants"] as Record<string, unknown> | null | undefined;
    if (rv && typeof rv === "object" && "pad" in rv && !("size" in rv)) rv["size"] = rv["pad"];
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
