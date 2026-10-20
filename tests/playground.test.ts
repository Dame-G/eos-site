import { describe, expect, it } from "vitest";
import { defineTheme } from "@eos-ui/tokens";
import { PRESETS, applyPreset, build, initialState, themeCode } from "../docs/.vitepress/theme/playground/state";

describe("playground export", () => {
  for (const preset of PRESETS) {
    it(`${preset.label} is reproduced by defineTheme(input) with no raw token overrides`, () => {
      const s = initialState();
      applyPreset(s, preset.id);
      const b = build(s);
      expect(b.extra).toEqual({});
      expect(b.input.tokens).toBeUndefined();
      expect(defineTheme(b.input).tokens).toEqual(b.theme.tokens);
    });
  }

  it("lifts stroke-edge and stroke-card overrides into strokes", () => {
    const s = initialState();
    s.t = { "stroke-edge": "2px", "stroke-card": "3px" };
    const b = build(s);
    expect(b.input.strokes).toEqual({ edge: 2, card: 3 });
    expect(b.extra).toEqual({});
    expect(themeCode(b)).toContain("strokes: { edge: 2, card: 3 }");
  });

  it("writes the page and text colours when they differ from what the surface would give", () => {
    const s = initialState();
    s.surface = "#fffdf7";
    const b = build(s);
    expect(b.input.background).toBe("#ffffff");
    expect(defineTheme(b.input).tokens["background"]).toBe("#ffffff");
    s.foreground = "#112233";
    expect(build(s).input.foreground).toBe("#112233");
  });

  it("the high contrast scheme exports as contrast: high", () => {
    const s = initialState();
    applyPreset(s, "contrast");
    expect(themeCode(build(s))).toContain('contrast: "high"');
  });
});
