<script setup lang="ts">
import { EButton, EStack, EStatementCard } from "@eos-ui/vue";

const activity = [
  { kind: "practice" as const, note: "Statement sent.", source: "Oct 1, 2026, 8:00 am, email" },
  { kind: "you" as const, note: "You opened the statement.", source: "Oct 2, 2026, 7:15 pm, online" },
];
</script>

<template>
  <EStack>
    <EStatementCard
      title="October statement"
      subtitle="Oct 1 to Oct 31, 2026"
      status="due"
      detail="Oct 22"
      amount-label="You owe"
      :amount="162.4"
      :details="[{ label: 'Insurance paid', value: 120 }]"
      reason="Pay by Oct 22, 2026 to avoid a late fee."
      :parts="[
        { label: 'Covers', text: 'Leo\'s visit on Oct 3, 2026' },
        { label: 'How to pay', text: 'Online or at the front desk' },
      ]"
      :activity="activity"
      activity-title="Activity"
    >
      <template #actions>
        <EButton>Pay now</EButton>
        <EButton variant="outline">Download</EButton>
      </template>
    </EStatementCard>
    <EStatementCard
      title="September statement"
      subtitle="Sep 1 to Sep 30, 2026"
      status="paid"
      amount-label="Paid"
      :amount="85"
    />
  </EStack>
</template>
