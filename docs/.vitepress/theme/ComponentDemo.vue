<script setup lang="ts">
import { defineAsyncComponent } from "vue";
import { EHighlight } from "@eos-ui/vue";

const demos = import.meta.glob("../../components/demos/*.vue");

const props = defineProps<{ name: string }>();
const loader = demos[`../../components/demos/${props.name}.vue`];
const Demo = loader ? defineAsyncComponent(loader as () => Promise<{ default: object }>) : null;
</script>

<template>
  <div class="demo">
    <div v-if="Demo" class="demo-stage e-root"><component :is="Demo" /></div>
    <p v-else class="demo-missing">
      There is no demo for E{{ name }} yet. Add <EHighlight code>docs/components/demos/{{ name }}.vue</EHighlight> to the site repository.
    </p>
  </div>
</template>
