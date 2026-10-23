import { defineConfig, type DefaultTheme, type HeadConfig } from "vitepress";
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { isColor, withSwatches, withSwatchesInMarkup } from "./color.mjs";
import { collectScriptHashes, headersFile, redirectsFile } from "./csp.mjs";
import { GROUPS, libraryBuildInfo, licenseText, listComponents } from "./eos-source.mjs";
import { GROUP_OF } from "./groups.mjs";
import { DESIGN, GUIDE, PATTERNS } from "./pages.mjs";
import { renderForSearch, searchBuildOptions, searchOptions } from "./search";
import { SHIKI_THEME, snippetLang } from "./shiki";
import { BOOT_SCRIPT, THEME_COLOR, darkCss } from "./scheme";
import { vitepressInLayer } from "./vitepress-layer";

const SITE = "https://eos.dame.gg";
const IMAGE = SITE + "/og.png";
const IMAGE_ALT = "EOS: a component library for Vue, shown as the word EOS in heavy teal letters.";
/** The size of docs/public/og.png. */
const IMAGE_SIZE = { width: "1200", height: "630" };
let warnedFont = false;

const components = listComponents();

function componentSidebar(): DefaultTheme.SidebarItem[] {
  const groups = GROUPS.map((g) => ({
    text: g.title,
    items: components.filter((c) => GROUP_OF[c as keyof typeof GROUP_OF] === g.id).map((c) => ({ text: "E" + c, link: `/components/${c}` })),
  }));
  const unmapped = components.filter((c) => !(c in GROUP_OF));
  // In CI a component with no group fails the build, so a library release cannot ship a page filed under "More" by accident.
  if (unmapped.length && process.env.CI) throw new Error(`[eos-site] No sidebar group for: ${unmapped.map((c) => "E" + c).join(", ")}. Add them to docs/.vitepress/groups.mjs.`);
  if (unmapped.length) console.warn(`[eos-site] No sidebar group for: ${unmapped.map((c) => "E" + c).join(", ")}. Add them to docs/.vitepress/groups.mjs.`);
  if (unmapped.length) groups.push({ text: "More", items: unmapped.map((c) => ({ text: "E" + c, link: `/components/${c}` })) });
  return [{ text: "Overview", link: "/components/" }, ...groups.filter((g) => g.items.length)];
}

const guide: DefaultTheme.SidebarItem[] = [
  { text: "Guide", items: [...GUIDE.map((g) => ({ text: g.name, link: `/guide/${g.slug}` })), { text: "Changelog", link: "/changelog" }] },
];

const patterns: DefaultTheme.SidebarItem[] = [
  {
    text: "Patterns",
    items: [{ text: "Overview", link: "/patterns/" }, ...PATTERNS.map((p) => ({ text: p.name, link: `/patterns/${p.slug}` }))],
  },
];

const tools: DefaultTheme.SidebarItem[] = [{ text: "Design", items: DESIGN.map((d) => ({ text: d.name, link: `/${d.slug}` })) }];

