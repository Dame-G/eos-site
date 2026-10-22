/**
 * The library's CHANGELOG.md as the body of the changelog page: the page supplies its own title, and each commit hash
 * links to the commit.
 */
export function changelogBody(markdown) {
  return markdown
    .replace(/\r\n/g, "\n")
    .replace(/^# .*\n+/, "")
    .replace(/^(\s*- )([0-9a-f]{7}): /gm, "$1[$2](https://github.com/Dame-G/eos/commit/$2): ")
    .trim();
}
