import { describe, expect, it } from "vitest";
import { headersFile, inlineScripts, policyOf } from "../docs/.vitepress/csp.mjs";
import { redirectsFile } from "../docs/.vitepress/redirects.mjs";
import { highlight } from "../docs/.vitepress/theme/highlight";
import { SYNONYMS, areaOf, breadcrumb, renderForSearch, searchOptions } from "../docs/.vitepress/search";

describe("headers and redirects", () => {
  const hashes = ["'sha256-abc='"];

  it("lists inline scripts by hash and never allows unsafe-inline scripts", () => {
    const file = headersFile(hashes);
    const enforced = policyOf(file)!;
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

  it("sends each component's lower-case and kebab-case address to its page, since static assets match case-sensitively", () => {
    const file = redirectsFile(["Button", "TextField", "ab"]);
    expect(file).toContain("/guide/ /guide/getting-started 302");
    expect(file).toContain("/guide/recipes /patterns/recipes 301");
    expect(file).toContain("/components/button /components/Button 301");
    expect(file).toContain("/components/textfield /components/TextField 301");
    expect(file).toContain("/components/text-field /components/TextField 301");
    // A slug that is already the page's own address would redirect to itself.
    expect(file).not.toContain("/components/ab ");
    expect(file.match(/\/components\/button /g)).toHaveLength(1);
  });
});

describe("search", () => {
  const md = { render: () => "<h1>ESelect</h1><p>Pick one.</p><h2>Props</h2>" };

  it("puts a component's other names in its page's own entry, right after its title", () => {
    const html = renderForSearch("", { relativePath: "components/Select.md" }, md);
    expect(html).toMatch(/^<h1>ESelect<\/h1><p>Select [^<]*dropdown/);
    expect(html.indexOf("dropdown")).toBeLessThan(html.indexOf("<h2>"));
    expect(renderForSearch("", { relativePath: "guide/theming.md" }, md)).toBe(md.render());
    expect(SYNONYMS["Dialog"]).toContain("modal");
    expect(SYNONYMS["Toast"]).toContain("snackbar");
  });

  it("lifts a component page's own entry over its sections", () => {
    expect(searchOptions.boostDocument("/components/Select#eselect", "", { titles: [] })).toBeGreaterThan(1);
    expect(searchOptions.boostDocument("/components/Select#props", "", { titles: ["ESelect"] })).toBe(1);
    expect(searchOptions.boostDocument("/guide/theming", "", { titles: [] })).toBe(1);
  });

  it("gives every result a place: its area, then the headings above it", () => {
    expect(areaOf("/guide/theming")).toBe("Guide");
    expect(areaOf("/components/Button")).toBe("Components");
    expect(breadcrumb("/guide/theming", "Theming", [])).toBe("Guide");
    expect(breadcrumb("/guide/theming#scopes", "Scoped themes", ["Theming"])).toBe("Guide › Theming");
  });
});

describe("highlight", () => {
  it("colours each language the live code blocks use, without WebAssembly", async () => {
    for (const [lang, code] of [["ts", "const a = 1;"], ["css", ":root { --e-primary: red; }"], ["vue", "<template><EButton /></template>"], ["vue", "<EButton />"], ["bash", "npm install x"]]) {
      expect(await highlight(code!, lang!)).toContain("--shiki-token-");
    }
  });
});
