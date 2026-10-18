import type { Theme } from "vitepress";
import { createEos } from "@eos-ui/vue";
import "@eos-ui/vue/fonts.css";
import "@eos-ui/vue/style.css";
// The prose and code styles of the VitePress default theme. The page around them is built from Eos components.
import "vitepress/dist/client/theme-default/styles/vars.css";
import "vitepress/dist/client/theme-default/styles/base.css";
import "vitepress/dist/client/theme-default/styles/utils.css";
import "vitepress/dist/client/theme-default/styles/components/custom-block.css";
import "vitepress/dist/client/theme-default/styles/components/vp-code.css";
import "vitepress/dist/client/theme-default/styles/components/vp-code-group.css";
import "vitepress/dist/client/theme-default/styles/components/vp-doc.css";
import "./custom.css";
import Layout from "./Layout.vue";
import ComponentDemo from "./ComponentDemo.vue";
import ContrastTable from "./ContrastTable.vue";
import TokenTables from "./TokenTables.vue";
import ThemePlayground from "./ThemePlayground.vue";
import HomeDemo from "./HomeDemo.vue";
import { siteTheme } from "./site-theme";

export default {
  Layout,
  enhanceApp({ app }) {
    // The site uses the library it documents: the same plugin, the same tokens.
    app.use(createEos({ locale: "en-US", currency: "USD", theme: siteTheme }));
    app.component("ComponentDemo", ComponentDemo);
    app.component("ContrastTable", ContrastTable);
    app.component("TokenTables", TokenTables);
    app.component("ThemePlayground", ThemePlayground);
    app.component("HomeDemo", HomeDemo);
  },
} satisfies Theme;
