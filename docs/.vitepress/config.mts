import { defineConfig, type DefaultTheme } from "vitepress";
import { sep } from "node:path";
import { GROUPS, listComponents } from "./eos-source.mjs";
import { GROUP_OF } from "./groups.mjs";

const components = listComponents();

/** The sidebar of the component pages, grouped by the library's layers. Generated from the folders on disk. */
function componentSidebar(): DefaultTheme.SidebarItem[] {
  const groups = GROUPS.map((g) => ({
    text: g.title,
    items: components.filter((c) => GROUP_OF[c as keyof typeof GROUP_OF] === g.id).map((c) => ({ text: "E" + c, link: `/components/${c}` })),
  }));
  const unmapped = components.filter((c) => !(c in GROUP_OF));
  if (unmapped.length) groups.push({ text: "More", items: unmapped.map((c) => ({ text: "E" + c, link: `/components/${c}` })) });
  return [{ text: "Components", link: "/components/" }, ...groups.filter((g) => g.items.length)];
}

const guide: DefaultTheme.SidebarItem[] = [
  {
    text: "Guide",
    items: [
      { text: "Getting started", link: "/guide/getting-started" },
      { text: "Theming", link: "/guide/theming" },
      { text: "Icons", link: "/guide/icons" },
      { text: "Words and language", link: "/guide/language" },
      { text: "Forms and validation", link: "/guide/forms" },
      { text: "Accessibility", link: "/guide/accessibility" },
      { text: "Design principles", link: "/guide/design-principles" },
      { text: "Nuxt and SSR", link: "/guide/ssr" },
      { text: "Migrating from Vuetify", link: "/guide/vuetify" },
    ],
  },
];

const patterns: DefaultTheme.SidebarItem[] = [
  {
    text: "Patterns",
    items: [
      { text: "Overview", link: "/patterns/" },
      { text: "Pay a bill", link: "/patterns/pay-a-bill" },
      { text: "Sign in", link: "/patterns/sign-in" },
      { text: "Register", link: "/patterns/register" },
      { text: "Schedule a visit", link: "/patterns/schedule-a-visit" },
      { text: "Sign a form", link: "/patterns/sign-a-form" },
      { text: "Statements", link: "/patterns/statements" },
    ],
  },
];

const tools: DefaultTheme.SidebarItem[] = [
  {
    text: "Design",
    items: [
      { text: "Tokens", link: "/tokens" },
      { text: "Theme playground", link: "/playground" },
    ],
  },
];

/**
 * VitePress ships its styles unlayered, which would beat every `@layer e.*` rule of the library inside the demos.
 * This puts the VitePress default theme in `@layer e.reset`, the lowest of the Eos layers (the library declares the
 * order `e.reset, e.tokens, ...`), so wherever the stylesheet lands in the bundle the VitePress theme loses to every
 * Eos component and a component looks the same in a page as it does anywhere else. The site's own `custom.css`
 * stays unlayered and wins over both.
 */
function vitepressInLayer() {
  const isThemeCss = (id: string) =>
    id.split(sep).join("/").includes("vitepress/dist/client/theme-default") && (id.endsWith(".css") || id.includes(".css?") || id.includes("type=style"));
  return {
    name: "eos-site:vitepress-layer",
    enforce: "pre" as const,
    transform(code: string, id: string) {
      if (!isThemeCss(id)) return null;
      const imports: string[] = [];
      const body = code.replace(/^\s*@import\s+([^;]+);[ \t]*$/gm, (_m, spec: string) => {
        imports.push(`@import ${spec.trim()} layer(e.reset);`);
        return "";
      });
      // The prose styles (".vp-doc li", ".vp-doc summary", ...) are for the page text. A donut scope keeps them out of
      // the live demos and patterns, so a component looks the same there as it does anywhere else.
      const scoped = id.split(sep).join("/").includes("styles/components/vp-doc.css");
      const css = scoped ? `@scope (.vp-doc) to (.demo-stage, .pattern-stage, .eos-live) {\n${body.replace(/\.vp-doc\b/g, ":scope")}\n}` : body;
      return { code: `${imports.join("\n")}\n@layer e.reset {\n${css}\n}\n`, map: null };
    },
  };
}

export default defineConfig({
  title: "Eos",
  description: "Accessible Vue 3 components with a token-based theme system. Calm, high contrast and rebrandable with a few lines.",
  lang: "en-US",
  cleanUrls: true,
  appearance: false,
  lastUpdated: false,
  srcExclude: ["**/README.md"],
  head: [
    ["link", { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" }],
    ["meta", { name: "theme-color", content: "#17586d" }],
  ],
  markdown: {
    theme: "github-light-high-contrast",
    config(md) {
      // A table scrolls sideways inside its own box on a narrow screen instead of stretching the page.
      md.renderer.rules.table_open = () => '<div class="table-wrap"><table>';
      md.renderer.rules.table_close = () => "</table></div>";
    },
  },
  themeConfig: {
    logo: { src: "/favicon.svg", alt: "" },
    siteTitle: "Eos",
    nav: [
      { text: "Guide", link: "/guide/getting-started", activeMatch: "/guide/" },
      { text: "Components", link: "/components/", activeMatch: "/components/" },
      { text: "Patterns", link: "/patterns/", activeMatch: "/patterns/" },
      { text: "Tokens", link: "/tokens" },
      { text: "Playground", link: "/playground" },
    ],
    sidebar: {
      "/guide/": guide,
      "/components/": componentSidebar(),
      "/patterns/": patterns,
      "/tokens": tools,
      "/playground": tools,
    },
    socialLinks: [{ icon: "github", link: "https://github.com/Dame-G/eos" }],
    search: { provider: "local" },
    outline: { level: [2, 3], label: "On this page" },
    notFound: { title: "That page is not here", quote: "It may have moved, or the component has not been written yet.", linkText: "Back to the home page" },
  },
  vite: {
    plugins: [vitepressInLayer()],
    resolve: {
      // One copy of Vue: the library is linked from beside this repo and has its own node_modules.
      dedupe: ["vue"],
    },
    ssr: { noExternal: ["@eos-ui/vue", "@eos-ui/tokens", "reka-ui", "@vueuse/core", "@vueuse/shared", "@internationalized/date", "@floating-ui/vue"] },
    server: { fs: { allow: ["../.."] } },
    build: { chunkSizeWarningLimit: 900 },
  },
});
