<script setup lang="ts">
import { ref } from "vue";
import { EButton, ECommandPalette, EInline, EKbd, EStack, EText, formatShortcut, type CommandItem } from "@eos-ui/vue";

const open = ref(false);
const chosen = ref("");

const commands: CommandItem[] = [
  { id: "theme", label: "Toggle theme", icon: "eye", keywords: ["dark", "light"] },
  { id: "invoice", label: "Create invoice", description: "Start a new bill", group: "Billing", icon: "plus", shortcut: "mod+i", keywords: ["bill"] },
  { id: "refund", label: "Issue refund", description: "Return a payment", group: "Billing", shortcut: "mod+shift+r" },
  { id: "archive", label: "Restore archived invoice", group: "Billing", disabled: true },
  { id: "settings", label: "Open settings", group: "Account", icon: "user" },
  { id: "signout", label: "Sign out", group: "Account" },
];

const keys = formatShortcut("mod+k");
</script>

<template>
  <EStack>
    <EInline align="center">
      <EButton variant="outline" @click="open = true">Open the palette</EButton>
      <EText size="sm" tone="neutral">
        or press <template v-for="k in keys" :key="k"><EKbd size="sm">{{ k }}</EKbd>{{ " " }}</template>
      </EText>
    </EInline>
    <EText size="sm" tone="neutral">{{ chosen ? `You chose “${chosen}”.` : "Nothing chosen yet." }}</EText>
    <ECommandPalette v-model:open="open" label="Command palette" :items="commands" @select="chosen = $event.label" />
  </EStack>
</template>
