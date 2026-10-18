<script setup lang="ts">
import { EButton, EItemList, EItemRow } from "@eos-ui/vue";
</script>

<template>
  <EItemList>
    <EItemRow title="New client form" subtitle="Due Oct 22, 2026" icon="form" status="action">
      <template #action><EButton variant="outline">Sign form</EButton></template>
    </EItemRow>
    <EItemRow title="October statement" subtitle="$162.40, due Oct 28, 2026" icon="receipt" status="due" />
    <EItemRow title="Insurance card" subtitle="Added Sep 3, 2026" icon="card" status="complete" />
    <EItemRow title="Leo's visit" subtitle="Cancelled on Oct 1, 2026" icon="calendar" status="cancelled" />
  </EItemList>
</template>
