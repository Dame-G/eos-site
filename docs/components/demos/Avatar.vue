<script setup lang="ts">
import { EAvatar, EInline, EStack, EText } from "@eos-ui/vue";
</script>

<template>
  <EStack>
    <!-- Initials come from the first and last word of the name -->
    <EInline>
      <EAvatar name="Ada Lovelace" small />
      <EAvatar name="Ada Lovelace" />
      <EAvatar name="Ada Lovelace" large />
    </EInline>
    <EInline>
      <EAvatar name="Grace Hopper" />
      <EAvatar name="Alan" />
      <EAvatar name="Mary Ann Evans" />
    </EInline>
    <!-- A photo that fails to load falls back to the initials -->
    <EInline>
      <EAvatar name="Dr. Priya Shah" src="data:image/gif;base64,AAAA" large />
      <EText>Dr. Priya Shah, your Oct 22, 2026 visit</EText>
    </EInline>
  </EStack>
</template>
