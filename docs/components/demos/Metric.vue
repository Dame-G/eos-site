<script setup lang="ts">
import { EGrid, EMetric, ESurface } from "@eos-ui/vue";
</script>

<template>
  <EGrid min="14rem">
    <ESurface>
      <EMetric label="Balance" value="$1,240.00" delta="+4.2%" trend="up" help="Since last month" />
    </ESurface>
    <ESurface>
      <EMetric label="Open claims" :value="1234" delta="Down 12" trend="down" help="Since Oct 1, 2026" />
    </ESurface>
    <ESurface>
      <EMetric label="Out of pocket" value="$320.00" delta="+$40.00" trend="up" tone="danger" help="A cost that went up" />
    </ESurface>
    <ESurface>
      <EMetric label="Appointments" :value="3" delta="No change" trend="flat" />
    </ESurface>
  </EGrid>
</template>
