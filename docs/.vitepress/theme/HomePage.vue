<script setup lang="ts">
import { Content } from "vitepress";
import { EActions, EButton, EGrid, EHeading, ELink, EStack, ESurface, EText } from "@eos-ui/vue";

const features = [
  {
    title: "Accessible",
    text: "Real elements, keyboard use for every control, visible focus and 48px targets. Every state is checked with axe in a real browser.",
    link: "/guide/accessibility",
    linkText: "How it is tested",
  },
  {
    title: "Themeable",
    text: "Give defineTheme() a brand colour. It derives the deep action colours and names any contrast pair that fails.",
    link: "/guide/theming",
    linkText: "Theming",
  },
  {
    title: "Yours to word and draw",
    text: "Bring Lucide, Tabler, Heroicons, Phosphor or your own icons. Reword every message. Money, dates and direction follow the locale.",
    link: "/guide/icons",
    linkText: "Icons and words",
  },
];
</script>

<template>
  <main class="home">
    <section class="home-hero" aria-labelledby="home-title">
      <EStack :gap="4">
        <h1 id="home-title" class="home-title">Eos</h1>
        <EText variant="deck" class="home-lead">Accessible Vue 3 components with a token-based theme. Calm, high contrast, rebranded in a few lines.</EText>
        <EActions>
          <EButton href="/guide/getting-started">Get started</EButton>
          <EButton href="/components/" variant="outline">Components</EButton>
          <EButton href="/playground" variant="outline">Playground</EButton>
        </EActions>
      </EStack>
    </section>

    <EGrid min="17rem" :gap="4" class="home-features">
      <ESurface v-for="f in features" :key="f.title" as="section" pad="md">
        <EStack :gap="3">
          <EHeading :level="3">{{ f.title }}</EHeading>
          <EText>{{ f.text }}</EText>
          <ELink :href="f.link">{{ f.linkText }}</ELink>
        </EStack>
      </ESurface>
    </EGrid>

    <div class="home-doc vp-doc"><Content /></div>
  </main>
</template>
