<script setup lang="ts">
import { computed, defineAsyncComponent, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { Content, onContentUpdated, useData, useRoute } from "vitepress";
import { EAppFooter } from "@eos-ui/vue/components/EAppFooter";
import { EAppHeader } from "@eos-ui/vue/components/EAppHeader";
import { EButton } from "@eos-ui/vue/components/EButton";
import { EDefinition } from "@eos-ui/vue/components/EDefinition";
import { EDrawer } from "@eos-ui/vue/components/EDrawer";
import { EIconButton } from "@eos-ui/vue/components/EIconButton";
import { EKbd } from "@eos-ui/vue/components/EKbd";
import { EKicker } from "@eos-ui/vue/components/EKicker";
import { ELink } from "@eos-ui/vue/components/ELink";
import { ENavList } from "@eos-ui/vue/components/ENavList";
import { ESegmented } from "@eos-ui/vue/components/ESegmented";
import { ESelect } from "@eos-ui/vue/components/ESelect";
import { ESkipLink } from "@eos-ui/vue/components/ESkipLink";
import { EText } from "@eos-ui/vue/components/EText";
import { EVisuallyHidden } from "@eos-ui/vue/components/EVisuallyHidden";
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

// The outline is the page's h2s from its page data (markdown.headers), so it is in the server-rendered page. Only which one is current is worked out in the browser.
const headings = computed(() => ((page.value.headers ?? []) as { title: string; slug: string }[]).map((h) => ({ id: h.slug, text: h.title.replace(/​/g, "").trim() })));
const activeId = ref("");
const showOutline = computed(() => !isHome.value && !isWide.value && frontmatter.value.aside !== false && headings.value.length > 1);
const outline = computed<NavItem[]>(() => headings.value.map((h, i) => ({ label: h.text, href: `#${h.id}`, current: activeId.value ? h.id === activeId.value : i === 0 })));

// The current heading is the last one above a line 35% down the window, or the last heading once the page is scrolled to its end.
let spies: IntersectionObserver[] = [];
function spy() {
  for (const o of spies) o.disconnect();
  spies = [];
  activeId.value = "";
  if (!showOutline.value) return;
  const above = new Map<string, boolean>();
  let atEnd = false;
  const pick = () => {
    const ids = headings.value.map((h) => h.id);
    activeId.value = (atEnd ? ids.at(-1) : ids.filter((id) => above.get(id)).at(-1)) ?? ids[0] ?? "";
  };
  const lines = new IntersectionObserver(
    (entries) => {
      for (const e of entries) above.set(e.target.id, e.boundingClientRect.top < (e.rootBounds?.bottom ?? 0));
      pick();
    },
    { rootMargin: "0px 0px -65% 0px" },
  );
  const end = new IntersectionObserver(
    ([e]) => {
      atEnd = !!e?.isIntersecting && window.scrollY > 4;
      pick();
    },
    { threshold: 1 },
  );
  for (const h of headings.value) {
    const el = document.getElementById(h.id);
    if (el) lines.observe(el);
  }
  const footer = document.querySelector(".site > .e-appfooter");
  if (footer) end.observe(footer);
  spies = [lines, end];
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
  spy();
  showCurrent();
  window.addEventListener("keydown", onShortcut);
  const load = () => (searchLoaded.value = true);
  if ("requestIdleCallback" in window) searchIdle = window.requestIdleCallback(load, { timeout: 3000 });
  else searchIdle = window.setTimeout(load, 1000);
});
onBeforeUnmount(() => {
  for (const o of spies) o.disconnect();
  window.removeEventListener("keydown", onShortcut);
  if ("cancelIdleCallback" in window) window.cancelIdleCallback(searchIdle);
  else clearTimeout(searchIdle);
});
onContentUpdated(() =>
  nextTick(() => {
    spy();
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
    <EAppHeader sticky brand-label="EOS, home">
      <template #brand><BubbleTitle decorative /></template>
      <template #logo>
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
        <div class="site-outline">
          <EKicker class="site-outline-title" aria-hidden="true">On this page</EKicker>
          <ENavList label="On this page" :items="outline" />
        </div>
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
