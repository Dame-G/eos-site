---
title: Getting started
description: "Install EOS, import the stylesheet and draw your first component in three steps."
---

# Getting started

Needs Vue 3.5+, Node 22+ and a bundler that handles CSS, such as Vite. EOS is ESM only: use `import`, not `require`.

## 1. Install

```bash
npm install @eos-ui/vue
```

## 2. Import the stylesheet

```ts
// main.ts
import { createApp } from "vue";
import "@eos-ui/vue/style.css";
import App from "./App.vue";

createApp(App).mount("#app");
```

`@eos-ui/vue/style.css` is required. It holds every component's styles and the default theme, so a component without it renders unstyled. This is true with or without the plugin.

## 3. Render a component

```vue
<script setup lang="ts">
import { ref } from "vue";
import { ETextField, EButton } from "@eos-ui/vue";

const email = ref("");
</script>

<template>
  <ETextField v-model="email" label="Email" type="email" required autocomplete="email" />
  <EButton>Continue</EButton>
</template>
```

- The main value is `v-model`. Leave it off and the component keeps its own state.
- Every field needs a `label`, and takes `hint` and `error`.
- Native attributes (`name`, `autocomplete`, `aria-*`) land on the real input. `class` and `style` land on the wrapper.

That is a working setup. Components render in English and US dollars until you tell them otherwise. Set `<html lang>` yourself. EOS never does.

## Next

### Add the plugin

`createEos()` holds your language, currency, words, icons and theme. It is also what makes `useToast()` work anywhere in the app.

```ts
import { createEos } from "@eos-ui/vue";

createApp(App)
  .use(createEos({ locale: "en-CA", currency: "CAD", theme: { brand: "#2c95b4" } }))
  .mount("#app");
```

See [Theming](/guide/theming), [Words and language](/guide/language) and the [API reference](/guide/api) for every option.

### Nuxt or a script tag

- Nuxt: add `css: ["@eos-ui/vue/style.css"]` and install the plugin in `plugins/eos.ts`. See [Nuxt and SSR](/guide/ssr).
- Script tag or CDN: there is no global build. EOS ships ES modules only, so use a bundler, or an import map that resolves `vue` and `@eos-ui/vue` to ES module URLs you host.

### Fonts

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

### Auto-import

With [unplugin-vue-components](https://github.com/unplugin/unplugin-vue-components):

```ts
// vite.config.ts
import Components from "unplugin-vue-components/vite";
import { EosResolver } from "@eos-ui/vue/resolver";

export default {
  plugins: [Components({ resolvers: [EosResolver()] })],
};
```

### TypeScript

EOS ships its own types, so there is nothing to install. Props, events and slots are typed in templates when you use Volar. unplugin-vue-components writes the global `components.d.ts` for auto-imported components (its `dts` option, on by default when TypeScript is installed), so commit it or add it to your `tsconfig` includes.

### Using an AI assistant

The site publishes [`/llms.txt`](/llms.txt), an index of every component. The complete documentation in one file ships in the package as `@eos-ui/vue/llms-full.txt` (and `@eos-ui/vue/llms.txt`), and the site serves it at `/llms-full.txt` when it is built against a library build that includes it. Hand either to an AI coding assistant so it writes correct props and slots.

### Where to go from here

[Which component should I use?](/guide/choosing), [Composing layouts](/guide/layouts), [Forms and validation](/guide/forms), [Components](/components/), [Patterns](/patterns/).
