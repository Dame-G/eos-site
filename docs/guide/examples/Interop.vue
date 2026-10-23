<script setup lang="ts">
import { EButton, EInline } from "@eos-ui/vue";
</script>

<template>
  <EInline>
    <EButton>Library style</EButton>
    <!-- Unlayered CSS beats every @layer e.* rule, with no extra specificity. -->
    <EButton class="wide-pill">Overridden by a class</EButton>
  </EInline>
</template>

<style scoped>
.wide-pill {
  border-radius: 999px;
  padding-inline: 2rem;
}
</style>
