import { mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { groupedComponents, listComponents, propsTable, readReadme, siteRoot, summaryOf } from "../docs/.vitepress/eos-source.mjs";

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
  ["theming", "Theming", "defineTheme inputs, CSS variables, scoped themes, portalTarget, cascade layers"],
  ["icons", "Icons", "Built-in icons and bringing your own icon set"],
  ["language", "Words and language", "Messages, locale, currency, right to left"],
  ["forms", "Forms and validation", "v-model, labels, hints, errors, ErrorSummary"],
  ["accessibility", "Accessibility", "Contrast table, keyboard, forced colours, what is tested"],
  ["design-principles", "Design principles", "Spacing rhythm, depth, control height, actions"],
  ["ssr", "Nuxt and SSR", "What was verified about server rendering"],
  ["vuetify", "Migrating from Vuetify", "Concept mapping and coexistence"],
  ["versioning", "Versioning and support", "Pre-1.0 stability, semver, supported Vue and browsers"],
];
for (const [slug, name, note] of guide) line(`- [${name}](${SITE}/guide/${slug}): ${note}`);
line();

line("## Design");
line();
line(`- [Tokens](${SITE}/tokens): the theme inputs, then every colour, size, radius, shadow and motion token with the input it follows, usage notes and contrast`);
line(`- [Theme playground](${SITE}/playground): change the theme inputs (colours, corners, elevation, strokes, fonts, text and space scale, control height, motion), locale and currency, with exportable defineTheme code`);
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
