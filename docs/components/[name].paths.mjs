import { existsSync } from "node:fs";
import { join, sep } from "node:path";
import { componentsDir, firstParagraph, listComponents, readReadme, siteRoot, splitReadme } from "../.vitepress/eos-source.mjs";
import { groupTitleOf } from "../.vitepress/groups.mjs";
import { usedIn } from "../.vitepress/patterns.mjs";

const EXPECTED_SECTIONS = ["Keyboard", "Related"];

/** The guide pages that explain a component, shown as "Guides" beside "Used in". Kept here, on the site, since the library's READMEs do not know the site's pages. */
const GUIDE_LINKS = {
  tables: { name: "Data tables", link: "/guide/data-tables" },
  forms: { name: "Forms and validation", link: "/guide/forms" },
  toasts: { name: "Toasts and notifications", link: "/guide/toasts" },
  scoped: { name: "Theming: scoped themes", link: "/guide/theming#scoped-themes" },
  icons: { name: "Icons", link: "/guide/icons" },
  oneValue: { name: "Which component? Choosing one value", link: "/guide/choosing#choosing-one-value" },
  showingMore: { name: "Which component? Showing more", link: "/guide/choosing#showing-more" },
  telling: { name: "Which component? Telling people things", link: "/guide/choosing#telling-people-things" },
  layouts: { name: "Composing layouts", link: "/guide/layouts" },
  page: { name: "Composing layouts: the page", link: "/guide/layouts#the-page" },
  language: { name: "Words and language", link: "/guide/language" },
  shortcuts: { name: "Composables: useShortcuts", link: "/guide/composables#useshortcuts-map-options" },
  copy: { name: "Composables: useCopy", link: "/guide/composables#usecopy-options" },
  toggletip: { name: "Glossary: toggletip", link: "/guide/glossary#toggletip" },
};
const GUIDES_OF = Object.fromEntries(
  Object.entries({
    DataGrid: ["tables"],
    Table: ["tables"],
    Form: ["forms"],
    Field: ["forms"],
    Fieldset: ["forms"],
    TextField: ["forms"],
    ToastProvider: ["toasts"],
    Toast: ["toasts"],
    Notice: ["toasts", "telling"],
    ConfigProvider: ["scoped", "language"],
    Icon: ["icons"],
    IconButton: ["icons"],
    Select: ["oneValue"],
    Combobox: ["oneValue"],
    RadioGroup: ["oneValue"],
    Segmented: ["oneValue"],
    Checkbox: ["oneValue"],
    CheckboxGroup: ["oneValue"],
    Switch: ["oneValue"],
    Dialog: ["showingMore"],
    Drawer: ["showingMore"],
    Disclosure: ["showingMore"],
    Tooltip: ["showingMore"],
    Toggletip: ["showingMore", "toggletip"],
    EmptyState: ["telling"],
    Skeleton: ["telling"],
    Stack: ["layouts"],
    Inline: ["layouts"],
    Grid: ["layouts"],
    Surface: ["layouts"],
    Container: ["page"],
    AppShell: ["page"],
    PageHeader: ["page"],
    CommandPalette: ["shortcuts"],
    Kbd: ["shortcuts"],
    CopyButton: ["copy"],
    CurrencyField: ["language"],
    DatePicker: ["language"],
  }).map(([name, keys]) => [name, keys.map((k) => GUIDE_LINKS[k])]),
);

