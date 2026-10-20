<script setup lang="ts">
import { EStack, ENavList } from "@eos-ui/vue";

const items = [
  { label: "Home", href: "#home", icon: "home" as const },
  { label: "Visits", href: "#visits", icon: "calendar" as const },
  { label: "Statements", href: "#statements", icon: "receipt" as const, count: 2, current: true },
  { label: "Forms", href: "#forms", icon: "form" as const, count: 1 },
];

const header = [
  { label: "Guide", href: "#guide" },
  { label: "Components", href: "#components", current: true },
  { label: "Playground", href: "#playground" },
];

const outline = [
  { label: "Demo", href: "#demo" },
  { label: "Props", href: "#props", current: true },
  { label: "Accessibility", href: "#accessibility" },
];
</script>

<template>
  <EStack :gap="6">
    <ENavList label="Account" :items="items" />
    <ENavList label="Site" orientation="horizontal" :items="header" />
    <ENavList label="On this page" :items="outline" />
  </EStack>
</template>
