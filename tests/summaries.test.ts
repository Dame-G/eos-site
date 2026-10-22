import { describe, expect, it } from "vitest";
import { plainText } from "../docs/.vitepress/plain-text.mjs";

declare const __TEXTS__: { name: string; text: string }[];

describe("plainText", () => {
  it("keeps the text of links and drops the target", () => {
    expect(plainText("Use [ENumberField](../NumberField/README.md) for numbers.")).toBe("Use ENumberField for numbers.");
  });
  it("drops code marks and emphasis", () => {
    expect(plainText("A `prop` that is **bold**, *soft* and _quiet_.")).toBe("A prop that is bold, soft and quiet.");
  });
  it("leaves underscores inside words alone", () => {
    expect(plainText("Set snake_case_name and 2 * 3 * 4.")).toBe("Set snake_case_name and 2 * 3 * 4.");
  });
});

describe("component summaries and descriptions", () => {
  it("read as plain text, with no markdown links left", () => {
    const leaks = __TEXTS__.filter(({ text }) => text.includes("](") || /[`*]/.test(text)).map(({ name, text }) => `${name}: ${text}`);
    expect(leaks).toEqual([]);
  });
});
