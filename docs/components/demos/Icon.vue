<script setup lang="ts">
import { EIcon, EInline, EStack, EText } from "@eos-ui/vue";
const names = ["card", "receipt", "calendar", "download", "lock", "mail", "phone", "check", "alert", "info"] as const;
</script>

<template>
  <EStack>
    <!-- Icons are decorative: say the meaning in words beside them -->
    <EInline>
      <EText v-for="n in names" :key="n" as="span" muted><EIcon :name="n" /> {{ n }}</EText>
    </EInline>
    <EInline>
      <EIcon name="wallet" small />
      <EIcon name="wallet" />
      <EIcon name="wallet" bold />
      <EText as="span">Small, regular and bold wallet</EText>
    </EInline>
  </EStack>
</template>
