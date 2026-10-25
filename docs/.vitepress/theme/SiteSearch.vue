<script setup lang="ts">
import localSearchIndex from "@localSearchIndex";
import MiniSearch from "minisearch";
import { computed, shallowRef, watch } from "vue";
import { useRouter } from "vitepress";
import { ECommandPalette } from "@eos-ui/vue/components/ECommandPalette";
import type { CommandItem } from "@eos-ui/vue";
import {
  areaOf,
  breadcrumb,
  componentDocs,
  componentSearchOptions,
  searchBuildOptions,
  searchOptions,
  titleRank,
  type ComponentGroup,
} from "../search";
// @ts-expect-error a build-time data loader (docs/data/components.data.js)
import { data as componentGroups } from "../../data/components.data.js";
import { cleanPath } from "./nav";

const open = defineModel<boolean>("open", { default: false });

interface Hit {
  id: string;
  title: string;
  titles: string[];
}

interface Loaded {
  index: MiniSearch<Hit>;
  components: MiniSearch<Hit>;
}

/** Shown before anything is typed, so the palette is never an empty box. */
const SUGGESTED = ["/guide/getting-started", "/components", "/patterns", "/playground", "/guide/theming"];

const router = useRouter();
const loaded = shallowRef<Loaded | null>(null);
const docs = shallowRef<CommandItem[]>([]);
let loading: Promise<void> | null = null;

const hrefOf = (id: string) => id.replace(/\.html(?=#|$)/, "");

function toItem(h: Hit): CommandItem {
  const href = hrefOf(h.id);
  return { id: href, label: h.title, description: breadcrumb(h.id, h.title, h.titles), group: areaOf(h.id) };
}

/** The index is fetched on first use, then every indexed page and heading becomes a command the palette can score. */
function load(): Promise<void> {
  loading ??= (async () => {
    const mod = await (localSearchIndex as Record<string, () => Promise<{ default: string }>>)["root"]!();
    const index = MiniSearch.loadJSON<Hit>(mod.default, { ...searchBuildOptions, searchOptions });
    const components = new MiniSearch<Hit>(componentSearchOptions);
    const own = componentDocs(componentGroups as ComponentGroup[]) as unknown as Hit[];
    components.addAll(own);
    const raw = JSON.parse(mod.default) as {
      documentIds: Record<string, string>;
      storedFields: Record<string, { title: string; titles: string[] }>;
    };
    const all = new Map<string, CommandItem>();
    for (const h of own) all.set(hrefOf(h.id), toItem(h));
    for (const [short, id] of Object.entries(raw.documentIds)) {
      const stored = raw.storedFields[short];
      if (stored && !all.has(hrefOf(id))) all.set(hrefOf(id), toItem({ id, ...stored }));
    }
    docs.value = [...all.values()];
    loaded.value = { index, components };
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
// ranking is computed when the query changes and each command only looks its own position up.
let rankedFor = "";
let ranked = new Map<string, number>();

function rankFor(q: string) {
  if (q === rankedFor || !loaded.value) return;
  rankedFor = q;
  const { index, components } = loaded.value;
  const order = [...components.search(q, componentSearchOptions.searchOptions), ...index.search(q).slice(0, 40)]
    .map((r) => r as unknown as Hit)
    .map((h, at) => ({ id: hrefOf(h.id), at, rank: titleRank(h.title, q) }))
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
watch(loaded, () => (rankedFor = ""));

const items = computed(() => (loaded.value ? docs.value : []));

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
    :loading="!loaded"
    empty-text="Nothing found. Try another word."
    @select="onSelect"
  />
</template>
