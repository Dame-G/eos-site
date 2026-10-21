<script setup lang="ts">
import { EActions, EButton, EStack } from "@eos-ui/vue";
import BubbleTitle from "./BubbleTitle.vue";
import FlowField from "./FlowField.vue";
import HighlightedCode from "./HighlightedCode.vue";

// What the library is: "v0.7.0" for a release, or the branch name when the site is pointed at something else.
declare const __EOS_BUILD__: { label: string };
const build = __EOS_BUILD__;
</script>

<template>
  <main class="home" tabindex="-1">
    <FlowField />
    <div class="home-heading">
      <h1 id="home-title" class="home-title"><BubbleTitle /></h1>
      <p class="home-tagline">A component library for Vue.</p>
    </div>

    <section class="home-hero" aria-labelledby="home-title">
      <EStack :gap="3">
        <div class="eos-live home-install">
          <HighlightedCode lang="bash" code="npm install @eos-ui/vue" :note="build.label" copy-label="Copy install command" />
        </div>
        <EActions>
          <EButton href="/guide/getting-started">Get started</EButton>
          <EButton href="/components/" variant="outline">Components</EButton>
          <EButton href="/playground" variant="outline">Playground</EButton>
        </EActions>
      </EStack>
    </section>
  </main>
</template>
