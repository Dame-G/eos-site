<script setup lang="ts">
import { ref } from "vue";
import {
  EAppFooter,
  EAppHeader,
  EAppShell,
  EBreadcrumb,
  EButton,
  EGrid,
  EInline,
  ENavList,
  EPageHeader,
  EStack,
  EStamp,
  ESurface,
  EText,
} from "@eos-ui/vue";

const page = ref<"home" | "statements">("statements");

// A real app builds `current` from its router. Here two buttons stand in for the router.
const items = () => [
  { label: "Home", href: "#home", icon: "home", current: page.value === "home" },
  { label: "Statements", href: "#statements", icon: "receipt", count: 2, countLabel: "2 due", current: page.value === "statements" },
  { label: "Visits", href: "#visits", icon: "calendar" },
];
</script>

<template>
  <div class="pattern-lg">
    <EStack gap="base">
      <EText size="sm" tone="neutral">The frame below stands in for a whole page. Switch the page to see the current item move.</EText>
      <EInline>
        <EButton variant="outline" :aria-pressed="page === 'home'" @click="page = 'home'">Home</EButton>
        <EButton variant="outline" :aria-pressed="page === 'statements'" @click="page = 'statements'">Statements</EButton>
      </EInline>

      <div class="frame">
        <EAppShell main-id="frame-main" sidebar-label="Account">
          <template #header>
            <EAppHeader brand="Elm Street Health" brand-href="#home">
              <template #actions><EButton variant="outline" icon="user">Maria</EButton></template>
            </EAppHeader>
          </template>
          <template #sidebar><ENavList label="Account" :items="items()" /></template>

          <EStack gap="section">
            <EPageHeader
              v-if="page === 'statements'"
              :heading-level="2"
              title="Statements"
              description="Your bills for 2026."
            >
              <template #breadcrumb>
                <EBreadcrumb :items="[{ label: 'Home', href: '#home' }, { label: 'Statements' }]" />
              </template>
              <template #actions><EButton icon="card">Pay $162.40</EButton></template>
            </EPageHeader>
            <EPageHeader v-else :heading-level="2" title="Home" description="What needs you today." />

            <EGrid min="12rem" as="ul">
              <ESurface as="li">
                <EStack gap="snug">
                  <EStamp status="due" size="sm" />
                  <EText>October statement, $162.40</EText>
                </EStack>
              </ESurface>
              <ESurface as="li">
                <EStack gap="snug">
                  <EStamp status="paid" size="sm" />
                  <EText>September statement, $84.00</EText>
                </EStack>
              </ESurface>
            </EGrid>
          </EStack>

          <template #footer><EAppFooter>Elm Street Family Health</EAppFooter></template>
        </EAppShell>
      </div>
    </EStack>
  </div>
</template>

<style scoped>
.frame {
  --e-shell-width: 44rem;
  height: 32rem;
  overflow: auto;
  border: var(--e-stroke-card) solid var(--e-border);
}
</style>
