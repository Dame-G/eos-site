<script setup lang="ts">
import { computed, ref } from "vue";
import type { Theme } from "@eos-ui/tokens";
import { EButton } from "@eos-ui/vue/components/EButton";
import { ECalendar } from "@eos-ui/vue/components/ECalendar";
import { ECheckbox } from "@eos-ui/vue/components/ECheckbox";
import { EConfigProvider } from "@eos-ui/vue/components/EConfigProvider";
import { EDataGrid } from "@eos-ui/vue/components/EDataGrid";
import { EDefinition } from "@eos-ui/vue/components/EDefinition";
import { EDialog } from "@eos-ui/vue/components/EDialog";
import { EDisclosure } from "@eos-ui/vue/components/EDisclosure";
import { EHeading } from "@eos-ui/vue/components/EHeading";
import { EIconButton } from "@eos-ui/vue/components/EIconButton";
import { EInline } from "@eos-ui/vue/components/EInline";
import { EKicker } from "@eos-ui/vue/components/EKicker";
import { ELink } from "@eos-ui/vue/components/ELink";
import { EMenu } from "@eos-ui/vue/components/EMenu";
import { EMetric } from "@eos-ui/vue/components/EMetric";
import { ENavList } from "@eos-ui/vue/components/ENavList";
import { ENotice } from "@eos-ui/vue/components/ENotice";
import { ENumberField } from "@eos-ui/vue/components/ENumberField";
import { EPagination } from "@eos-ui/vue/components/EPagination";
import { EProgress } from "@eos-ui/vue/components/EProgress";
import { ERadioGroup } from "@eos-ui/vue/components/ERadioGroup";
import { ESegmented } from "@eos-ui/vue/components/ESegmented";
import { ESelect } from "@eos-ui/vue/components/ESelect";
import { EStack } from "@eos-ui/vue/components/EStack";
import { EStamp } from "@eos-ui/vue/components/EStamp";
import { EStepper } from "@eos-ui/vue/components/EStepper";
import { ESurface } from "@eos-ui/vue/components/ESurface";
import { ESwitch } from "@eos-ui/vue/components/ESwitch";
import { ETabs } from "@eos-ui/vue/components/ETabs";
import { EText } from "@eos-ui/vue/components/EText";
import { ETextField } from "@eos-ui/vue/components/ETextField";
import { ETooltip } from "@eos-ui/vue/components/ETooltip";
import { variantProps } from "./build";
import { DEFAULT_VARIANTS, type Variants } from "./model";
import { stopPlaceholderLinks } from "../placeholder-links";

const props = withDefaults(defineProps<{ theme: Theme; locale: string; currency: string; variants?: Variants }>(), { variants: () => ({ ...DEFAULT_VARIANTS }) });

const vp = computed(() => variantProps(props.variants));

const currencyFormat = computed(() => new Intl.NumberFormat(props.locale, { style: "currency", currency: props.currency }));
const money = (n: unknown) => currencyFormat.value.format(Number(n));

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

const SCENES = [
  { value: "overview", label: "Overview" },
  { value: "actions", label: "Actions" },
  { value: "forms", label: "Forms" },
  { value: "feedback", label: "Feedback" },
  { value: "navigation", label: "Navigation" },
  { value: "data", label: "Data" },
  { value: "overlays", label: "Overlays" },
  { value: "type", label: "Type" },
];
const scene = ref("overview");
</script>

