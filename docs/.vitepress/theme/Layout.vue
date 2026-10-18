<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { Content, onContentUpdated, useData, useRoute } from "vitepress";
import { EAppFooter, EAppHeader, EButton, EDrawer, EIconButton, ENavList, ESkipLink, EText } from "@eos-ui/vue";
import type { NavItem } from "@eos-ui/vue";
import HomePage from "./HomePage.vue";
import NotFoundPage from "./NotFoundPage.vue";
import SiteSearch from "./SiteSearch.vue";
import { cleanPath, flatten, sidebarFor, toSections } from "./nav";

const { theme, page, frontmatter } = useData();
const route = useRoute();

const isHome = computed(() => frontmatter.value.layout === "home");
const isWide = computed(() => frontmatter.value.layout === "page");

const topNav = computed<NavItem[]>(() => {
  const here = cleanPath(route.path);
  const items = (theme.value.nav ?? []) as { text: string; link: string; activeMatch?: string }[];
  const links: NavItem[] = items.map((n) => ({
    label: n.text,
    href: n.link,
    current: n.activeMatch ? here.startsWith(cleanPath(n.activeMatch)) : here === cleanPath(n.link),
  }));
  const github = (theme.value.socialLinks ?? []).find((s: { icon: unknown }) => s.icon === "github") as { link: string } | undefined;
  return github ? [...links, { label: "GitHub", href: github.link }] : links;
});

const sections = computed(() => toSections(sidebarFor(theme.value.sidebar, route.path), route.path));
const hasSidebar = computed(() => !isHome.value && !page.value.isNotFound && sections.value.length > 0);

const pager = computed(() => {
  const all = flatten(sections.value);
  const i = all.findIndex((x) => x.current);
  return i < 0 ? { prev: undefined, next: undefined } : { prev: all[i - 1], next: all[i + 1] };
});

/** "On this page": the second-level headings of the article, with the one being read marked. */
const headings = ref<{ id: string; text: string }[]>([]);
const activeId = ref("");
const showOutline = computed(() => !isHome.value && !isWide.value && frontmatter.value.aside !== false && headings.value.length > 1);
const outline = computed<NavItem[]>(() => headings.value.map((h) => ({ label: h.text, href: `#${h.id}`, current: h.id === activeId.value })));

function readHeadings() {
  headings.value = [...document.querySelectorAll<HTMLElement>(".site-article h2[id]")].map((h) => ({
    id: h.id,
    text: (h.textContent ?? "").replace(/^#\s*/, "").replace(/​/g, "").trim(),
  }));
  onScroll();
}

function onScroll() {
  let current = "";
  for (const h of headings.value) {
    const el = document.getElementById(h.id);
    if (el && el.getBoundingClientRect().top <= 120) current = h.id;
  }
  activeId.value = current;
}

/** Keeps the current page in view in a long sidebar. */
function showCurrent() {
  const side = document.querySelector<HTMLElement>(".site-side");
  const here = side?.querySelector<HTMLElement>("[aria-current=page]");
  if (side && here) side.scrollTop = Math.max(0, here.offsetTop - side.clientHeight / 3);
}

onMounted(() => {
  readHeadings();
  showCurrent();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("keydown", onShortcut);
});
onBeforeUnmount(() => {
  window.removeEventListener("scroll", onScroll);
  window.removeEventListener("keydown", onShortcut);
});
onContentUpdated(() =>
  nextTick(() => {
    readHeadings();
    showCurrent();
  }),
);

/** Search opens with / or Ctrl+K, unless the person is typing somewhere. */
const searching = ref(false);
function onShortcut(e: KeyboardEvent) {
  const typing = (e.target as HTMLElement | null)?.closest("input, textarea, select, [contenteditable]");
  if ((e.key === "k" && (e.ctrlKey || e.metaKey)) || (e.key === "/" && !typing && !e.ctrlKey && !e.metaKey)) {
    e.preventDefault();
    searching.value = true;
  }
}

const menuOpen = ref(false);
watch(
  () => route.path,
  () => (menuOpen.value = false),
);
</script>

<template>
  <div class="site e-root">
    <ESkipLink href="#main" />
    <EAppHeader sticky class="site-header">
      <template #logo>
        <a class="site-brand" href="/"><img src="/favicon.svg" alt="" width="32" height="32" /><span>Eos</span></a>
      </template>
      <template #actions>
        <ENavList class="site-topnav" label="Site" :items="topNav" />
        <EButton variant="outline" icon="search" class="site-search-button" @click="searching = true">Search</EButton>
        <EIconButton icon="menu" label="Menu" class="site-menu-button" @click="menuOpen = true" />
      </template>
    </EAppHeader>

    <HomePage v-if="isHome" id="main" />

    <div v-else class="site-body" :class="{ 'site-body--side': hasSidebar, 'site-body--outline': showOutline, 'site-body--wide': isWide }">
      <div v-if="hasSidebar" class="site-side">
        <ENavList dense label="Pages" :sections="sections" />
      </div>
      <main id="main" class="site-main" tabindex="-1">
        <NotFoundPage v-if="page.isNotFound" />
        <template v-else>
          <article class="site-article vp-doc"><Content /></article>
          <nav v-if="pager.prev || pager.next" class="site-pager" aria-label="Previous and next page">
            <EButton v-if="pager.prev" variant="outline" icon="arrow-left" :href="pager.prev.href">{{ pager.prev.label }}</EButton>
            <EButton v-if="pager.next" variant="outline" :href="pager.next.href" class="site-pager-next">{{ pager.next.label }}</EButton>
          </nav>
        </template>
      </main>
      <aside v-if="showOutline" class="site-outline" aria-label="Page outline">
        <p class="site-outline-title">On this page</p>
        <ENavList dense label="On this page" :items="outline" />
      </aside>
    </div>

    <EAppFooter class="site-footer">
      <EText variant="small" muted>Eos is released under the MIT license. Its icons are Phosphor (MIT).</EText>
    </EAppFooter>

    <EDrawer v-model:open="menuOpen" side="left" title="Menu" class="site-drawer">
      <ENavList label="Site menu" :items="topNav" />
      <ENavList v-if="hasSidebar" dense label="Pages" :sections="sections" class="site-drawer-pages" />
    </EDrawer>
    <SiteSearch v-model:open="searching" />
  </div>
</template>
