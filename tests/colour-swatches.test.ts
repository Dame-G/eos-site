import { describe, expect, it } from "vitest";
import { isColor, withSwatches, withSwatchesInMarkup } from "../docs/.vitepress/color.mjs";

describe("colour swatches", () => {
  it("recognises a literal colour as a whole value", () => {
    expect(isColor("#2c95b4")).toBe(true);
    expect(isColor("oklch(60% 0.1 200)")).toBe(true);
    expect(isColor("brand")).toBe(false);
  });

  it("adds the library's swatch after a hex colour, including after an equals sign and inside quotes", () => {
    expect(withSwatches("= #17586d")).toMatch(/^= #17586d<span class="e-highlight-swatch" style="--_swatch:#17586d"/);
    expect(withSwatches('brand: "#8a2be2"')).toContain('#8a2be2<span class="e-highlight-swatch"');
  });

  it("leaves numbers, entities and longer words alone", () => {
    expect(withSwatches("issue #123")).toBe("issue #123");
    expect(withSwatches("&#x2c95b4;")).toBe("&#x2c95b4;");
    expect(withSwatches("#abcde")).toBe("#abcde");
  });

  it("marks colours in the text of highlighted code but not in its attributes", () => {
    const html = withSwatchesInMarkup('<span style="color:#ffffff">brand = "#8a2be2"</span>');
    expect(html).toContain('style="color:#ffffff"');
    expect(html.match(/e-highlight-swatch/g)).toHaveLength(1);
  });
});
