<script setup lang="ts">
import { ref } from "vue";
import { EButtonGroup, EStack, EToggle, EText } from "@eos-ui/vue";

const unpaid = ref(true);
const recent = ref(false);
const paper = ref(false);
</script>

<template>
  <EStack>
    <EButtonGroup label="Filter statements">
      <EToggle v-model="unpaid" icon="filter">Unpaid only</EToggle>
      <EToggle v-model="recent">Last 30 days</EToggle>
      <EToggle v-model="paper" disabled>Paper only</EToggle>
    </EButtonGroup>
    <EText variant="small" muted>Unpaid only: {{ unpaid ? "on" : "off" }}, last 30 days: {{ recent ? "on" : "off" }}</EText>
  </EStack>
</template>
