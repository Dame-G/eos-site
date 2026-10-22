import { describe, expect, it } from "vitest";
import { changelogBody } from "../docs/.vitepress/changelog.mjs";

describe("changelogBody", () => {
  it("drops the package title and links commit hashes", () => {
    const body = changelogBody("# @eos-ui/vue\n\n## 0.8.1\n\n### Patch Changes\n\n- e6e03e5: A fix.\n- @eos-ui/tokens@0.8.1\n");
    expect(body.startsWith("## 0.8.1")).toBe(true);
    expect(body).toContain("- [e6e03e5](https://github.com/Dame-G/eos/commit/e6e03e5): A fix.");
    expect(body).toContain("- @eos-ui/tokens@0.8.1");
  });
});
