<script setup lang="ts">
import { ref } from "vue";
import { EDetailRow, EStack } from "@eos-ui/vue";

const email = ref("sam@example.com");
function editEmail() {
  email.value = email.value === "sam@example.com" ? "sam.rivera@example.com" : "sam@example.com";
}
</script>

<template>
  <EStack>
    <EDetailRow label="Email" status="Verified" tone="success" @edit="editEmail">{{ email }}</EDetailRow>
    <EDetailRow label="Phone" status="Needs update" tone="warning" @edit="editEmail">(555) 010-2299</EDetailRow>
    <!-- No edit listener, so no Edit button -->
    <EDetailRow label="Member since">Jan 14, 2024</EDetailRow>
  </EStack>
</template>
