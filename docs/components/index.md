---
title: Components
description: "Every Eos component with its README and a live demo, grouped by layer."
---

<script setup>
import { EGrid, ELink, ESurface, EText } from "@eos-ui/vue";
import { data } from "../data/components.data.js";
</script>

# Components

Each component has a page: what it is for, its props, keyboard use and rules, then a live demo. The pages are the components' own READMEs, so they match the code you install.

Components sit in layers. A component only uses components from its own layer or an earlier one, so the order below is also the order to learn them in.

<template v-for="g in data" :key="g.id">
  <h2 :id="g.id">{{ g.title }}</h2>
  <EGrid as="ul" min="17rem" :gap="3" class="eos-live component-list">
    <ESurface v-for="c in g.items" :key="c.name" as="li" pad="sm">
      <ELink :href="`/components/${c.name}`">E{{ c.name }}</ELink>
      <EText variant="small" muted>{{ c.summary }}</EText>
    </ESurface>
  </EGrid>
</template>
