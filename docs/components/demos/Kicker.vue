<script setup lang="ts">
import { EHeading, EKicker, EStack } from "@eos-ui/vue";
</script>

<template>
  <EStack>
    <div>
      <EKicker>Balance</EKicker>
      <p>$162.40</p>
    </div>
    <div>
      <EKicker>Due date</EKicker>
      <p>Oct 31, 2026</p>
    </div>
    <div>
      <EKicker as="span">October statement</EKicker>
      <EHeading :level="3">Visit on Oct 22, 2026</EHeading>
    </div>
  </EStack>
</template>
