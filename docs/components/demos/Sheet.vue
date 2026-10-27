<script setup lang="ts">
import { ref } from "vue";
import { EButton, ESheet, EStack, EText } from "@eos-ui/vue";

const open = ref(true);
</script>

<template>
  <EStack>
    <EButton variant="outline" @click="open = !open">{{ open ? "Close the profile" : "Open the profile" }}</EButton>
    <div style="position: relative; min-height: 22rem; overflow: hidden">
      <EStack>
        <EText>The statement stays usable beside the sheet.</EText>
        <EText>Total due Oct 22, 2026: $162.40</EText>
      </EStack>
      <ESheet v-model:open="open" title="Your profile" description="How your name and contact details appear on statements.">
        <EText>Alex Morgan</EText>
        <EText>alex@example.com</EText>
        <template #actions>
          <EButton>Save</EButton>
          <EButton variant="outline" @click="open = false">Cancel</EButton>
        </template>
      </ESheet>
    </div>
  </EStack>
</template>
