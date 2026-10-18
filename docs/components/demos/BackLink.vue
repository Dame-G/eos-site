<script setup lang="ts">
import { EBackLink, EStack } from "@eos-ui/vue";
</script>

<template>
  <EStack>
    <EBackLink href="#statements">Back to statements</EBackLink>
    <!-- Without words it says "Back" -->
    <EBackLink />
  </EStack>
</template>
