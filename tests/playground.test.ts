import { describe, expect, it } from "vitest";
import { page } from "vitest/browser";
import { defineComponent, h, onMounted } from "vue";
import { defineTheme } from "@eos-ui/tokens";
import { mount, settle } from "./helpers";
import ControlsDock from "../docs/.vitepress/theme/playground/ControlsDock.vue";
import ThemePlayground from "../docs/.vitepress/theme/ThemePlayground.vue";
import { build, themeCode } from "../docs/.vitepress/theme/playground/build";
import { initialState } from "../docs/.vitepress/theme/playground/model";
import { PRESETS, applyPreset } from "../docs/.vitepress/theme/playground/presets";

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

describe("preset contrast", () => {
  it("every preset holds every contrast pair", () => {
    for (const preset of PRESETS) {
      const s = initialState();
      applyPreset(s, preset.id);
      expect(build(s).theme.issues, preset.label).toEqual([]);
    }
  });
});

describe("controls dock", () => {
  const Probe = defineComponent({
    setup() {
      onMounted(() => mounts.push(1));
      return () => h("p", "controls");
    },
  });
  const mounts: number[] = [];
  const Page = () => h(ControlsDock, null, { default: () => h(Probe) });

  it("is one aside that is sticky only from 64rem, and keeps its contents when the width changes", async () => {
    mounts.length = 0;
    await page.viewport(800, 900);
    await mount(Page);
    const dock = () => document.querySelector("aside.dock") as HTMLElement;
    expect(document.querySelectorAll("aside.dock").length).toBe(1);
    expect(getComputedStyle(dock()).position).not.toBe("sticky");
    const before = dock();

    await page.viewport(1200, 900);
    await settle();
    expect(document.querySelectorAll("aside.dock").length).toBe(1);
    expect(dock()).toBe(before);
    expect(getComputedStyle(dock()).position).toBe("sticky");
    expect(mounts).toEqual([1]);
    await page.viewport(900, 900);
  });
});

describe("playground preview layout", () => {
  it("stays in one layout on a narrow screen instead of flipping the scene tabs back and forth", async () => {
    const Narrow = defineComponent({ render: () => h("div", { style: "width: 343px" }, [h(ThemePlayground)]) });
    await mount(Narrow);
    await settle(300);
    const wrap = document.querySelector<HTMLElement>(".pv-wrap")!;
    const seen = new Set<string>();
    await new Promise<void>((done) => {
      const end = performance.now() + 1000;
      const frame = () => {
        const tabs = wrap.querySelector(".e-tablist")!.getAttribute("aria-orientation");
        seen.add(`${tabs} ${Math.round(wrap.getBoundingClientRect().width)}`);
        if (performance.now() < end) requestAnimationFrame(frame);
        else done();
      };
      frame();
    });
    // One orientation, one width, and the preview fits the column it was given.
    expect(seen.size).toBe(1);
    expect(wrap.getBoundingClientRect().width).toBeLessThanOrEqual(343);
  });
});

describe("playground theme inputs", () => {
  it("exports density, scheme, contrast and preset, and the export reproduces the theme", () => {
    const s = initialState();
    s.density = "compact";
    s.autoScheme = true;
    s.autoContrast = true;
    s.themePreset = "ink";
    const b = build(s);
    expect(b.input).toMatchObject({ density: "compact", scheme: "auto", contrast: "auto", preset: "ink" });
    const code = themeCode(b);
    for (const line of ['density: "compact"', 'scheme: "auto"', 'contrast: "auto"', 'preset: "ink"']) expect(code).toContain(line);
    expect(defineTheme(b.input).tokens).toEqual(b.theme.tokens);
  });

  it("the high contrast scheme wins over contrast auto", () => {
    const s = initialState();
    applyPreset(s, "contrast");
    s.autoContrast = true;
    expect(build(s).input.contrast).toBe("high");
  });

  it("writes nothing for the defaults", () => {
    const { input } = build(initialState());
    for (const k of ["density", "scheme", "contrast", "preset"]) expect(input).not.toHaveProperty(k);
  });
});
