<script setup lang="ts">
import { computed, ref } from "vue";
import {
  EButton,
  EButtonGroup,
  EEmptyState,
  EInline,
  EPageHeader,
  EPagination,
  ESearchBar,
  EStack,
  EStatementRow,
  EText,
  EToggle,
} from "@eos-ui/vue";

type Filter = "all" | "due" | "paid";

const all = [
  { id: 1, title: "Visit on Oct 2", sub: "Statement 4471, Main office", status: "due", amount: 162.4, reason: "Your balance is due by November 1." },
  { id: 2, title: "Follow-up visit", sub: "Statement 4402, Main office", status: "paid", amount: 84, reason: "Paid Sep 18." },
  { id: 3, title: "Consultation", sub: "Statement 4290, Downtown location", status: "overdue", amount: 310, reason: "This balance is past due." },
  { id: 4, title: "Package of 4 sessions", sub: "Statement 4188, Online", status: "paid", amount: 480, reason: "Paid Aug 3." },
  { id: 5, title: "Lab work", sub: "Statement 4101, Main office", status: "paid", amount: 56.75, reason: "Paid Jul 21." },
  { id: 6, title: "Visit on Jun 9", sub: "Statement 4033, Main office", status: "paid", amount: 120, reason: "Paid Jun 30." },
] as const;

const PER_PAGE = 3;
const query = ref("");
const typed = ref("");
const filter = ref<Filter>("all");
const page = ref(1);

const matches = computed(() =>
  all.filter((s) => {
    const byFilter = filter.value === "all" || s.status === filter.value || (filter.value === "due" && s.status === "overdue");
    const q = query.value.trim().toLowerCase();
    return byFilter && (!q || `${s.title} ${s.sub}`.toLowerCase().includes(q));
  }),
);
const pages = computed(() => Math.max(1, Math.ceil(matches.value.length / PER_PAGE)));
const shown = computed(() => matches.value.slice((page.value - 1) * PER_PAGE, page.value * PER_PAGE));

function setFilter(f: Filter) {
  filter.value = f;
  page.value = 1;
}
function search(q: string) {
  query.value = q;
  page.value = 1;
}
</script>

<template>
  <div class="pattern-md">
    <EStack :gap="4">
      <EPageHeader :heading-level="2" title="Statements and receipts" description="Everything you have been billed, newest first." />
      <ESearchBar v-model="typed" placeholder="Search by visit or statement number" @submit="search" />

      <EInline justify="between">
        <EButtonGroup label="Show">
          <EToggle :model-value="filter === 'all'" @update:model-value="setFilter('all')">All</EToggle>
          <EToggle :model-value="filter === 'due'" @update:model-value="setFilter('due')">Needs payment</EToggle>
          <EToggle :model-value="filter === 'paid'" @update:model-value="setFilter('paid')">Paid</EToggle>
        </EButtonGroup>
        <EText variant="small" muted role="status">{{ matches.length }} {{ matches.length === 1 ? "statement" : "statements" }}</EText>
      </EInline>

      <EStack v-if="shown.length" :gap="2">
        <EStatementRow
          v-for="s in shown"
          :key="s.id"
          :title="s.title"
          :subtitle="s.sub"
          :status="s.status"
          :amount="s.amount"
          :reason="s.reason"
        >
          <template #actions>
            <template v-if="s.status === 'paid'">
              <EButton variant="outline" icon="download">Download receipt</EButton>
            </template>
            <template v-else>
              <EButton icon="card">Pay ${{ s.amount.toFixed(2) }}</EButton>
              <EButton variant="outline" icon="download">Download</EButton>
            </template>
          </template>
        </EStatementRow>
      </EStack>
      <EEmptyState v-else title="No statements match" description="Try a different word, or show all statements." />

      <EPagination v-if="pages > 1" v-model="page" :page-count="pages" aria-label="Statement pages" />
    </EStack>
  </div>
</template>
