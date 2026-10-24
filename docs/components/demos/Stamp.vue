<script setup lang="ts">
import { EInline, EStack, EStamp } from "@eos-ui/vue";
</script>

<template>
  <EStack>
    <EInline>
      <EStamp status="paid" />
      <EStamp status="due" detail="Oct 31, 2026" />
      <EStamp status="overdue" detail="12 days" />
      <EStamp status="action" />
      <EStamp status="scheduled" detail="Oct 22, 2026" />
    </EInline>
    <EInline>
      <EStamp status="confirmed" />
      <EStamp status="cancelled" />
      <EStamp status="signed" detail="Oct 5, 2026" />
      <EStamp status="pending" />
      <EStamp status="complete" />
    </EInline>
    <EInline>
      <EStamp status="paid" size="sm" />
      <EStamp tone="warning" label="Review" size="sm" />
      <EStamp tone="danger" label="Card declined" />
    </EInline>
    <EInline>
      <EStamp>Draft</EStamp>
      <EStamp tone="neutral" size="sm">Neutral</EStamp>
      <EStamp tone="success">Signed</EStamp>
      <EStamp tone="info" size="sm">Scheduled</EStamp>
    </EInline>
  </EStack>
</template>
