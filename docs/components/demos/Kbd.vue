<script setup lang="ts">
import { EKbd, EStack, EText } from "@eos-ui/vue";
</script>

<template>
  <EStack>
    <EText>Press <EKbd>/</EKbd> to search the statements.</EText>
    <EText size="sm" tone="neutral">Press <EKbd size="sm">Esc</EKbd> to close, or <EKbd size="sm">Ctrl</EKbd> <EKbd size="sm">K</EKbd> from anywhere.</EText>
  </EStack>
</template>
