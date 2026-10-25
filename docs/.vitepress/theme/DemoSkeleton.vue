<script setup lang="ts">
import { useRoute } from "vitepress";
import { ESkeleton } from "@eos-ui/vue/components/ESkeleton";
import { demoName } from "./demo-loading";
import { stageHeight } from "./demo-heights";

// `stage`: only the demo is loading, inside a frame and stage that are already drawn. Otherwise the whole frame is.
const props = defineProps<{ stage?: boolean }>();

// The room the stage took when this demo last rendered at this window width (a usual height before that), less the
// stage's padding. A skeleton only renders in the browser: the built page has the demo itself.
const name = demoName(useRoute().path);
const style = name ? { height: `calc(${stageHeight(name)}px - 2 * var(--e-space-4))` } : undefined;
</script>

<template>
  <!-- The demo's shape while its code loads, so the page below it does not move when it arrives. -->
  <div v-if="props.stage" class="demo-skeleton" :style="style">
    <ESkeleton height="100%" label="Loading the demo" />
  </div>
  <div v-else class="demo">
    <div class="demo-frame">
      <div class="demo-bar demo-skeleton-bar">
        <ESkeleton :height="30" width="min(100%, 15rem)" />
      </div>
      <div class="demo-stage">
        <div class="demo-skeleton" :style="style">
          <ESkeleton height="100%" label="Loading the demo" />
        </div>
      </div>
    </div>
  </div>
</template>
