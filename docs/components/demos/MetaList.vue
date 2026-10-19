<script setup lang="ts">
import { EMetaList } from "@eos-ui/vue";
</script>

<template>
  <EMetaList
    :items="[
      { icon: 'calendar', text: 'Thursday, Oct 22, 2026 at 9:30 am' },
      { icon: 'map-pin', text: 'Main office, 14 Oak Street' },
      { icon: 'phone', text: 'Call 555 0142 to change your visit' },
      null,
      { text: 'Bring your insurance card' },
    ]"
  />
</template>
