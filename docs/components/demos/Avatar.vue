<script setup lang="ts">
import { EAvatar, EInline, EStack, EText } from "@eos-ui/vue";
</script>

<template>
  <EStack>
    <EInline>
      <EAvatar name="Ada Lovelace" size="sm" />
      <EAvatar name="Ada Lovelace" />
      <EAvatar name="Ada Lovelace" size="lg" />
    </EInline>
    <EInline>
      <EAvatar name="Grace Hopper" />
      <EAvatar name="Alan" />
      <EAvatar name="Mary Ann Evans" />
    </EInline>
    <EInline>
      <EAvatar name="Ada Lovelace" interactive size="sm" />
      <EAvatar name="Grace Hopper" interactive />
      <EAvatar name="Mary Ann Evans" interactive size="lg" />
      <EText>Pressable, like the trigger of a menu</EText>
    </EInline>
    <EInline>
      <EAvatar name="Dr. Priya Shah" src="data:image/gif;base64,AAAA" size="lg" />
      <EText>Dr. Priya Shah, your Oct 22, 2026 visit</EText>
    </EInline>
  </EStack>
</template>
