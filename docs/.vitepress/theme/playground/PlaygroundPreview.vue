<script setup lang="ts">
import { computed, ref } from "vue";
import ThemedScope from "./ThemedScope.vue";
import {
  EButton,
  ECalendar,
  ECheckbox,
  EChip,
  EDataGrid,
  EDialog,
  EDisclosure,
  EHeading,
  EIconButton,
  EInline,
  EKicker,
  ELink,
  EMenu,
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
  EStatementCard,
  EStepper,
  ESurface,
  ESwitch,
  ETabs,
  EText,
  ETextField,
  ETooltip,
} from "@eos-ui/vue";
import { DEFAULT_VARIANTS, variantProps, type Variants } from "./state";

const props = withDefaults(defineProps<{ tokens: Record<string, string>; locale: string; currency: string; variants?: Variants }>(), { variants: () => ({ ...DEFAULT_VARIANTS }) });

const vp = computed(() => variantProps(props.variants));

const money = computed(() => new Intl.NumberFormat(props.locale, { style: "currency", currency: props.currency }).format(162.4));

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
</script>

<template>
  <ThemedScope :tokens="tokens" :locale="locale" :currency="currency">
    <div class="pv-cols">
      <ESurface :pad="vp.pad" :tone="vp.tone" class="pv-card">
        <EStack :gap="vp.gap">
          <EKicker>Actions</EKicker>
          <EInline :gap="vp.inlineGap">
            <EButton icon="lock">Pay {{ money }}</EButton>
            <EButton variant="secondary">Confirm</EButton>
            <EButton variant="outline">Cancel</EButton>
            <EButton variant="danger">Remove</EButton>
            <EButton variant="quiet">Skip</EButton>
            <EButton disabled>Disabled</EButton>
            <EMenu label="More" :items="menuItems" />
            <ETooltip label="Help"><EIconButton icon="info" label="Help" /></ETooltip>
          </EInline>
          <EText variant="small">Questions about a charge? <ELink href="#preview">Read how billing works</ELink>.</EText>
        </EStack>
      </ESurface>

      <ESurface :pad="vp.pad" :tone="vp.tone" class="pv-card">
        <EStack :gap="vp.gap">
          <EKicker>Fields</EKicker>
          <ETextField v-model="email" label="Email" type="email" error="Enter an email address like name@example.com" />
          <ESelect v-model="plan" label="Pay with" :options="planOptions" />
          <ENumberField v-model="copies" label="Copies" :min="1" :max="9" />
          <ESegmented v-model="view" label="View" :options="[{ value: 'month', label: 'Month' }, { value: 'week', label: 'Week' }, { value: 'day', label: 'Day' }]" />
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
      </ESurface>

      <EStatementCard class="pv-card"
        title="October statement"
        :heading-level="2"
        subtitle="Oct 1 to Oct 31"
        status="due"
        detail="Oct 22"
        :amount="162.4"
        amount-label="You owe"
        :details="[{ label: 'Insurance paid', value: 80 }]"
        reason="Your balance is due October 22. Pay online in about a minute."
      />

      <ESurface :pad="vp.pad" :tone="vp.tone" class="pv-card">
        <EStack :gap="vp.gap">
          <EKicker>Status</EKicker>
          <EInline :gap="vp.inlineGap">
            <EStamp status="paid" :variant="vp.badge" />
            <EStamp status="due" detail="Nov 1" :variant="vp.badge" />
            <EStamp status="action" :variant="vp.badge" />
            <EStamp status="overdue" :variant="vp.badge" />
          </EInline>
          <EInline :gap="vp.inlineGap">
            <EChip :variant="vp.badge">Draft</EChip>
            <EChip tone="success" :variant="vp.badge">Paid</EChip>
            <EChip tone="info" :variant="vp.badge">Scheduled</EChip>
            <EChip tone="warning" :variant="vp.badge">Review</EChip>
            <EChip tone="danger" :variant="vp.badge">Failed</EChip>
          </EInline>
          <ENotice tone="info" title="Your visit is Thursday">Main office, 9:30 am.</ENotice>
          <ENotice tone="success" title="Payment received">We emailed your receipt.</ENotice>
          <ENotice tone="warning" title="Form due">Please sign before Oct 22.</ENotice>
          <ENotice tone="danger" title="Card declined">Try another card.</ENotice>
        </EStack>
      </ESurface>

      <ESurface :pad="vp.pad" :tone="vp.tone" class="pv-card">
        <EStack :gap="vp.gap">
          <EKicker>Motion</EKicker>
          <EProgress label="Uploading" :value="progress" />
          <EInline :gap="vp.inlineGap">
            <EButton variant="outline" @click="progress = progress > 50 ? 15 : 90">Replay</EButton>
          </EInline>
          <EKicker>Calendar</EKicker>
          <ECalendar v-model="day" :month="day" :footer="false" />
        </EStack>
      </ESurface>

      <ESurface :pad="vp.pad" :tone="vp.tone" class="pv-card">
        <EStack :gap="vp.gap">
          <EKicker>Type</EKicker>
          <EHeading :level="1">Your account</EHeading>
          <EHeading :level="2">Upcoming visits</EHeading>
          <EHeading :level="3">Visit on Oct 2</EHeading>
          <EText variant="deck">Your balance is due November 1.</EText>
          <EText>Pay online in about a minute. Receipts are emailed the same day.</EText>
          <EText variant="small" muted>Statement 4471, sent Oct 14</EText>
          <EKicker>History</EKicker>
        </EStack>
      </ESurface>

      <ESurface :pad="vp.pad" :tone="vp.tone" class="pv-card">
        <EStack :gap="vp.gap">
          <EKicker>Dialog and float</EKicker>
          <EButton variant="outline" @click="dialogOpen = !dialogOpen">{{ dialogOpen ? "Hide" : "Show" }} dialog</EButton>
          <EDialog v-if="dialogOpen" v-model:open="dialogOpen" inline title="Remove this card?">
            Visa ending 4242 will no longer be available for payments.
            <template #actions>
              <EButton variant="danger">Remove card</EButton>
              <EButton variant="outline" @click="dialogOpen = false">Keep it</EButton>
            </template>
          </EDialog>
          <ESurface tone="float" pad="sm"><EText variant="small">A floating surface: menus, lists and toasts.</EText></ESurface>
        </EStack>
      </ESurface>

      <ESurface :pad="vp.pad" :tone="vp.tone" class="pv-card">
        <EStack :gap="vp.gap">
          <EKicker>Navigation</EKicker>
          <ETabs v-if="vp.navOutline" dense orientation="vertical" label="Account sections" :items="navItems" />
          <ENavList v-else label="Account sections" :items="navItems" :dense="vp.navDense" />
          <ETabs
            v-model="tab"
            :items="[
              { id: 'overview', label: 'Overview' },
              { id: 'history', label: 'History', count: 3 },
              { id: 'settings', label: 'Settings' },
            ]"
          >
            <template #panel="{ item }"><EText variant="small" muted>{{ item.label }} panel.</EText></template>
          </ETabs>
          <EStepper :steps="steps" label="Checkout" />
          <EPagination v-model="page" :page-count="6" aria-label="Visit pages" />
          <div :class="['pv-disclosures', { 'pv-disclosures--card': vp.disclosure === 'card' }]">
            <EDisclosure :variant="vp.disclosure" title="What does this cover?" :meta="vp.disclosure === 'card' ? 'Oct' : undefined">Visits, labs and supplies from Oct 1 to Oct 31.</EDisclosure>
            <EDisclosure :variant="vp.disclosure" title="When is it due?" :meta="vp.disclosure === 'card' ? 'Oct 22' : undefined">Payment is due 21 days after the statement is sent.</EDisclosure>
          </div>
        </EStack>
      </ESurface>
    </div>

    <ESurface :pad="vp.pad" :tone="vp.tone" class="pv-wide">
      <EStack :gap="vp.gap">
        <EKicker>Data</EKicker>
        <EDataGrid caption="Statements" :columns="columns" :rows="rows" :plain="vp.plain" :searchable="!vp.plain" :selectable="!vp.plain" :page-size="4">
          <template #cell-status="{ row }">
            <EChip :tone="tone[row.status as keyof typeof tone]" :variant="vp.badge">{{ row.status }}</EChip>
          </template>
          <template #cell-amount="{ value }">{{ fmt(value) }}</template>
        </EDataGrid>
      </EStack>
    </ESurface>
  </ThemedScope>
</template>

<style scoped>
.pv-cols {
  columns: 2 19rem;
  column-gap: var(--e-space-4);
  min-width: 0;
}
.pv-card {
  break-inside: avoid;
  margin-block-end: var(--e-space-4);
  min-width: 0;
}
.pv-wide {
  min-width: 0;
}
</style>
