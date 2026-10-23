<script setup lang="ts">
import { ref } from "vue";
import { EDescriptionList, EStack } from "@eos-ui/vue";

const email = ref("sam@example.com");
function editEmail() {
  email.value = email.value === "sam@example.com" ? "sam.rivera@example.com" : "sam@example.com";
}
</script>

<template>
  <EStack :gap="6">
    <EDescriptionList
      :items="[
        { label: 'Covers', text: 'Visit on Sep 12, 2026' },
        { label: 'Amount', text: '$162.40' },
        { label: 'Due', text: 'Oct 31, 2026' },
        { label: 'Pay by', text: 'Card, bank transfer or at the front desk' },
      ]"
    />

    <EDescriptionList
      :items="[
        { label: 'Email', text: email, icon: 'mail', badge: 'Verified', badgeTone: 'success', editable: true },
        { label: 'Phone', text: '(555) 010-2299', badge: 'Needs update', badgeTone: 'warning', editable: true },
        { label: 'Member since', text: 'Jan 14, 2024' },
      ]"
      @edit="editEmail"
    />

    <EDescriptionList
      :items="[
        { icon: 'calendar', text: 'Thursday, Oct 22, 2026 at 9:30 am' },
        { icon: 'pin', text: 'Main office, 14 Oak Street' },
        { icon: 'phone', text: 'Call 555 0142 to change your visit' },
        null,
        { text: 'Bring your insurance card' },
      ]"
    />
  </EStack>
</template>
