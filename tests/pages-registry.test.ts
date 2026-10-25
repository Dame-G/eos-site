import { describe, it, expect } from "vitest";
import { GUIDE, GUIDE_GROUPS, PATTERNS, PATTERN_EXTRAS, PATTERN_GROUPS, PATTERN_MOVES, guideSections, patternSections } from "../docs/.vitepress/pages.mjs";
import { builtFrom, frontMatter, section } from "../docs/data/patterns-source.js";
import { GROUPS, groupComponents } from "../docs/.vitepress/groups.mjs";

declare const __COMPONENTS__: string[];

describe("component groups", () => {
  // A member the library does not have is allowed, so a group can list a component under its old and new name while a rename lands.
  it("files every library component in exactly one group", () => {
    const members = GROUPS.flatMap((g) => g.members);
    expect(members.length, "a component in two groups").toBe(new Set(members).size);
    expect(groupComponents(__COMPONENTS__).map((g) => g.id), "nothing falls under More").not.toContain("more");
  });
});

const patternPages = import.meta.glob("../docs/patterns/*.md", { query: "?raw", import: "default", eager: true }) as Record<string, string>;
const patternSources = import.meta.glob("../docs/patterns/*.vue", { query: "?raw", import: "default", eager: true }) as Record<string, string>;
const guidePages = import.meta.glob("../docs/guide/*.md", { query: "?raw", import: "default", eager: true }) as Record<string, string>;

/** The demos a pattern page imports: one, or several for a page that shows more than one. */
const demosOf = (markdown: string) => [...markdown.matchAll(/import \w+ from "\.\/(\w+)\.vue"/g)].map((m) => m[1]!);
const nameOf = (path: string) => path.split("/").pop()!.replace(/\.(md|vue)$/, "");
const pages = new Map(Object.entries(patternPages).map(([path, text]) => [nameOf(path), text]));
const sources = new Map(Object.entries(patternSources).map(([path, text]) => [nameOf(path), text]));

describe("guide pages", () => {
  it("lists every guide page once, in a known group", () => {
    const files = Object.keys(guidePages).map(nameOf).sort();
    expect(GUIDE.map((g) => g.slug).sort(), "docs/.vitepress/pages.mjs against docs/guide").toEqual(files);
    for (const g of GUIDE) expect(GUIDE_GROUPS, `${g.slug} has a group`).toContain(g.group);
  });

  it("groups the sidebar and leaves no group empty", () => {
    const sections = guideSections();
    expect(sections.map((s) => s.title)).toEqual(GUIDE_GROUPS);
    for (const s of sections) expect(s.pages.length, `${s.title} has pages`).toBeGreaterThan(0);
    expect(sections.flatMap((s) => s.pages.filter((p) => p.link.startsWith("/guide/")))).toHaveLength(GUIDE.length);
    expect(sections.flatMap((s) => s.pages).map((p) => p.link), "the changelog sits in the guide sidebar").toContain("/changelog");
  });

  it("names each guide page in the sidebar as its title", () => {
    for (const g of GUIDE) expect(frontMatter(guidePages[`../docs/guide/${g.slug}.md`]!, "title"), g.slug).toBe(g.name);
  });

  it("gives each page a title and a description", () => {
    for (const [path, text] of Object.entries(guidePages)) {
      expect(frontMatter(text, "title"), `${path} title`).not.toBe("");
      expect(frontMatter(text, "description"), `${path} description`).not.toBe("");
    }
  });
});

describe("pattern pages", () => {
  it("has a page and a demo for every pattern, and no page that is not listed", () => {
    const listed = PATTERNS.map((p) => p.slug).sort();
    const extras = PATTERN_EXTRAS.map((p) => p.slug);
    const files = [...pages.keys()].filter((n) => n !== "index" && !extras.includes(n)).sort();
    expect(files, "docs/patterns/*.md against PATTERNS").toEqual(listed);
    for (const slug of listed) {
      const demos = demosOf(pages.get(slug)!);
      expect(demos.length, `${slug}.md imports its demo`).toBeGreaterThan(0);
      for (const demo of demos) expect(sources.has(demo), `docs/patterns/${demo}.vue exists`).toBe(true);
    }
  });

  it("links every pattern and extra page from the overview", () => {
    const overview = pages.get("index")!;
    for (const { slug } of [...PATTERNS, ...PATTERN_EXTRAS]) expect(overview, `/patterns/${slug} on the overview`).toContain(`(/patterns/${slug})`);
    for (const { slug } of PATTERN_EXTRAS) expect(pages.has(slug), `docs/patterns/${slug}.md exists`).toBe(true);
  });

  it("groups the patterns as the overview does, and each page's sidebar name is its title", () => {
    const overview = pages.get("index")!;
    const headings = [...overview.matchAll(/^## (.+)$/gm)].map((m) => m[1]!.trim());
    expect(headings.filter((h) => PATTERN_GROUPS.includes(h))).toEqual(PATTERN_GROUPS);
    for (const s of patternSections()) {
      const under = overview.split(/^## /m).find((part) => part.startsWith(s.title))!;
      for (const p of s.pages) expect(under, `${p.slug} under ${s.title}`).toContain(`(/patterns/${p.slug})`);
    }
    for (const p of [...PATTERNS, ...PATTERN_EXTRAS]) expect(frontMatter(pages.get(p.slug)!, "title"), p.slug).toBe(p.name);
  });

  it("sends every moved pattern address to a pattern that exists, and lists no moved address as a page", () => {
    const live = PATTERNS.map((p) => `/patterns/${p.slug}`);
    for (const [from, to] of Object.entries(PATTERN_MOVES)) {
      expect(live, `${from} is gone`).not.toContain(from);
      expect(live, `${from} goes to a page`).toContain(to);
    }
  });

  it.each(PATTERNS.map((p) => [p.slug] as const))("%s names what it is built from and why", (slug) => {
    const text = pages.get(slug)!;
    expect(frontMatter(text, "description"), "front matter description").not.toBe("");
    const uses = builtFrom(text);
    expect(uses.length, "a Built from line with components").toBeGreaterThan(0);
    for (const component of uses) expect(__COMPONENTS__, `${component} is a library component`).toContain(component);

    const decisions = section(text, "Decisions");
    expect(decisions.split("\n").filter((l) => l.startsWith("- ")).length, "Decisions has at least two entries").toBeGreaterThanOrEqual(2);
  });

  it.each(PATTERNS.map((p) => [p.slug] as const))("%s imports every component it says it is built from", (slug) => {
    const text = pages.get(slug)!;
    const demos = demosOf(text);
    const source = demos.map((d) => sources.get(d)!).join("\n");
    const missing = builtFrom(text).filter((c) => !new RegExp("\\bE" + c + "\\b").test(source));
    expect(missing, `components in "Built from" that ${demos.join(" and ")} never use`).toEqual([]);
  });
});
