<script setup lang="ts">
import { ref } from "vue";
import { EPagination, EStack, EText } from "@eos-ui/vue";

const page = ref(5);
const short = ref(1);
</script>

<template>
  <EStack>
    <EText small muted>Statements, page {{ page }} of 12</EText>
    <EPagination v-model="page" :page-count="12" aria-label="Statement pages" />
    <EPagination v-model="short" :page-count="3" aria-label="Receipt pages" />
  </EStack>
</template>
