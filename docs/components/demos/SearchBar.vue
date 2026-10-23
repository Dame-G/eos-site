<script setup lang="ts">
import { ref } from "vue";
import { ESearchBar, EStack, EText } from "@eos-ui/vue";

const query = ref("");
const last = ref("");
</script>

<template>
  <EStack>
    <ESearchBar v-model="query" placeholder="Search statements and visits" @submit="last = $event" />
    <EText size="sm" tone="neutral">{{ last ? `Searched for "${last}".` : "Press Enter or Search." }}</EText>
  </EStack>
</template>
