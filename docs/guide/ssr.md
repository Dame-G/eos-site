---
title: Nuxt and SSR
description: "What was checked about server rendering Eos components, and what to configure in Nuxt and other SSR setups."
---

# Nuxt and SSR

This page states only what was checked. `scripts/ssr-check.mjs` in the site repository renders components with `renderToString` and reports what it finds. This site is also pre-rendered by VitePress, so every page was rendered on the server and then hydrated.

## What was found

Rendering `EButton`, `ETextField`, `ESelect`, `ECalendar`, `ETabs` and `EIcon`:

- **They render,** with the plugin installed and without it.
- **Output is stable.** Rendering the same tree twice gives identical HTML, so generated ids do not differ and hydration has no id mismatches.
- **The locale reaches the server HTML.** A calendar with `locale: "fr-CA"` has French month names in the markup.
- **`createEos()` is safe on the server.** It does not touch `document` or `window`. The theme is applied in the browser.
- **No warnings** from Vue or the library.
- **Modal dialogs draw nothing on the server,** even in `inline` mode. Their content appears after hydration, which a dialog needs anyway for focus handling.
- **The package loads in plain Node.** The JavaScript has no CSS imports. The styles are one file, `@eos-ui/vue/style.css`.

## The theme without a flash

`theme.apply()` sets inline variables in the browser. On the server, render the theme as CSS into the `<head>` so the first paint has your colours:

```ts
const theme = defineTheme({ brand: "#8a2be2" });
const css = theme.css(); // a <style> body, inside @layer e.tokens
```

The default theme needs nothing: `style.css` already holds the default tokens.

## Nuxt

This site was not built with Nuxt. These steps follow from the facts above, so check them in your app.

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  css: ["@eos-ui/vue/style.css", "@eos-ui/vue/fonts.css"],
});
```

```ts
// plugins/eos.ts
import { createEos, defineTheme } from "@eos-ui/vue";

export default defineNuxtPlugin((nuxtApp) => {
  const theme = defineTheme({ brand: "#8a2be2" });
  nuxtApp.vueApp.use(createEos({ locale: "en-CA", currency: "CAD", theme }));
  useHead({ style: [{ innerHTML: theme.css() }] }); // no flash of the default theme
});
```

Set `lang` yourself: `useHead({ htmlAttrs: { lang: "en-CA" } })`.

## Other SSR setups

Nothing needs adding to `ssr.noExternal` or `build.transpile`. Import `@eos-ui/vue/style.css` once in your client entry. If you link the library from another folder, as this site does, keep one copy of Vue with `resolve.dedupe: ["vue"]`.

## Client-only parts

Menus, option lists, tooltips and dialogs teleport to `portalTarget` (`body` by default). The closed state renders on the server, so `<ClientOnly>` is not needed.
