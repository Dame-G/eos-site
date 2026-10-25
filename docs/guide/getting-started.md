---
title: Getting started
description: "Install eos, set up main.ts and App.vue, and build a working form with a toast."
---

<script setup>
import FirstForm from "./examples/FirstForm.vue";
</script>

# Getting started

Needs Vue 3.5+, Node 22+ and a bundler that handles CSS, such as Vite. eos is ESM only: use `import`, not `require`.

## 1. Install

```bash
npm install @eos-ui/vue
```

npm saves a caret range such as `^0.17.1`. Before 1.0 that takes fixes but never the next minor version, which is where API changes land. See [Versioning and support](/guide/versioning).

## 2. Set up `main.ts`

```ts
// main.ts
import { createApp } from "vue";
import { createEos } from "@eos-ui/vue";
import "@eos-ui/vue/style.css";
import App from "./App.vue";

createApp(App).use(createEos()).mount("#app");
```

- `@eos-ui/vue/style.css` is required. It holds every component's styles and the default theme, so a component without it renders unstyled, with or without the plugin.
- `createEos()` holds your language, currency, words, icons and theme, and gives the whole app a toast store, so `useToast()` works in any component. Install it in every app. A component also draws without it, in English and US dollars with the default theme.
- eos loads no web fonts, so text is in the system font until you choose one. [Install options](/guide/install#fonts) shows how to self-host fonts, and why the opt-in `@eos-ui/vue/fonts.css` (from Google Fonts, which sends your visitors' IP addresses to Google) is off by default.

## 3. Add the toast region to `App.vue`

```vue
<!-- App.vue -->
<script setup lang="ts">
import { EToastProvider } from "@eos-ui/vue";
</script>

<template>
  <EToastProvider>
    <RouterView />
  </EToastProvider>
</template>
```

[`EToastProvider`](/components/ToastProvider) is where toasts appear: mount one, at the root. Without a router, put your page inside it instead of `<RouterView />`.

Set `<html lang>` yourself on the server. In the browser `createEos({ locale })` sets `lang` and `dir` for you.

## 4. Build a form

A form that checks its field, shows an error beside it, and confirms with a toast. Try it with the field empty, then with a real address.

<div class="pattern-stage">
  <FirstForm />
</div>

<<< @/guide/examples/FirstForm.vue

- The main value is `v-model`. Leave it off and the component keeps its own state.
- Every field needs a `label`, and takes `hint` and `error`. `error` replaces the hint, turns the edge red and is announced. Here it stays `undefined` until the first submit.
- [`EForm`](/components/Form) checks the fields before it submits: their `error` props and the browser's own rules (`required`, `type="email"`). When one fails it stops the submit, emits `invalid` and moves focus to the field. `@submit.prevent` runs only when every field passes, and stops the page reload.
- Native attributes (`name`, `autocomplete`, `aria-*`) land on the real input. `class` and `style` land on the wrapper.
- On a longer form, leave out `:summary="false"` and EForm lists every problem at the top: see [Forms and validation](/guide/forms). [Settings page](/patterns/settings) is a whole form.

## Next

Language, currency and theme are options of `createEos()`:

```ts
createApp(App)
  .use(createEos({ locale: "en-CA", currency: "CAD", theme: { brand: "#2c95b4" } }))
  .mount("#app");
```

See [Theming](/guide/theming), [Words and language](/guide/language) and the [API reference](/guide/api) for every option. [Install options](/guide/install) covers self-hosted fonts, auto-import, TypeScript and Nuxt. If you use an AI coding assistant, give it [`/llms.txt`](/llms.txt), an index of every page and component, so it writes correct props.

Then: [Which component?](/guide/choosing), [Composing layouts](/guide/layouts), [Forms and validation](/guide/forms), [Components](/components/), [Patterns](/patterns/).
