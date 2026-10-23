<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import ThemedScope from "./ThemedScope.vue";
import {
  EButton,
  ECalendar,
  ECheckbox,
  EDataGrid,
  EDefinition,
  EDialog,
  EDisclosure,
  EHeading,
  EIconButton,
  EInline,
  EKicker,
  ELink,
  EMenu,
  EMetric,
  ENavList,
  ENotice,
  ENumberField,
  EPagination,
  EProgress,
  ERadioGroup,
  ESegmented,
  ESelect,
  EStack,
  EStamp,
  EStepper,
  ESurface,
  ESwitch,
  ETabs,
  EText,
  ETextField,
  ETooltip,
} from "@eos-ui/vue";
import { variantProps } from "./build";
import { DEFAULT_VARIANTS, type Variants } from "./model";

const props = withDefaults(defineProps<{ tokens: Record<string, string>; locale: string; currency: string; variants?: Variants }>(), { variants: () => ({ ...DEFAULT_VARIANTS }) });

const vp = computed(() => variantProps(props.variants));

const money = computed(() => new Intl.NumberFormat(props.locale, { style: "currency", currency: props.currency }).format(162.4));
const formatMoney = (n: number) => new Intl.NumberFormat(props.locale, { style: "currency", currency: props.currency }).format(n);

const email = ref("name@");
const plan = ref("card");
const agree = ref(true);
const method = ref("full");
const reminders = ref(true);
const view = ref("month");
const copies = ref<number | null>(2);
const day = ref(new Date(2026, 9, 22));
const tab = ref("overview");
const page = ref(2);
const progress = ref(35);
const dialogOpen = ref(true);
const planOptions = [
  { value: "card", label: "Visa ending 4242" },
  { value: "bank", label: "Bank account ending 6789" },
  { value: "cash", label: "Cash at the office" },
];
const menuItems = [
  { label: "Download PDF", icon: "download" as const },
  { label: "Share" },
  { divider: true as const },
  { label: "Remove", danger: true },
];
const steps = [
  { label: "Details", state: "done" as const },
  { label: "Payment", state: "current" as const },
  { label: "Receipt", state: "upcoming" as const },
];
const rows = [
  { id: "4471", name: "October statement", date: "Oct 14", status: "due", amount: 162.4 },
  { id: "4470", name: "September statement", date: "Sep 14", status: "paid", amount: 98 },
  { id: "4469", name: "August statement", date: "Aug 14", status: "paid", amount: 120.5 },
  { id: "4468", name: "July statement", date: "Jul 14", status: "overdue", amount: 45 },
  { id: "4467", name: "June statement", date: "Jun 14", status: "paid", amount: 210 },
];
const columns = [
  { key: "name", label: "Statement", sortable: true },
  { key: "date", label: "Sent", sortable: true },
  { key: "status", label: "Status" },
  { key: "amount", label: "Amount", numeric: true, sortable: true },
];
const navItems = [
  { label: "Overview", href: "#preview", current: true },
  { label: "Statements", href: "#preview" },
  { label: "Visits", href: "#preview" },
  { label: "Forms", href: "#preview" },
];
const tone = { paid: "success", due: "info", overdue: "danger" } as const;
const fmt = (n: unknown) => new Intl.NumberFormat(props.locale, { style: "currency", currency: props.currency }).format(Number(n));

const sceneItems = [
  { id: "overview", label: "Overview" },
  { id: "actions", label: "Actions" },
  { id: "forms", label: "Forms" },
  { id: "feedback", label: "Feedback" },
  { id: "navigation", label: "Navigation" },
  { id: "data", label: "Data" },
  { id: "overlays", label: "Overlays" },
  { id: "type", label: "Type" },
];
const scene = ref("overview");

/** The scene list sits beside the scene, on its right, when there is room, above it when there is not. */
const wrap = ref<HTMLElement | null>(null);
const narrow = ref(false);
let watcher: ResizeObserver | undefined;
onMounted(() => {
  watcher = new ResizeObserver(([entry]) => (narrow.value = entry!.contentRect.width < 576));
  if (wrap.value) watcher.observe(wrap.value);
});
onBeforeUnmount(() => watcher?.disconnect());
</script>

