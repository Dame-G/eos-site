<script setup lang="ts">
import { EActions, EButton, EStack } from "@eos-ui/vue";
import BubbleTitle from "./BubbleTitle.vue";
import FlowField from "./FlowField.vue";
import HighlightedCode from "./HighlightedCode.vue";

declare const __EOS_VERSION__: string;
const version = __EOS_VERSION__;
</script>

<template>
  <main class="home" tabindex="-1">
    <FlowField />
    <div class="home-heading">
      <h1 id="home-title" class="home-title"><BubbleTitle /></h1>
    </div>

    <section class="home-hero" aria-labelledby="home-title">
      <EStack :gap="3">
        <div class="eos-live home-install">
          <HighlightedCode lang="bash" code="npm install @eos-ui/vue" :note="`v${version}`" copy-label="Copy install command" />
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
