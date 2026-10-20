import { defineConfig, type DefaultTheme, type HeadConfig } from "vitepress";
import { sep } from "node:path";
import { GROUPS, listComponents } from "./eos-source.mjs";
import { GROUP_OF } from "./groups.mjs";
import { DESIGN, GUIDE, PATTERNS } from "./pages.mjs";
import { renderForSearch, searchBuildOptions, searchOptions } from "./search";
import { SHIKI_THEME, snippetLang } from "./shiki";

const SITE = "https://eos.dame.gg";
const IMAGE = SITE + "/og.png";

const components = listComponents();

function componentSidebar(): DefaultTheme.SidebarItem[] {
  const groups = GROUPS.map((g) => ({
    text: g.title,
    items: components.filter((c) => GROUP_OF[c as keyof typeof GROUP_OF] === g.id).map((c) => ({ text: "E" + c, link: `/components/${c}` })),
  }));
  const unmapped = components.filter((c) => !(c in GROUP_OF));
  if (unmapped.length) console.warn(`[eos-site] No sidebar group for: ${unmapped.map((c) => "E" + c).join(", ")}. Add them to docs/.vitepress/groups.mjs.`);
  if (unmapped.length) groups.push({ text: "More", items: unmapped.map((c) => ({ text: "E" + c, link: `/components/${c}` })) });
  return [{ text: "Overview", link: "/components/" }, ...groups.filter((g) => g.items.length)];
}

const guide: DefaultTheme.SidebarItem[] = [{ text: "Guide", items: GUIDE.map((g) => ({ text: g.name, link: `/guide/${g.slug}` })) }];

const patterns: DefaultTheme.SidebarItem[] = [
  {
    text: "Patterns",
    items: [{ text: "Overview", link: "/patterns/" }, ...PATTERNS.map((p) => ({ text: p.name, link: `/patterns/${p.slug}` }))],
  },
];

const tools: DefaultTheme.SidebarItem[] = [{ text: "Design", items: DESIGN.map((d) => ({ text: d.name, link: `/${d.slug}` })) }];

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
      const scoped = id.split(sep).join("/").includes("styles/components/vp-doc.css");
      const css = scoped ? `@scope (.vp-doc) to (.demo-stage, .pattern-stage, .eos-live, .e-code, .e-acc, .e-details) {\n${body.replace(/\.vp-doc\b/g, ":scope")}\n}` : body;
      return { code: `${imports.join("\n")}\n@layer e.reset {\n${css}\n}\n`, map: null };
    },
  };
}