export default {
  watch: [join(componentsDir, "*/README.md").split(sep).join("/"), join(siteRoot, "docs/components/demos/*.vue").split(sep).join("/")],
  paths() {
    const names = listComponents();
    const known = new Set(names);
    const fixRelative = (md, self) =>
      md.replace(/\]\((\.{1,2}\/[^)\s]*)\)/g, (m, target) => {
        if (/icons\/README/.test(target)) return "](/guide/icons)";
        const sibling = /^\.\.\/([A-Z][A-Za-z]+)\/README\.md$/.exec(target);
        if (sibling && known.has(sibling[1])) return `](/components/${sibling[1]})`;
        const path = new URL(target, `https://x/packages/vue/src/components/${self}/`).pathname.slice(1);
        return `](https://github.com/Dame-G/eos/blob/main/${path})`;
      });
    // The library writes an em dash for "no default" in its props tables: the site says "None".
    const noDefault = (md) => md.replace(/^\|.*$/gm, (row) => row.replace(/\|\s*—\s*(?=\|)/g, "| None "));
    const link = (md, self) =>
      fixRelative(md, self).replace(/(^|[^`\[])`(E[A-Z][A-Za-z]+)`/g, (m, pre, tag) => {
        const folder = tag.slice(1);
        return known.has(folder) && folder !== self ? `${pre}[\`${tag}\`](/components/${folder})` : m;
      });

    const patterns = usedIn();
    const missing = [];
    const pages = names.map((name) => {
      const readme = readReadme(name);
      if (readme) {
        for (const heading of ["Accessibility", ...EXPECTED_SECTIONS]) {
          const a11y = /^## Accessibility\s*$([\s\S]*?)(?=^## |(?![\s\S]))/m.exec(readme)?.[1] ?? "";
          const optional = heading === "Keyboard" && /^(?:- )?Not focusable\.\s*$/m.test(a11y);
          if (!optional && !new RegExp(`^## ${heading}\\s*$`, "m").test(readme)) missing.push({ name, heading });
        }
      }
      const hasDemo = existsSync(join(siteRoot, "docs/components/demos", `${name}.vue`));
      const { head, rest } = splitReadme(readme || `# E${name}\n`);
      const group = groupTitleOf(name);
      const demo = [
        "## Demo",
        "",
        `<ComponentDemo name="${name}" />`,
        "",
        ...(hasDemo ? ["<EDisclosure title=\"Source\">", "", `<<< @/components/demos/${name}.vue`, "", "</EDisclosure>", ""] : []),
      ].join("\n");
      const noReadme = readme ? "" : `\n\n<ENotice tone="warning">The library has no README.md for E${name} yet, so this page only has the demo.</ENotice>\n`;
      // Derived from each pattern's "Built from:" line, so the list cannot drift from the patterns.
      const used = patterns.get(name) ?? [];
      const usedSection = used.length ? ["## Used in", "", ...used.map((p) => `- [${p.name}](/patterns/${p.slug})`)].join("\n") : "";
      const guides = GUIDES_OF[name] ?? [];
      const guidesSection = guides.length ? ["## Guides", "", ...guides.map((g) => `- [${g.name}](${g.link})`)].join("\n") : "";
      // Every component is exported by name from the package root.
      const importLine = ["```ts", `import { E${name} } from "@eos-ui/vue";`, "```"].join("\n");
      const source = readme ? `This page is the component's README in the library. [View or edit it on GitHub](https://github.com/Dame-G/eos/blob/main/packages/vue/src/components/${name}/README.md).` : "";
      const content = [link(head, name), importLine, noReadme, demo, noDefault(link(rest, name)), usedSection, guidesSection, source].join("\n\n");
      return {
        params: { name, group, description: firstParagraph(readme) },
        content,
      };
    });
    // Every README must have Accessibility, Keyboard and Related, and a missing one fails the build. A component that cannot
    // take focus may leave out Keyboard when its Accessibility section has the line "Not focusable." (or "- Not focusable.").
    // Set EOS_LENIENT_SECTIONS to downgrade that to a warning when building against an older library release that predates the sections.
    for (const heading of ["Accessibility", ...EXPECTED_SECTIONS]) {
      const lacking = missing.filter((m) => m.heading === heading).map((m) => `E${m.name}`);
      if (lacking.length) console.warn(`[eos-site] ${lacking.length} README.md file(s) have no "## ${heading}" section: ${lacking.join(", ")}.`);
    }
    if (missing.length && !process.env.EOS_LENIENT_SECTIONS) throw new Error(`${missing.length} component README section(s) are missing. Add them to the library READMEs, or set EOS_LENIENT_SECTIONS to build anyway. See the warnings above.`);
    return pages;
  },
};
