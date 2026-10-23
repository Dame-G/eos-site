<script setup lang="ts">
import { computed, ref } from "vue";
import { EEmptyState, EGrid, EKicker, ELink, ESearchBar, ESurface, EText, EVisuallyHidden } from "@eos-ui/vue";
import { SYNONYMS } from "../search";

interface Group {
  id: string;
  title: string;
  items: { name: string; summary: string }[];
}
const props = defineProps<{ groups: Group[] }>();

/** What each group is for, in a few words. */
const ROLE: Record<string, string> = {
  layout: "Arrange things on the page: spacing, grids, surfaces and the page frame.",
  content: "Show information: text, code, avatars, tables and status marks.",
  actions: "Things you press to do something.",
  forms: "Collect input: fields, choices, dates, files and signatures.",
  navigation: "Move around: tabs, breadcrumbs, steppers and pages.",
  feedback: "Tell people what is happening: messages, progress and empty states.",
  overlays: "Open on top of the page: dialogs, drawers, menus and tooltips.",
};

/** The components most pages reach for first. A name the library does not have is skipped, so a renamed component never leaves a dead link. */
const MOST_USED = ["Button", "TextField", "Field", "Select", "Dialog", "Table", "Tabs", "Toast", "Surface", "Notice"];

const query = ref("");
const known = computed(() => new Map(props.groups.flatMap((g) => g.items.map((c) => [c.name, c] as const))));
const popular = computed(() => MOST_USED.flatMap((n) => (known.value.has(n) ? [known.value.get(n)!] : [])));

const shown = computed(() => {
  const words = query.value.toLowerCase().split(/\s+/).filter(Boolean);
  return props.groups
    .map((g) => ({
      ...g,
      items: g.items.filter((c) => {
        const haystack = `${c.name} ${c.summary} ${SYNONYMS[c.name] ?? ""}`.toLowerCase();
        return words.every((w) => haystack.includes(w));
      }),
    }))
    .filter((g) => g.items.length);
});
const count = computed(() => shown.value.reduce((n, g) => n + g.items.length, 0));
const status = computed(() => (query.value.trim() ? (count.value ? `${count.value} ${count.value === 1 ? "component" : "components"}` : "No components found") : ""));
</script>

<template>
  <div class="eos-live component-index">
    <ESearchBar v-model="query" label="Filter components" placeholder="Filter by name, such as dropdown or modal" hide-action autocomplete="off" class="component-filter" />
    <EVisuallyHidden as="div" role="status" aria-live="polite" aria-atomic="true">{{ status }}</EVisuallyHidden>

    <section v-if="!query.trim()" class="component-popular" aria-labelledby="most-used">
      <EKicker id="most-used">Most used</EKicker>
      <ul class="component-popular-list">
        <li v-for="c in popular" :key="c.name"><ELink :href="`/components/${c.name}`">E{{ c.name }}</ELink></li>
      </ul>
    </section>

    <EEmptyState v-if="!shown.length" title="No component matches that" icon="search" :heading-level="2">
      Try a shorter word, or a name you know from another library, such as modal or snackbar.
    </EEmptyState>

    <section v-for="g in shown" :key="g.id" :aria-labelledby="g.id" class="component-group">
      <EKicker v-if="ROLE[g.id]" class="component-group-kicker">{{ ROLE[g.id] }}</EKicker>
      <h2 :id="g.id">{{ g.title }}</h2>
      <EGrid as="ul" min="17rem" :gap="3" class="component-list">
        <ESurface v-for="c in g.items" :key="c.name" as="li" small class="component-card">
          <a :href="`/components/${c.name}`" class="component-card-link">E{{ c.name }}</a>
          <EText small muted>{{ c.summary }}</EText>
        </ESurface>
      </EGrid>
    </section>
  </div>
</template>
