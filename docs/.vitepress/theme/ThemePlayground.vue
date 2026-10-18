<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, provide, reactive, ref, watch } from "vue";
import {
  CONFIG_KEY,
  EButton,
  ECalendar,
  ECheckbox,
  EChip,
  EColorField,
  EDisclosure,
  EGrid,
  EHeading,
  EInline,
  EKicker,
  ENotice,
  ERadioGroup,
  ESegmented,
  ESelect,
  EStack,
  EStamp,
  ESurface,
  ESwitch,
  EText,
  ETextField,
  defineTheme,
  type EosConfig,
} from "@eos-ui/vue";
import CodeBlock from "./CodeBlock.vue";

const DEFAULT_BRAND = "#2c95b4";
const DEFAULT_ACCENT = "#72c451";
const DEFAULT_MUTED = "#515151";
const DEFAULT_BORDER = "#7f8f96";
const FONTS: Record<string, string> = {
  jost: '"Jost", Futura, "Century Gothic", "Avenir Next", system-ui, sans-serif',
  system: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
  serif: 'Georgia, "Times New Roman", serif',
  verdana: "Verdana, Geneva, sans-serif",
};
const LOCALES = [
  { value: "en-US", label: "English (United States)" },
  { value: "en-CA", label: "English (Canada)" },
  { value: "fr-CA", label: "French (Canada)" },
  { value: "de-DE", label: "German" },
  { value: "ja-JP", label: "Japanese" },
  { value: "ar-EG", label: "Arabic (right to left)" },
];
const CURRENCIES = ["USD", "CAD", "EUR", "GBP", "JPY"];

const brand = ref(DEFAULT_BRAND);
const accent = ref(DEFAULT_ACCENT);
const radius = ref<"sharp" | "default" | "round">("default");
const font = ref("jost");
const locale = ref("en-US");
const currency = ref("USD");
// Two raw overrides, so the contrast check has something to catch.
const muted = ref("");
const border = ref("");

const isHex = (v: string) => /^#[0-9a-f]{6}$/i.test(v);

const input = computed(() => {
  const o: Parameters<typeof defineTheme>[0] = { name: "preview" };
  if (isHex(brand.value) && brand.value.toLowerCase() !== DEFAULT_BRAND) o.brand = brand.value;
  if (isHex(accent.value) && accent.value.toLowerCase() !== DEFAULT_ACCENT) o.accent = accent.value;
  if (font.value !== "jost") o.fonts = { sans: FONTS[font.value] };
  if (radius.value !== "default") o.radius = radius.value;
  const tokens: Record<string, string> = {};
  if (isHex(muted.value)) tokens.muted = muted.value;
  if (isHex(border.value)) tokens.border = border.value;
  if (Object.keys(tokens).length) o.tokens = tokens;
  return o;
});
const theme = computed(() => defineTheme(input.value));
const dir = computed(() => (locale.value.startsWith("ar") ? "rtl" : "ltr"));

const style = computed(() => Object.fromEntries(Object.entries(theme.value.tokens).map(([k, v]) => [`--e-${k}`, v])));

// The preview has its own config, so changing the locale here never changes the rest of the site.
const config = reactive<EosConfig>({
  locale: locale.value,
  currency: currency.value,
  dir: null,
  messages: {},
  icons: {},
  portalTarget: "body",
});
provide(CONFIG_KEY, config);
watch([locale, currency], () => {
  config.locale = locale.value;
  config.currency = currency.value;
});
const scope = ref<HTMLElement | null>(null);
onMounted(() => {
  // Floating parts (the select list) render inside the themed wrapper so they carry the theme.
  config.portalTarget = scope.value!;
});
onBeforeUnmount(() => (config.portalTarget = "body"));

const money = computed(() => new Intl.NumberFormat(locale.value, { style: "currency", currency: currency.value }).format(162.4));

// Preview state
const email = ref("name@");
const plan = ref("card");
const agree = ref(true);
const method = ref("full");
const reminders = ref(true);
const day = ref(new Date(2026, 9, 22));
const planOptions = [
  { value: "card", label: "Visa ending 4242" },
  { value: "bank", label: "Bank account ending 6789" },
  { value: "cash", label: "Cash at the office" },
];

