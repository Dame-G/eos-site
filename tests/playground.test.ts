import { describe, expect, it } from "vitest";
import { page } from "vitest/browser";
import { defineComponent, h, onMounted } from "vue";
import { defineTheme } from "@eos-ui/tokens";
import { mount, settle } from "./helpers";
import ContrastStatus from "../docs/.vitepress/theme/playground/ContrastStatus.vue";
import ControlsDock from "../docs/.vitepress/theme/playground/ControlsDock.vue";
import { PRESETS, applyPreset, build, contrastSummary, describeIssue, initialState, themeCode } from "../docs/.vitepress/theme/playground/state";

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

describe("contrast status", () => {
  it("every preset holds every contrast pair", () => {
    for (const preset of PRESETS) {
      const s = initialState();
      applyPreset(s, preset.id);
      expect(build(s).theme.issues, preset.label).toEqual([]);
    }
  });

  it("summarises the issues and writes each pair as a line", () => {
    const issue = { role: "Body text", pair: ["ink", "surface"] as [string, string], ratio: 1.92, min: 7 };
    expect(contrastSummary([])).toBe("All contrast pairs hold");
    expect(contrastSummary([issue])).toBe("1 contrast pair fails");
    expect(contrastSummary([issue, issue])).toBe("2 contrast pairs fail");
    expect(describeIssue(issue)).toBe("Body text: ink on surface is 1.92:1, needs 7:1");
  });

  it("says all pairs hold for a sound theme", async () => {
    await mount(() => h(ContrastStatus, { issues: [] }));
    await expect.element(page.getByRole("status")).toHaveTextContent("All contrast pairs hold");
  });

  it("lists the failing pairs for a theme that fails", async () => {
    const s = initialState();
    s.t = { ink: "#bbbbbb" };
    const issues = build(s).theme.issues;
    expect(issues.length).toBeGreaterThan(0);
    await mount(() => h(ContrastStatus, { issues }));
    expect(page.getByRole("status").element().textContent).toContain(contrastSummary(issues));
    await expect.element(page.getByText(describeIssue(issues[0]!))).toBeVisible();
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
