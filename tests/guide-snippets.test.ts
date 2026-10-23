import { describe, it, expect } from "vitest";
import { babelParse, compileTemplate, parse as parseSfc } from "vue/compiler-sfc";
import * as vuePackage from "@eos-ui/vue";
import * as tokensPackage from "@eos-ui/tokens";

// Every ```ts, ```js and ```vue fence in the guide is parsed, and every name imported from the library is checked against
// what the library exports, so a renamed or removed export breaks the build instead of the reader's code.
// Put "no-check" after the language (```ts no-check) for a fence that is deliberately not code, such as a fragment.

const guides = import.meta.glob("../docs/guide/*.md", { query: "?raw", import: "default", eager: true }) as Record<string, string>;
const declarations = import.meta.glob("../node_modules/@eos-ui/{vue,tokens}/dist/**/*.d.ts", { query: "?raw", import: "default", eager: true }) as Record<string, string>;

const declarationText = Object.values(declarations).join("\n");
/** A type has no runtime value, so it is looked for as a declaration in the d.ts files. */
const declared = (name: string) => new RegExp(String.raw`\b(?:interface|type|class|enum)\s+${name}\b`).test(declarationText);

const exportsOf: Record<string, Record<string, unknown>> = {
  "@eos-ui/vue": vuePackage as Record<string, unknown>,
  "@eos-ui/tokens": tokensPackage as Record<string, unknown>,
};

interface Fence {
  file: string;
  line: number;
  lang: "ts" | "js" | "vue";
  code: string;
}

const LANGS: Record<string, Fence["lang"]> = { ts: "ts", typescript: "ts", js: "js", javascript: "js", vue: "vue" };

function fencesOf(file: string, markdown: string): Fence[] {
  const found: Fence[] = [];
  const lines = markdown.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const open = /^```(\S*)(.*)$/.exec(lines[i]!);
    if (!open) continue;
    const start = i;
    const body: string[] = [];
    for (i += 1; i < lines.length && !lines[i]!.startsWith("```"); i++) body.push(lines[i]!);
    const lang = LANGS[open[1]!.replace(/\{.*$/, "")];
    if (lang && !/no-check/.test(open[2]!)) found.push({ file, line: start + 1, lang, code: body.join("\n") });
  }
  return found;
}

const fences = Object.entries(guides).flatMap(([path, markdown]) => fencesOf(path.split("/").pop()!, markdown));
const id = (f: Fence) => `${f.file}:${f.line} (${f.lang})`;

/** A whole single-file component starts a line with <script> or a bare <template>. A fragment may hold <template #slot> inside. */
const isSfc = (f: Fence) => /^<script\b/m.test(f.code) || /^<template>\s*$/m.test(f.code);

/** Parses TypeScript. A signature such as `const KEY: Key;` is not a module, so a failure is tried again as a declaration file. */
function parseScript(script: string) {
  try {
    return babelParse(script, { sourceType: "module", plugins: ["typescript"] });
  } catch (error) {
    try {
      return babelParse(script, { sourceType: "module", plugins: [["typescript", { dts: true }]] });
    } catch {
      throw error;
    }
  }
}

/** The script of a fence, or null when it has none to parse. */
function scriptOf(f: Fence): string | null {
  if (f.lang !== "vue") return f.code;
  if (!/^<script\b/m.test(f.code)) return null;
  return parseSfc(f.code, { filename: "snippet.vue" }).descriptor.scriptSetup?.content ?? parseSfc(f.code).descriptor.script?.content ?? null;
}

/** Names imported from the two packages that the packages do not export. */
function missingImports(script: string): string[] {
  const missing: string[] = [];
  for (const node of parseScript(script).program.body) {
    if (node.type !== "ImportDeclaration" || !(node.source.value in exportsOf)) continue;
    const known = exportsOf[node.source.value]!;
    for (const spec of node.specifiers) {
      if (spec.type !== "ImportSpecifier") continue;
      const name = spec.imported.type === "Identifier" ? spec.imported.name : spec.imported.value;
      if (!(name in known) && !declared(name)) missing.push(`${name} from ${node.source.value}`);
    }
  }
  return missing;
}

describe("guide code samples", () => {
  it("finds the samples", () => {
    expect(fences.length).toBeGreaterThan(20);
    expect(Object.keys(declarations).length, "the built d.ts files of the linked packages").toBeGreaterThan(0);
  });

  it.each(fences.map((f) => [id(f), f] as const))("%s parses", (_name, f) => {
    if (f.lang === "vue") {
      if (isSfc(f)) {
        const { errors } = parseSfc(f.code, { filename: "snippet.vue" });
        expect(errors.map(String), "single-file component errors").toEqual([]);
      } else {
        const { errors } = compileTemplate({ source: f.code, filename: "snippet.vue", id: "snippet" });
        expect(errors.map(String), "template errors").toEqual([]);
      }
    }
    const script = scriptOf(f);
    if (script !== null) expect(() => parseScript(script)).not.toThrow();
  });

  it.each(fences.map((f) => [id(f), f] as const))("%s imports only names the library exports", (_name, f) => {
    const script = scriptOf(f);
    if (script === null) return;
    expect(missingImports(script), "names the library does not export").toEqual([]);
  });

  it("notices a name the library does not export", () => {
    expect(missingImports('import { EButton, EAutocomplete } from "@eos-ui/vue";')).toEqual(["EAutocomplete from @eos-ui/vue"]);
    expect(missingImports('import { defineTheme, nope } from "@eos-ui/tokens";')).toEqual(["nope from @eos-ui/tokens"]);
    expect(missingImports('import type { Theme } from "@eos-ui/vue";')).toEqual([]);
  });
});
