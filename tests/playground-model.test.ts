import { describe, expect, it } from "vitest";
import { build } from "../docs/.vitepress/theme/playground/build";
import { decode, encode } from "../docs/.vitepress/theme/playground/codec";
import { checkPairs, resolve } from "../docs/.vitepress/theme/playground/contrast";
import { initialState } from "../docs/.vitepress/theme/playground/model";
import { PRESETS, applyPreset } from "../docs/.vitepress/theme/playground/presets";
import { applyRandom } from "../docs/.vitepress/theme/playground/random";

// Pure modules only: no component is mounted here.

describe("share link codec", () => {
  it("encodes the defaults as an empty string and decodes it back", () => {
    expect(encode(initialState())).toBe("");
  });

  it("round-trips every preset", () => {
    for (const preset of PRESETS) {
      const s = initialState();
      applyPreset(s, preset.id);
      const code = encode(s);
      if (!code) continue; // the defaults need no link
      const back = decode(code);
      expect(back, preset.label).not.toBeNull();
      expect(encode(back!), preset.label).toBe(encode(s));
    }
  });

  it("drops unsafe, unknown and out-of-range values instead of trusting them", () => {
    const hostile = btoa(JSON.stringify({ brand: "red;}body{x:y", radius: "huge", textScale: 9000, surface: "#112233", nope: 1, t: { ink: "#000;}", primary: "#123456" } }));
    const s = decode(hostile)!;
    const d = initialState();
    expect(s.brand).toBe(d.brand);
    expect(s.radius).toBe(d.radius);
    expect(s.textScale).toBe(d.textScale);
    expect(s.surface).toBe("#112233");
    expect(s.t).toEqual({ primary: "#123456" });
  });

  it("returns null for text that is not a link", () => {
    expect(decode("%%%")).toBeNull();
  });
});

describe("contrast", () => {
  it("resolves a token that points at another token", () => {
    expect(resolve({ a: "var(--e-b)", b: "#112233" }, "a")).toBe("#112233");
    expect(resolve({ a: "var(--e-a)" }, "a")).toBe("var(--e-a)");
  });

  it("judges the default theme on every pair", () => {
    const results = checkPairs(build(initialState()).theme.tokens);
    expect(results.length).toBeGreaterThan(15);
    expect(results.filter((r) => !r.pass)).toEqual([]);
  });

  it("flags a failing pair", () => {
    const s = initialState();
    s.t = { ink: "#cccccc" };
    expect(checkPairs(build(s).theme.tokens).some((r) => !r.pass)).toBe(true);
    expect(build(s).theme.issues.length).toBeGreaterThan(0);
  });
});

describe("random", () => {
  it("only ever returns a look where every pair passes", () => {
    for (let i = 0; i < 5; i++) {
      const s = initialState();
      applyRandom(s);
      expect(s.preset).toBe("random");
      expect(checkPairs(build(s).theme.tokens).every((r) => r.pass)).toBe(true);
    }
  });
});

describe("share link, theme inputs", () => {
  it("round-trips density, auto scheme, auto contrast and the library preset", () => {
    const s = initialState();
    s.density = "compact";
    s.autoScheme = true;
    s.autoContrast = true;
    s.themePreset = "quiet";
    const back = decode(encode(s))!;
    expect(back).toMatchObject({ density: "compact", autoScheme: true, autoContrast: true, themePreset: "quiet" });
  });

  it("drops an unknown density or preset", () => {
    const s = decode(btoa(JSON.stringify({ density: "huge", themePreset: "loud", autoScheme: "yes" })))!;
    expect(s).toMatchObject({ density: "comfortable", themePreset: "none", autoScheme: false });
  });
});
