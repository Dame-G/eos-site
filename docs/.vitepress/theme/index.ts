import { defineAsyncComponent } from "vue";
import type { Theme } from "vitepress";
import { createEos, ECodeBlock, EDisclosure, EHighlight } from "@eos-ui/vue";
import "./fonts.css";
import "@eos-ui/vue/style.css";
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
import { siteTheme } from "./site-theme";

export default {
  Layout,
  enhanceApp({ app }) {
    app.use(createEos({ locale: "en-US", currency: "USD", theme: siteTheme }));
    app.component("ECodeBlock", ECodeBlock);
    app.component("EDisclosure", EDisclosure);
    app.component("EHighlight", EHighlight);
    app.component("ComponentDemo", ComponentDemo);
    app.component("ContrastTable", defineAsyncComponent(() => import("./ContrastTable.vue")));
    app.component("TokenTables", defineAsyncComponent(() => import("./TokenTables.vue")));
    app.component("ThemePlayground", defineAsyncComponent(() => import("./ThemePlayground.vue")));
    app.component("HomeDemo", defineAsyncComponent(() => import("./HomeDemo.vue")));
  },
} satisfies Theme;
