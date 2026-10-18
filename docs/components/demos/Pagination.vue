<script setup lang="ts">
import { ref } from "vue";
import { EPagination, EStack } from "@eos-ui/vue";

const page = ref(5);
const short = ref(1);
</script>

<template>
  <EStack>
    <p>Statements, page {{ page }} of 12</p>
    <EPagination v-model="page" :page-count="12" aria-label="Statement pages" />
    <EPagination v-model="short" :page-count="3" aria-label="Receipt pages" />
  </EStack>
</template>
