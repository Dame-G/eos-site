<script setup lang="ts">
import { ref } from "vue";
import { EIconButton, EInline, EStack, EText } from "@eos-ui/vue";
const last = ref("Nothing pressed yet.");
</script>

<template>
  <EStack>
    <EInline>
      <EIconButton icon="download" label="Download receipt" @click="last = 'Receipt downloaded.'" />
      <EIconButton icon="print" label="Print statement" @click="last = 'Statement sent to the printer.'" />
      <EIconButton icon="mail" label="Email statement" @click="last = 'Statement emailed.'" />
      <EIconButton icon="trash" label="Remove saved card" disabled />
      <EIconButton icon="trash" label="Remove saved card, outline" variant="outline" disabled />
    </EInline>
    <EInline>
      <EIconButton icon="user" label="Profile" href="#profile" current />
      <EIconButton icon="mail" label="Messages" href="#messages" />
      <EIconButton icon="download" label="Download, dense" size="xs" />
    </EInline>
    <EText tone="muted" role="status">{{ last }}</EText>
  </EStack>
</template>
