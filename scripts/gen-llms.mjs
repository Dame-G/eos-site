// Writes docs/public/llms.txt: a plain list of the site's pages and every component's props, for AI tools.
// It reads the component READMEs from the library checkout, so it is always the same as the code. Runs before dev and build.
import { mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { GROUPS, firstParagraph, listComponents, propsTable, readReadme, siteRoot } from "../docs/.vitepress/eos-source.mjs";
import { GROUP_OF } from "../docs/.vitepress/groups.mjs";

const SITE = "https://eos.dame.gg";
const out = [];
const line = (s = "") => out.push(s);


line("# Eos");
line();
line("> Accessible Vue 3 components with a token-based theme system. Install `@eos-ui/vue`, add `createEos()`, and use components such as `EButton` and `ETextField`. Themes are built with `defineTheme()` and checked for contrast.");
line();

line("## Guide");
line();
const guide = [
  ["getting-started", "Getting started", "Install, plugin, first component, Vite auto-import"],
  ["theming", "Theming", "defineTheme, CSS variables, scoped themes, portalTarget, cascade layers"],
  ["icons", "Icons", "Built-in icons and bringing your own icon set"],
  ["language", "Words and language", "Messages, locale, currency, right to left"],
  ["forms", "Forms and validation", "v-model, labels, hints, errors, ErrorSummary"],
  ["accessibility", "Accessibility", "Contrast table, keyboard, forced colours, what is tested"],
  ["design-principles", "Design principles", "Spacing rhythm, depth, control height, actions"],
  ["ssr", "Nuxt and SSR", "What was verified about server rendering"],
  ["vuetify", "Migrating from Vuetify", "Concept mapping and coexistence"],
];
for (const [slug, name, note] of guide) line(`- [${name}](${SITE}/guide/${slug}): ${note}`);
line();

line("## Design");
line();
line(`- [Tokens](${SITE}/tokens): every colour, size, radius, shadow and motion token with usage notes and contrast`);
line(`- [Theme playground](${SITE}/playground): change brand, accent, corners, font, locale and currency, with live contrast checks`);
line();

line("## Patterns");
line();
const patterns = readdirSync(join(siteRoot, "docs/patterns")).filter((f) => f.endsWith(".md") && f !== "index.md");
for (const f of patterns.sort()) {
  const slug = f.replace(/\.md$/, "");
  line(`- [${slug.replace(/-/g, " ")}](${SITE}/patterns/${slug})`);
}
line();

line("## Components");
line();
line("Every component has a page with its README and a live demo. Props are listed as name (type).");
line();

const names = listComponents();
const groups = [...GROUPS, { id: "more", title: "More" }];
for (const g of groups) {
  const inGroup = names.filter((n) => (GROUP_OF[n] ?? "more") === g.id);
  if (!inGroup.length) continue;
  line(`### ${g.title}`);
  line();
  for (const name of inGroup) {
    const readme = readReadme(name);
    const summary = firstParagraph(readme).split(/(?<=\.)\s/)[0] ?? "";
    line(`- [E${name}](${SITE}/components/${name}): ${summary}`);
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
console.log(`llms.txt: ${names.length} components, ${out.length} lines`);
