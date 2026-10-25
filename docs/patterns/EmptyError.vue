<script setup lang="ts">
import { computed, ref } from "vue";
import { EButton, EEmptyState, EExpandableRow, ENotice, EPageHeader, ESegmented, ESkeleton, EStack, EStamp } from "@eos-ui/vue";

type State = "Loading" | "Error" | "Empty" | "Loaded";

// The segmented control only previews each state. A real page derives the state from its request.
const state = ref<State>("Error");
const attempts = ref(0);
const items = [
  { id: 1, title: "Annual check-up", sub: "Statement 4471", status: "due" },
  { id: 2, title: "Follow-up visit", sub: "Statement 4402", status: "paid" },
] as const;

const showRetryNote = computed(() => attempts.value > 0);

function retry() {
  attempts.value++;
  state.value = "Loading";
  setTimeout(() => (state.value = "Loaded"), 600);
}
</script>

<template>
  <div class="pattern-md">
    <EStack gap="loose">
      <EPageHeader :heading-level="2" title="Statements" description="Every state a list can be in." />
      <ESegmented v-model="state" label="Preview state" hide-label :options="['Loading', 'Error', 'Empty', 'Loaded']" />

      <EStack v-if="state === 'Loading'" gap="snug" aria-busy="true">
        <ESkeleton :height="64" />
        <ESkeleton :height="64" />
        <ESkeleton :height="64" />
      </EStack>

      <EStack v-else-if="state === 'Error'" gap="snug">
        <ENotice tone="danger" title="Statements did not load" :heading-level="3">
          We could not reach the server. Your data is safe. Try again in a moment.
          <template #actions><EButton variant="outline" @click="retry">Try again</EButton></template>
        </ENotice>
      </EStack>

      <EEmptyState v-else-if="state === 'Empty'" icon="file" title="No statements yet" :heading-level="3">
        They appear here after your first visit.
        <template #action><EButton>Book a visit</EButton></template>
      </EEmptyState>

      <EStack v-else gap="snug">
        <ENotice v-if="showRetryNote" tone="success" title="Statements loaded" :heading-level="3">Back online.</ENotice>
        <EExpandableRow v-for="s in items" :key="s.id" :title="s.title" :subtitle="s.sub">
          <template #leading><EStamp :status="s.status" size="sm" /></template>
          Details of {{ s.sub }}.
        </EExpandableRow>
      </EStack>
    </EStack>
  </div>
</template>
