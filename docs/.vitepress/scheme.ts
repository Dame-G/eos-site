import { defineTheme } from "@eos-ui/tokens";

/** The site's two themes. Kept free of Vue so the config can render the dark one into the document head. */
export const lightTheme = defineTheme({ name: "light" });
export const darkTheme = defineTheme({ name: "dark", background: "#0a0e11", surface: "#0f1418", foreground: "#ffffff" });

export type Choice = "system" | "light" | "dark";
export const STORAGE_KEY = "eos-scheme";

/**
 * Runs in the head before the first paint, so a dark page never flashes light. It sets `data-scheme` from the saved
 * choice, or from the system when nothing is saved. The tokens for it come from `darkCss` below.
 */
export const BOOT_SCRIPT = `(function(){try{var c=localStorage.getItem("${STORAGE_KEY}");var d=c==="dark"||(c!=="light"&&matchMedia("(prefers-color-scheme: dark)").matches);var r=document.documentElement;r.dataset.scheme=d?"dark":"light";r.style.colorScheme=d?"dark":"light"}catch(e){}})()`;

/** The dark tokens under the attribute the boot script sets. Unlayered, so it wins over the default tokens until the client applies the theme inline. */
export const darkCss = darkTheme.css({ selector: ':root[data-scheme="dark"]', layer: false });
