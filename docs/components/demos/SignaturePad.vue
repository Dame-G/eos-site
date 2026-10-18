<script setup lang="ts">
import { ref } from "vue";
import { ESignaturePad, EStack } from "@eos-ui/vue";

const image = ref("");
</script>

<template>
  <EStack>
    <ESignaturePad v-model="image" :height="180" />
    <p>{{ image ? "Signature drawn" : "Nothing drawn yet" }}</p>
    <ESignaturePad :height="100" disabled />
  </EStack>
</template>
