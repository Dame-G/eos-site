<script setup lang="ts">
import { ref } from "vue";
import { EButton, ENotice, EStack } from "@eos-ui/vue";

const showClosable = ref(true);
</script>

<template>
  <EStack>
    <ENotice title="Office closed on Nov 11">We reopen on Nov 12, 2026.</ENotice>
    <ENotice tone="success" title="Payment received">A receipt for $162.40 was sent to your email.</ENotice>
    <ENotice tone="warning" title="Form due" :heading-level="3">
      Please sign before Oct 22, 2026.
      <template #actions><EButton variant="outline">Sign now</EButton></template>
    </ENotice>
    <ENotice tone="danger" title="Card declined">Check the card number or use another card.</ENotice>

    <ENotice v-if="showClosable" title="Reminders are on" @close="showClosable = false">
      We message you two days before each visit.
    </ENotice>
  </EStack>
</template>
