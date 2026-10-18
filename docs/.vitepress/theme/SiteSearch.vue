<script setup lang="ts">
import localSearchIndex from "@localSearchIndex";
import MiniSearch from "minisearch";
import { computed, nextTick, ref, shallowRef, watch } from "vue";
import { useRouter } from "vitepress";
import { EDialog, ENavList, EText, ETextField } from "@eos-ui/vue";
import type { NavItem } from "@eos-ui/vue";
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
const list = ref<HTMLElement | null>(null);
const field = ref<{ focus: () => void } | null>(null);
let index: MiniSearch<Hit> | null = null;

async function load() {
  if (index) return;
  const mod = await (localSearchIndex as Record<string, () => Promise<{ default: string }>>)["root"]!();
  index = MiniSearch.loadJSON<Hit>(mod.default, {
    fields: ["title", "titles", "text"],
    storeFields: ["title", "titles"],
    searchOptions: { fuzzy: 0.2, prefix: true, boost: { title: 4, text: 2, titles: 1 } },
  });
}

async function run() {
  await load();
  hits.value = index && query.value.trim() ? (index.search(query.value).slice(0, 12) as unknown as Hit[]) : [];
}

watch(query, run);
watch(open, async (isOpen) => {
  if (!isOpen) return;
  await load();
  await run();
  await nextTick();
  field.value?.focus();
});

const items = computed<NavItem[]>(() =>
  hits.value.map((h) => ({ label: [...h.titles, h.title].join(" > "), href: h.id.replace(/\.html(?=#|$)/, "") })),
);

function go(href: string) {
  open.value = false;
  query.value = "";
  const [path, hash] = href.split("#");
  void router.go(cleanPath(path ?? "/") + (hash ? `#${hash}` : ""));
}

/** Arrow keys move between the box and the results; Enter opens the first result from the box. */
function onKeydown(e: KeyboardEvent) {
  const links = [...(list.value?.querySelectorAll<HTMLAnchorElement>("a") ?? [])];
  const at = links.indexOf(document.activeElement as HTMLAnchorElement);
  if (e.key === "ArrowDown" && links.length) {
    e.preventDefault();
    links[Math.min(at + 1, links.length - 1)]!.focus();
  } else if (e.key === "ArrowUp" && at >= 0) {
    e.preventDefault();
    if (at === 0) field.value?.focus();
    else links[at - 1]!.focus();
  } else if (e.key === "Enter" && at < 0 && items.value[0]?.href) {
    e.preventDefault();
    go(items.value[0].href);
  }
}

function onResultClick(e: MouseEvent) {
  const a = (e.target as HTMLElement).closest("a");
  if (!a) return;
  e.preventDefault();
  e.stopPropagation();
  go(a.getAttribute("href") ?? "/");
}
</script>

<template>
  <EDialog v-model:open="open" title="Search" class="site-search">
    <!-- eslint-disable-next-line vuejs-accessibility/no-static-element-interactions -->
    <div class="site-search-body" @keydown="onKeydown">
      <ETextField ref="field" v-model="query" label="Search the docs" hide-label type="search" placeholder="Search the docs" autocomplete="off" />
      <div ref="list" class="site-search-results" aria-live="polite" @click.capture="onResultClick">
        <ENavList v-if="items.length" label="Search results" :items="items" dense />
        <EText v-else-if="query.trim()" muted variant="small">Nothing found for "{{ query }}".</EText>
      </div>
    </div>
  </EDialog>
</template>
