<script setup lang="ts">
import { EIconButton, EInline, ELink, EStack, ETooltip, EText } from "@eos-ui/vue";
</script>

<template>
  <EStack>
    <EText small muted>Hover or focus a control to see its tooltip.</EText>
    <EInline>
      <ETooltip label="Download receipt">
        <EIconButton icon="download" label="Download receipt" />
      </ETooltip>
      <ETooltip label="Print statement">
        <EIconButton icon="print" label="Print statement" />
      </ETooltip>
      <ETooltip label="Opens the billing help page">
        <ELink href="#billing-help">Billing help</ELink>
      </ETooltip>
    </EInline>
  </EStack>
</template>
