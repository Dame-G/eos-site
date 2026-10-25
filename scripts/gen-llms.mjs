import { copyFileSync, cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { groupedComponents, libraryDist, listComponents, readReadme, siteRoot, summaryOf } from "../docs/.vitepress/eos-source.mjs";
import { DESIGN, guideSections } from "../docs/.vitepress/pages.mjs";
import { patternInfo } from "../docs/.vitepress/patterns.mjs";

// Writes docs/public/llms.txt, the site's index for AI assistants (https://llmstxt.org): the site's own pages, and each
// component's page beside the library's reference for it. The references themselves are the library's: its build writes
// llms-full.txt (every README in one file) and llms/<Name>.txt (one each), and they are published here as they are.

const SITE = "https://eos.dame.gg";
const publicDir = join(siteRoot, "docs/public");
mkdirSync(publicDir, { recursive: true });

/** Publishes one of the library's llms files, or says why it cannot. CI builds the library first and sets EOS_REQUIRE_LLMS_FULL, so a missing file there is a broken build, not a local shortcut. */
function publish(name, copy) {
  const source = join(libraryDist, name);
  const target = join(publicDir, name);
  rmSync(target, { recursive: true, force: true });
  if (existsSync(source)) {
    copy(source, target);
    return true;
  }
  const message = `${name}: not found at ${source}, so it is not published. Build the library to get it.`;
  if (process.env.EOS_REQUIRE_LLMS_FULL) {
    console.error(message);
    process.exit(1);
  }
  console.warn(message);
  return false;
}

const hasFull = publish("llms-full.txt", copyFileSync);
const hasPerComponent = publish("llms", (from, to) => cpSync(from, to, { recursive: true }));

const out = [];
const line = (s = "") => out.push(s);

line("# eos");
line();
line("> A component library for Vue. Install `@eos-ui/vue`, add `createEos()`, and use components such as `EButton` and `ETextField`. Themes are built with `defineTheme()` and checked for contrast.");
line();

line("## Guide");
line();
for (const { title, pages } of guideSections()) {
  line(`### ${title}`);
  line();
  for (const { link, name, note } of pages) line(`- [${name}](${SITE}${link}): ${note}`);
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

if (hasFull) {
  line(`The complete library documentation in one file: ${SITE}/llms-full.txt`);
  line();
}

line("## Components");
line();
line(`Every component has a page with its README and a live demo.${hasPerComponent ? " Its props, slots, events and accessibility notes are in the library's reference for it, linked under each one." : ""}`);
line();

for (const g of groupedComponents()) {
  line(`### ${g.title}`);
  line();
  for (const name of g.names) {
    line(`- [E${name}](${SITE}/components/${name}): ${summaryOf(readReadme(name))}`);
    if (hasPerComponent && existsSync(join(publicDir, "llms", `E${name}.txt`))) line(`  Reference: ${SITE}/llms/E${name}.txt`);
  }
  line();
}

writeFileSync(join(publicDir, "llms.txt"), out.join("\n"), "utf8");
console.log(`llms.txt: ${listComponents().length} components, ${out.length} lines`);
