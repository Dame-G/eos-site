import { describe, expect, it } from "vitest";
// The VitePress files the layer plugin rewrites. If an upgrade moves or renames them, these imports fail first.
import vpDocCss from "vitepress/dist/client/theme-default/styles/components/vp-doc.css?raw";
import varsCss from "vitepress/dist/client/theme-default/styles/vars.css?raw";
import { headersFile, inlineScripts, redirectsFile } from "../docs/.vitepress/csp-policy.mjs";
import { highlight } from "../docs/.vitepress/theme/highlight";
import { SYNONYMS, areaOf, breadcrumb, componentDocs } from "../docs/.vitepress/search";
import customCss from "../docs/.vitepress/theme/custom.css?raw";
import { DOC_SCOPE_LIMIT, THEME_CSS_MARK, isThemeCss, wrapInLayer } from "../docs/.vitepress/vitepress-layer";

describe("vitepressInLayer", () => {
  const id = ["C:", "x", "node_modules", "vitepress", "dist", "client", "theme-default", "styles", "components", "vp-doc.css"].join(String.fromCharCode(92));

  it("only touches the default theme's stylesheets", () => {
    expect(isThemeCss(id)).toBe(true);
    expect(isThemeCss("/site/docs/.vitepress/theme/custom.css")).toBe(false);
    expect(isThemeCss("/node_modules/vitepress/dist/client/theme-default/index.js")).toBe(false);
    expect(id.replaceAll("\\", "/")).toContain(THEME_CSS_MARK);
  });

  it("puts every rule in e.reset and hoists @import first with the same layer, so the library's layers and custom.css both win", () => {
    const out = wrapInLayer('@import "./a.css";\n.x { color: red }\n', "/vitepress/dist/client/theme-default/styles/base.css");
    expect(out.indexOf("@import")).toBeLessThan(out.indexOf("@layer e.reset {"));
    expect(out).toContain('@import "./a.css" layer(e.reset);');
    expect(out.match(/@layer e\.reset \{/g)).toHaveLength(1);
    // Nothing is left outside the layer: the only top-level rules are the imports and the one layer block.
    expect(out.replace(/@import[^\n]*\n/g, "").trimStart().startsWith("@layer e.reset {")).toBe(true);
  });

  it("scopes the doc styles so they stop at the demos and the library's own markup", () => {
    const out = wrapInLayer(".vp-doc h1 { margin: 0 }", id);
    expect(out).toContain("@scope (.vp-doc) to (.demo-stage, .pattern-stage, .eos-live, .e-code, .e-details)");
    // The site's own doc rules stop at the same places.
    expect(customCss).toContain(`@scope (.vp-doc) to (${DOC_SCOPE_LIMIT})`);
    expect(out).toContain(":scope h1");
  });

  it("still finds what it rewrites in the installed VitePress", () => {
    expect(vpDocCss).toContain(".vp-doc");
    expect(varsCss).toContain("--vp-c-brand-1");
  });
});

describe("headers and redirects", () => {
  const hashes = ["'sha256-abc='"];

  it("lists inline scripts by hash and never allows unsafe-inline scripts", () => {
    const file = headersFile(hashes);
    const enforced = /Content-Security-Policy: (.*)/.exec(file)![1]!;
    const scriptSrc = /script-src ([^;]*)/.exec(enforced)![1]!;
    expect(scriptSrc).toContain("'sha256-abc='");
    expect(scriptSrc).not.toContain("unsafe-inline");
    // Shiki runs on its JavaScript regex engine, so nothing needs WebAssembly or eval.
    expect(scriptSrc).not.toContain("eval");
    expect(file).toContain("/assets/*");
  });

  it("sends HSTS and no report-only policy, since nothing collects reports", () => {
    const file = headersFile(hashes);
    expect(file).toContain("Strict-Transport-Security: max-age=31536000; includeSubDomains");
    expect(file).not.toContain("Report-Only");
  });

  it("hashes only scripts the browser runs", () => {
    const html = '<script src="/a.js"></script><script>boot()</script><script type="application/ld+json">{"a":1}</script><script type="module">x()</script>';
    expect(inlineScripts(html)).toEqual(["boot()", "x()"]);
  });

  it("redirects /guide and each lower-case component address, which static assets match case-sensitively", () => {
    const file = redirectsFile(["Button", "TextField", "ab"]);
    expect(file).toContain("/guide/ /guide/getting-started 302");
    expect(file).toContain("/components/button /components/Button 301");
    expect(file).toContain("/components/textfield /components/TextField 301");
    expect(file).not.toContain("/components/ab ");
  });
});

describe("search words", () => {
  it("finds a component by what other libraries call it", () => {
    const docs = componentDocs([{ title: "Form controls", items: [{ name: "Select", summary: "x" }] }]);
    expect(docs[0]!.names).toContain("dropdown");
    expect(SYNONYMS["Dialog"]).toContain("modal");
    expect(SYNONYMS["Toast"]).toContain("snackbar");
    expect(SYNONYMS["Combobox"]).toContain("autocomplete");
    expect(SYNONYMS["DatePicker"]).toContain("datepicker");
  });

  it("gives every result a place: its area, then the headings above it", () => {
    expect(areaOf("/guide/theming")).toBe("Guide");
    expect(areaOf("/components/Button")).toBe("Components");
    expect(breadcrumb("/guide/theming", "Theming", [])).toBe("Guide");
    expect(breadcrumb("/guide/theming#scopes", "Scoped themes", ["Theming"])).toBe("Guide › Theming");
    expect(breadcrumb("/components/Select", "ESelect", ["Form controls"])).toBe("Components › Form controls");
  });
});

describe("highlight", () => {
  it("colours each language the live code blocks use, without WebAssembly", async () => {
    for (const [lang, code] of [["ts", "const a = 1;"], ["css", ":root { --e-primary: red; }"], ["vue", "<template><EButton /></template>"], ["vue", "<EButton />"], ["bash", "npm install x"]]) {
      expect(await highlight(code!, lang!)).toContain("--shiki-token-");
    }
  });
});
