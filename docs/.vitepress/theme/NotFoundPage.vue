<script setup lang="ts">
import { EActions, EButton, EEmptyState, EKbd } from "@eos-ui/vue";

defineEmits<{ search: [] }>();

</script>

<template>
  <div class="not-found">
    <EEmptyState title="We could not find that page" icon="search" :heading-level="1">
      The address may have changed, or it was never written. Search for what you wanted, or go back to the home page.
      <template #action>
        <EActions>
          <EButton icon="search" @click="$emit('search')">Search the docs <EKbd small class="not-found-key">/</EKbd></EButton>
          <EButton variant="outline" href="/">Back to the home page</EButton>
        </EActions>
      </template>
    </EEmptyState>
  </div>
</template>
