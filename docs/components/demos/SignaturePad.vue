<script setup lang="ts">
import { ref } from "vue";
import { ESignaturePad, EStack, EText } from "@eos-ui/vue";

const image = ref("");
</script>

<template>
  <EStack>
    <ESignaturePad v-model="image" :height="180" />
    <EText variant="small" muted>{{ image ? "Signature drawn" : "Nothing drawn yet" }}</EText>
  </EStack>
</template>
