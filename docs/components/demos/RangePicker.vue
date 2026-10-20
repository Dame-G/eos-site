<script setup lang="ts">
import { ref } from "vue";
import { ERangePicker, EStack, EText } from "@eos-ui/vue";

const from = ref<Date | null>(new Date(2026, 9, 4, 12));
const to = ref<Date | null>(new Date(2026, 9, 18, 12));
</script>

<template>
  <EStack>
    <ERangePicker v-model:start="from" v-model:end="to" label="Statement period" start-name="from" end-name="to" />
    <EText small muted>{{ from?.toDateString() ?? "none" }} to {{ to?.toDateString() ?? "none" }}</EText>
    <ERangePicker label="Stay dates" hint="Check in and check out." required :min="new Date(2026, 10, 1, 12)" />
    <ERangePicker label="Billing dates" error="Choose both dates." />
    <ERangePicker label="Closed period" disabled optional />
  </EStack>
</template>
