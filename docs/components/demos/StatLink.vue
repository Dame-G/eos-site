<script setup lang="ts">
import { EInline, EStack, EStatLink } from "@eos-ui/vue";
</script>

<template>
  <EStack>
    <EInline>
      <EStatLink label="Balance" :value="162.4" href="#balance" />
      <EStatLink label="Visits" :value="12" href="#visits" current />
      <EStatLink label="Plan" value="Standard" href="#plan" />
      <EStatLink label="Next visit" value="Oct 29" />
    </EInline>
  </EStack>
</template>
