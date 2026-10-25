<script setup lang="ts">
import { EInline, ESkeleton, EStack } from "@eos-ui/vue";
</script>

<template>
  <EStack>
    <ESkeleton :height="120" />
    <ESkeleton :height="20" :width="160" />
    <ESkeleton :height="20" width="60%" />
    <EInline>
      <ESkeleton circle :height="56" />
      <EStack gap="snug">
        <ESkeleton :height="16" :width="200" />
        <ESkeleton :height="16" :width="120" />
      </EStack>
    </EInline>
  </EStack>
</template>
