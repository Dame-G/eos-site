<script setup lang="ts">
import localSearchIndex from "@localSearchIndex";
import MiniSearch from "minisearch";
import { computed, nextTick, ref, shallowRef, watch } from "vue";
import { useRouter } from "vitepress";
import { EDialog, EKbd, ESearchBar, ESearchResults, EVisuallyHidden } from "@eos-ui/vue";
import type { SearchResultItem } from "@eos-ui/vue";
import { searchBuildOptions, searchOptions, titleRank } from "../search";
import { cleanPath } from "./nav";

const open = defineModel<boolean>("open", { default: false });

interface Hit {
  id: string;
  title: string;
  titles: string[];
}

const router = useRouter();
const query = ref("");
const hits = shallowRef<Hit[]>([]);
const results = ref<{ focusFirst: () => void } | null>(null);
const field = ref<{ focus: () => void } | null>(null);
let index: MiniSearch<Hit> | null = null;

async function load() {
  if (index) return;
  const mod = await (localSearchIndex as Record<string, () => Promise<{ default: string }>>)["root"]!();
  index = MiniSearch.loadJSON<Hit>(mod.default, { ...searchBuildOptions, searchOptions });
}

async function run() {
  await load();
  const q = query.value.trim();
  hits.value =
    index && q
      ? (index.search(q).slice(0, 40) as unknown as Hit[])
          .map((h, at) => ({ h, at, rank: titleRank(h.title, q) }))
          .sort((a, b) => a.rank - b.rank || a.at - b.at)
          .slice(0, 12)
          .map((x) => x.h)
      : [];
}

watch(query, run);
watch(open, async (isOpen) => {
  if (!isOpen) return;
  await load();
  await run();
  await nextTick();
  field.value?.focus();
});

const status = computed(() => {
  if (!query.value.trim()) return "";
  const n = hits.value.length;
  return n ? `${n} ${n === 1 ? "result" : "results"}` : "No results";
});

const items = computed<SearchResultItem[]>(() =>
  hits.value.map((h) => ({
    label: h.title,
    description: h.titles.join(" › "),
    href: h.id.replace(/\.html(?=#|$)/, ""),
  })),
);
const emptyText = computed(() => (query.value.trim() ? `Nothing found for "${query.value}".` : undefined));

function go(href: string) {
  open.value = false;
  query.value = "";
  const [path, hash] = href.split("#");
  void router.go(cleanPath(path ?? "/") + (hash ? `#${hash}` : ""));
}

function onFieldKeydown(e: KeyboardEvent) {
  if (e.key === "ArrowDown" && items.value.length) {
    e.preventDefault();
    results.value?.focusFirst();
  }
}

function openFirst() {
  const first = items.value[0]?.href;
  if (first) go(first);
}

function onSelect(item: SearchResultItem, e: MouseEvent) {
  e.preventDefault();
  go(item.href ?? "/");
}
</script>

<template>
  <EDialog v-model:open="open" title="Search" class="site-search">
    <div class="site-search-body">
      <ESearchBar
        ref="field"
        v-model="query"
        label="Search the docs"
        placeholder="Search the docs"
        hide-action
        autocomplete="off"
        @keydown="onFieldKeydown"
        @submit="openFirst"
      />
      <EVisuallyHidden as="div" role="status" aria-live="polite" aria-atomic="true">{{ status }}</EVisuallyHidden>
      <ESearchResults
        ref="results"
        label="Search results"
        :items="items"
        :query="query"
        :empty-text="emptyText"
        @select="onSelect"
        @edge="field?.focus()"
      />
    </div>
    <template #actions>
      <p class="site-search-hint"><EKbd small>Esc</EKbd> to close</p>
    </template>
  </EDialog>
</template>
