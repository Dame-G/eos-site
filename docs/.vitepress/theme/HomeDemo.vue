<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, provide, reactive, ref } from "vue";
import {
  EActions,
  EAvatar,
  EBreadcrumb,
  EButton,
  ECalendar,
  EGrid,
  EHeading,
  EIcon,
  EInline,
  EKicker,
  EMenu,
  ENavList,
  ENotice,
  EPageHeader,
  EProgress,
  EStack,
  EStamp,
  EStepper,
  ESurface,
  EText,
  EToast,
  CONFIG_KEY,
  useConfig,
  useLocale,
  type EosConfig,
} from "@eos-ui/vue";
import PresetPicker from "./playground/PresetPicker.vue";
import { applyPreset, applyRandom, build, initialState, variantProps } from "./playground/state";

const { formatMoney } = useLocale();
const baseConfig = useConfig();
const config = reactive<EosConfig>({ ...baseConfig, portalTarget: "body" });
provide(CONFIG_KEY, config);
const frame = ref<HTMLElement | null>(null);
onMounted(() => (config.portalTarget = frame.value!));
onBeforeUnmount(() => (config.portalTarget = "body"));

const state = reactive(initialState());
const tokens = computed(() => build(state).theme.tokens as Record<string, string>);
const style = computed(() => Object.fromEntries(Object.entries(tokens.value).map(([k, v]) => [`--e-${k}`, v])));
const vp = computed(() => variantProps(state.variants));

const nav = [
  { label: "Overview", href: "#overview" },
  { label: "Projects", href: "#projects", current: true },
  { label: "Invoices", href: "#invoices", count: 2 },
  { label: "Calendar", href: "#calendar" },
];
const accountMenu = [
  { label: "My profile", icon: "user" as const },
  { label: "Invoices", icon: "receipt" as const },
  { divider: true as const },
  { label: "Sign out" },
];
const crumbs = [{ label: "Projects", href: "#projects" }, { label: "Brand refresh" }];

const steps = [
  { label: "Brief", state: "done" },
  { label: "Concepts", state: "done" },
  { label: "Review", state: "current" },
  { label: "Handoff", state: "upcoming" },
] as const;
const stepItems = [...steps];

const deliverables = [
  { name: "Logo suite", meta: "12 files · updated 2 hours ago", icon: "file" as const, tone: "success" as const, status: "Approved" },
  { name: "Brand guide", meta: "48 pages · updated yesterday", icon: "form" as const, tone: "warning" as const, status: "Needs review" },
  { name: "Social templates", meta: "8 files · Ada is working on it", icon: "file" as const, tone: "info" as const, status: "In progress" },
];

const marked = [new Date(2026, 9, 24), new Date(2026, 9, 31)];
const deadline = ref<Date | null>(null);

const toast = ref<{ title: string; text: string } | null>(null);
function remind() {
  toast.value = { title: "Reminder sent", text: "Harbor & Pine was nudged about invoice 0412." };
}
</script>

