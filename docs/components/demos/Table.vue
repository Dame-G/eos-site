<script setup lang="ts">
import { EEmptyState, ESurface, EStack, ETable } from "@eos-ui/vue";
</script>

<template>
  <EStack>
    <ETable caption="Plans and what they include" striped>
      <thead>
        <tr>
          <th scope="col">Plan</th>
          <th scope="col">Best for</th>
          <th scope="col" class="e-num">Visits</th>
          <th scope="col" class="e-num">Price</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row">Basic</th>
          <td>Occasional checkups</td>
          <td class="e-num">4</td>
          <td class="e-num">$18.00</td>
        </tr>
        <tr>
          <th scope="row">Plus</th>
          <td>Regular care</td>
          <td class="e-num">12</td>
          <td class="e-num">$42.00</td>
        </tr>
        <tr>
          <th scope="row">Pro</th>
          <td>Whole-family cover</td>
          <td class="e-num">24</td>
          <td class="e-num">$79.00</td>
        </tr>
      </tbody>
    </ETable>

    <ETable caption="Dense reference table" hide-caption size="sm" max-height="9rem">
      <thead>
        <tr><th scope="col">Code</th><th scope="col">Meaning</th></tr>
      </thead>
      <tbody>
        <tr v-for="n in 12" :key="n"><th scope="row">E{{ 100 + n }}</th><td>Reference row {{ n }}</td></tr>
      </tbody>
    </ETable>

    <ETable caption="Plans with long descriptions">
      <thead>
        <tr><th scope="col">Plan</th><th scope="col">What it includes</th></tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row">Whole-family cover</th>
          <td>Twenty-four visits a year across every member of the household, lab work, imaging referrals, vaccinations, and a yearly review with your family doctor that we book for you.</td>
        </tr>
      </tbody>
    </ETable>

    <ETable caption="Receipts">
      <thead>
        <tr><th scope="col">Receipt</th><th scope="col" class="e-num">Amount</th></tr>
      </thead>
      <tbody>
        <tr>
          <td colspan="2"><EEmptyState bare icon="receipt" title="No receipts yet">They appear here after your first payment.</EEmptyState></td>
        </tr>
      </tbody>
    </ETable>

    <ESurface>Inside a card, a table keeps its own outline and scrolls on its own.</ESurface>
  </EStack>
</template>
