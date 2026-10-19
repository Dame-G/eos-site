<script setup lang="ts">
import { ELink, EStack, EText } from "@eos-ui/vue";
</script>

<template>
  <EStack>
    <EText>See <ELink href="#statements">all statements</ELink> for the year.</EText>
    <EText>
      Need help paying? Read the
      <ELink href="https://example.com/help" external>help centre (opens in a new tab)</ELink>.
    </EText>
    <EText><ELink href="#receipt-8842" download>Download receipt 8842</ELink></EText>
    <EText><ELink href="#receipt-8842" icon="download">Download receipt 8842 as a PDF</ELink></EText>
  </EStack>
</template>
