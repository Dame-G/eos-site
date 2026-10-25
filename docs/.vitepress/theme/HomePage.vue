<script setup lang="ts">
import { EActions } from "@eos-ui/vue/components/EActions";
import { EButton } from "@eos-ui/vue/components/EButton";
import { ECodeBlock } from "@eos-ui/vue/components/ECodeBlock";
import { EStack } from "@eos-ui/vue/components/EStack";
import BubbleTitle from "./BubbleTitle.vue";
import FlowField from "./FlowField.vue";

declare const __EOS_VERSION__: string;
declare const __EOS_INSTALL_HTML__: string;
const install = `npm install @eos-ui/vue@${__EOS_VERSION__}`;
const installHtml = __EOS_INSTALL_HTML__;
</script>

<template>
  <main class="home" tabindex="-1">
    <FlowField />
    <div class="home-top">
    <div class="home-heading">
      <h1 id="home-title" class="home-title"><BubbleTitle /></h1>
      <p class="home-tagline">A component library for Vue.</p>
    </div>

    <section class="home-hero" aria-labelledby="home-title">
      <EStack :gap="3">
        <div class="eos-live home-install">
          <ECodeBlock lang="bash" :code="install" copy-label="Copy install command"><div v-html="installHtml" /></ECodeBlock>
        </div>
        <EActions stack="narrow">
          <EButton href="/guide/getting-started">Get started</EButton>
          <EButton href="/components/" variant="outline">Components</EButton>
          <EButton href="/playground" variant="outline">Playground</EButton>
        </EActions>
      </EStack>
    </section>
    </div>

  </main>
</template>
