import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join, sep } from "node:path";
import { changelogFile, siteRoot } from "./.vitepress/eos-source.mjs";
import { changelogBody } from "./.vitepress/changelog.mjs";

const knownDates = JSON.parse(readFileSync(join(siteRoot, "docs/.vitepress/release-dates.json"), "utf8"));

/**
 * Release dates: the date of each `@eos-ui/vue@x.y.z` tag in the library checkout, over the dates committed in
 * release-dates.json (which covers the releases that have no tag, and a checkout cloned without tags). A release in neither
 * shows no date. Add a line to release-dates.json for a release whose tag is missing.
 */
function releaseDates() {
  const dates = { ...knownDates };
  try {
    const out = execFileSync("git", ["for-each-ref", "--format=%(refname:short) %(creatordate:short)", "refs/tags/@eos-ui/vue@*"], { cwd: dirname(changelogFile), encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
    for (const line of out.split("\n")) {
      const m = /^@eos-ui\/vue@(\S+) (\d{4}-\d{2}-\d{2})$/.exec(line.trim());
      if (m) dates[m[1]] = m[2];
    }
  } catch {
    // No git, or not a checkout: the committed dates stand.
  }
  return dates;
}

/** /changelog, generated from the library's packages/vue/CHANGELOG.md. */
export default {
  watch: [changelogFile.split(sep).join("/")],
  paths() {
    const found = existsSync(changelogFile);
    if (!found) console.warn(`[eos-site] No changelog found at ${changelogFile}.`);
    const notes = found ? changelogBody(readFileSync(changelogFile, "utf8"), { dates: releaseDates() }) : "The library has no CHANGELOG.md in this checkout.";
    const content = [
      "# Changelog",
      "Release notes for `@eos-ui/vue`, newest first. `@eos-ui/tokens` shares the version. Before 1.0 a minor version can change the API: each release lists what may need a change in your code under **Breaking**. See [Versioning and support](/guide/versioning).",
      notes,
    ].join("\n\n");
    return [{ params: { changelog: "changelog", description: "Every release of @eos-ui/vue, newest first, with its date and breaking changes." }, content }];
  },
};
