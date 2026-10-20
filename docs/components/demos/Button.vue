<script setup lang="ts">
import { EButton, EInline, EStack } from "@eos-ui/vue";
</script>

<template>
  <EStack>
    <EInline>
      <EButton icon="lock">Pay $162.40</EButton>
      <EButton variant="secondary">Confirm</EButton>
      <EButton variant="outline">Cancel</EButton>
      <EButton variant="danger">Remove card</EButton>
      <EButton variant="quiet">Skip this step</EButton>
    </EInline>
    <EInline>
      <EButton disabled>Disabled</EButton>
      <EButton loading icon="lock">Paying</EButton>
    </EInline>
    <EButton block>Full width</EButton>
  </EStack>
</template>
