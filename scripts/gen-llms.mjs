import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { groupedComponents, listComponents, propsTable, readReadme, siteRoot, summaryOf } from "../docs/.vitepress/eos-source.mjs";
import { DESIGN, GUIDE, PATTERNS } from "../docs/.vitepress/pages.mjs";

const SITE = "https://eos.dame.gg";
const out = [];
const line = (s = "") => out.push(s);

line("# EOS");
line();
line("> A component library for Vue. Install `@eos-ui/vue`, add `createEos()`, and use components such as `EButton` and `ETextField`. Themes are built with `defineTheme()` and checked for contrast.");
line();

line("## Guide");
line();
for (const { slug, name, note } of GUIDE) line(`- [${name}](${SITE}/guide/${slug}): ${note}`);
line();

line("## Design");
line();
for (const { slug, name, note } of DESIGN) line(`- [${name}](${SITE}/${slug}): ${note}`);
line();

line("## Patterns");
line();
for (const { slug, name } of PATTERNS) line(`- [${name}](${SITE}/patterns/${slug})`);
line();

line("The complete library documentation in one file ships with the package as `@eos-ui/vue/llms-full.txt`.");
line();

line("## Components");
line();
line("Every component has a page with its README and a live demo. Props are listed as name (type).");
line();

for (const g of groupedComponents()) {
  line(`### ${g.title}`);
  line();
  for (const name of g.names) {
    const readme = readReadme(name);
    line(`- [E${name}](${SITE}/components/${name}): ${summaryOf(readme)}`);
    const props = propsTable(readme);
    if (props.length) {
      line(`  Props: ${props.map((p) => (p.type ? `${p.prop} (${p.type})` : p.prop)).join(", ")}`);
    }
  }
  line();
}

const dir = join(siteRoot, "docs/public");
mkdirSync(dir, { recursive: true });
writeFileSync(join(dir, "llms.txt"), out.join("\n"), "utf8");
console.log(`llms.txt: ${listComponents().length} components, ${out.length} lines`);
