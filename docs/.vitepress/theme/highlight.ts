import { createHighlighterCore, type HighlighterCore } from "shiki/core";
import { createOnigurumaEngine } from "shiki/engine/oniguruma";
import { SHIKI_THEME, snippetLang } from "../shiki";

let highlighter: Promise<HighlighterCore> | undefined;

function load() {
  highlighter ??= createHighlighterCore({
    themes: [SHIKI_THEME],
    langs: [
      import("shiki/langs/typescript.mjs"),
      import("shiki/langs/css.mjs"),
      import("shiki/langs/shellscript.mjs"),
      import("shiki/langs/vue.mjs"),
      import("shiki/langs/json.mjs"),
      import("shiki/langs/html.mjs"),
      import("shiki/langs/markdown.mjs"),
    ],
    engine: createOnigurumaEngine(import("shiki/wasm")),
  });
  return highlighter;
}

export async function highlight(code: string, written: string): Promise<string> {
  const h = await load();
  const lang = snippetLang(code, written);
  return h.codeToHtml(code, { lang: h.getLoadedLanguages().includes(lang) ? lang : "text", theme: SHIKI_THEME.name });
}
