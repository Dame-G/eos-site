import DefaultTheme from "vitepress/theme";
import type { Theme } from "vitepress";
import { createEos } from "@eos-ui/vue";
import "@eos-ui/vue/fonts.css";
import "@eos-ui/vue/style.css";
import "./custom.css";
import ComponentDemo from "./ComponentDemo.vue";
import ContrastTable from "./ContrastTable.vue";
import TokenTables from "./TokenTables.vue";
import ThemePlayground from "./ThemePlayground.vue";
import Mini from "./HomeDemo.vue";
import { siteTheme } from "./site-theme";

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // The site uses the library it documents: the same plugin, the same tokens.
    app.use(createEos({ locale: "en-US", currency: "USD", theme: siteTheme }));
    app.component("ComponentDemo", ComponentDemo);
    app.component("ContrastTable", ContrastTable);
    app.component("TokenTables", TokenTables);
    app.component("ThemePlayground", ThemePlayground);
    app.component("HomeDemo", Mini);
  },
} satisfies Theme;