export default defineConfig({
  title: "eos",
  titleTemplate: ":title · Eos",
  description: "Accessible Vue 3 components with a token-based theme system. Calm, high contrast and rebrandable with a few lines.",
  sitemap: { hostname: SITE },
  lang: "en-US",
  cleanUrls: true,
  appearance: false,
  lastUpdated: false,
  srcExclude: ["**/README.md"],
  transformPageData(pageData) {
    const description = pageData.params?.description;
    if (typeof description === "string" && description) pageData.description = description;
  },
  transformHead({ pageData, assets, title, description }) {
    if (pageData.isNotFound) return [["meta", { name: "robots", content: "noindex" }]];
    const path = pageData.relativePath.replace(/(^|\/)index\.md$/, "$1").replace(/\.md$/, "");
    const url = SITE + "/" + path;
    const head: HeadConfig[] = [
      ["link", { rel: "canonical", href: url }],
      ["meta", { property: "og:type", content: "website" }],
      ["meta", { property: "og:site_name", content: "eos" }],
      ["meta", { property: "og:title", content: title }],
      ["meta", { property: "og:description", content: description }],
      ["meta", { property: "og:url", content: url }],
      ["meta", { property: "og:image", content: IMAGE }],
      ["meta", { name: "twitter:card", content: "summary_large_image" }],
    ];
    const font = assets.find((a) => /\/bricolage-grotesque-latin-wght-normal\.[^/]*\.woff2$/.test(a));
    if (font) head.push(["link", { rel: "preload", as: "font", type: "font/woff2", href: font, crossorigin: "" }]);
    if (pageData.relativePath === "index.md") {
      head.push([
        "script",
        { type: "application/ld+json" },
        JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareSourceCode",
          name: "eos",
          description,
          url: SITE,
          codeRepository: "https://github.com/Dame-G/eos",
          programmingLanguage: "TypeScript",
          runtimePlatform: "Vue 3",
          license: "https://opensource.org/license/mit",
        }),
      ]);
    }
    return head;
  },
  head: [
    ["link", { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" }],
    ["link", { rel: "apple-touch-icon", href: "/apple-touch-icon.png" }],
    ["link", { rel: "manifest", href: "/site.webmanifest" }],
    ["meta", { name: "theme-color", content: "#17586d" }],
  ],
  markdown: {
    theme: SHIKI_THEME,
    config(md) {
      md.renderer.rules.table_open = (tokens, idx, _options, env) => {
        let heading = "";
        for (let i = idx - 1; i >= 0; i--) {
          if (tokens[i]!.type === "heading_open") {
            heading = tokens[i + 1]?.content ?? "";
            break;
          }
        }
        env.tableCount = (env.tableCount ?? 0) + 1;
        const label = md.utils.escapeHtml(`${heading || "Page"}, table ${env.tableCount}`);
        return `<div class="table-wrap"><div class="table-scroll" tabindex="0" role="region" aria-label="${label}"><table>`;
      };
      md.renderer.rules.table_close = () => "</table></div></div>";
      const linkOpen = md.renderer.rules.link_open ?? ((tokens, idx, options, _env, self) => self.renderToken(tokens, idx, options));
      md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
        if (!tokens[idx]!.attrGet("class")?.includes("header-anchor")) tokens[idx]!.attrJoin("class", "e-link");
        return linkOpen(tokens, idx, options, env, self);
      };
      md.renderer.rules.code_inline = (tokens, idx) => {
        const text = md.utils.escapeHtml(tokens[idx]!.content).replace(/[{}]/g, (c) => (c === "{" ? "&#123;" : "&#125;"));
        return `<EHighlight code>${text}</EHighlight>`;
      };
      const fence = md.renderer.rules.fence!;
      md.renderer.rules.fence = (...args) => {
        const token = args[0][args[1]]!;
        const written = token.info.trim().split(/\s+/)[0] ?? "";
        token.info = token.info.replace(/^\s*vue\b/, snippetLang(token.content, written));
        const html = fence(...args);
        const lang = written || (/class="language-([^"\s]+)/.exec(html)?.[1] ?? "");
        const pre = /<pre[\s\S]*<\/pre>/.exec(html)?.[0];
        return pre ? `<ECodeBlock lang="${lang}">${pre}</ECodeBlock>\n` : html;
      };
    },
  },
  themeConfig: {
    logo: { src: "/favicon.svg", alt: "" },
    siteTitle: "eos",
    nav: [
      { text: "Guide", link: "/guide/getting-started", activeMatch: "/guide/" },
      { text: "Components", link: "/components/", activeMatch: "/components/" },
      { text: "Patterns", link: "/patterns/", activeMatch: "/patterns/" },
      { text: "Playground", link: "/playground" },
    ],
    sidebar: {
      "/guide/": guide,
      "/components/": componentSidebar(),
      "/patterns/": patterns,
      "/playground": tools,
    },
    socialLinks: [{ icon: "github", link: "https://github.com/Dame-G/eos" }],
    search: { provider: "local", options: { miniSearch: { options: searchBuildOptions, searchOptions }, _render: renderForSearch } },
    outline: { level: [2, 3], label: "On this page" },
    notFound: { title: "That page is not here", quote: "It may have moved, or the component has not been written yet.", linkText: "Back to the home page" },
  },
  vite: {
    plugins: [vitepressInLayer()],
    resolve: {
      dedupe: ["vue"],
    },
    ssr: { noExternal: ["@eos-ui/vue", "@eos-ui/tokens", "reka-ui", "@vueuse/core", "@vueuse/shared", "@internationalized/date", "@floating-ui/vue"] },
    server: { fs: { allow: ["../.."] } },
    build: { chunkSizeWarningLimit: 900 },
  },
});
