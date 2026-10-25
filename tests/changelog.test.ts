import { describe, expect, it } from "vitest";
import { changelogBody, parseChangelog } from "../docs/.vitepress/changelog.mjs";

const sample = [
  "# @eos-ui/vue",
  "",
  "## 0.9.0",
  "",
  "### Minor Changes",
  "",
  "- 1111111: `EFoo` is removed. Use `EBar`.",
  "- 2222222: ETabs takes a `label`.",
  "",
  "### Patch Changes",
  "",
  "- 3333333: A fix.",
  "  With a second paragraph.",
  "- Updated dependencies [1111111]",
  "  - @eos-ui/tokens@0.9.0",
  "",
  "## 0.8.1",
  "",
  "### Patch Changes",
  "",
  "- e6e03e5: Another fix.",
  "- @eos-ui/tokens@0.8.1",
  "",
].join("\n");

describe("changelog", () => {
  it("sorts each release's entries into breaking changes, changes and fixes, and drops dependency lines", () => {
    const [latest, previous] = parseChangelog(sample);
    expect(latest!.version).toBe("0.9.0");
    expect(latest!.breaking).toHaveLength(1);
    expect(latest!.changes).toHaveLength(1);
    expect(latest!.fixes).toEqual(["- 3333333: A fix.\n  With a second paragraph."]);
    expect(previous!.fixes).toEqual(["- e6e03e5: Another fix."]);
  });

  it("dates each release, puts Breaking first and moves the commit hash to the end as a link", () => {
    const body = changelogBody(sample, { dates: { "0.9.0": "2026-10-21" } });
    expect(body.startsWith("## 0.9.0 · 2026-10-21\n\n### Breaking")).toBe(true);
    expect(body).toContain("- `EFoo` is removed. Use `EBar`. ([1111111](https://github.com/Dame-G/eos/commit/1111111))");
    expect(body).not.toContain("@eos-ui/tokens@");
    expect(body).toContain("## 0.8.1\n");
  });

  it("folds the releases after the newest few into disclosures", () => {
    const body = changelogBody(sample, { recent: 1 });
    expect(body).toContain("## Older releases");
    expect(body).toContain('<EDisclosure title="0.8.1">');
    expect(body).toContain("#### Fixes");
  });
});
