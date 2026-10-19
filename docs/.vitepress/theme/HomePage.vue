<script setup lang="ts">
import { EActions, EButton, EHeading, ELink, EStack, ESurface, EText } from "@eos-ui/vue";
import HighlightedCode from "./HighlightedCode.vue";

const points = [
  { title: "Accessible", text: "Keyboard-operable, visible focus, 48px targets. Checked with axe.", link: "/guide/accessibility" },
  { title: "Themeable", text: "15 inputs restyle every component. Contrast is checked for you.", link: "/guide/theming" },
  { title: "Localised", text: "Swap the icon set, reword any message. Money and dates follow the locale.", link: "/guide/icons" },
];
</script>

<template>
  <main class="home" tabindex="-1">
    <div class="home-top">
      <section class="home-hero" aria-labelledby="home-title">
        <EStack :gap="6">
          <h1 id="home-title" class="home-title">Eos</h1>
          <div class="eos-live home-install">
            <HighlightedCode lang="bash" code="npm install @eos-ui/vue" copy-label="Copy install command" />
          </div>
          <EActions>
            <EButton href="/guide/getting-started">Get started</EButton>
            <EButton href="/components/" variant="outline">Components</EButton>
            <EButton href="/playground" variant="outline">Playground</EButton>
          </EActions>
        </EStack>
      </section>

      <ESurface class="home-points-card">
        <ul class="home-points">
          <li v-for="p in points" :key="p.title">
            <EHeading :level="2" class="home-point-title"><ELink :href="p.link">{{ p.title }}</ELink></EHeading>
            <EText>{{ p.text }}</EText>
          </li>
        </ul>
      </ESurface>
    </div>

    <HomeDemo />
  </main>
</template>
