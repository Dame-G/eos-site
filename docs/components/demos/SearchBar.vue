<script setup lang="ts">
import { ref } from "vue";
import { ESearchBar, EStack } from "@eos-ui/vue";

const query = ref("");
const last = ref("");
</script>

<template>
  <EStack>
    <!-- One search landmark per page, so only one bar is shown here -->
    <ESearchBar v-model="query" placeholder="Search statements and visits" @submit="last = $event" />
    <p>{{ last ? `Searched for "${last}".` : "Press Enter or Search." }}</p>
  </EStack>
</template>
