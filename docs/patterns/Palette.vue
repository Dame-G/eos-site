<script setup lang="ts">
import { computed, ref } from "vue";
import {
  EButton,
  ECommandPalette,
  EDescriptionList,
  EInline,
  EKbd,
  EPageHeader,
  EStack,
  EText,
  EToastProvider,
  formatShortcut,
  useToast,
  type CommandItem,
} from "@eos-ui/vue";

const toast = useToast();

const open = ref(false);
const page = ref("Home");
const due = ref(true);
const reminders = ref(true);

// Commands are data, rebuilt when the state they depend on changes. `disabled` keeps a command listed, so people learn it exists.
const commands = computed<CommandItem[]>(() => [
  { id: "home", label: "Home", group: "Go to", icon: "home" },
  { id: "statements", label: "Statements", group: "Go to", icon: "receipt", keywords: ["bills", "invoices"] },
  { id: "settings", label: "Settings", group: "Go to", icon: "user", keywords: ["profile", "account"] },
  { id: "pay", label: "Pay October statement", description: due.value ? "$162.40 due Oct 22" : "Nothing is due", group: "Do", icon: "card", disabled: !due.value, keywords: ["bill"] },
  { id: "reminders", label: reminders.value ? "Turn visit reminders off" : "Turn visit reminders on", group: "Do", icon: "bell" },
]);

function run(command: CommandItem) {
  if (["home", "statements", "settings"].includes(command.id)) page.value = command.label;
  else if (command.id === "pay") {
    due.value = false;
    toast.show({ title: "October statement paid", tone: "success" });
  } else if (command.id === "reminders") reminders.value = !reminders.value;
}

const keys = formatShortcut("mod+k");
const facts = computed(() => [
  { label: "Page", text: page.value },
  { label: "Statement", text: due.value ? "$162.40 due" : "Paid" },
  { label: "Reminders", text: reminders.value ? "On" : "Off" },
]);
</script>

<template>
  <div class="pattern-md">
    <EToastProvider>
      <EStack :gap="4">
        <EPageHeader :heading-level="2" title="Command palette" description="Reach any page or action from the keyboard." />
        <EInline align="center">
          <EButton variant="outline" icon="search" aria-haspopup="dialog" @click="open = true">Search commands</EButton>
          <EText small muted>
            or press <template v-for="k in keys" :key="k"><EKbd small>{{ k }}</EKbd>{{ " " }}</template>
          </EText>
        </EInline>
        <EDescriptionList :items="facts" />
        <ECommandPalette v-model:open="open" label="Command palette" :items="commands" @select="run" />
      </EStack>
    </EToastProvider>
  </div>
</template>
