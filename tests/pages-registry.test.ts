import { describe, it, expect } from "vitest";
import { GUIDE, GUIDE_GROUPS, PATTERNS, guideSections } from "../docs/.vitepress/pages.mjs";
import { builtFrom, frontMatter, section } from "../docs/data/patterns-source.js";

declare const __COMPONENTS__: string[];

const patternPages = import.meta.glob("../docs/patterns/*.md", { query: "?raw", import: "default", eager: true }) as Record<string, string>;
const patternSources = import.meta.glob("../docs/patterns/*.vue", { query: "?raw", import: "default", eager: true }) as Record<string, string>;
const guidePages = import.meta.glob("../docs/guide/*.md", { query: "?raw", import: "default", eager: true }) as Record<string, string>;

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
    expect(sections.map((s) => s.title)).toEqual(["Start", "Theming", "Build", "Platform", "Reference"]);
    for (const s of sections) expect(s.pages.length, `${s.title} has pages`).toBeGreaterThan(0);
    expect(sections.flatMap((s) => s.pages)).toHaveLength(GUIDE.length);
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
    const files = [...pages.keys()].filter((n) => n !== "index").sort();
    expect(files, "docs/patterns/*.md against PATTERNS").toEqual(listed);
    for (const slug of listed) {
      const demo = /import \w+ from "\.\/(\w+)\.vue"/.exec(pages.get(slug)!)?.[1];
      expect(demo, `${slug}.md imports its demo`).toBeTruthy();
      expect(sources.has(demo!), `docs/patterns/${demo}.vue exists`).toBe(true);
    }
  });

  it("links every pattern from the overview", () => {
    const overview = pages.get("index")!;
    for (const { slug } of PATTERNS) expect(overview, `/patterns/${slug} on the overview`).toContain(`(/patterns/${slug})`);
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
    const demo = /import \w+ from "\.\/(\w+)\.vue"/.exec(text)![1]!;
    const source = sources.get(demo)!;
    const missing = builtFrom(text).filter((c) => !new RegExp("\\bE" + c + "\\b").test(source));
    expect(missing, `components in "Built from" that ${demo}.vue never uses`).toEqual([]);
  });
});
