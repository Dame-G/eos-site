---
title: Nuxt and SSR
description: "What was checked about server rendering Eos components, and what to configure in Nuxt and other SSR setups."
---

# Nuxt and SSR

This page only states what was verified. The script `scripts/ssr-check.mjs` in the site repository renders components with `renderToString` and reports what it finds. This site is also pre-rendered with VitePress, so every component page you read here was rendered on the server first and then hydrated in the browser.

## What was found

Rendering `EButton`, `ETextField`, `ESelect`, `ECalendar`, `ETabs` and `EIcon` with `renderToString`:

- **They render.** All six produce HTML, with the plugin installed and without it.
- **Output is stable.** Rendering the same tree twice gives identical HTML, so generated ids (labels, hints, errors) do not differ between renders. That is what keeps hydration free of id mismatches.
- **The locale reaches the server HTML.** A calendar rendered with `locale: "fr-CA"` has French month names in the markup.
- **`createEos()` is safe on the server.** Installing the plugin does not touch `document` or `window`. The theme is applied in the browser only.
- **No warnings** from Vue or the library appeared while rendering.
- **Modal dialogs draw nothing on the server.** An `EDialog` that starts open, even in its `inline` preview mode, produces an empty placeholder in the server HTML. Its content appears after hydration. Plan for that if a dialog must be visible before scripts load; it should not be, because a dialog needs script for its focus handling anyway.
- **The package loads in plain Node.** The JavaScript has no CSS imports (the styles are one file, `@eos-ui/vue/style.css`), so `scripts/ssr-check.mjs` runs with no bundler at all.

## The theme without a flash

`theme.apply()` sets inline variables on an element, in the browser. On the server, render the theme as CSS into the `<head>` instead. Then the first paint already has your colours:

```ts
const theme = defineTheme({ brand: "#8a2be2" });
const css = theme.css(); // a <style> body, inside @layer e.tokens
```

The default theme needs nothing: `@eos-ui/vue/style.css` already contains the default tokens.

## Nuxt

The steps below follow from the facts above. This site was not built with Nuxt, so treat them as the starting point and check them in your app.

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

Set `lang` yourself with `useHead({ htmlAttrs: { lang: "en-CA" } })`. Eos never does.

## Other SSR setups

Because the JavaScript has no CSS imports, nothing needs to be added to `ssr.noExternal` or `build.transpile`. Import `@eos-ui/vue/style.css` once in your client entry. If you link the library from another folder, as this site does, keep one copy of Vue with `resolve.dedupe: ["vue"]`.

## Client-only parts

Floating parts (menus, option lists, tooltips, dialogs) are teleported to `portalTarget`, which is `body` by default. If you wrap them in `<ClientOnly>` nothing is lost, but you do not need to: the closed state renders on the server.