const snippet = computed(() => {
  const t = input.value;
  const parts: string[] = [];
  if (t.brand) parts.push(`brand: "${t.brand}"`);
  if (t.accent) parts.push(`accent: "${t.accent}"`);
  if (t.fonts) parts.push(`fonts: { sans: ${JSON.stringify(t.fonts.sans)} }`);
  if (t.radius) parts.push(`radius: "${t.radius}"`);
  if (t.tokens) parts.push(`tokens: { ${Object.entries(t.tokens).map(([k, v]) => `"${k}": "${v}"`).join(", ")} }`);
  const themeText = parts.length ? `\n  theme: { ${parts.join(", ")} },` : "";
  return `import { createEos } from "@eos-ui/vue";\n\napp.use(\n  createEos({\n    locale: "${locale.value}",\n    currency: "${currency.value}",${themeText}\n  }),\n);`;
});

const defaultTokens = defineTheme({}).tokens;
const cssBlock = computed(() => {
  const changed = Object.entries(theme.value.tokens).filter(([k, v]) => defaultTokens[k] !== v);
  if (!changed.length) return ":root {\n  /* No changes: these are the defaults. */\n}";
  return `:root {\n${changed.map(([k, v]) => `  --e-${k}: ${v};`).join("\n")}\n}`;
});
</script>