<template>
  <!-- The scenes' links are stand-ins (#preview): following one would replace the theme the address holds. -->
  <div class="pv vp-raw" @click="stopPlaceholderLinks">
    <ESelect v-model="scene" class="pv-scene" bare label="Scene" :options="SCENES" />
    <EConfigProvider :theme="theme" :locale="locale" :currency="currency">
      <ESurface class="pv-wrap">
        <EStack v-if="scene === 'overview'" :gap="vp.gap">
          <EHeading :level="2" kicker="A bill, the way a page would use it">Overview</EHeading>
          <EStack :gap="vp.gap">
            <EInline justify="between">
              <EHeading :level="2" kicker="Oct 1 to Oct 31">October statement</EHeading>
              <EStamp status="due" detail="Oct 22" />
            </EInline>
            <EMetric label="You owe" :value="money(162.4)" :help="`Insurance paid ${money(80)}`" />
            <ENotice tone="info" title="Your visit is Thursday">Main office, 9:30 am.</ENotice>
            <ESelect v-model="plan" label="Pay with" :options="planOptions" />
            <EInline :gap="vp.inlineGap">
              <EButton icon="lock">Pay {{ money(162.4) }}</EButton>
              <EButton variant="outline">Download PDF</EButton>
            </EInline>
            <EText size="sm">Questions about a charge? <ELink href="#preview">Read how billing works</ELink>.</EText>
          </EStack>
        </EStack>

        <EStack v-else-if="scene === 'actions'" :gap="vp.gap">
          <EHeading :level="2" kicker="Buttons, menus and links">Actions</EHeading>
          <EStack :gap="vp.gap">
            <EKicker>Variants</EKicker>
            <EInline :gap="vp.inlineGap">
              <EButton icon="lock">Pay {{ money(162.4) }}</EButton>
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
                Split your balance of {{ money(162.4) }} into equal monthly payments. There is no interest and no fee.
                <template #actions><EButton variant="outline">Set up a plan</EButton></template>
              </EDefinition>
            </EInline>
            <EText size="sm">Questions about a charge? <ELink href="#preview">Read how billing works</ELink>.</EText>
          </EStack>
        </EStack>

        <EStack v-else-if="scene === 'forms'" :gap="vp.gap">
          <EHeading :level="2" kicker="Fields and choices">Forms</EHeading>
          <EStack :gap="vp.gap">
            <ETextField v-model="email" label="Email" type="email" error="Enter an email address like name@example.com" />
            <ESelect v-model="plan" label="Pay with" :options="planOptions" />
            <ENumberField v-model="copies" label="Copies" :min="1" :max="9" />
            <ESegmented v-model="view" label="View" :options="[{ value: 'month', label: 'Month' }, { value: 'week', label: 'Week' }, { value: 'day', label: 'Day' }]" />
          </EStack>
          <EStack :gap="vp.gap">
            <ECheckbox v-model="agree" label="Keep me signed in" description="On this device only." />
            <ESwitch v-model="reminders" label="Text reminders" />
            <ERadioGroup
              v-model="method"
              label="How much would you like to pay?"
              :options="[
                { value: 'full', label: 'The full balance', description: money(162.4) },
                { value: 'part', label: 'Another amount' },
              ]"
            />
          </EStack>
        </EStack>

        <EStack v-else-if="scene === 'feedback'" :gap="vp.gap">
          <EHeading :level="2" kicker="Status, notices and progress">Feedback</EHeading>
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
          <EStack :gap="vp.gap">
            <EKicker>Notices</EKicker>
            <ENotice tone="info" title="Your visit is Thursday">Main office, 9:30 am.</ENotice>
            <ENotice tone="success" title="Payment received">We emailed your receipt.</ENotice>
            <ENotice tone="warning" title="Form due">Please sign before Oct 22.</ENotice>
            <ENotice tone="danger" title="Card declined">Try another card.</ENotice>
          </EStack>
          <EStack :gap="vp.gap">
            <EKicker>Motion</EKicker>
            <EProgress label="Uploading" :value="progress" />
            <EInline :gap="vp.inlineGap">
              <EButton variant="outline" @click="progress = progress > 50 ? 15 : 90">Replay</EButton>
            </EInline>
          </EStack>
        </EStack>

        <EStack v-else-if="scene === 'navigation'" :gap="vp.gap">
          <EHeading :level="2" kicker="Moving around">Navigation</EHeading>
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
              <template #panel="{ item }"><EText size="sm" tone="neutral">{{ item.label }} panel.</EText></template>
            </ETabs>
            <EStepper :steps="steps" label="Checkout" />
            <EPagination v-model="page" :page-count="6" aria-label="Visit pages" />
          </EStack>
          <EStack :gap="vp.gap">
            <EDisclosure title="What does this cover?">Visits, labs and supplies from Oct 1 to Oct 31.</EDisclosure>
            <EDisclosure title="When is it due?">Payment is due 21 days after the statement is sent.</EDisclosure>
          </EStack>
        </EStack>

        <EStack v-else-if="scene === 'data'" :gap="vp.gap">
          <EHeading :level="2" kicker="Tables and dates">Data</EHeading>
          <EDataGrid caption="Statements" :columns="columns" :rows="rows" searchable selectable :page-size="4">
            <template #cell-status="{ row }">
              <EStamp :tone="tone[row.status as keyof typeof tone]" size="sm">{{ row.status }}</EStamp>
            </template>
            <template #cell-amount="{ value }">{{ money(value) }}</template>
          </EDataGrid>
          <ECalendar v-model="day" :month="day" :footer="false" />
        </EStack>

        <EStack v-else-if="scene === 'overlays'" :gap="vp.gap">
          <EHeading :level="2" kicker="Dialogs and floating layers">Overlays</EHeading>
          <EStack :gap="vp.gap">
            <EButton variant="outline" @click="dialogOpen = !dialogOpen">{{ dialogOpen ? "Hide" : "Show" }} dialog</EButton>
            <EDialog v-if="dialogOpen" v-model:open="dialogOpen" inline title="Remove this card?">
              Visa ending 4242 will no longer be available for payments.
              <template #actions>
                <EButton variant="danger">Remove card</EButton>
                <EButton variant="outline" @click="dialogOpen = false">Keep it</EButton>
              </template>
            </EDialog>
            <ESurface variant="raised" size="sm"><EText size="sm">A floating surface: menus, lists and toasts.</EText></ESurface>
            <EInline :gap="vp.inlineGap">
              <EMenu label="More" :items="menuItems" />
              <ETooltip label="Help"><EIconButton icon="info" label="Help" /></ETooltip>
            </EInline>
          </EStack>
        </EStack>

        <EStack v-else-if="scene === 'type'" :gap="vp.gap">
          <EHeading :level="2" kicker="Headings and text">Type</EHeading>
          <EStack :gap="vp.gap">
            <EHeading :level="1">Your account</EHeading>
            <EHeading :level="2">Upcoming visits</EHeading>
            <EHeading :level="3">Visit on Oct 2</EHeading>
            <EText size="lg">Your balance is due November 1.</EText>
            <EText>Pay online in about a minute. Receipts are emailed the same day.</EText>
            <EText size="sm" tone="neutral">Statement 4471, sent Oct 14</EText>
            <EKicker>History</EKicker>
          </EStack>
        </EStack>
      </ESurface>
    </EConfigProvider>
  </div>
</template>

<style scoped>
.pv {
  display: grid;
  gap: var(--e-space-3);
  min-width: 0;
}
.pv-scene {
  justify-self: start;
  min-width: 12rem;
}
/* The preview is a library card, so its edge and shadow follow the theme's elevation like any other card. */
.pv-wrap {
  min-width: 0;
}
</style>
