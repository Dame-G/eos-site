---
title: Components
description: "Every Eos component with its README and a live demo, grouped by layer."
---

<script setup>
import { data } from "../data/components.data.js";
</script>

# Components

Every component in the library has a page: what it is for, its props, keyboard use and rules, then a live demo you can use. The pages are the components' own README files, so they are always the same as the code you install.

Components sit in layers. A component only uses components from its own layer or an earlier one, so the order below is also the order to learn them in.

<div v-for="g in data" :key="g.id" class="layer-group">
  <h2 :id="g.id">{{ g.title }}</h2>
  <ul class="component-list">
    <li v-for="c in g.items" :key="c.name"><a :href="`/components/${c.name}`"><code>E{{ c.name }}</code></a> <span>{{ c.summary }}</span></li>
  </ul>
</div>
