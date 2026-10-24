/** The part of a module id that marks the default theme's own stylesheets. Pinned to the VitePress version in package.json: see "Upgrading VitePress" in the README. */
export const THEME_CSS_MARK = "vitepress/dist/client/theme-default";

const posix = (id: string) => id.replaceAll("\\", "/");

export function isThemeCss(id: string): boolean {
  return posix(id).includes(THEME_CSS_MARK) && (id.endsWith(".css") || id.includes(".css?") || id.includes("type=style"));
}

/** Where the doc styles are scoped so they stop at the demos, patterns and library components. custom.css scopes its own doc rules to the same list. */
export const DOC_SCOPE_LIMIT = ".demo-stage, .pattern-stage, .eos-live, .e-code, .e-details";

/**
 * VitePress ships unlayered CSS, which would beat the library's `@layer e.*` rules inside the demos. This wraps the
 * default theme's CSS in `@layer e.reset`, the lowest EOS layer, so the library wins inside demos and the site's own
 * unlayered `custom.css` wins over both. `@import`s are hoisted (they must come first) and given the same layer, and
 * `vp-doc.css` is scoped to stop at the demos.
 */
export function wrapInLayer(code: string, id: string): string {
  const imports: string[] = [];
  const body = code.replace(/^\s*@import\s+([^;]+);[ \t]*$/gm, (_m, spec: string) => {
    imports.push(`@import ${spec.trim()} layer(e.reset);`);
    return "";
  });
  const scoped = posix(id).includes("styles/components/vp-doc.css");
  const css = scoped ? `@scope (.vp-doc) to (${DOC_SCOPE_LIMIT}) {\n${body.replace(/\.vp-doc\b/g, ":scope")}\n}` : body;
  return `${imports.join("\n")}\n@layer e.reset {\n${css}\n}\n`;
}

export function vitepressInLayer() {
  return {
    name: "eos-site:vitepress-layer",
    enforce: "pre" as const,
    transform(code: string, id: string) {
      return isThemeCss(id) ? { code: wrapInLayer(code, id), map: null } : null;
    },
  };
}
