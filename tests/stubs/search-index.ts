import MiniSearch from "minisearch";
import { searchBuildOptions } from "../../docs/.vitepress/search";

// Stands in for VitePress's generated page index: one guide page that has no headings above it.
const index = new MiniSearch(searchBuildOptions);
index.addAll([{ id: "/guide/theming", title: "Theming", titles: [], text: "Change the colours with defineTheme." }]);

export default { root: () => Promise.resolve({ default: JSON.stringify(index) }) };
