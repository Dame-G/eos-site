import { createCssVariablesTheme } from "shiki/core";

export const SHIKI_THEME = createCssVariablesTheme({ name: "eos", variablePrefix: "--shiki-", fontStyle: true });

/** A `vue` fence that is a bare template snippet, not a single-file component, reads as HTML: the Vue grammar treats a top-level tag other than template, script and style as raw text. */
export function snippetLang(code: string, lang: string): string {
  return lang === "vue" && !/^\s*<(script|template|style)[\s>]/.test(code) ? "html" : lang;
}
