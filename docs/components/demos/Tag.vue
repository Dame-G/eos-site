<script setup lang="ts">
import { ref } from "vue";
import { EInline, EStack, ETag, EText } from "@eos-ui/vue";

const people = ref(["Ada Lovelace", "Grace Hopper", "Mary Ann Evans"]);
</script>

<template>
  <EStack>
    <EInline>
      <ETag label="Cardiology" />
      <ETag label="Scheduled" tone="info" />
      <ETag label="Paid" tone="success" />
      <ETag label="Review" tone="warning" />
      <ETag label="Overdue" tone="danger" icon="alert" />
    </EInline>
    <EInline>
      <ETag label="Small" size="sm" />
      <ETag label="Medium" />
    </EInline>
    <EInline>
      <ETag v-for="person in people" :key="person" :label="person" removable @remove="people = people.filter((p) => p !== person)" />
      <EText v-if="!people.length">Everyone has been removed.</EText>
    </EInline>
  </EStack>
</template>
