import { existsSync, readFileSync } from "node:fs";
import { sep } from "node:path";
import { changelogFile } from "./.vitepress/eos-source.mjs";
import { changelogBody } from "./.vitepress/changelog.mjs";

/** /changelog, generated from the library's packages/vue/CHANGELOG.md. */
export default {
  watch: [changelogFile.split(sep).join("/")],
  paths() {
    const found = existsSync(changelogFile);
    if (!found) console.warn(`[eos-site] No changelog found at ${changelogFile}.`);
    const notes = found ? changelogBody(readFileSync(changelogFile, "utf8")) : "The library has no CHANGELOG.md in this checkout.";
    const content = [
      "# Changelog",
      `Release notes for \`@eos-ui/vue\`, newest first. \`@eos-ui/tokens\` shares the version. Read these before you update while eos is pre-1.0, see [Versioning and support](/guide/versioning).`,
      notes,
    ].join("\n\n");
    return [{ params: { changelog: "changelog", description: "Every release of @eos-ui/vue, with what changed." }, content }];
  },
};
