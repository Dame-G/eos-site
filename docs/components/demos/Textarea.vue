<script setup lang="ts">
import { ref } from "vue";
import { ETextarea, EStack, EText } from "@eos-ui/vue";

const note = ref("");
</script>

<template>
  <EStack>
    <ETextarea
      v-model="note"
      label="Note to the practice"
      placeholder="Anything we should know before your visit on Oct 22, 2026?"
      hint="Please do not include card numbers."
      :rows="5"
      optional
    />
    <EText small muted>{{ note.length }} characters</EText>
    <ETextarea label="Reason for dispute" model-value="" error="Tell us what looks wrong with this charge." required />
    <ETextarea label="Notes" model-value="Locked after Oct 22, 2026." disabled />
  </EStack>
</template>
