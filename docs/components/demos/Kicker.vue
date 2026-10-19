<script setup lang="ts">
import { EHeading, EKicker, EStack, EText } from "@eos-ui/vue";
</script>

<template>
  <EStack>
    <div>
      <EKicker>Balance</EKicker>
      <EText>$162.40</EText>
    </div>
    <div>
      <EKicker>Due date</EKicker>
      <EText>Oct 31, 2026</EText>
    </div>
    <div>
      <EKicker as="span">October statement</EKicker>
      <EHeading :level="3">Visit on Oct 22, 2026</EHeading>
    </div>
  </EStack>
</template>
