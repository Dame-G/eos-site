<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { Content, onContentUpdated, useData, useRoute } from "vitepress";
import { EAppFooter, EAppHeader, EButton, EDrawer, EIconButton, EKbd, ELink, ENavList, ESearchBar, ESkipLink, ETabs, EText, EVisuallyHidden } from "@eos-ui/vue";
import type { NavItem } from "@eos-ui/vue";
import GithubMark from "./GithubMark";
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
  return items.map((n) => ({
    label: n.text,
    href: n.link,
    current: n.activeMatch ? here.startsWith(cleanPath(n.activeMatch)) : here === cleanPath(n.link),
  }));
});

const githubUrl = computed(() => {
  const github = (theme.value.socialLinks ?? []).find((s: { icon: unknown }) => s.icon === "github") as { link: string } | undefined;
  return github?.link;
});

const sections = computed(() => toSections(sidebarFor(theme.value.sidebar, route.path), route.path));
const hasSidebar = computed(() => !isHome.value && !page.value.isNotFound && frontmatter.value.sidebar !== false && sections.value.length > 0);
const menuSplit = computed(() => {
  const at = topNav.value.findIndex((i) => i.current);
  return at < 0 || !hasSidebar.value
    ? { before: topNav.value, after: [] as NavItem[] }
    : { before: topNav.value.slice(0, at + 1), after: topNav.value.slice(at + 1) };
});
const filter = ref("");
const filterable = computed(() => route.path.startsWith("/components"));
const shown = computed(() => {
  const q = filter.value.trim().toLowerCase();
  if (!filterable.value || !q) return sections.value;
  return sections.value
    .map((s) => ({ ...s, items: s.items.filter((i) => i.label.toLowerCase().includes(q)) }))
    .filter((s) => s.items.length);
});

const pager = computed(() => {
  const all = flatten(sections.value);
  const i = all.findIndex((x) => x.current);
  return i < 0 ? { prev: undefined, next: undefined } : { prev: all[i - 1], next: all[i + 1] };
});

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
  const list = headings.value;
  if (!list.length) {
    activeId.value = "";
    return;
  }
  const root = document.documentElement;
  const scrolled = window.scrollY > 4;
  const atEnd = scrolled && window.scrollY + window.innerHeight >= root.scrollHeight - 4;
  let current = list[0]!.id;
  if (atEnd) current = list[list.length - 1]!.id;
  else {
    const line = window.innerHeight * 0.35;
    for (const h of list) {
      const el = document.getElementById(h.id);
      if (el && el.getBoundingClientRect().top <= line) current = h.id;
    }
  }
  activeId.value = current;
}

function showCurrent() {
  const side = document.querySelector<HTMLElement>(".site-side");
  const here = side?.querySelector<HTMLElement>("[aria-current=page]");
  if (side && here) side.scrollTop = Math.max(0, here.offsetTop - side.clientHeight / 3);
}

const searching = ref(false);
function onShortcut(e: KeyboardEvent) {
  const typing = (e.target as HTMLElement | null)?.closest("input, textarea, select, [contenteditable]");
  if ((e.key === "k" && (e.ctrlKey || e.metaKey)) || (e.key === "/" && !typing && !e.ctrlKey && !e.metaKey)) {
    e.preventDefault();
    searching.value = true;
  }
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

const menuOpen = ref(false);
watch(
  () => route.path,
  () => (menuOpen.value = false),
);

const announcement = ref("");
watch(
  () => page.value.relativePath,
  async () => {
    await nextTick();
    const hash = decodeURIComponent(window.location.hash.slice(1));
    const target = hash ? document.getElementById(hash) : null;
    if (target) {
      if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    } else {
      document.getElementById("main")?.focus({ preventScroll: true });
    }
    announcement.value = "";
    await nextTick();
    announcement.value = page.value.isNotFound ? "Page not found" : page.value.title;
  },
);
</script>

<template>
  <div class="site e-root">
    <ESkipLink href="#main" />
    <EVisuallyHidden as="div" role="status" aria-live="polite" aria-atomic="true">{{ announcement }}</EVisuallyHidden>
    <EAppHeader sticky>
      <template #logo>
        <a class="site-brand" href="/" aria-label="Eos, home">Eos</a>
      </template>
      <template #actions>
        <ETabs class="site-topnav" label="Site" :items="topNav" />
        <EButton variant="outline" icon="search" class="site-search-button" aria-keyshortcuts="/" @click="searching = true">
          Search<span class="site-search-key" aria-hidden="true"><EKbd small>/</EKbd></span>
        </EButton>
        <EIconButton icon="menu" label="Menu" class="site-menu-button" @click="menuOpen = true" />
      </template>
    </EAppHeader>

    <HomePage v-if="isHome" id="main" />

    <div v-else class="site-body" :class="{ 'site-body--side': hasSidebar, 'site-body--outline': showOutline, 'site-body--wide': isWide }">
      <div v-if="hasSidebar" class="site-side">
        <div v-if="filterable" class="site-filter">
          <ESearchBar v-model="filter" label="Filter components" placeholder="Filter components" hide-action autocomplete="off" />
        </div>
        <ETabs dense orientation="vertical" label="Pages" :sections="shown" />
        <EText v-if="filterable && filter.trim() && !shown.length" variant="small" muted class="site-filter-empty">No component matches "{{ filter }}".</EText>
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
      <aside v-if="showOutline" class="site-outline" aria-labelledby="site-outline-title">
        <p id="site-outline-title" class="site-outline-title">On this page</p>
        <ETabs dense orientation="vertical" label="On this page" :items="outline" />
      </aside>
    </div>

    <EAppFooter>
      <EText variant="small" muted>Eos is released under the MIT license.</EText>
      <nav class="site-footer-links" aria-label="Project">
        <ELink v-if="githubUrl" :href="githubUrl" external :icon="GithubMark">GitHub</ELink>
        <ELink href="https://github.com/Dame-G/eos/releases" external>Releases</ELink>
        <ELink href="https://github.com/Dame-G/eos/blob/main/CONTRIBUTING.md" external>Contributing</ELink>
        <ELink href="https://github.com/Dame-G/eos/issues/new/choose" external>Report an issue</ELink>
      </nav>
    </EAppFooter>

    <EDrawer v-model:open="menuOpen" side="left" title="Menu">
      <ENavList label="Site menu" :items="menuSplit.before" />
      <div v-if="hasSidebar" class="site-drawer-pages">
        <div v-if="filterable" class="site-filter site-filter--drawer">
          <ESearchBar v-model="filter" label="Filter components" placeholder="Filter components" hide-action autocomplete="off" />
        </div>
        <ETabs dense orientation="vertical" label="Pages" :sections="shown" />
      </div>
      <ENavList v-if="menuSplit.after.length" label="More of the site" :items="menuSplit.after" />
    </EDrawer>
    <SiteSearch v-model:open="searching" />
  </div>
</template>
