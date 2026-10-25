<script setup lang="ts">
import { ref } from "vue";
import { ECopyButton, EInline, EStack, EText } from "@eos-ui/vue";

const link = "https://eos.dame.gg/invite/4f9c2a";
const last = ref("");
</script>

<template>
  <EStack>
    <EInline align="center">
      <EText>{{ link }}</EText>
      <ECopyButton :text="link" label="Copy invite link" @copy="last = $event ? 'Copied to the clipboard.' : 'Could not copy.'" />
    </EInline>
    <EText size="sm" tone="muted">{{ last || "Press the button to copy the link. Screen readers hear “Copied”." }}</EText>
  </EStack>
</template>
