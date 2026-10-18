---
layout: page
title: Eos
hero:
  name: Eos
  text: Accessible Vue 3 components
  tagline: Calm, high contrast and consistent by default. Rebrand it with a few lines, and the contrast is checked for you.
  actions:
    - theme: brand
      text: Get started
      link: /guide/getting-started
    - theme: alt
      text: Browse components
      link: /components/
    - theme: alt
      text: Theme playground
      link: /playground
features:
  - title: Accessible by default
    details: Real elements first, keyboard use for every control, visible focus, 48px targets, and a word beside every colour. Every state is checked with axe in a real browser.
    link: /guide/accessibility
    linkText: How it is tested
  - title: Themeable, with checked contrast
    details: Give defineTheme() a brand colour and it derives the deep action colours, then tells you which promised contrast pair fails, if any.
    link: /guide/theming
    linkText: Theming
  - title: Bring your own icons and words
    details: Swap the icon set for Lucide, Tabler or your own, and reword every message the components say. Money, dates and direction follow the locale.
    link: /guide/icons
    linkText: Icons and words
---

<script setup>
import { VPHomeHero, VPHomeFeatures } from "vitepress/theme";
</script>

<main>

<VPHomeHero />
<VPHomeFeatures />

<div class="home-body">

## Install

```bash
npm install @eos-ui/vue
```

```ts
import { createApp } from "vue";
import { createEos } from "@eos-ui/vue";
import "@eos-ui/vue/style.css";
import "@eos-ui/vue/fonts.css";

createApp(App).use(createEos({ locale: "en-CA", currency: "CAD", theme: { brand: "#2c95b4" } })).mount("#app");
```

## Try it

<HomeDemo />

This is the real component, running here. The site around it is themed with the same tokens.

Eos is released under the MIT license. Its icons are Phosphor (MIT).

</div>

</main>
