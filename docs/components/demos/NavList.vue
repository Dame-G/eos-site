<script setup lang="ts">
import { ENavList } from "@eos-ui/vue";

// `count` is things waiting on the person; `current` marks the open page.
const items = [
  { label: "Home", href: "#home", icon: "home" as const },
  { label: "Visits", href: "#visits", icon: "calendar" as const },
  { label: "Statements", href: "#statements", icon: "receipt" as const, count: 2, current: true },
  { label: "Forms", href: "#forms", icon: "form" as const, count: 1 },
];
</script>

<template>
  <ENavList label="Account" :items="items" />
</template>
