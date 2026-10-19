<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, provide, reactive, ref } from "vue";
import {
  EAvatar,
  EBookingCard,
  EButton,
  EChip,
  EDataGrid,
  EDetailRow,
  EDisclosure,
  EHeading,
  EItemList,
  EItemRow,
  EMenu,
  ENavList,
  ENotice,
  EPageHeader,
  EPanel,
  ESelect,
  EStack,
  EStatementRow,
  ESurface,
  ESwitch,
  ETabs,
  EToast,
  ETextField,
  CONFIG_KEY,
  useConfig,
  type EosConfig,
} from "@eos-ui/vue";
import PresetPicker from "./playground/PresetPicker.vue";
import { applyPreset, applyRandom, build, initialState, variantProps } from "./playground/state";

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
  { label: "Home", href: "#home", current: true },
  { label: "Visits", href: "#visits" },
  { label: "Billing", href: "#billing" },
  { label: "Forms", href: "#forms" },
  { label: "Profile", href: "#profile" },
];
const outline = [
  { label: "To do", href: "#home-todo", current: true },
  { label: "Next visit", href: "#home-visit" },
  { label: "Billing", href: "#home-billing" },
  { label: "Profile", href: "#home-profile" },
];
const plan = ref("card");
const planOptions = [
  { value: "card", label: "Visa ending 4242" },
  { value: "bank", label: "Bank account ending 6789" },
];
const email = ref("ada@example.com");
const reminders = ref(true);
const autopay = ref(false);
const toast = ref<{ title: string; text: string } | null>({ title: "Payment received", text: "A receipt for $98.00 was sent to your email." });
function pay() {
  toast.value = { title: "Payment received", text: "A receipt for $162.40 was sent to your email." };
}
const accountMenu = [
  { label: "My profile", icon: "user" as const },
  { label: "Insurance and forms", icon: "form" as const },
  { label: "Statements and receipts", icon: "receipt" as const },
  { divider: true as const },
  { label: "Sign out" },
];
const provider = { name: "Dr. Amara Singh", role: "Primary care" };
const visitDate = new Date(2026, 9, 28);
const octoberDetails = [
  { label: "Charges", value: 242.4 },
  { label: "Insurance paid", value: -80 },
];
const receipts = [
  { id: "r1", name: "September statement", date: "Sep 24", status: "paid", amount: "$98.00" },
  { id: "r2", name: "Lab work", date: "Sep 3", status: "paid", amount: "$41.50" },
  { id: "r3", name: "August statement", date: "Aug 22", status: "paid", amount: "$120.50" },
];
const columns = [
  { key: "name", label: "Receipt" },
  { key: "date", label: "Paid" },
  { key: "status", label: "Status" },
  { key: "amount", label: "Amount", numeric: true },
];
const tone = { paid: "success", due: "info" } as const;
</script>

