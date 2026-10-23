<script setup lang="ts">
import { EButton, EGrid, EHeading, EInline, ENotice, EPageHeader, EProgress, EStack, EStamp, ESurface, ETable, EText } from "@eos-ui/vue";

const money = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

const recent = [
  { id: 1, what: "Annual check-up", date: "Oct 2, 2026", status: "due", amount: 162.4 },
  { id: 2, what: "Follow-up visit", date: "Sep 18, 2026", status: "paid", amount: 84 },
  { id: 3, what: "Lab work", date: "Jul 21, 2026", status: "paid", amount: 56.75 },
] as const;
</script>

<template>
  <div class="pattern-md">
    <EStack :gap="6">
      <EPageHeader :heading-level="2" title="Overview" description="Where your account stands today.">
        <template #actions><EButton icon="card">Pay $162.40</EButton></template>
      </EPageHeader>

      <ENotice tone="warning" title="One statement is due" :heading-level="3">
        Your October statement is due Nov 1.
        <template #actions><EButton variant="outline">View statement</EButton></template>
      </ENotice>

      <EGrid min="15rem" as="ul" class="pattern-cards">
        <ESurface as="li">
          <EStack :gap="2">
            <EText small muted>Balance due</EText>
            <EText large>{{ money(162.4) }}</EText>
            <EStamp status="due" small detail="Nov 1" />
          </EStack>
        </ESurface>
        <ESurface as="li">
          <EStack :gap="2">
            <EText small muted>Paid this year</EText>
            <EText large>{{ money(1286.75) }}</EText>
            <EText small muted>Across 9 statements</EText>
          </EStack>
        </ESurface>
        <ESurface as="li">
          <EStack :gap="2">
            <EText small muted>Visits used</EText>
            <EProgress label="Visits used" :value="9" :max="12" value-text="9 of 12" />
          </EStack>
        </ESurface>
      </EGrid>

      <EStack :gap="3">
        <EInline justify="between">
          <EHeading :level="3">Recent statements</EHeading>
          <EButton variant="quiet">See all</EButton>
        </EInline>
        <ETable caption="Recent statements" hide-caption>
          <thead>
            <tr>
              <th scope="col">Visit</th>
              <th scope="col">Date</th>
              <th scope="col">Status</th>
              <th scope="col" class="e-num">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in recent" :key="r.id">
              <th scope="row">{{ r.what }}</th>
              <td>{{ r.date }}</td>
              <td><EStamp :status="r.status" small /></td>
              <td class="e-num">{{ money(r.amount) }}</td>
            </tr>
          </tbody>
        </ETable>
      </EStack>
    </EStack>
  </div>
</template>

<style scoped>
.pattern-cards {
  list-style: none;
  margin: 0;
  padding: 0;
}
</style>
