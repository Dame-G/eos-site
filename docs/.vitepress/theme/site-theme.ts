import { computed, ref } from "vue";
import { THEME_COLOR, STORAGE_KEY, type Choice } from "../scheme";

const choice = ref<Choice>("system");
const systemDark = ref(false);

/** What the page is showing: the saved choice, or the system's when the choice is "system". */
const scheme = computed<"light" | "dark">(() => (choice.value === "system" ? (systemDark.value ? "dark" : "light") : choice.value));
export const schemeChoice = computed(() => choice.value);
/** The scheme on screen, which the demos' own light and dark toggle starts from. */
export const activeScheme = scheme;

/** The two `theme-color` metas follow the system by media query; a choice that differs from the system has to override both. */
function paintChrome(value: "light" | "dark") {
  for (const meta of document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')) meta.content = THEME_COLOR[value];
}

/** The tokens are CSS (`darkCss` in the head for the dark scheme), so switching is the attribute the boot script also sets. */
function paint() {
  const root = document.documentElement;
  root.dataset.scheme = scheme.value;
  root.style.colorScheme = scheme.value;
  paintChrome(scheme.value);
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
