import { defineAsyncComponent } from "vue";
import type { Theme } from "vitepress";
// Every theme file imports components by their own paths, never the @eos-ui/vue barrel, so each component only reaches the pages and demos that use it.
import { createEos } from "@eos-ui/vue/plugin";
import { ECodeBlock } from "@eos-ui/vue/components/ECodeBlock";
import { EDisclosure } from "@eos-ui/vue/components/EDisclosure";
import { EHighlight } from "@eos-ui/vue/components/EHighlight";
// The per-component paths do not register the built-in icons; the header, search and pager use them.
import "@eos-ui/vue/icons/builtin";
import "./fonts.css";
import "@eos-ui/vue/style.css";
// The site's own layout and prose. No VitePress theme CSS is loaded.
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
    // Only some pages use these, so they load with those pages and stay out of the chunk every page loads.
    app.component("ENotice", defineAsyncComponent(() => import("@eos-ui/vue/components/ENotice").then((m) => m.ENotice)));
    app.component("ComponentDemo", defineAsyncComponent(() => import("./ComponentDemo.vue")));
    app.component("ComponentIndex", defineAsyncComponent(() => import("./ComponentIndex.vue")));
    app.component("ContrastTable", defineAsyncComponent(() => import("./ContrastTable.vue")));
    app.component("TokenTables", defineAsyncComponent(() => import("./TokenTables.vue")));
    app.component("ThemePlayground", defineAsyncComponent({ loader: () => import("./ThemePlayground.vue"), loadingComponent: PlaygroundSkeleton, delay: 0 }));
  },
} satisfies Theme;