<template>
  <div class="eos-live home-demo">
    <section class="home-picker" aria-labelledby="home-picker-title">
      <EHeading id="home-picker-title" :level="2" class="home-picker-title">Make it yours</EHeading>
      <PresetPicker :model-value="state.preset" name="home-preset" @select="applyPreset(state, $event)" @random="applyRandom(state)" />
    </section>

    <div ref="frame" class="home-demo-frame e-root" :style="style">
      <header class="home-demo-header">
        <span class="home-demo-brand">Elm Street Health</span>
        <ENavList label="Patient portal" orientation="horizontal" :items="nav" :dense="vp.navDense" :class="['home-demo-nav', { 'home-demo-nav--dense': vp.navDense }]" />
        <EMenu label="Account" :items="accountMenu" align="end">
          <template #trigger>
            <EAvatar as="button" name="Ada Lovelace" small aria-label="AL, account menu" />
          </template>
        </EMenu>
      </header>

      <div :class="['home-demo-body', { 'home-demo-body--rail': state.variants.nav === 'outline' }]">
        <ETabs v-if="state.variants.nav === 'outline'" dense orientation="vertical" label="On this page" :items="outline" class="home-demo-outline" />
        <div class="home-demo-page" :style="{ gap: `var(--e-space-${vp.gap})` }">
          <EPageHeader title="Good morning, Ada" description="Three things need you before your visit on Oct 28." :heading-level="2">
            <template #actions>
              <EButton icon="lock" @click="pay">Pay $162.40</EButton>
              <EButton variant="outline" icon="calendar">Book a visit</EButton>
            </template>
          </EPageHeader>

          <ENotice tone="info" title="Clinic closed Nov 11">Messages sent that day are answered Nov 12.</ENotice>

          <div class="home-demo-cols" :style="{ gap: `var(--e-space-${vp.gap})` }">
            <EStack :gap="vp.gap">
              <EPanel id="home-todo" kicker="To do" title="Before your visit" :heading-level="3">
                <EItemList>
                  <EItemRow icon="form" title="Intake form" subtitle="Needed before Oct 28" status="action">
                    <template #action><EButton variant="outline">Review and sign</EButton></template>
                  </EItemRow>
                  <EItemRow icon="card" title="Update your insurance card" subtitle="Your plan changed Oct 1" status="pending">
                    <template #action><EButton variant="outline">Upload</EButton></template>
                  </EItemRow>
                  <EItemRow icon="receipt" title="October statement" subtitle="Due Oct 22" status="due">
                    <template #action><EButton @click="pay">Pay now</EButton></template>
                  </EItemRow>
                </EItemList>
              </EPanel>

              <EStack id="home-billing" :gap="vp.gap">
                <EHeading :level="3" class="home-demo-h">Statements and receipts</EHeading>
                <EStatementRow
                  title="October statement"
                  subtitle="Oct 1 to Oct 31"
                  status="due"
                  detail="Oct 22"
                  :amount="162.4"
                  amount-label="You owe"
                  :details="octoberDetails"
                  reason="Pay by Oct 22 to avoid a late fee."
                >
                  <template #actions><EButton @click="pay">Pay now</EButton></template>
                </EStatementRow>
              </EStack>

              <ESurface :pad="vp.pad" :tone="vp.tone">
                <EStack :gap="vp.gap">
                  <ESelect v-model="plan" label="Pay with" :options="planOptions" />
                  <ETextField v-model="email" label="Send my receipt to" type="email" autocomplete="email" />
                  <ESwitch v-model="autopay" label="Pay my balance automatically" />
                  <ESwitch v-model="reminders" label="Text reminders" />
                </EStack>
              </ESurface>
            </EStack>

            <EStack :gap="vp.gap">
              <EBookingCard id="home-visit" :date="visitDate" time="9:30 am" title="Annual check-up" :provider="provider" location="Elm Street Clinic" status="confirmed">
                <template #actions>
                  <EButton variant="outline">Reschedule</EButton>
                  <EButton variant="outline">Directions</EButton>
                </template>
              </EBookingCard>

              <EPanel id="home-profile" kicker="Profile" title="Insurance and contact" :heading-level="3">
                <EDetailRow label="Insurance" status="Verified" tone="success" @edit="() => {}">Blue Cross PPO, member XZ4471</EDetailRow>
                <EDetailRow label="Phone" @edit="() => {}">(555) 010-4471</EDetailRow>
                <EDetailRow label="Home address" @edit="() => {}">12 Elm Street, Springfield</EDetailRow>
              </EPanel>

              <div :class="['home-demo-disclosures', { 'home-demo-disclosures--card': vp.disclosure === 'card' }]">
                <EDisclosure :variant="vp.disclosure" title="What does this cover?" :meta="vp.disclosure === 'card' ? 'Oct' : undefined">Visits, labs and supplies from Oct 1 to Oct 31.</EDisclosure>
                <EDisclosure :variant="vp.disclosure" title="When is it due?" :meta="vp.disclosure === 'card' ? 'Oct 22' : undefined">Payment is due 21 days after the statement is sent.</EDisclosure>
              </div>
            </EStack>
          </div>

          <EStack :gap="vp.gap">
            <EHeading :level="3" class="home-demo-h">Recent receipts</EHeading>
            <EDataGrid :plain="vp.plain" caption="Recent receipts" :columns="columns" :rows="receipts">
              <template #cell-status="{ row }"><EChip :tone="tone[row.status as keyof typeof tone]" :variant="vp.badge">{{ row.status }}</EChip></template>
            </EDataGrid>
          </EStack>
        </div>
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
  --rail-width: 11rem;
  --toast-width: 22rem;
  position: relative;
  container-type: inline-size;
  overflow: hidden;
  border: var(--e-stroke-card) solid var(--e-border);
  border-radius: var(--e-radius-lg);
  background: var(--e-background);
  color: var(--e-ink);
  font-family: var(--e-font-sans);
  box-shadow: var(--e-shadow-md);
}

.home-demo-header {
  display: flex;
  align-items: center;
  gap: var(--e-space-4);
  padding: var(--e-space-2) var(--e-space-4);
  border-bottom: var(--e-stroke-hair) solid var(--e-border);
  background: var(--e-surface);
}

.home-demo-brand {
  font: 600 var(--e-text-lg) / 1 var(--e-font-sans);
  color: var(--e-primary);
}

.home-demo-nav {
  flex: 1;
  min-width: 0;
}

.home-demo-nav:not(.home-demo-nav--dense) :deep(.e-nav-item) {
  height: var(--site-tap);
  padding-inline: var(--e-space-3);
  font-size: var(--e-text-sm);
}

@media (max-width: 40rem) {
  .home-demo-nav {
    display: none;
  }

  .home-demo-brand {
    margin-inline-end: auto;
  }
}

.home-demo-page {
  display: grid;
  gap: var(--e-space-4);
  padding: var(--e-space-3) var(--e-space-4) var(--e-space-4);
}

.home-demo-body {
  display: grid;
  min-width: 0;
}

.home-demo-outline {
  padding: var(--e-space-3) var(--e-space-4) 0;
}

@media (min-width: 48rem) {
  .home-demo-body--rail {
    grid-template-columns: var(--rail-width) minmax(0, 1fr);
  }

  .home-demo-outline {
    padding: var(--e-space-4) 0 var(--e-space-4) var(--e-space-4);
  }
}

.home-demo-cols {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  align-items: start;
}

@container (min-width: 46rem) {
  .home-demo-cols {
    grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr);
  }
}

.home-demo-h {
  margin: 0;
}

.home-demo-toast {
  position: absolute;
  inset-block-end: var(--e-space-4);
  inset-inline-end: var(--e-space-4);
  inline-size: min(var(--toast-width), calc(100% - 2 * var(--e-space-4)));
}

.home-demo-page :deep(.e-pagehead) {
  margin-bottom: 0;
}
</style>
