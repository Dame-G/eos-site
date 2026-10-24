import { copyFileSync, existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { groupedComponents, libraryDist, listComponents, propsTable, readReadme, siteRoot, summaryOf } from "../docs/.vitepress/eos-source.mjs";
import { DESIGN, guideSections } from "../docs/.vitepress/pages.mjs";
import { patternInfo } from "../docs/.vitepress/patterns.mjs";

/** "name (type, required)" or "name (type, default X)". The README writes **Required** or None in the Default column. */
function propText({ prop, type, def }) {
  const parts = [type];
  if (/^required$/i.test(def)) parts.push("required");
  else if (def && !/^none$/i.test(def)) parts.push(`default ${def}`);
  const inner = parts.filter(Boolean).join(", ");
  return inner ? `${prop} (${inner})` : prop;
}

const SITE = "https://eos.dame.gg";
const out = [];
const line = (s = "") => out.push(s);

line("# eos");
line();
line("> A component library for Vue. Install `@eos-ui/vue`, add `createEos()`, and use components such as `EButton` and `ETextField`. Themes are built with `defineTheme()` and checked for contrast.");
line();

line("## Guide");
line();
const sections = guideSections();
for (const { title, pages } of sections) {
  line(`### ${title}`);
  line();
  for (const { slug, name, note } of pages) line(`- [${name}](${SITE}/guide/${slug}): ${note}`);
  if (title === sections.at(-1).title) line(`- [Changelog](${SITE}/changelog): Release notes for every version of the library`);
  line();
}

line("## Design");
line();
for (const { slug, name, note } of DESIGN) line(`- [${name}](${SITE}/${slug}): ${note}`);
line();

line("## Patterns");
line();
for (const { slug, name, description, uses } of patternInfo()) {
  line(`- [${name}](${SITE}/patterns/${slug}): ${description}`);
  if (uses.length) line(`  Built from: ${uses.map((c) => `E${c}`).join(", ")}`);
}
line();

// The library's one-file documentation is published beside this index when the library has been built.
const publicDir = join(siteRoot, "docs/public");
mkdirSync(publicDir, { recursive: true });
const fullSource = join(libraryDist, "llms-full.txt");
const fullTarget = join(publicDir, "llms-full.txt");
if (existsSync(fullSource)) {
  copyFileSync(fullSource, fullTarget);
  line(`The complete library documentation in one file: ${SITE}/llms-full.txt`);
  line();
} else {
  rmSync(fullTarget, { force: true });
  const message = `llms-full.txt: not found at ${fullSource}, so it is not published. Build the library to get it.`;
  // CI sets EOS_REQUIRE_LLMS_FULL when it builds the library first, so a missing file there is a broken build, not a local shortcut.
  if (process.env.EOS_REQUIRE_LLMS_FULL) {
    console.error(message);
    process.exit(1);
  }
  console.warn(message);
}

line("## Components");
line();
line("Every component has a page with its README and a live demo. Props are listed as name (type, default or required).");
line();

for (const g of groupedComponents()) {
  line(`### ${g.title}`);
  line();
  for (const name of g.names) {
    const readme = readReadme(name);
    line(`- [E${name}](${SITE}/components/${name}): ${summaryOf(readme)}`);
    const props = propsTable(readme);
    if (props.length) {
      line(`  Props: ${props.map(propText).join(", ")}`);
    }
  }
  line();
}

const dir = join(siteRoot, "docs/public");
mkdirSync(dir, { recursive: true });
writeFileSync(join(dir, "llms.txt"), out.join("\n"), "utf8");
console.log(`llms.txt: ${listComponents().length} components, ${out.length} lines`);
