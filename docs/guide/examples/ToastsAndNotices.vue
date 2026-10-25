<script setup lang="ts">
import { h, ref } from "vue";
import { EButton, EInline, ENotice, EStack, EText, EToastProvider, useToast } from "@eos-ui/vue";

const toast = useToast();
const declined = ref(false);

function save() {
  toast.show({ title: "Saved", message: "Your changes are in.", tone: "success" });
}
function remove() {
  toast.show({
    title: "Statement removed",
    action: () => h(EButton, { variant: "outline", onClick: () => toast.clear() }, () => "Undo"),
  });
}
function decline() {
  declined.value = true;
}
</script>

<template>
  <EToastProvider>
    <EStack>
      <EInline>
        <EButton @click="save">Save</EButton>
        <EButton variant="outline" @click="remove">Remove with undo</EButton>
        <EButton variant="outline" @click="decline">Decline the card</EButton>
      </EInline>
      <ENotice v-if="declined" closable tone="danger" title="Card declined" @close="declined = false">
        Check the card number or use another card.
        <template #actions><EButton variant="outline">Use another card</EButton></template>
      </ENotice>
      <EText size="sm" tone="muted">A toast goes by itself. A notice stays until it is dealt with.</EText>
    </EStack>
  </EToastProvider>
</template>
