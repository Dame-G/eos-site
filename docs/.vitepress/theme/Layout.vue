<script setup lang="ts">
import { computed, defineAsyncComponent, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { Content, onContentUpdated, useData, useRoute } from "vitepress";
import { EAppFooter, EAppHeader, EButton, EDefinition, EDrawer, EIconButton, EKbd, ELink, ENavList, ESegmented, ESelect, ESkipLink, EText, EVisuallyHidden } from "@eos-ui/vue";
import type { NavItem } from "@eos-ui/vue";
import HomePage from "./HomePage.vue";
import NotFoundPage from "./NotFoundPage.vue";
import { cleanPath, flatten, sidebarFor, toSections } from "./nav";
import { MonitorIcon, MoonIcon, SunIcon } from "./SchemeIcons";
import BubbleTitle from "./BubbleTitle.vue";
import { GithubIcon, NpmxIcon } from "./BrandIcons";
import type { Choice } from "../scheme";
import { followScheme, schemeChoice, setChoice } from "./site-theme";

const ORDER = ["system", "light", "dark"] as const;
declare const __EOS_LICENSE__: string;
// The licence file hard-wraps its lines: each paragraph is joined into one. The first paragraph is its title, which the panel shows itself.
const license = __EOS_LICENSE__.split(/\n\n/).slice(1).map((p) => p.replace(/\n/g, " "));
const SCHEME_ICON = { system: MonitorIcon, light: SunIcon, dark: MoonIcon };
const NAMES: Record<Choice, string> = { system: "System", light: "Light", dark: "Dark" };
const SCHEME_OPTIONS = ORDER.map((value) => ({ value, label: NAMES[value] }));
// The header lists the three modes so any one can be picked directly; the drawer has the same choice as a segmented control.
const SCHEME_SELECT_OPTIONS = ORDER.map((value) => ({ value, label: NAMES[value], icon: SCHEME_ICON[value] }));

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
  if (!side || !here) return;
  const top = here.offsetTop - side.scrollTop;
  if (top >= 0 && top + here.offsetHeight <= side.clientHeight) return;
  side.scrollTop = Math.max(0, here.offsetTop - side.clientHeight / 3);
}

// The search code and its index load once the browser is idle after mount, or at once when search is opened first, so they are not part of the first load.
const SiteSearch = defineAsyncComponent(() => import("./SiteSearch.vue"));
const searching = ref(false);
const searchLoaded = ref(false);
let searchIdle = 0;
watch(searching, (open) => {
  if (open) searchLoaded.value = true;
});
function onShortcut(e: KeyboardEvent) {
  const typing = (e.target as HTMLElement | null)?.closest("input, textarea, select, [contenteditable]");
  if ((e.key === "k" && (e.ctrlKey || e.metaKey)) || (e.key === "/" && !typing && !e.ctrlKey && !e.metaKey)) {
    e.preventDefault();
    searching.value = true;
  }
}

onMounted(() => {
  followScheme();
  readHeadings();
  showCurrent();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("keydown", onShortcut);
  const load = () => (searchLoaded.value = true);
  if ("requestIdleCallback" in window) searchIdle = window.requestIdleCallback(load, { timeout: 3000 });
  else searchIdle = window.setTimeout(load, 1000);
});
onBeforeUnmount(() => {
  window.removeEventListener("scroll", onScroll);
  window.removeEventListener("keydown", onShortcut);
  if ("cancelIdleCallback" in window) window.cancelIdleCallback(searchIdle);
  else clearTimeout(searchIdle);
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
async function say(text: string) {
  announcement.value = "";
  await nextTick();
  announcement.value = text;
}
function chooseScheme(next: Choice) {
  setChoice(next);
  void say(`Colour scheme: ${NAMES[next].toLowerCase()}`);
}
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
  <div class="site e-root e-shell">
    <ESkipLink href="#main" />
    <EVisuallyHidden as="div" role="status" aria-live="polite" aria-atomic="true">{{ announcement }}</EVisuallyHidden>
    <EAppHeader sticky>
      <template #logo>
        <a class="site-brand" href="/" aria-label="EOS, home"><BubbleTitle decorative /></a>
        <EButton variant="outline" icon="search" class="site-search-button" aria-keyshortcuts="/" @click="searching = true">
          Search<span class="site-search-key" aria-hidden="true"><EKbd small>/</EKbd></span>
        </EButton>
      </template>
      <template #actions>
        <ENavList class="site-topnav" label="Site" orientation="horizontal" :items="topNav" />
        <ESelect class="site-scheme" bare aria-label="Colour scheme" :model-value="schemeChoice" :options="SCHEME_SELECT_OPTIONS" @update:model-value="chooseScheme($event as Choice)" />
        <EIconButton icon="menu" label="Menu" class="site-menu-button" @click="menuOpen = true" />
      </template>
    </EAppHeader>

    <HomePage v-if="isHome" id="main" />

    <div v-else class="site-body" :class="{ 'site-body--side': hasSidebar, 'site-body--outline': showOutline, 'site-body--wide': isWide }">
      <div v-if="hasSidebar" class="site-rail site-rail--side"><div class="site-side">
        <ENavList label="Pages" :sections="sections" />
      </div></div>
      <main id="main" class="site-main" tabindex="-1">
        <NotFoundPage v-if="page.isNotFound" @search="searching = true" />
        <template v-else>
          <article class="site-article vp-doc"><Content /></article>
          <nav v-if="pager.prev || pager.next" class="site-pager" aria-label="Previous and next page">
            <EButton v-if="pager.prev" variant="outline" icon="arrow-left" :href="pager.prev.href">{{ pager.prev.label }}</EButton>
            <EButton v-if="pager.next" variant="outline" :href="pager.next.href" class="site-pager-next">{{ pager.next.label }}</EButton>
          </nav>
        </template>
      </main>
      <div v-if="showOutline" class="site-rail site-rail--outline">
        <aside class="site-outline" aria-labelledby="site-outline-title">
          <p id="site-outline-title" class="site-outline-title">On this page</p>
          <ENavList label="On this page" :items="outline" />
        </aside>
      </div>
    </div>

    <EAppFooter>
      <div class="site-footer-about">
        <EText small muted class="site-footer-license">
          EOS is released under the
          <EDefinition label="Full text of the MIT license" title="MIT License" class="site-footer-term">
            <template #trigger>MIT license</template>
            <span v-for="p in license" :key="p" class="site-license">{{ p }}</span>
          </EDefinition>.
        </EText>
      </div>
      <nav class="site-footer-links" aria-label="Project">
        <ELink href="/changelog">Changelog</ELink>
        <ELink v-if="githubUrl" :href="githubUrl" external><GithubIcon class="site-footer-mark" />GitHub</ELink>
        <ELink href="https://npmx.dev/package/@eos-ui/vue" external><NpmxIcon class="site-footer-mark" />npmx</ELink>
      </nav>
    </EAppFooter>

    <EDrawer v-model:open="menuOpen" side="start" title="Menu">
      <ESegmented class="site-drawer-scheme" label="Colour scheme" :model-value="schemeChoice" :options="SCHEME_OPTIONS" @update:model-value="chooseScheme($event as Choice)" />
      <ENavList label="Site menu" :items="menuSplit.before" />
      <div v-if="hasSidebar" class="site-drawer-pages">
        <ENavList label="Pages" :sections="sections" />
      </div>
      <ENavList v-if="menuSplit.after.length" label="More of the site" :items="menuSplit.after" />
    </EDrawer>
    <SiteSearch v-if="searchLoaded" v-model:open="searching" />
  </div>
</template>
