<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, provide, reactive, ref, watch } from "vue";
import {
  CONFIG_KEY,
  EButton,
  ECalendar,
  ECheckbox,
  EChip,
  ENotice,
  ERadioGroup,
  ESegmented,
  ESelect,
  EStamp,
  ESwitch,
  ETextField,
  defineTheme,
  type EosConfig,
} from "@eos-ui/vue";

const DEFAULT_BRAND = "#2c95b4";
const DEFAULT_ACCENT = "#72c451";
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

const copied = ref("");
async function copy(text: string, what: string) {
  try {
    await navigator.clipboard.writeText(text);
    copied.value = `${what} copied`;
  } catch {
    copied.value = `Select the ${what} and copy it`;
  }
  setTimeout(() => (copied.value = ""), 2500);
}
</script>

<template>
  <div class="playground">
    <section class="controls" aria-labelledby="pg-controls">
      <h2 id="pg-controls">Theme</h2>

      <div class="pair">
        <label class="color">
          <span class="e-kicker">Brand colour</span>
          <span class="row"><input v-model="brand" type="color" /><code>{{ brand }}</code></span>
        </label>
        <label class="color">
          <span class="e-kicker">Accent colour</span>
          <span class="row"><input v-model="accent" type="color" /><code>{{ accent }}</code></span>
        </label>
      </div>
      <p class="note">The deep action colours are derived from these so white text on them keeps at least 7:1.</p>

      <ESegmented v-model="radius" label="Corners" :options="[{ value: 'sharp', label: 'Sharp' }, { value: 'default', label: 'Default' }, { value: 'round', label: 'Round' }]" />

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

      <details class="advanced">
        <summary>Try a failing colour</summary>
        <p class="note">Plain token overrides are not corrected. Pick a pale grey to see the contrast check catch it.</p>
        <div class="pair">
          <label class="color">
            <span class="e-kicker">Secondary text</span>
            <span class="row"><input type="color" :value="muted || '#515151'" @input="muted = ($event.target as HTMLInputElement).value" /><code>{{ muted || "default" }}</code></span>
          </label>
          <label class="color">
            <span class="e-kicker">Card edge</span>
            <span class="row"><input type="color" :value="border || '#7f8f96'" @input="border = ($event.target as HTMLInputElement).value" /><code>{{ border || "default" }}</code></span>
          </label>
        </div>
        <EButton variant="quiet" @click="((muted = ''), (border = ''))">Reset both</EButton>
      </details>
    </section>

    <div class="stage">
      <section aria-labelledby="pg-issues">
        <h2 id="pg-issues">Contrast check</h2>
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
      </section>

      <section aria-labelledby="pg-preview">
        <h2 id="pg-preview">Preview</h2>
        <div ref="scope" class="preview e-root" data-e-theme="preview" :style="style" :dir="dir">
          <div class="grid">
            <div class="card">
              <p class="e-kicker">Buttons</p>
              <div class="wrap">
                <EButton icon="lock">Pay {{ money }}</EButton>
                <EButton variant="secondary">Confirm</EButton>
                <EButton variant="outline">Cancel</EButton>
                <EButton variant="danger">Remove</EButton>
                <EButton variant="quiet">Skip</EButton>
                <EButton disabled>Disabled</EButton>
              </div>
            </div>
            <div class="card">
              <p class="e-kicker">Stamps and chips</p>
              <div class="wrap">
                <EStamp status="paid" />
                <EStamp status="due" detail="Nov 1" />
                <EStamp status="action" />
                <EStamp status="overdue" />
                <EChip>Draft</EChip>
                <EChip tone="success">Paid</EChip>
                <EChip tone="info">Scheduled</EChip>
                <EChip tone="warning">Review</EChip>
                <EChip tone="danger">Failed</EChip>
              </div>
            </div>
            <div class="card">
              <p class="e-kicker">Fields</p>
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
            </div>
            <div class="card">
              <p class="e-kicker">Notices</p>
              <ENotice tone="info" title="Your visit is Thursday">Main office, 9:30 am.</ENotice>
              <ENotice tone="success" title="Payment received">We emailed your receipt.</ENotice>
              <ENotice tone="warning" title="Form due">Please sign before Oct 22.</ENotice>
              <ENotice tone="danger" title="Card declined">Try another card.</ENotice>
            </div>
            <div class="card">
              <p class="e-kicker">Calendar</p>
              <ECalendar v-model="day" :month="day" :footer="false" />
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="pg-code">
        <h2 id="pg-code">Use this theme</h2>
        <h3>In your app</h3>
        <pre class="code" tabindex="0"><code>{{ snippet }}</code></pre>
        <EButton variant="outline" @click="copy(snippet, 'Code')">Copy code</EButton>
        <h3>Or as plain CSS</h3>
        <p class="note">Only the values that differ from the defaults. It wins because the library is layered.</p>
        <pre class="code" tabindex="0"><code>{{ cssBlock }}</code></pre>
        <EButton variant="outline" @click="copy(cssBlock, 'CSS')">Copy CSS</EButton>
        <p class="status" role="status">{{ copied }}</p>
      </section>
    </div>
  </div>