<template>
  <ThemedScope :tokens="tokens" :locale="locale" :currency="currency">
    <div ref="wrap" class="pv-wrap">
      <ETabs v-model="scene" :items="sceneItems" :orientation="narrow ? 'horizontal' : 'vertical'" side="start" class="pv">
          <template #overview>
            <EStack :gap="vp.gap">
              <EHeading :level="2" kicker="A bill, the way a page would use it">Overview</EHeading>
            <EStack :gap="vp.gap">
              <EStack :gap="vp.gap">
                <EInline justify="between">
                  <EHeading :level="2" kicker="Oct 1 to Oct 31">October statement</EHeading>
                  <EStamp status="due" detail="Oct 22" />
                </EInline>
                <EMetric label="You owe" :value="formatMoney(162.4)" :help="`Insurance paid ${formatMoney(80)}`" />
                <ENotice tone="info" title="Your visit is Thursday">Main office, 9:30 am.</ENotice>
                <ESelect v-model="plan" label="Pay with" :options="planOptions" />
                <EInline :gap="vp.inlineGap">
                  <EButton icon="lock">Pay {{ money }}</EButton>
                  <EButton variant="outline">Download PDF</EButton>
                </EInline>
                <EText small>Questions about a charge? <ELink href="#preview">Read how billing works</ELink>.</EText>
              </EStack>
            </EStack>
            </EStack>
          </template>

          <template #actions>
            <EStack :gap="vp.gap">
              <EHeading :level="2" kicker="Buttons, menus and links">Actions</EHeading>
            <EStack :gap="vp.gap">
              <EStack :gap="vp.gap">
                <EKicker>Variants</EKicker>
                <EInline :gap="vp.inlineGap">
                  <EButton icon="lock">Pay {{ money }}</EButton>
                  <EButton variant="secondary">Confirm</EButton>
                  <EButton variant="outline">Cancel</EButton>
                  <EButton variant="danger">Remove</EButton>
                  <EButton variant="quiet">Skip</EButton>
                </EInline>
                <EKicker>States</EKicker>
                <EInline :gap="vp.inlineGap">
                  <EButton disabled>Disabled</EButton>
                  <EButton loading>Paying</EButton>
                </EInline>
                <EKicker>Menus and help</EKicker>
                <EInline :gap="vp.inlineGap">
                  <EMenu label="More" :items="menuItems" />
                  <ETooltip label="Help"><EIconButton icon="info" label="Help" /></ETooltip>
                  <EDefinition label="About payment plans" title="Payment plan">
                    <template #trigger>What is a payment plan?</template>
                    Split your balance of {{ formatMoney(162.4) }} into equal monthly payments. There is no interest and no fee.
                    <template #actions><EButton variant="outline">Set up a plan</EButton></template>
                  </EDefinition>
                </EInline>
                <EText small>Questions about a charge? <ELink href="#preview">Read how billing works</ELink>.</EText>
              </EStack>
            </EStack>
            </EStack>
          </template>

          <template #forms>
            <EStack :gap="vp.gap">
              <EHeading :level="2" kicker="Fields and choices">Forms</EHeading>
            <EStack :gap="vp.gap">
              <EStack :gap="vp.gap">
                <ETextField v-model="email" label="Email" type="email" error="Enter an email address like name@example.com" />
                <ESelect v-model="plan" label="Pay with" :options="planOptions" />
                <ENumberField v-model="copies" label="Copies" :min="1" :max="9" />
                <ESegmented v-model="view" label="View" :options="[{ value: 'month', label: 'Month' }, { value: 'week', label: 'Week' }, { value: 'day', label: 'Day' }]" />
              </EStack>
            </EStack>
            <EStack :gap="vp.gap">
              <EStack :gap="vp.gap">
                <ECheckbox v-model="agree" label="Keep me signed in" description="On this device only." />
                <ESwitch v-model="reminders" label="Text reminders" />
                <ERadioGroup
                  v-model="method"
                  label="How much would you like to pay?"
                  :options="[
                    { value: 'full', label: 'The full balance', description: money },
                    { value: 'part', label: 'Another amount' },
                  ]"
                />
              </EStack>
            </EStack>
            </EStack>
          </template>

          <template #feedback>
            <EStack :gap="vp.gap">
              <EHeading :level="2" kicker="Status, notices and progress">Feedback</EHeading>
            <EStack :gap="vp.gap">
              <EStack :gap="vp.gap">
                <EKicker>Stamps</EKicker>
                <EInline :gap="vp.inlineGap">
                  <EStamp status="paid" />
                  <EStamp status="due" detail="Nov 1" />
                  <EStamp status="action" />
                  <EStamp status="overdue" />
                </EInline>
                <EInline :gap="vp.inlineGap">
                  <EStamp size="sm">Draft</EStamp>
                  <EStamp tone="success" size="sm">Paid</EStamp>
                  <EStamp tone="info" size="sm">Scheduled</EStamp>
                  <EStamp tone="warning" size="sm">Review</EStamp>
                  <EStamp tone="danger" size="sm">Failed</EStamp>
                </EInline>
              </EStack>
            </EStack>
            <EStack :gap="vp.gap">
              <EStack :gap="vp.gap">
                <EKicker>Notices</EKicker>
                <ENotice tone="info" title="Your visit is Thursday">Main office, 9:30 am.</ENotice>
                <ENotice tone="success" title="Payment received">We emailed your receipt.</ENotice>
                <ENotice tone="warning" title="Form due">Please sign before Oct 22.</ENotice>
                <ENotice tone="danger" title="Card declined">Try another card.</ENotice>
              </EStack>
            </EStack>
            <EStack :gap="vp.gap">
              <EStack :gap="vp.gap">
                <EKicker>Motion</EKicker>
                <EProgress label="Uploading" :value="progress" />
                <EInline :gap="vp.inlineGap">
                  <EButton variant="outline" @click="progress = progress > 50 ? 15 : 90">Replay</EButton>
                </EInline>
              </EStack>
            </EStack>
            </EStack>
          </template>

          <template #navigation>
            <EStack :gap="vp.gap">
              <EHeading :level="2" kicker="Moving around">Navigation</EHeading>
            <EStack :gap="vp.gap">
              <EStack :gap="vp.gap">
                <ENavList label="Account sections" :items="navItems" />
                <ETabs
                  v-model="tab"
                  :items="[
                    { id: 'overview', label: 'Overview' },
                    { id: 'history', label: 'History', count: 3 },
                    { id: 'settings', label: 'Settings' },
                  ]"
                >
                  <template #panel="{ item }"><EText small muted>{{ item.label }} panel.</EText></template>
                </ETabs>
                <EStepper :steps="steps" label="Checkout" />
                <EPagination v-model="page" :page-count="6" aria-label="Visit pages" />
              </EStack>
            </EStack>
            <EStack :gap="vp.gap">
              <div :class="['pv-disclosures', { 'pv-disclosures--card': vp.disclosure === 'card' }]">
                <EDisclosure title="What does this cover?">Visits, labs and supplies from Oct 1 to Oct 31.</EDisclosure>
                <EDisclosure title="When is it due?">Payment is due 21 days after the statement is sent.</EDisclosure>
              </div>
            </EStack>
            </EStack>
          </template>

          <template #data>
            <EStack :gap="vp.gap">
              <EHeading :level="2" kicker="Tables and dates">Data</EHeading>
            <EStack :gap="vp.gap">
              <EDataGrid caption="Statements" :columns="columns" :rows="rows" searchable selectable :page-size="4">
                <template #cell-status="{ row }">
                  <EStamp :tone="tone[row.status as keyof typeof tone]" size="sm">{{ row.status }}</EStamp>
                </template>
                <template #cell-amount="{ value }">{{ fmt(value) }}</template>
              </EDataGrid>
            </EStack>
            <EStack :gap="vp.gap">
              <ECalendar v-model="day" :month="day" :footer="false" />
            </EStack>
            </EStack>
          </template>

          <template #overlays>
            <EStack :gap="vp.gap">
              <EHeading :level="2" kicker="Dialogs and floating layers">Overlays</EHeading>
            <EStack :gap="vp.gap">
              <EStack :gap="vp.gap">
                <EButton variant="outline" @click="dialogOpen = !dialogOpen">{{ dialogOpen ? "Hide" : "Show" }} dialog</EButton>
                <EDialog v-if="dialogOpen" v-model:open="dialogOpen" inline title="Remove this card?">
                  Visa ending 4242 will no longer be available for payments.
                  <template #actions>
                    <EButton variant="danger">Remove card</EButton>
                    <EButton variant="outline" @click="dialogOpen = false">Keep it</EButton>
                  </template>
                </EDialog>
                <ESurface raised small><EText small>A floating surface: menus, lists and toasts.</EText></ESurface>
                <EInline :gap="vp.inlineGap">
                  <EMenu label="More" :items="menuItems" />
                  <ETooltip label="Help"><EIconButton icon="info" label="Help" /></ETooltip>
                </EInline>
              </EStack>
            </EStack>
            </EStack>
          </template>

          <template #type>
            <EStack :gap="vp.gap">
              <EHeading :level="2" kicker="Headings and text">Type</EHeading>
            <EStack :gap="vp.gap">
              <EStack :gap="vp.gap">
                <EHeading :level="1">Your account</EHeading>
                <EHeading :level="2">Upcoming visits</EHeading>
                <EHeading :level="3">Visit on Oct 2</EHeading>
                <EText large>Your balance is due November 1.</EText>
                <EText>Pay online in about a minute. Receipts are emailed the same day.</EText>
                <EText small muted>Statement 4471, sent Oct 14</EText>
                <EKicker>History</EKicker>
              </EStack>
            </EStack>
            </EStack>
          </template>
      </ETabs>
    </div>
  </ThemedScope>
</template>

<style scoped>
.pv-wrap {
  min-width: 0;
  padding: var(--e-space-4);
  border: var(--e-stroke-card) solid var(--e-border);
  border-radius: var(--e-radius-md);
  background: var(--e-surface);
  color: var(--e-ink);
}
</style>
