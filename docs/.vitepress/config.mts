import { codeToHtml } from "shiki";
import { defineConfig, type DefaultTheme, type HeadConfig } from "vitepress";
import { readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { isColor, withSwatches, withSwatchesInMarkup } from "./color.mjs";
import { collectScriptHashes, headersFile, redirectsFile } from "./csp.mjs";
import { GROUPS, groupedComponents, libraryBuildInfo, licenseText, listComponents, componentModified } from "./eos-source.mjs";
import { GROUP_OF } from "./groups.mjs";
import { PATTERN_EXTRAS, guideSections, patternSections } from "./pages.mjs";
import { areaOf, renderForSearch, searchBuildOptions, searchOptions } from "./search";
import { SHIKI_THEME, snippetLang } from "./shiki";
import { BOOT_SCRIPT, THEME_COLOR, darkCss } from "./scheme";
import { vitepressInLayer } from "./vitepress-layer";

const SITE = "https://eos.dame.gg";
const IMAGE = SITE + "/og.png";
const IMAGE_ALT = "eos: a component library for Vue. The eos logo, a white e on a tile beside the word eos, on a pastel lavender card with a darker edge along the bottom like a button.";
/** The size of docs/public/og.png. */
const IMAGE_SIZE = { width: "1200", height: "630" };
let warnedFont = false;

const components = listComponents();
/** The home page's install line, coloured here so the browser does not fetch a highlighter for one line. */
const installHtml = await codeToHtml(`npm install @eos-ui/vue@${libraryBuildInfo.version}`, { lang: "bash", theme: SHIKI_THEME });

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

const guide: DefaultTheme.SidebarItem[] = guideSections().map((s) => ({
  text: s.title,
  items: [...s.pages.map((g) => ({ text: g.name, link: `/guide/${g.slug}` })), ...(s.title === "Reference" ? [{ text: "Changelog", link: "/changelog" }] : [])],
}));

// Grouped as the overview groups them, then the pages that are not whole patterns.
const patterns: DefaultTheme.SidebarItem[] = [
  { text: "Overview", link: "/patterns/" },
  ...patternSections().map((s) => ({ text: s.title, items: s.pages.map((p) => ({ text: p.name, link: `/patterns/${p.slug}` })) })),
  { text: "More", items: PATTERN_EXTRAS.map((p) => ({ text: p.name, link: `/patterns/${p.slug}` })) },
];

export default defineConfig({
  title: "eos",
  titleTemplate: ":title · eos",
  description: "A component library for Vue. High contrast by default, rebrandable with a few lines.",
  sitemap: {
    hostname: SITE,
    transformItems(items) {
      return items.map((item) => {
        const name = /^components\/([^/]+?)(?:\.html)?$/.exec(item.url)?.[1];
        const lastmod = name && components.includes(name) ? componentModified(name) : undefined;
        return lastmod ? { ...item, lastmod: Date.parse(lastmod) } : item;
      });
    },
  },
  lang: "en-US",
  cleanUrls: true,
  appearance: false,
  lastUpdated: false,
  srcExclude: ["**/README.md"],
  buildEnd(siteConfig) {
    // _headers is generated, not copied from public/, because the script hashes depend on what the built pages contain.
    writeFileSync(join(siteConfig.outDir, "_headers"), headersFile(collectScriptHashes(siteConfig.outDir)));
    writeFileSync(join(siteConfig.outDir, "_redirects"), redirectsFile(components));
    // The icon stylesheet VitePress generates for its own theme is empty here, because the site draws its icons itself.
    rmSync(join(siteConfig.outDir, "vp-icons.css"), { force: true });
    // The manifest takes its colours from the same tokens as the pages, so they cannot drift apart.
    const manifest = JSON.parse(readFileSync(join(siteConfig.srcDir, "public/site.webmanifest"), "utf8"));
    writeFileSync(join(siteConfig.outDir, "site.webmanifest"), JSON.stringify({ ...manifest, theme_color: THEME_COLOR.light, background_color: THEME_COLOR.light }, null, 2) + "\n");
  },
  transformHtml(code) {
    return code.replace(/<link\b[^>]*\bvp-icons\.css[^>]*>\s*/g, "");
  },
  transformPageData(pageData) {
    // The components index draws its group headings itself, so they are not in its markdown. The outline lists them all the same.
    if (pageData.relativePath === "components/index.md") pageData.headers = groupedComponents().map((g) => ({ level: 2, title: g.title, slug: g.id, link: `#${g.id}`, children: [] }));
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
      ["meta", { property: "og:image:alt", content: IMAGE_ALT }],
      ["meta", { property: "og:image:width", content: IMAGE_SIZE.width }],
      ["meta", { property: "og:image:height", content: IMAGE_SIZE.height }],
      ["meta", { name: "twitter:card", content: "summary_large_image" }],
      ["meta", { name: "twitter:title", content: title }],
      ["meta", { name: "twitter:description", content: description }],
      ["meta", { name: "twitter:image", content: IMAGE }],
      ["meta", { name: "twitter:image:alt", content: IMAGE_ALT }],
    ];
    // The title's face is in the header on every page, so it loads with the body face rather than swapping in late.
    const titleFont = assets.find((a) => /\/outfit-latin-wght-normal\.[^/]*\.woff2$/.test(a));
    if (titleFont) head.push(["link", { rel: "preload", as: "font", type: "font/woff2", href: titleFont, crossorigin: "" }]);
    const font = assets.find((a) => /\/bricolage-grotesque-latin-wght-normal\.[^/]*\.woff2$/.test(a));
    if (font) head.push(["link", { rel: "preload", as: "font", type: "font/woff2", href: font, crossorigin: "" }]);
    // A renamed font file would silently drop the preload and bring the late font swap back, so say so once.
    else if (!warnedFont) {
      warnedFont = true;
      console.warn("[eos-site] No Bricolage Grotesque latin woff2 among the page assets, so the font preload was skipped. Check the file name in docs/.vitepress/theme/fonts.css against the pattern in config.mts.");
    }
    const component = /^components\/([^/]+)\.md$/.exec(pageData.relativePath)?.[1];
    if (component) {
      const trail = [
        { name: "Home", url: SITE + "/" },
        { name: areaOf(`/${path}`), url: SITE + "/components/" },
        { name: pageData.title, url },
      ];
      head.push([
        "script",
        { type: "application/ld+json" },
        JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: trail.map((t, i) => ({ "@type": "ListItem", position: i + 1, name: t.name, item: t.url })),
        }),
      ]);
    }
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
    ["meta", { name: "theme-color", content: THEME_COLOR.light, media: "(prefers-color-scheme: light)" }],
    ["meta", { name: "theme-color", content: THEME_COLOR.dark, media: "(prefers-color-scheme: dark)" }],
    ["script", {}, BOOT_SCRIPT],
    ["style", {}, darkCss],
  ],
  markdown: {
    theme: SHIKI_THEME,
    // Each page's h2s, for the outline beside it.
    headers: { level: [2] },
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
      // Each h2 starts a section: a divider, then a <section> that runs to the next h2. The divider is its own element, so a section is only its content and has the same box on every page (the outline flash highlights it as it is).
      md.core.ruler.push("doc_sections", (state) => {
        const html = (content: string) => {
          const token = new state.Token("html_block", "", 0);
          token.content = content;
          token.block = true;
          return token;
        };
        const out: typeof state.tokens = [];
        let open = false;
        for (const token of state.tokens) {
          if (token.type === "heading_open" && token.tag === "h2" && token.level === 0) {
            if (open) out.push(html("</section>\n"));
            out.push(html('<div class="doc-divider" aria-hidden="true"></div>\n'), html('<section class="doc-section">\n'));
            open = true;
          }
          out.push(token);
        }
        if (open) out.push(html("</section>\n"));
        state.tokens = out;
      });
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
    nav: [
      { text: "Guide", link: "/guide/getting-started", activeMatch: "/guide/" },
      { text: "Components", link: "/components/", activeMatch: "/components/" },
      { text: "Patterns", link: "/patterns/", activeMatch: "/patterns/" },
      { text: "Playground", link: "/playground" },
    ],
    sidebar: {
      "/guide/": guide,
      "/changelog": guide,
      "/components/": componentSidebar(),
      "/patterns/": patterns,
    },
    socialLinks: [{ icon: "github", link: "https://github.com/Dame-G/eos" }],
    search: { provider: "local", options: { miniSearch: { options: searchBuildOptions, searchOptions }, _render: renderForSearch } },
  },
  vite: {
    plugins: [vitepressInLayer()],
    define: { __EOS_BUILD__: JSON.stringify(libraryBuildInfo), __EOS_INSTALL_HTML__: JSON.stringify(installHtml), __EOS_LICENSE__: JSON.stringify(licenseText) },
    resolve: {
      dedupe: ["vue"],
    },
    ssr: { noExternal: ["@eos-ui/vue", "@eos-ui/tokens", "reka-ui", "@vueuse/core", "@vueuse/shared", "@internationalized/date", "@floating-ui/vue"] },
    server: { fs: { allow: ["../.."] } },
    build: { chunkSizeWarningLimit: 650 },
  },
});
