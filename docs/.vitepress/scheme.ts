import { defineTheme, type ThemeInput } from "@eos-ui/tokens";

/** The inputs of the dark scheme, shared with the demos' own dark toggle. */
export const DARK_INPUT = { name: "dark", background: "#0d0a12", surface: "#14111a", foreground: "#ffffff" } satisfies ThemeInput;

/** The site's two themes. Kept free of Vue so the config can render the dark one into the document head. */
const lightTheme = defineTheme({ name: "light" });
const darkTheme = defineTheme(DARK_INPUT);

export type Choice = "system" | "light" | "dark";
export const STORAGE_KEY = "eos-scheme";

/**
 * Runs in the head before the first paint, so a dark page never flashes light. It sets `data-scheme` from the saved
 * choice, or from the system when nothing is saved. The tokens for it come from `darkCss` below.
 */
export const BOOT_SCRIPT = `(function(){try{var c=localStorage.getItem("${STORAGE_KEY}");var d=c==="dark"||(c!=="light"&&matchMedia("(prefers-color-scheme: dark)").matches);var r=document.documentElement;r.dataset.scheme=d?"dark":"light";r.style.colorScheme=d?"dark":"light"}catch(e){}})()`;

/** The dark tokens under the attribute the boot script sets. Unlayered, so it wins over the default tokens in style.css. The site never sets tokens inline (`applyTheme: false`), so this is the dark scheme for the whole visit. */
export const darkCss = darkTheme.css({ selector: ':root[data-scheme="dark"]', layer: false });

/** The browser chrome colour of each scheme: the header's own surface, so the address bar and the page are one colour. */
export const THEME_COLOR = { light: lightTheme.tokens["surface"] as string, dark: darkTheme.tokens["surface"] as string };
