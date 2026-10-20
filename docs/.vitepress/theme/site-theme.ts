import { computed, ref } from "vue";
import { darkTheme, lightTheme, STORAGE_KEY, type Choice } from "../scheme";

/** The theme the site starts with. `startScheme` swaps it for the dark one when the visitor's choice or system asks. The playground previews other themes without touching it. */
export const siteTheme = lightTheme;

const choice = ref<Choice>("system");
const systemDark = ref(false);

/** What the page is showing: the saved choice, or the system's when the choice is "system". */
export const scheme = computed<"light" | "dark">(() => (choice.value === "system" ? (systemDark.value ? "dark" : "light") : choice.value));
export const schemeChoice = computed(() => choice.value);

function paint() {
  const root = document.documentElement;
  (scheme.value === "dark" ? darkTheme : lightTheme).apply(root);
  root.dataset.scheme = scheme.value;
  root.style.colorScheme = scheme.value;
}

export function setChoice(next: Choice) {
  choice.value = next;
  try {
    if (next === "system") localStorage.removeItem(STORAGE_KEY);
    else localStorage.setItem(STORAGE_KEY, next);
  } catch {
    /* Storage can be blocked; the choice then lasts for this visit. */
  }
  paint();
}

function saved(): Choice {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === "light" || v === "dark") return v;
  } catch {
    /* Treated as "system". */
  }
  return "system";
}

/** Applies the right theme straight away, before the app mounts, without touching reactive state so the server and client markup agree. Browser only. */
export function startScheme() {
  const dark = saved() === "dark" || (saved() === "system" && matchMedia("(prefers-color-scheme: dark)").matches);
  (dark ? darkTheme : lightTheme).apply(document.documentElement);
}

/** Loads the saved choice into state and follows the system afterwards. Call it once the page has mounted. */
export function followScheme() {
  const query = matchMedia("(prefers-color-scheme: dark)");
  systemDark.value = query.matches;
  choice.value = saved();
  query.addEventListener("change", (e) => {
    systemDark.value = e.matches;
    if (choice.value === "system") paint();
  });
  paint();
}
