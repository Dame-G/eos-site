<script setup lang="ts">
import { EKbd, EStack, EText } from "@eos-ui/vue";
</script>

<template>
  <EStack>
    <EText>Press <EKbd>/</EKbd> to search the statements.</EText>
    <EText small muted>Press <EKbd small>Esc</EKbd> to close, or <EKbd small>Ctrl</EKbd> <EKbd small>K</EKbd> from anywhere.</EText>
  </EStack>
</template>
