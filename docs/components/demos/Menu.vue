<script setup lang="ts">
import { ref } from "vue";
import { EInline, EMenu, EStack, EText } from "@eos-ui/vue";

const last = ref("Nothing chosen yet");

const items = [
  { label: "Download receipt", icon: "download", onClick: () => (last.value = "Downloaded the receipt") },
  { label: "Email statement", onClick: () => (last.value = "Emailed the statement") },
  { label: "Print", disabled: true },
  { divider: true },
  { label: "Remove statement", danger: true, onClick: () => (last.value = "Removed the statement") },
] as const;
</script>

<template>
  <EStack>
    <EInline>
      <EMenu label="Statement actions" :items="items" />
      <EMenu label="More" variant="secondary" :items="items" @select="(item) => (last = `Selected: ${item.label}`)" />
      <EMenu label="Account" variant="quiet" icon="user" :items="items" />
    </EInline>
    <EText small muted>{{ last }}</EText>
  </EStack>
</template>
