<script setup lang="ts">
import { ref } from "vue";
import { EMultiSelect, EStack } from "@eos-ui/vue";

const ways = ref<string[]>(["Text", "Email"]);
const days = ref<string[]>([]);
</script>

<template>
  <EStack>
    <EMultiSelect v-model="ways" label="Remind me by" :options="['Text', 'Email', 'Call', 'Post']" hint="Choose as many as you like." />
    <p>Chosen: {{ ways.join(", ") || "none" }}</p>
    <EMultiSelect v-model="days" label="Days I can visit" placeholder="Pick days" optional :options="['Mon', 'Tue', 'Wed', 'Thu', 'Fri']" />
    <EMultiSelect label="Statements to export" :options="['Sep 2026', 'Aug 2026']" error="Choose at least one statement." required />
    <EMultiSelect label="Locked choices" :model-value="['Email']" :options="['Text', 'Email']" disabled />
  </EStack>
</template>
