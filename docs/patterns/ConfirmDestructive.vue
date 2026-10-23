<script setup lang="ts">
import { h, ref } from "vue";
import { EButton, EDescriptionList, EDialog, EPageHeader, EStack, EStamp, ESurface, EText, EToastProvider, useToast } from "@eos-ui/vue";

interface Card {
  id: string;
  brand: string;
  last4: string;
  expires: string;
  default?: boolean;
}

const toast = useToast();

const cards = ref<Card[]>([
  { id: "c1", brand: "Visa", last4: "4242", expires: "08/28", default: true },
  { id: "c2", brand: "Mastercard", last4: "5100", expires: "02/27" },
]);

const target = ref<Card | null>(null);
const confirming = ref(false);

function ask(card: Card) {
  target.value = card;
  confirming.value = true;
}

function remove() {
  const card = target.value;
  if (!card) return;
  const index = cards.value.findIndex((c) => c.id === card.id);
  cards.value = cards.value.filter((c) => c.id !== card.id);
  confirming.value = false;
  // Undo is offered because it is cheap here. Where a removal cannot be reversed, leave it out and say so in the dialog.
  toast.show({
    title: `${card.brand} ending ${card.last4} removed`,
    tone: "success",
    duration: 8000,
    action: () =>
      h(EButton, { variant: "outline", onClick: () => cards.value.splice(index, 0, card) }, () => "Undo"),
  });
}
</script>

<template>
  <div class="pattern-md">
    <EToastProvider>
      <EStack :gap="4">
        <EPageHeader :heading-level="2" title="Payment methods" description="Cards you can pay with." />
        <EText v-if="!cards.length" tone="neutral">No cards saved. Add one when you pay your next bill.</EText>
        <ESurface v-for="card in cards" :key="card.id">
          <EStack :gap="3">
            <EDescriptionList
              :items="[
                { label: card.brand, text: `Ending ${card.last4}` },
                { label: 'Expires', text: card.expires },
              ]"
            />
            <EStamp v-if="card.default" tone="info" size="sm">Default</EStamp>
            <EButton variant="outline" icon="trash" :aria-label="`Remove ${card.brand} ending ${card.last4}`" @click="ask(card)">Remove</EButton>
          </EStack>
        </ESurface>

        <EDialog
          v-model:open="confirming"
          role="alertdialog"
          :title="target ? `Remove ${target.brand} ending ${target.last4}?` : 'Remove this card?'"
          description="You will not be able to pay with it. Past payments stay in your statements."
        >
          <template #actions>
            <EButton variant="danger" @click="remove">Remove card</EButton>
            <EButton variant="outline" @click="confirming = false">Keep card</EButton>
          </template>
        </EDialog>
      </EStack>
    </EToastProvider>
  </div>
</template>
