<script setup lang="ts">
import { ref } from "vue";
import { EPagination, EStack, EText } from "@eos-ui/vue";

const page = ref(5);
const short = ref(1);
const last = ref(12);
</script>

<template>
  <EStack>
    <EText size="sm" tone="muted">Statements, page {{ page }} of 12</EText>
    <EPagination v-model="page" :page-count="12" aria-label="Statement pages" />
    <EPagination v-model="short" :page-count="3" aria-label="Receipt pages" />
    <EText size="sm" tone="muted">The last page</EText>
    <EPagination v-model="last" :page-count="12" aria-label="Last statement pages" />
    <EText size="sm" tone="muted">One page</EText>
    <EPagination :model-value="1" :page-count="1" aria-label="Single page" />
    <EText size="sm" tone="muted">Many pages</EText>
    <EPagination :model-value="480" :page-count="1200" aria-label="Archive pages" />
  </EStack>
</template>
