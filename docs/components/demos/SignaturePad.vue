<script setup lang="ts">
import { ref } from "vue";
import { EStack, EText, ESignaturePad } from "@eos-ui/vue";

const image = ref("");
</script>

<template>
  <EStack>
    <ESignaturePad v-model="image" :height="180" />
    <EText small muted>{{ image ? "Signature drawn" : "Nothing drawn yet" }}</EText>
  </EStack>
</template>