<template>
  <div class="playground eos-live">
    <EStack as="section" aria-labelledby="pg-controls" class="controls">
      <EHeading id="pg-controls">Theme</EHeading>
      <EGrid min="9rem" :gap="3">
        <EColorField v-model="brand" label="Brand colour" />
        <EColorField v-model="accent" label="Accent colour" />
      </EGrid>
      <EText variant="small" muted>The deep action colours are derived from these so white text on them keeps at least 7:1.</EText>
      <ESegmented
        v-model="radius"
        label="Corners"
        :options="[
          { value: 'sharp', label: 'Sharp' },
          { value: 'default', label: 'Default' },
          { value: 'round', label: 'Round' },
        ]"
      />
      <ESelect
        v-model="font"
        label="Font"
        :options="[
          { value: 'jost', label: 'Jost (default)' },
          { value: 'system', label: 'System UI' },
          { value: 'serif', label: 'Serif' },
          { value: 'verdana', label: 'Verdana' },
        ]"
      />
      <ESelect v-model="locale" label="Language and region" :options="LOCALES" />
      <ESelect v-model="currency" label="Currency" :options="CURRENCIES" />
      <EDisclosure title="Try a failing colour">
        <EStack :gap="3">
          <EText variant="small" muted>Plain token overrides are not corrected. Pick a pale grey to see the contrast check catch it.</EText>
          <EGrid min="9rem" :gap="3">
            <EColorField label="Secondary text" :model-value="muted || DEFAULT_MUTED" @update:model-value="muted = $event" />
            <EColorField label="Card edge" :model-value="border || DEFAULT_BORDER" @update:model-value="border = $event" />
          </EGrid>
          <div><EButton variant="quiet" @click="((muted = ''), (border = ''))">Reset both</EButton></div>
        </EStack>
      </EDisclosure>
    </EStack>

    <EStack :gap="8" class="stage">
      <EStack as="section" :gap="3" aria-labelledby="pg-issues">
        <EHeading id="pg-issues">Contrast check</EHeading>
        <ENotice v-if="theme.issues.length" tone="danger" :title="`${theme.issues.length} contrast ${theme.issues.length === 1 ? 'pair fails' : 'pairs fail'}`">
          <ul class="issues">
            <li v-for="i in theme.issues" :key="i.pair.join()">
              <strong>{{ i.role }}</strong
              >: <code>{{ i.pair[0] }}</code> on <code>{{ i.pair[1] }}</code> is {{ i.ratio }}:1, needs {{ i.min }}:1.
            </li>
          </ul>
        </ENotice>
        <ENotice v-else tone="success" title="Every promised pair holds">
          <code>defineTheme().issues</code> is empty for this theme.
        </ENotice>
      </EStack>

      <EStack as="section" :gap="3" aria-labelledby="pg-preview">
        <EHeading id="pg-preview">Preview</EHeading>
        <div ref="scope" class="preview e-root" data-e-theme="preview" :style="style" :dir="dir">
          <EGrid min="19rem" :gap="4">
            <ESurface pad="md">
              <EStack>
                <EKicker>Buttons</EKicker>
                <EInline>
                  <EButton icon="lock">Pay {{ money }}</EButton>
                  <EButton variant="secondary">Confirm</EButton>
                  <EButton variant="outline">Cancel</EButton>
                  <EButton variant="danger">Remove</EButton>
                  <EButton variant="quiet">Skip</EButton>
                  <EButton disabled>Disabled</EButton>
                </EInline>
              </EStack>
            </ESurface>
            <ESurface pad="md">
              <EStack>
                <EKicker>Stamps and chips</EKicker>
                <EInline>
                  <EStamp status="paid" />
                  <EStamp status="due" detail="Nov 1" />
                  <EStamp status="action" />
                  <EStamp status="overdue" />
                  <EChip>Draft</EChip>
                  <EChip tone="success">Paid</EChip>
                  <EChip tone="info">Scheduled</EChip>
                  <EChip tone="warning">Review</EChip>
                  <EChip tone="danger">Failed</EChip>
                </EInline>
              </EStack>
            </ESurface>
            <ESurface pad="md">
              <EStack>
                <EKicker>Fields</EKicker>
                <ETextField v-model="email" label="Email" type="email" error="Enter an email address like name@example.com" />
                <ESelect v-model="plan" label="Pay with" :options="planOptions" />
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
            <ESurface pad="md">
              <EStack>
                <EKicker>Notices</EKicker>
                <ENotice tone="info" title="Your visit is Thursday">Main office, 9:30 am.</ENotice>
                <ENotice tone="success" title="Payment received">We emailed your receipt.</ENotice>
                <ENotice tone="warning" title="Form due">Please sign before Oct 22.</ENotice>
                <ENotice tone="danger" title="Card declined">Try another card.</ENotice>
              </EStack>
            </ESurface>
            <ESurface pad="md">
              <EStack>
                <EKicker>Calendar</EKicker>
                <ECalendar v-model="day" :month="day" :footer="false" />
              </EStack>
            </ESurface>
          </EGrid>
        </div>
      </EStack>

      <EStack as="section" :gap="4" aria-labelledby="pg-code">
        <EHeading id="pg-code">Use this theme</EHeading>
        <EStack :gap="3">
          <EHeading :level="3">In your app</EHeading>
          <CodeBlock :code="snippet" what="code" />
        </EStack>
        <EStack :gap="3">
          <EHeading :level="3">Or as plain CSS</EHeading>
          <EText variant="small" muted>Only the values that differ from the defaults. It wins because the library is layered.</EText>
          <CodeBlock :code="cssBlock" what="CSS" />
        </EStack>
      </EStack>
    </EStack>
  </div>
</template>

<style scoped>
.playground {
  display: grid;
  grid-template-columns: minmax(16rem, 20rem) minmax(0, 1fr);
  gap: var(--e-space-8);
  align-items: start;
  padding-block: var(--e-space-6);
}
@media (max-width: 64rem) {
  .playground {
    grid-template-columns: minmax(0, 1fr);
  }
}
.controls {
  position: sticky;
  top: calc(var(--site-header) + var(--e-space-4));
}
@media (max-width: 64rem) {
  .controls {
    position: static;
  }
}
.stage {
  min-width: 0;
}
.issues {
  margin: var(--e-space-2) 0 0;
  padding-inline-start: var(--e-space-4);
}
.preview {
  padding: var(--e-space-4);
  border: var(--e-stroke-hair) solid var(--e-border);
  border-radius: var(--e-radius-lg);
  background: var(--e-surface-tint);
  color: var(--e-ink);
  font-family: var(--e-font-sans);
}
</style>