<template>
  <div class="eos-live home-demo">
    <section class="home-picker" aria-labelledby="home-picker-title">
      <EHeading id="home-picker-title" :level="2" class="home-picker-title">Make it yours</EHeading>
      <PresetPicker :model-value="state.preset" name="home-preset" @select="applyPreset(state, $event)" @random="applyRandom(state)" />
    </section>

    <div ref="frame" class="home-demo-frame e-root" :style="style">
      <header class="hd-top">
        <p class="hd-brand"><span class="hd-mark" aria-hidden="true" />Larkspur</p>
        <ENavList label="Studio" orientation="horizontal" :items="nav" class="hd-nav" />
        <EMenu label="Account" :items="accountMenu" align="end">
          <template #trigger>
            <EAvatar as="button" name="Ada Lovelace" small aria-label="AL, account menu" />
          </template>
        </EMenu>
      </header>

      <div class="hd-page" :style="{ gap: `var(--e-space-${vp.gap})` }">
        <EStack :gap="2">
          <EBreadcrumb :items="crumbs" />
          <EPageHeader title="Brand refresh" description="Harbor & Pine · due Nov 14" :heading-level="2">
            <template #actions>
              <EButton icon="plus">Add deliverable</EButton>
            </template>
          </EPageHeader>
        </EStack>

        <ENotice tone="warning" title="Brand guide needs your review">Approve it or request changes by Oct 24 to keep the Nov 14 handoff on track.</ENotice>

        <ESurface :pad="vp.pad">
          <EStepper label="Brand refresh progress" :steps="stepItems" />
        </ESurface>

        <EGrid masonry min="19rem" :gap="vp.gap">
          <ESurface as="section" :pad="vp.pad" aria-labelledby="hd-files">
            <EStack :gap="vp.gap">
              <EInline justify="between">
                <EHeading id="hd-files" :level="3" kicker="Review">Deliverables</EHeading>
                <EText small muted>3 of 8 done</EText>
              </EInline>
              <ul class="hd-files">
                <li v-for="d in deliverables" :key="d.name" class="hd-file">
                  <span class="hd-tile" aria-hidden="true"><EIcon :name="d.icon" /></span>
                  <div class="hd-file-main">
                    <p class="hd-file-name">{{ d.name }}</p>
                    <p class="hd-file-meta">{{ d.meta }}</p>
                  </div>
                  <EStamp :tone="d.tone" :label="d.status" size="sm" />
                </li>
              </ul>
            </EStack>
          </ESurface>

          <ESurface as="section" :pad="vp.pad" aria-labelledby="hd-bill">
            <EStack :gap="vp.gap">
              <EInline justify="between">
                <EHeading id="hd-bill" :level="3" kicker="Invoice 0412">Billing</EHeading>
                <EStamp status="due" detail="Oct 31" size="sm" />
              </EInline>
              <EStack :gap="1">
                <EKicker>Outstanding</EKicker>
                <p class="site-figure">{{ formatMoney(4820) }}</p>
              </EStack>
              <EProgress label="Paid so far" :value="39" :value-text="`${formatMoney(3100)} of ${formatMoney(7920)}`" />
              <EActions><EButton variant="secondary" @click="remind">Send reminder</EButton></EActions>
            </EStack>
          </ESurface>

          <ESurface as="section" :pad="vp.pad" aria-labelledby="hd-cal">
            <EStack :gap="vp.gap">
              <EHeading id="hd-cal" :level="3" kicker="Calendar">Milestones</EHeading>
              <ECalendar v-model="deadline" :marked="marked" mark-label="Milestone" />
            </EStack>
          </ESurface>
        </EGrid>
      </div>

      <div v-if="toast" class="home-demo-toast">
        <EToast tone="success" :title="toast.title" @close="toast = null">{{ toast.text }}</EToast>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-demo {
  display: contents;
}

.home-picker {
  display: grid;
  gap: var(--e-space-3);
  min-width: 0;
}

.home-picker-title {
  margin: 0;
}

.home-demo-frame {
  --toast-width: 22rem;
  position: relative;
  container-type: inline-size;
  overflow: hidden;
  border: var(--e-stroke-card) solid var(--e-border);
  border-radius: var(--e-radius-lg);
  background: var(--e-surface);
  color: var(--e-ink);
  font-family: var(--e-font-sans);
  box-shadow: 0 1px 2px rgb(0 0 0 / 0.04), 0 6px 16px -6px rgb(0 0 0 / 0.08);
}

.hd-top {
  display: flex;
  align-items: center;
  gap: var(--e-space-4);
  padding: var(--e-space-2) var(--e-space-4);
  border-bottom: var(--e-stroke-hair) solid var(--e-border);
  background: var(--e-surface);
}

.hd-brand {
  display: flex;
  align-items: center;
  gap: var(--e-space-2);
  margin: 0;
  font: 600 var(--e-text-lg) / 1 var(--e-font-sans);
  color: var(--e-ink);
}

.hd-mark {
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 58% 42% 52% 48% / 46% 56% 44% 54%;
  background: var(--e-primary);
}

.hd-nav {
  flex: 1;
  min-width: 0;
}

@media (max-width: 40rem) {
  .hd-nav {
    display: none;
  }

  .hd-brand {
    margin-inline-end: auto;
  }
}

.hd-page {
  display: grid;
  min-width: 0;
  padding: var(--e-space-4);
}

@container (min-width: 46rem) {
  .hd-page {
    padding: var(--e-space-6);
  }
}

.hd-files {
  display: grid;
  margin: 0;
  padding: 0;
  list-style: none;
}

.hd-file {
  display: flex;
  align-items: center;
  gap: var(--e-space-3);
  padding: var(--e-space-3) 0;
}

.hd-file + .hd-file {
  border-top: var(--e-stroke-hair) solid var(--e-border);
}

.hd-tile {
  display: grid;
  flex: none;
  place-items: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: var(--e-radius-md);
  background: color-mix(in srgb, var(--e-primary) 12%, var(--e-surface));
  color: var(--e-primary);
}

.hd-file-main {
  flex: 1;
  min-width: 0;
}

.hd-file-name,
.hd-file-meta {
  margin: 0;
}

.hd-file-name {
  font: 500 var(--e-text-md) / 1.3 var(--e-font-sans);
}

.hd-file-meta {
  color: var(--e-muted);
  font: 400 var(--e-text-sm) / 1.4 var(--e-font-sans);
}

.home-demo-toast {
  position: absolute;
  inset-block-end: var(--e-space-4);
  inset-inline-end: var(--e-space-4);
  inline-size: min(var(--toast-width), calc(100% - 2 * var(--e-space-4)));
}

.hd-page :deep(.e-pagehead) {
  margin-bottom: 0;
}
</style>
