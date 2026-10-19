<script setup lang="ts">
import { ESkipLink, EText } from "@eos-ui/vue";
</script>

<template>
  <div style="position: relative; min-height: 4rem">
    <ESkipLink href="#statements-main" />
    <div id="statements-main" tabindex="-1">
      <EText>Your statements start here.</EText>
    </div>
  </div>
</template>
