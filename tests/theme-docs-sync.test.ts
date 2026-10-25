import { describe, it, expect } from "vitest";
import { themeInputs } from "@eos-ui/tokens";
import { interfaceMembers } from "../docs/data/theme-source.js";
import { INPUT_NOTES, NOT_INPUTS } from "../docs/data/theme-inputs.js";
import theming from "../docs/guide/theming.md?raw";
import api from "../docs/guide/api.md?raw";
import tokensGuide from "../docs/guide/tokens.md?raw";

// The guides describe defineTheme by hand. These tests read the library's ThemeInput (its exported themeInputs) and the
// Theme interface, and fail when the documented inputs differ, so a new, renamed or removed input cannot go unnoticed.

const sources = import.meta.glob("../node_modules/@eos-ui/tokens/src/theme.ts", { query: "?raw", import: "default", eager: true }) as Record<string, string>;
const source = Object.values(sources)[0] ?? "";

const inputKeys = themeInputs.map((m) => m.name);
const themeMembers = interfaceMembers(source, "Theme").map((m) => m.name);

/** The first-column keys of the Markdown table whose header starts with `header`. */
function tableKeys(markdown: string, header: string): string[] {
  const lines = markdown.split(/\r?\n/);
  const start = lines.findIndex((l) => l.startsWith(header));
  if (start < 0) return [];
  const keys: string[] = [];
  for (const line of lines.slice(start + 2)) {
    if (!line.startsWith("|")) break;
    const first = line.split("|")[1] ?? "";
    for (const m of first.matchAll(/`([A-Za-z]+)(?:\([^`]*\))?`/g)) keys.push(m[1]!);
  }
  return keys;
}

describe("defineTheme documentation", () => {
  it("reads ThemeInput and Theme from the linked tokens package", () => {
    expect(inputKeys).toContain("brand");
    expect(inputKeys.length).toBeGreaterThan(15);
    expect(themeMembers).toContain("tokens");
  });

  it("has a note for every ThemeInput input and none for an input that no longer exists", () => {
    const documented = [...Object.keys(INPUT_NOTES), ...NOT_INPUTS].sort();
    expect(documented, "docs/data/theme-inputs.js against ThemeInput").toEqual([...inputKeys].sort());
  });

  it("lists every ThemeInput key in the one inputs table, in the theming guide, and nothing else", () => {
    expect(tableKeys(theming, "| Input | Type |").sort()).toEqual([...inputKeys].sort());
    expect(tableKeys(api, "| Input | Type |"), "the API reference links to the table instead of repeating it").toEqual([]);
  });

  it("names every ThemeInput key in the theming guide", () => {
    const missing = inputKeys.filter((key) => !new RegExp("`" + key + "`").test(theming));
    expect(missing, "keys missing from docs/guide/theming.md").toEqual([]);
  });

  it("lists every member of Theme in the API reference", () => {
    const documented = tableKeys(api, "| Member | What it is |").sort();
    expect(documented).toEqual([...themeMembers].sort());
  });

  it("does not state a count of inputs that can go stale", () => {
    const pattern = /takes (?:\d+|sixteen|seventeen|eighteen|nineteen|twenty|twenty-\w+) inputs/i;
    for (const [name, text] of Object.entries({ theming, api, tokensGuide })) expect(pattern.test(text), `${name} states how many inputs there are`).toBe(false);
  });
});
