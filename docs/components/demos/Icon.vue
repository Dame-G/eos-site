<script setup lang="ts">
import { EIcon, EInline, EStack, EText } from "@eos-ui/vue";
const names = ["card", "receipt", "calendar", "download", "lock", "mail", "phone", "check", "alert", "info"] as const;
</script>

<template>
  <EStack>
    <EInline :gap="6">
      <EInline v-for="n in names" :key="n" :gap="2">
        <EIcon :name="n" />
        <EText as="span" tone="neutral">{{ n }}</EText>
      </EInline>
    </EInline>
    <EInline>
      <EIcon name="wallet" size="sm" />
      <EIcon name="wallet" />
      <EIcon name="wallet" bold />
      <EText as="span">Small, regular and bold wallet</EText>
    </EInline>
  </EStack>
</template>
