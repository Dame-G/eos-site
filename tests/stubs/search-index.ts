import MiniSearch from "minisearch";
import { SYNONYMS, searchBuildOptions } from "../../docs/.vitepress/search";

// Stands in for VitePress's generated page index: one guide page with no headings above it, and a component page whose
// own entry carries its other names (as renderForSearch writes them) and one of its sections.
const index = new MiniSearch(searchBuildOptions);
index.addAll([
  { id: "/guide/theming", title: "Theming", titles: [], text: "Change the colours with defineTheme." },
  { id: "/components/Select#eselect", title: "ESelect", titles: [], text: `Select ${SYNONYMS["Select"]} Choose one option from a list.` },
  { id: "/components/Select#props", title: "Props", titles: ["ESelect"], text: "options label modelValue" },
]);

export default { root: () => Promise.resolve({ default: JSON.stringify(index) }) };
