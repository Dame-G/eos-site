<script setup lang="ts">
import { ESurface, EStack, ETable } from "@eos-ui/vue";
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

    <ETable caption="Dense reference table" hide-caption dense max-height="9rem">
      <thead>
        <tr><th scope="col">Code</th><th scope="col">Meaning</th></tr>
      </thead>
      <tbody>
        <tr v-for="n in 12" :key="n"><th scope="row">E{{ 100 + n }}</th><td>Reference row {{ n }}</td></tr>
      </tbody>
    </ETable>

    <ESurface pad="md">Inside a card, a table keeps its own outline and scrolls on its own.</ESurface>
  </EStack>
</template>
