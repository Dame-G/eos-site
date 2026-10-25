<script setup lang="ts">
import localSearchIndex from "@localSearchIndex";
import MiniSearch from "minisearch";
import { computed, shallowRef, watch } from "vue";
import { useRouter } from "vitepress";
import { ECommandPalette } from "@eos-ui/vue/components/ECommandPalette";
import type { CommandItem } from "@eos-ui/vue";
import { areaOf, breadcrumb, searchBuildOptions, searchOptions, titleRank } from "../search";
import { cleanPath } from "./nav";

const open = defineModel<boolean>("open", { default: false });

interface Hit {
  id: string;
  title: string;
  titles: string[];
}

/** Shown before anything is typed, so the palette is never an empty box. */
const SUGGESTED = ["/guide/getting-started", "/components", "/patterns", "/playground", "/guide/theming"];

const router = useRouter();
const index = shallowRef<MiniSearch<Hit> | null>(null);
const docs = shallowRef<CommandItem[]>([]);
let loading: Promise<void> | null = null;

/** A page's own entry (its title section, with no headings above it) links to the page, not to its title's anchor. */
function hrefOf(h: Hit): string {
  const href = h.id.replace(/\.html(?=#|$)/, "");
  return h.titles.length ? href : href.replace(/#.*$/, "");
}

function toItem(h: Hit): CommandItem {
  return { id: hrefOf(h), label: h.title, description: breadcrumb(h.id, h.title, h.titles), group: areaOf(h.id) };
}

/** VitePress's page index is fetched on first use; every page and heading in it becomes a command the palette can score. */
function load(): Promise<void> {
  loading ??= (async () => {
    const mod = await localSearchIndex["root"]!();
    const loaded = MiniSearch.loadJSON<Hit>(mod.default, { ...searchBuildOptions, searchOptions });
    const raw = JSON.parse(mod.default) as { documentIds: Record<string, string>; storedFields: Record<string, { title: string; titles: string[] }> };
    const all = new Map<string, CommandItem>();
    for (const [short, id] of Object.entries(raw.documentIds)) {
      const stored = raw.storedFields[short];
      if (!stored) continue;
      const item = toItem({ id, ...stored });
      if (!all.has(item.id)) all.set(item.id, item);
    }
    docs.value = [...all.values()];
    index.value = loaded;
  })();
  return loading;
}

watch(
  open,
  (isOpen) => {
    if (isOpen) void load();
  },
  { immediate: true },
);

// The palette asks for a score per command, once per command per query. MiniSearch ranks the whole query once, so the
// ranking is computed when the query changes and each command only looks its own position up. A title that is the
// query, or starts with it, goes first.
let rankedFor = "";
let ranked = new Map<string, number>();

function rankFor(q: string) {
  if (q === rankedFor || !index.value) return;
  rankedFor = q;
  const order = index.value
    .search(q)
    .slice(0, 40)
    .map((r, at) => {
      const hit = r as unknown as Hit;
      return { id: hrefOf(hit), at, rank: titleRank(hit.title, q) };
    })
    .sort((a, b) => a.rank - b.rank || a.at - b.at);
  ranked = new Map();
  for (const hit of order) if (!ranked.has(hit.id) && ranked.size < 12) ranked.set(hit.id, 1000 - ranked.size);
}

function score(item: CommandItem, query: string): number {
  // A page's own entry is the one whose line is only its area.
  if (!query) return !item.description?.includes("›") && SUGGESTED.includes(item.id.replace(/[#?].*$/, "").replace(/\/(index)?$/, "")) ? 1 : 0;
  rankFor(query);
  return ranked.get(item.id) ?? 0;
}

// A new index means the same query ranks differently.
watch(index, () => (rankedFor = ""));

const items = computed(() => (index.value ? docs.value : []));

function onSelect(item: CommandItem) {
  const [path, hash] = item.id.split("#");
  void router.go(cleanPath(path ?? "/") + (hash ? `#${hash}` : ""));
}
</script>

<template>
  <ECommandPalette
    v-model:open="open"
    label="Search the docs"
    placeholder="Search the docs"
    :shortcut="false"
    :items="items"
    :score="score"
    :loading="!index"
    empty-text="Nothing found. Try another word."
    @select="onSelect"
  />
</template>
