---
title: Install options
description: "Self-hosted fonts, auto-import, TypeScript and global component types, per-component imports, Nuxt, script tags and llms.txt."
---

# Install options

[Getting started](/guide/getting-started) is all an app needs. These are the choices after it.

## Fonts

`@eos-ui/vue/fonts.css` is one `@import` of Bricolage Grotesque and Geist Mono from `fonts.googleapis.com`. It is optional. Importing it makes your visitors' browsers contact Google, and the font files come from Google's servers too.

```ts
import "@eos-ui/vue/fonts.css";
```

To serve the fonts yourself, skip `fonts.css` and install them from [Fontsource](https://fontsource.org). Their variable fonts register the families as "Bricolage Grotesque Variable" and "Geist Mono Variable", so pass those names to the theme:

```bash
npm install @fontsource-variable/bricolage-grotesque @fontsource-variable/geist-mono
```

```ts
import "@fontsource-variable/bricolage-grotesque";
import "@fontsource-variable/geist-mono";

createApp(App).use(
  createEos({
    theme: {
      fonts: {
        sans: '"Bricolage Grotesque Variable", "Avenir Next", system-ui, sans-serif',
        mono: '"Geist Mono Variable", ui-monospace, Menlo, Consolas, monospace',
      },
    },
  }),
);
```

`fonts.sans` and `fonts.mono` are full CSS `font-family` stacks and set `--e-font-sans` and `--e-font-mono`. They work with any font you load. EOS never bundles fonts. Without any font loaded, the stack falls back to `system-ui`.

## Import only what you use

The package root brings every component and the built-in icons, and a bundler drops the components you never import. To keep a chunk small, such as the one every page of a site loads, import each component from its own path:

```ts
import { createEos } from "@eos-ui/vue/plugin";
import { EButton } from "@eos-ui/vue/components/EButton";
import "@eos-ui/vue/icons/builtin"; // the built-in icons: the per-component paths do not register them
```

They are the same modules the root exports, so mixing the two is safe. `@eos-ui/vue/plugin` also has `themeCss`.

## Auto-import

With [unplugin-vue-components](https://github.com/unplugin/unplugin-vue-components):

```ts
// vite.config.ts
import Components from "unplugin-vue-components/vite";
import { EosResolver } from "@eos-ui/vue/resolver";

export default {
  plugins: [Components({ resolvers: [EosResolver()] })],
};
```

## TypeScript

EOS ships its own types, so there is nothing to install. Props, events and slots are typed in templates when you use Volar, and importing the package types `$e` (the config).

unplugin-vue-components writes the global `components.d.ts` for auto-imported components (its `dts` option, on by default when TypeScript is installed), so commit it or add it to your `tsconfig` includes.

`createEos()` registers no components. If you register them yourself with `app.component("EButton", EButton)`, their global types are opt-in: add this once.

```ts
import type {} from "@eos-ui/vue/globals";
```

Or put `"types": ["@eos-ui/vue/globals"]` in `tsconfig.json`. Load them only when you do register globally: they tell `vue-tsc` every component is available, so a component you forgot to import would pass the type check and fail at run time.

## Nuxt or a script tag

- Nuxt: add `css: ["@eos-ui/vue/style.css"]` and install the plugin in `plugins/eos.ts`. See [Nuxt and SSR](/guide/ssr).
- Script tag or CDN: there is no global build. EOS ships ES modules only, so use a bundler, or an import map that resolves `vue` and `@eos-ui/vue` to ES module URLs you host.

## Using an AI assistant

The site publishes [`/llms.txt`](/llms.txt), an index of every component. The complete documentation in one file ships in the package as `@eos-ui/vue/llms-full.txt` (and `@eos-ui/vue/llms.txt`), and the site serves it at `/llms-full.txt` when it is built against a library build that includes it. Hand either to an AI coding assistant so it writes correct props and slots.