</template>

<style scoped>
.playground {
  display: grid;
  grid-template-columns: minmax(16rem, 20rem) minmax(0, 1fr);
  gap: var(--e-space-8);
  align-items: start;
  max-width: 1280px;
  margin: 0 auto;
  padding: var(--e-space-8) var(--e-space-4);
}
@media (max-width: 860px) {
  .playground {
    grid-template-columns: minmax(0, 1fr);
  }
}
.controls {
  display: grid;
  gap: var(--e-space-4);
  position: sticky;
  top: calc(var(--vp-nav-height) + var(--e-space-4));
}
@media (max-width: 860px) {
  .controls {
    position: static;
  }
}
h2 {
  margin: 0 0 var(--e-space-3);
  font-size: var(--e-text-2xl);
  font-weight: 500;
}
h3 {
  margin: var(--e-space-4) 0 var(--e-space-2);
  font-size: var(--e-text-xl);
  font-weight: 500;
}
.stage {
  display: grid;
  gap: var(--e-space-8);
  min-width: 0;
}
.pair {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--e-space-3);
}
.color {
  display: grid;
  gap: var(--e-space-2);
}
.row {
  display: flex;
  gap: var(--e-space-2);
  align-items: center;
}
.row input[type="color"] {
  width: 48px;
  height: var(--e-control-height);
  padding: 2px;
  border: var(--e-stroke-edge) solid var(--e-border-strong);
  border-radius: var(--e-radius-md);
  background: var(--e-surface);
}
.note {
  margin: 0;
  font-size: var(--e-text-sm);
  color: var(--e-muted);
}
.advanced summary {
  min-height: 44px;
  display: flex;
  align-items: center;
  cursor: pointer;
  font-weight: 500;
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
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 20rem), 1fr));
  gap: var(--e-space-4);
}
.card {
  display: grid;
  gap: var(--e-space-4);
  align-content: start;
  min-width: 0;
  padding: var(--e-space-4);
  border: var(--e-stroke-hair) solid var(--e-border);
  border-radius: var(--e-radius-md);
  background: var(--e-surface);
}
.card p {
  margin: 0;
}
.wrap {
  display: flex;
  flex-wrap: wrap;
  gap: var(--e-space-2);
  align-items: center;
}
.code {
  margin: 0 0 var(--e-space-3);
  padding: var(--e-space-4);
  overflow-x: auto;
  border-radius: var(--e-radius-md);
  background: var(--e-surface-tint);
  font: 400 var(--e-text-sm) / 1.6 var(--e-font-mono);
  white-space: pre;
}
.status {
  min-height: 1.5em;
  margin: var(--e-space-2) 0 0;
  font-size: var(--e-text-sm);
  color: var(--e-muted);
}
</style>
