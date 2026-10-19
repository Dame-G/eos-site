<script setup lang="ts">
import { EAppFooter, EAppHeader, EAppShell, EBreadcrumb, ENavList, EPageHeader, EText } from "@eos-ui/vue";
</script>

<template>
  <div class="frame">
    <EAppShell main-id="demo-main" sidebar-label="Account">
      <template #header>
        <EAppHeader><template #logo><a href="#home">Elm Street Health</a></template></EAppHeader>
      </template>
      <template #sidebar>
        <ENavList
          label="Sections"
          :items="[
            { label: 'Visits', href: '#visits', icon: 'calendar' },
            { label: 'Statements', href: '#statements', icon: 'receipt', current: true },
          ]"
        />
      </template>
      <EPageHeader title="Statements" description="Your bills for 2026.">
        <template #breadcrumb>
          <EBreadcrumb :items="[{ label: 'Home', href: '#home' }, { label: 'Statements' }]" />
        </template>
      </EPageHeader>
      <EText>The October statement of $162.40 is due Oct 22, 2026.</EText>
      <template #footer><EAppFooter>Elm Street Family Health</EAppFooter></template>
    </EAppShell>
  </div>
</template>

<style scoped>
.frame {
  --frame-height: 28rem;
  height: var(--frame-height);
  overflow: auto;
  border: var(--e-stroke-card) solid var(--e-border);
}
</style>
