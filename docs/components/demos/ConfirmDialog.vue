<script setup lang="ts">
import { ref } from "vue";
import { EButton, EConfirmDialog, EInline, EStack, EText } from "@eos-ui/vue";

const asking = ref(false);
const slow = ref(false);
const busy = ref(false);
const removed = ref(false);

function remove() {
  removed.value = true;
}

function save() {
  busy.value = true;
  setTimeout(() => {
    busy.value = false;
    slow.value = false;
  }, 1200);
}
</script>

<template>
  <EStack>
    <EInline>
      <EButton variant="outline" @click="asking = true">Delete game</EButton>
      <EButton variant="outline" @click="slow = true">Resign game</EButton>
    </EInline>
    <EText size="sm" tone="muted">{{ removed ? "The game was deleted." : "The game is still here." }}</EText>

    <EConfirmDialog
      v-model:open="asking"
      tone="danger"
      title="Delete this game?"
      description="It cannot be restored."
      confirm-label="Delete game"
      @confirm="remove"
    >
      Its review and the drills made from it go too.
    </EConfirmDialog>

    <EConfirmDialog
      v-model:open="slow"
      title="Resign this game?"
      confirm-label="Resign"
      :close-on-confirm="false"
      :loading="busy"
      focus="confirm"
      @confirm="save"
    />
  </EStack>
</template>
