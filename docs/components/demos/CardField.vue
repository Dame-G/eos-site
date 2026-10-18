<script setup lang="ts">
import { ECardField, EStack } from "@eos-ui/vue";
</script>

<template>
  <EStack>
    <ECardField required>
      <!-- A payment provider mounts its hosted card fields here. -->
      <div style="padding: var(--e-space-3)">Provider card fields appear here</div>
    </ECardField>
    <ECardField label="Card for the $162.40 balance" state="loading" />
    <ECardField error="Your card was declined. Try another card." />
    <ECardField label="Card on file" note="Used for your monthly statement." />
  </EStack>
</template>
