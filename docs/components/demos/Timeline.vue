<script setup lang="ts">
import { ETimeline } from "@eos-ui/vue";

// Newest first. `source` always says when and where.
const items = [
  { kind: "system" as const, note: "Reminder sent for the $162.40 bill.", source: "Oct 14, 2026, 8:00 am, email" },
  { kind: "practice" as const, note: "Insurance paid $120.00 on this bill.", source: "Oct 12, 2026, 3:10 pm, front desk" },
  { kind: "you" as const, note: "You signed the new client form.", source: "Oct 12, 2026, 9:41 am, online" },
];
</script>

<template>
  <ETimeline :items="items" />
</template>
