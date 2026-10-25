import { createHighlighterCore, type HighlighterCore, type LanguageInput } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";
import { SHIKI_THEME, snippetLang } from "../shiki";

// The grammars the live code blocks use, each fetched the first time a block needs it. The JavaScript engine needs no WebAssembly.
const GRAMMARS: Record<string, LanguageInput> = {
  ts: () => import("shiki/langs/typescript.mjs"),
  css: () => import("shiki/langs/css.mjs"),
  vue: () => import("shiki/langs/vue.mjs"),
  html: () => import("shiki/langs/html.mjs"),
  bash: () => import("shiki/langs/shellscript.mjs"),
};

let highlighter: Promise<HighlighterCore> | undefined;
const loading = new Map<string, Promise<void>>();

async function load(lang: string) {
  highlighter ??= createHighlighterCore({ themes: [SHIKI_THEME], langs: [], engine: createJavaScriptRegexEngine() });
  const h = await highlighter;
  const grammar = GRAMMARS[lang];
  if (grammar && !loading.has(lang)) loading.set(lang, h.loadLanguage(grammar));
  await loading.get(lang);
  return h;
}

export async function highlight(code: string, written: string): Promise<string> {
  const lang = snippetLang(code, written);
  const h = await load(lang);
  return h.codeToHtml(code, { lang: h.getLoadedLanguages().includes(lang) ? lang : "text", theme: SHIKI_THEME.name! });
}