export default defineConfig({
  title: "EOS",
  titleTemplate: ":title · EOS",
  description: "A component library for Vue. High contrast by default, rebrandable with a few lines.",
  sitemap: { hostname: SITE },
  lang: "en-US",
  cleanUrls: true,
  appearance: false,
  lastUpdated: false,
  srcExclude: ["**/README.md"],
  buildEnd(siteConfig) {
    // _headers is generated, not copied from public/, because the script hashes depend on what the built pages contain.
    writeFileSync(join(siteConfig.outDir, "_headers"), headersFile(collectScriptHashes(siteConfig.outDir)));
    writeFileSync(join(siteConfig.outDir, "_redirects"), redirectsFile(components));
  },
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
      ["meta", { property: "og:site_name", content: "EOS" }],
      ["meta", { property: "og:title", content: title }],
      ["meta", { property: "og:description", content: description }],
      ["meta", { property: "og:url", content: url }],
      ["meta", { property: "og:image", content: IMAGE }],
      ["meta", { property: "og:image:alt", content: IMAGE_ALT }],
      ["meta", { property: "og:image:width", content: IMAGE_SIZE.width }],
      ["meta", { property: "og:image:height", content: IMAGE_SIZE.height }],
      ["meta", { name: "twitter:card", content: "summary_large_image" }],
      ["meta", { name: "twitter:title", content: title }],
      ["meta", { name: "twitter:description", content: description }],
      ["meta", { name: "twitter:image", content: IMAGE }],
      ["meta", { name: "twitter:image:alt", content: IMAGE_ALT }],
    ];
    const font = assets.find((a) => /\/bricolage-grotesque-latin-wght-normal\.[^/]*\.woff2$/.test(a));
    if (font) head.push(["link", { rel: "preload", as: "font", type: "font/woff2", href: font, crossorigin: "" }]);
    // A renamed font file would silently drop the preload and bring the late font swap back, so say so once.
    else if (!warnedFont) {
      warnedFont = true;
      console.warn("[eos-site] No Bricolage Grotesque latin woff2 among the page assets, so the font preload was skipped. Check the file name in docs/.vitepress/theme/fonts.css against the pattern in config.mts.");
    }
    if (pageData.relativePath === "index.md") {
      head.push([
        "script",
        { type: "application/ld+json" },
        JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareSourceCode",
          name: "EOS",
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
    ["meta", { name: "theme-color", content: THEME_COLOR.light, media: "(prefers-color-scheme: light)" }],
    ["meta", { name: "theme-color", content: THEME_COLOR.dark, media: "(prefers-color-scheme: dark)" }],
    ["script", {}, BOOT_SCRIPT],
    ["style", {}, darkCss],
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
        return `<div class="e-table-wrap e-table-wrap--striped e-table-wrap--dense"><div class="e-table-scroll" tabindex="0" role="region" aria-label="${label}"><table class="e-table">`;
      };
      md.renderer.rules.table_close = () => "</table></div></div>";
      const linkOpen = md.renderer.rules.link_open ?? ((tokens, idx, options, _env, self) => self.renderToken(tokens, idx, options));
      md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
        if (!tokens[idx]!.attrGet("class")?.includes("header-anchor")) tokens[idx]!.attrJoin("class", "e-link");
        return linkOpen(tokens, idx, options, env, self);
      };
      // A hex colour gets the library's own swatch beside it wherever it is written: in plain text, in inline code and in code blocks.
      md.core.ruler.push("colour_swatches", (state) => {
        for (const block of state.tokens) {
          if (block.type !== "inline" || !block.children) continue;
          const out: typeof block.children = [];
          for (const token of block.children) {
            const parts = token.type === "text" ? withSwatches(md.utils.escapeHtml(token.content)).replace(/[{}]/g, (c) => (c === "{" ? "&#123;" : "&#125;")) : "";
            if (!parts.includes("e-highlight-swatch")) {
              out.push(token);
              continue;
            }
            const html = new state.Token("html_inline", "", 0);
            html.content = parts;
            out.push(html);
          }
          block.children = out;
        }
      });
      // Inline code is the library's EHighlight. A literal colour in it, such as `#2c95b4`, gets the swatch to its right; a colour among other text gets it right after the colour.
      md.renderer.rules.code_inline = (tokens, idx) => {
        const content = tokens[idx]!.content;
        const escaped = md.utils.escapeHtml(content);
        const braces = (s: string) => s.replace(/[{}]/g, (c) => (c === "{" ? "&#123;" : "&#125;"));
        if (isColor(content)) return `<EHighlight code swatch="${escaped.trim()}">${braces(escaped)}</EHighlight>`;
        return `<EHighlight code>${braces(withSwatches(escaped))}</EHighlight>`;
      };
      const fence = md.renderer.rules.fence!;
      md.renderer.rules.fence = (...args) => {
        const token = args[0][args[1]]!;
        const written = token.info.trim().split(/\s+/)[0] ?? "";
        token.info = token.info.replace(/^\s*vue\b/, snippetLang(token.content, written));
        const html = fence(...args);
        const lang = written || (/class="language-([^"\s]+)/.exec(html)?.[1] ?? "");
        const pre = /<pre[\s\S]*<\/pre>/.exec(html)?.[0];
        return pre ? `<ECodeBlock lang="${lang}">${withSwatchesInMarkup(pre)}</ECodeBlock>\n` : html;
      };
    },
  },
  themeConfig: {
    logo: { src: "/favicon.svg", alt: "" },
    siteTitle: "EOS",
    nav: [
      { text: "Guide", link: "/guide/getting-started", activeMatch: "/guide/" },
      { text: "Components", link: "/components/", activeMatch: "/components/" },
      { text: "Patterns", link: "/patterns/", activeMatch: "/patterns/" },
      { text: "Playground", link: "/playground" },
      { text: "Changelog", link: "/changelog" },
    ],
    sidebar: {
      "/guide/": guide,
      "/changelog": guide,
      "/components/": componentSidebar(),
      "/patterns/": patterns,
      "/playground": tools,
    },
    socialLinks: [{ icon: "github", link: "https://github.com/Dame-G/eos" }],
    search: { provider: "local", options: { miniSearch: { options: searchBuildOptions, searchOptions }, _render: renderForSearch } },
    outline: { level: [2, 3], label: "On this page" },
  },
  vite: {
    plugins: [vitepressInLayer()],
    define: { __EOS_BUILD__: JSON.stringify(libraryBuildInfo), __EOS_LICENSE__: JSON.stringify(licenseText) },
    resolve: {
      dedupe: ["vue"],
    },
    ssr: { noExternal: ["@eos-ui/vue", "@eos-ui/tokens", "reka-ui", "@vueuse/core", "@vueuse/shared", "@internationalized/date", "@floating-ui/vue"] },
    server: { fs: { allow: ["../.."] } },
    build: { chunkSizeWarningLimit: 900 },
  },
});
