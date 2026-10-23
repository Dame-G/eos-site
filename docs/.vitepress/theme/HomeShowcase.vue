<script setup lang="ts">
import { computed, ref } from "vue";
import { EActions, EButton, ECheckbox, EHeading, EKicker, ESegmented, ESelect, EStack, EStamp, ESurface, ETable, EText, ETextField } from "@eos-ui/vue";
import { build } from "./playground/build";
import { initialState } from "./playground/model";
import { applyPreset } from "./playground/presets";
import ThemedScope from "./playground/ThemedScope.vue";

// Four of the playground's own presets, applied to a real card, table and form. Changing the theme changes only CSS variables on the scope around them.
const THEMES = [
  { value: "eos", label: "Light" },
  { value: "paper", label: "Paper" },
  { value: "midnight", label: "Dark" },
  { value: "contrast", label: "High contrast" },
];
const tokensOf = (id: string) => {
  const s = initialState();
  applyPreset(s, id);
  return Object.fromEntries(Object.entries(build(s).theme.tokens).map(([k, v]) => [`--e-${k}`, v]));
};
const SETS = Object.fromEntries(THEMES.map((t) => [t.value, tokensOf(t.value)]));

const theme = ref("eos");
const tokens = computed(() => SETS[theme.value]!);

const name = ref("Alex Rivera");
const plan = ref("team");
const updates = ref(true);
const PLANS = [
  { value: "solo", label: "Solo" },
  { value: "team", label: "Team" },
  { value: "org", label: "Organisation" },
];
const ROWS = [
  { id: "inv-204", month: "October", amount: "$162.40", status: "paid" as const },
  { id: "inv-203", month: "September", amount: "$162.40", status: "paid" as const },
  { id: "inv-205", month: "November", amount: "$171.00", status: "due" as const },
];
</script>

<template>
  <section class="showcase" aria-labelledby="showcase-title">
    <div class="showcase-head">
      <EKicker>Try a theme</EKicker>
      <h2 id="showcase-title" class="showcase-title">One component set, any look</h2>
      <EText muted>The card, table and form below are ordinary EOS components. Switching the theme changes variables, not markup.</EText>
      <ESegmented v-model="theme" label="Showcase theme" :options="THEMES" class="showcase-switch" />
    </div>

    <ThemedScope :tokens="tokens" locale="en-US" currency="USD" class="showcase-stage">
      <div class="showcase-grid">
        <ESurface as="article" aria-labelledby="showcase-card">
          <EStack :gap="3">
            <EHeading id="showcase-card" :level="3" kicker="Your plan">Team, billed monthly</EHeading>
            <EText>Next payment of <strong>$171.00</strong> on November 1. Every contrast pair in this theme is checked when it is built.</EText>
            <EStamp tone="success">Active</EStamp>
          </EStack>
          <template #actions>
            <EButton>Pay now</EButton>
            <EButton variant="outline">View plan</EButton>
          </template>
        </ESurface>

        <ETable caption="Recent invoices" striped>
          <thead>
            <tr><th scope="col">Invoice</th><th scope="col">Month</th><th scope="col" class="e-num">Amount</th><th scope="col">Status</th></tr>
          </thead>
          <tbody>
            <tr v-for="r in ROWS" :key="r.id">
              <th scope="row">{{ r.id }}</th>
              <td>{{ r.month }}</td>
              <td class="e-num">{{ r.amount }}</td>
              <td><EStamp :status="r.status" small /></td>
            </tr>
          </tbody>
        </ETable>

        <ESurface as="section" aria-label="Account details" class="showcase-form">
          <EStack :gap="4">
            <ETextField v-model="name" label="Full name" hint="As it appears on invoices." />
            <ESelect v-model="plan" label="Plan" :options="PLANS" />
            <ECheckbox v-model="updates" label="Email me about changes to my plan" />
            <EActions><EButton>Save changes</EButton></EActions>
          </EStack>
        </ESurface>
      </div>
    </ThemedScope>
  </section>

  <section class="values" aria-label="Why EOS">
    <ul class="values-list">
      <li><EKicker>Accessible</EKicker><EText>Contrast is checked at build time and every control works from the keyboard.</EText></li>
      <li><EKicker>Themeable</EKicker><EText>Rebrand with a few lines of defineTheme. Light, dark and high contrast come from the same tokens.</EText></li>
      <li><EKicker>Tree-shakeable</EKicker><EText>Import only the components you use. Nothing else reaches your bundle.</EText></li>
    </ul>
  </section>
</template>
