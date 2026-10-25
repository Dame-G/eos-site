<script setup lang="ts">
import { EHighlight } from "@eos-ui/vue/components/EHighlight";
import { isColor } from "../color.mjs";

// A value shown as code, with a small square of the colour to its right when the value is a colour. Anything else is shown as plain code.
defineProps<{ value: string }>();
</script>

<template>
  <EHighlight code :swatch="isColor(value) ? value.trim() : undefined">{{ value }}</EHighlight>
</template>
