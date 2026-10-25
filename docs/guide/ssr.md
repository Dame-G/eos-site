---
title: Nuxt and SSR
description: "Server rendering eos components, and what to configure in Nuxt."
---

# Nuxt and SSR

eos components render on the server with `renderToString`:

- Components render with and without the plugin. Generated ids are stable between server and client, so hydration has no id mismatches.
- `createEos()` does not touch `document` or `window`. The locale reaches the server HTML.
- Dialogs draw nothing on the server and appear after hydration.
- Menus, option lists and tooltips teleport to `portalTarget`. Their closed state renders on the server, so `<ClientOnly>` is not needed.
- Nothing is needed in `ssr.noExternal` or `build.transpile`. If you link the library from another folder, set `resolve.dedupe: ["vue"]`.

## Theme without a flash

`createEos()` adds the theme only in the browser. On the server, render the theme into `<head>`. The default theme needs nothing, because `style.css` contains it.

```ts
import { themeCss } from "@eos-ui/vue";

const css = themeCss({ brand: "#8a2be2" });
const head = `<style>${css}</style>`;
```

`themeCss(theme, selector?)` needs no `document`. It returns the tokens inside `@layer e.tokens`. Pass a selector to theme a subtree only. Inline it before first paint. In the browser, `createEos({ theme })` then adds the same theme as a stylesheet, which changes nothing visible. If the page ships the theme as CSS and switches it itself, for example a dark variant under an attribute, pass `createEos({ applyTheme: false })` so the client adds nothing of its own. This site does that.

## Nuxt

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  css: ["@eos-ui/vue/style.css"],
});
```

Add `"@eos-ui/vue/fonts.css"` to the list only if you accept that it loads the fonts from Google, which sends your visitors' IP addresses there. [Install options](/guide/install#fonts) shows how to self-host them instead.

```ts
// plugins/eos.ts
import { createEos, themeCss } from "@eos-ui/vue";

export default defineNuxtPlugin((nuxtApp) => {
  const theme = { brand: "#8a2be2" };
  nuxtApp.vueApp.use(createEos({ locale: "en-CA", currency: "CAD", theme }));
  useHead({ htmlAttrs: { lang: "en-CA" }, style: [{ innerHTML: themeCss(theme) }] });
});
```
