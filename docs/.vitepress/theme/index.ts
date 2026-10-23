import { defineAsyncComponent } from "vue";
import type { Theme } from "vitepress";
// Per-component paths, so the barrel of every component only reaches the pages and demos that import it.
import { createEos } from "@eos-ui/vue/plugin";
import { ECodeBlock } from "@eos-ui/vue/components/ECodeBlock";
import { EDisclosure } from "@eos-ui/vue/components/EDisclosure";
import { EHighlight } from "@eos-ui/vue/components/EHighlight";
// The per-component paths do not register the built-in icons; the header, search and pager use them.
import "@eos-ui/vue/icons/builtin";
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
import PlaygroundSkeleton from "./playground/PlaygroundSkeleton.vue";

export default {
  Layout,
  enhanceApp({ app }) {
    // The page ships both themes as CSS: the default tokens in style.css and the dark ones under [data-scheme="dark"], which the boot script sets before the first paint. Inline tokens would override that.
    app.use(createEos({ locale: "en-US", currency: "USD", applyTheme: false }));
    app.component("ECodeBlock", ECodeBlock);
    app.component("EDisclosure", EDisclosure);
    app.component("EHighlight", EHighlight);
    // Only component pages use these, so they load with those pages and stay out of the chunk every page loads.
    app.component("ComponentDemo", defineAsyncComponent(() => import("./ComponentDemo.vue")));
    app.component("ComponentIndex", defineAsyncComponent(() => import("./ComponentIndex.vue")));
    app.component("ContrastTable", defineAsyncComponent(() => import("./ContrastTable.vue")));
    app.component("TokenTables", defineAsyncComponent(() => import("./TokenTables.vue")));
    app.component("ThemePlayground", defineAsyncComponent({ loader: () => import("./ThemePlayground.vue"), loadingComponent: PlaygroundSkeleton, delay: 0 }));
  },
} satisfies Theme;
