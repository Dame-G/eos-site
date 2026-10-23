<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from "vue";
import {
  EButton,
  EColorField,
  EDrawer,
  EGrid,
  EKicker,
  ENumberField,
  ESegmented,
  ESelect,
  EStack,
  ESwitch,
  ETabs,
  EText,
  ETextField,
  EVisuallyHidden,
} from "@eos-ui/vue";
import { groups } from "@eos-ui/tokens";
import HighlightedCode from "./HighlightedCode.vue";
import ControlsDock from "./playground/ControlsDock.vue";
import PlaygroundPreview from "./playground/PlaygroundPreview.vue";
import PresetPicker from "./playground/PresetPicker.vue";
import TokenOverrides from "./playground/TokenOverrides.vue";
import { build, cssChanges, cssFull, derivedTokens, themeCode, variantCode } from "./playground/build";
import { decode, encode } from "./playground/codec";
import { CURRENCIES, LOCALES, MONO, NEUTRAL, SAFE, SANS, groundOf, initialState, withGround, type State, type VariantKey } from "./playground/model";
import { applyPreset } from "./playground/presets";
import { applyRandom } from "./playground/random";

const s = reactive<State>(initialState());
const built = computed(() => build(s));
const tokens = computed(() => built.value.theme.tokens);
const cssVars = computed(() => Object.fromEntries(Object.entries(tokens.value).map(([k, v]) => [`--e-${k}`, v])));

// The state is serialised once per change. The same string says whether anything was edited since the last preset (then the preset reads "custom") and is what the address holds.
const link = computed(() => encode(s));
let snapshot = link.value;
// What the address stands for. On load it is the state the page started on, so loading writes nothing.
let shown = link.value;
/** After a preset, or after loading, the state as it now stands is the starting point again. */
function settle(loaded = false) {
  snapshot = link.value;
  if (loaded) shown = link.value;
}
function usePreset(id: string) {
  if (id === "random" || id === "custom") return;
  applyPreset(s, id);
  settle();
}
function useRandom() {
  applyRandom(s);
  settle();
}

let timer: ReturnType<typeof setTimeout> | undefined;
const HASH = "#t=";
watch(link, (code) => {
  if (code !== snapshot && s.preset !== "custom") {
    s.preset = "custom";
    return;
  }
  if (code === shown) return;
  shown = code;
  clearTimeout(timer);
  // The address follows each edit in place, so the edits do not fill the history.
  timer = setTimeout(() => {
    try {
      history.replaceState(history.state, "", code ? `${HASH}${code}` : location.pathname + location.search);
    } catch {}
  }, 200);
});
const copied = ref("");
async function copyLink() {
  try {
    await navigator.clipboard.writeText(location.origin + location.pathname + (link.value ? HASH + link.value : ""));
    copied.value = "Link copied";
  } catch {
    copied.value = "Copy the address bar";
  }
  setTimeout(() => (copied.value = ""), 2500);
}

const wholePage = ref(false);
let pageKeys: string[] = [];
function syncPage() {
  const root = document.documentElement;
  for (const k of pageKeys) root.style.removeProperty(k);
  pageKeys = [];
  if (!wholePage.value) return;
  for (const [k, v] of Object.entries(cssVars.value)) {
    root.style.setProperty(k, v);
    pageKeys.push(k);
  }
}
watch([wholePage, cssVars], syncPage);

function loadHash() {
  const m = /^#t=([\w-]+)$/.exec(location.hash);
  const loaded = m ? decode(m[1]!) : null;
  if (loaded && encode(loaded) !== encode(s)) {
    Object.assign(s, loaded);
    settle(true);
  }
}
/** With no state in the address, start on the scheme the site is showing, so a visitor in dark mode gets a dark preview. A shared link keeps its own scheme. */
function followSite() {
  if (/^#t=/.test(location.hash) || document.documentElement.dataset["scheme"] !== "dark") return;
  Object.assign(s, withGround("dark"));
  settle(true);
}
onMounted(() => {
  followSite();
  loadHash();
  window.addEventListener("hashchange", loadHash);
});
onBeforeUnmount(() => {
  window.removeEventListener("hashchange", loadHash);
  wholePage.value = false;
  syncPage();
  clearTimeout(timer);
});

const GROUND = [
  ["background", "Background", "The page: sets background."],
  ["surface", "Surface", "Cards and fields: sets surface, its tint and the status tints."],
  ["foreground", "Foreground", "Text and lines: sets ink, secondary text and edges."],
] as const;
const TONES = [
  ["brand", "Brand", "Sets primary and the tinted ground."],
  ["accent", "Accent", "Sets secondary and the success tint."],
  ["danger", "Danger", "Sets danger, its text and tint."],
  ["warning", "Warning", "Sets the warning text and tint."],
] as const;
const COLOUR_SET = new Set<string>(groups.color);
const LISTS = {
  colour: derivedTokens("colour"),
  shape: derivedTokens("shape"),
  type: derivedTokens("type"),
  space: derivedTokens("space"),
  motion: derivedTokens("motion"),
};
function resetColours() {
  for (const k of Object.keys(s.t)) if (COLOUR_SET.has(k)) delete s.t[k];
}
function setToken(name: string, value: string) {
  const v = value.trim();
  if (!v) delete s.t[name];
  else if (SAFE.test(v)) s.t[name] = v;
}
function followAgain(name: string) {
  delete s.t[name];
}
function followTab(tab: keyof typeof LISTS) {
  for (const { name } of LISTS[tab]) delete s.t[name];
}
function setScheme(v: string) {
  s.scheme = v as State["scheme"];
  Object.assign(s, groundOf(s.scheme));
  resetColours();
}
function setGround(name: "background" | "surface" | "foreground", v: string) {
  s[name] = v;
  s.scheme = "custom";
}
const schemeOptions = computed(() => [
  { value: "light", label: "Light" },
  { value: "paper", label: "Paper" },
  { value: "dark", label: "Dark" },
  { value: "contrast", label: "Contrast" },
  ...(s.scheme === "custom" ? [{ value: "custom", label: "Custom" }] : []),
]);

const FALLBACK = { ...NEUTRAL, textScale: 100, spaceScale: 100 } as const;
function setField(field: keyof typeof FALLBACK, v: number | null) {
  s[field] = v ?? FALLBACK[field];
  if (field === "textScale") followTab("type");
  if (field === "spaceScale") for (const { name } of LISTS.space) if (name.startsWith("space-")) delete s.t[name];
}
function setRadius(v: string) {
  s.radius = v as State["radius"];
  for (const k of ["radius-sm", "radius-md", "radius-lg"]) delete s.t[k];
}
function setElevation(v: string) {
  s.elevation = v as State["elevation"];
  for (const k of ["frame", "well", "float"]) delete s.t[k];
}
function setMotion(v: string) {
  s.motion = v as State["motion"];
  followTab("motion");
}
const VARIANT_FIELDS: { key: VariantKey; label: string; hint: string; options: { value: string; label: string }[] }[] = [
  { key: "pad", label: "Surface padding", hint: "ESurface pad.", options: [{ value: "sm", label: "Small" }, { value: "md", label: "Medium" }, { value: "lg", label: "Large" }] },
  { key: "gap", label: "Gaps", hint: "EStack, EInline and EGrid gap.", options: [{ value: "tight", label: "Tight" }, { value: "default", label: "Default" }, { value: "roomy", label: "Roomy" }] },
];
function setVariant(key: VariantKey, v: string) {
  (s.variants as Record<string, string>)[key] = v;
}
const variantTags = computed(() => variantCode(s.variants));
const sansOptions = Object.entries(SANS).map(([value, f]) => ({ value, label: f.label }));
const monoOptions = Object.entries(MONO).map(([value, f]) => ({ value, label: f.label }));

const controlTab = ref("colour");
const controlItems = [
  { id: "colour", label: "Colour" },
  { id: "shape", label: "Shape" },
  { id: "type", label: "Type" },
  { id: "space", label: "Space" },
  { id: "motion", label: "Motion" },
];
const exporting = ref(false);

const format = ref("code");
const code = computed(() => {
  if (format.value === "css") return cssChanges(built.value);
  if (format.value === "full") return cssFull(built.value);
  return themeCode(built.value);
});
const codeLang = computed(() => (format.value === "code" ? "ts" : "css"));
const copyLabel = computed(() => ({ code: "Copy code", css: "Copy CSS", full: "Copy full CSS" })[format.value] ?? "Copy");
const changedCount = computed(() => Object.keys(built.value.extra).length + Object.keys(built.value.input).filter((k) => k !== "name" && k !== "tokens").length);
</script>

<template>
  <div class="playground eos-live">
    <section class="bar" aria-label="Presets">
      <PresetPicker class="bar-presets" :model-value="s.preset" :tokens="tokens" @select="usePreset" @random="useRandom" />
      <div class="bar-actions">
        <ESwitch v-model="wholePage" label="Apply to the whole page" />
        <div class="bar-buttons">
          <EButton variant="outline" @click="usePreset('eos')">Reset</EButton>
          <EButton variant="outline" @click="copyLink">Copy link</EButton>
          <EButton @click="exporting = true">Export</EButton>
        </div>
        <EText size="sm" tone="neutral" role="status">{{ copied }}</EText>
      </div>
    </section>

    <div class="workbench">
      <ControlsDock>
        <ETabs v-model="controlTab" :items="controlItems" fill class="groups">
          <template #colour>
            <EStack :gap="4">
              <ESegmented :model-value="s.scheme" label="Scheme" :options="schemeOptions" @update:model-value="setScheme" />
              <EStack :gap="2">
                <ESwitch v-model="s.autoScheme" label="Follow light and dark" />
                <ESwitch v-model="s.autoContrast" label="Follow high contrast" :disabled="s.scheme === 'contrast'" />
                <EText size="sm" tone="neutral">Sets scheme and contrast to auto in the export. The preview shows the one theme.</EText>
              </EStack>
              <EKicker>Ground</EKicker>
              <EGrid min="9rem" :gap="3">
                <EColorField v-for="[k, label, hint] in GROUND" :key="k" :label="label" :hint="hint" :model-value="s[k]" @update:model-value="setGround(k, $event)" />
              </EGrid>
              <EKicker>Tones</EKicker>
              <EGrid min="9rem" :gap="3">
                <EColorField v-for="[k, label, hint] in TONES" :key="k" :label="label" :hint="hint" v-model="s[k]" />
              </EGrid>
              <TokenOverrides title="All colour tokens" colour :items="LISTS.colour" :tokens="tokens" :overridden="s.t" @set="setToken" @follow="followAgain" />
            </EStack>
          </template>

          <template #shape>
            <EStack :gap="4">
              <ESegmented :model-value="s.radius" label="Corners" :options="[{ value: 'sharp', label: 'Sharp' }, { value: 'default', label: 'Default' }, { value: 'round', label: 'Round' }]" @update:model-value="setRadius" />
              <ESegmented :model-value="s.elevation" label="Elevation" :options="[{ value: 'outline', label: 'Outline' }, { value: 'lifted', label: 'Lifted' }, { value: 'bold', label: 'Bold' }]" hint="Edges are rings of the card edge colour." @update:model-value="setElevation" />
              <ESelect
                v-model="s.themePreset"
                label="Theme preset"
                :options="[{ value: 'none', label: 'None' }, { value: 'paper', label: 'Paper' }, { value: 'ink', label: 'Ink' }, { value: 'quiet', label: 'Quiet' }]"
                hint="Sets elevation, strokes, radius and motion together. Corners, elevation and motion you change here win over it."
              />
              <EKicker>Strokes</EKicker>
              <EGrid min="8rem" :gap="3">
                <ENumberField label="Hairline" hint="Dividers, edges" suffix="px" :step="0.5" :min="0.5" :max="8" :model-value="s.hair" @update:model-value="setField('hair', $event)" />
                <ENumberField label="Focus outline" hint="At least 2" suffix="px" :step="0.5" :min="0.5" :max="8" :model-value="s.focus" @update:model-value="setField('focus', $event)" />
              </EGrid>
              <EKicker>Spacing</EKicker>
              <EText size="sm" tone="neutral">Component props, not tokens. They are not part of defineTheme.</EText>
              <ESegmented v-for="f in VARIANT_FIELDS" :key="f.key" :model-value="s.variants[f.key]" :label="f.label" :options="f.options" :hint="f.hint" @update:model-value="setVariant(f.key, $event)" />
              <TokenOverrides title="All shape tokens" :items="LISTS.shape" :tokens="tokens" :overridden="s.t" @set="setToken" @follow="followAgain" />
            </EStack>
          </template>

          <template #type>
            <EStack :gap="4">
              <EGrid min="9rem" :gap="3">
                <ESelect v-model="s.sans" label="Text font" :options="sansOptions" />
                <ESelect v-model="s.mono" label="Label font" :options="monoOptions" />
              </EGrid>
              <ETextField v-if="s.sans === 'custom'" v-model="s.sansCustom" label="Font stack" placeholder='"Inter", system-ui, sans-serif' spellcheck="false" hint="Fonts are never bundled: install or load them yourself." />
              <ETextField v-if="s.mono === 'custom'" v-model="s.monoCustom" label="Mono stack" placeholder='"JetBrains Mono", monospace' spellcheck="false" />
              <ENumberField label="Text size" hint="Percent of the default scale" suffix="%" :step="5" :min="50" :max="200" :model-value="s.textScale" @update:model-value="setField('textScale', $event)" />
              <EKicker>Language</EKicker>
              <EGrid min="9rem" :gap="3">
                <ESelect v-model="s.locale" label="Language and region" :options="LOCALES" />
                <ESelect v-model="s.currency" label="Currency" :options="CURRENCIES" />
              </EGrid>
              <TokenOverrides title="All type tokens" :items="LISTS.type" :tokens="tokens" :overridden="s.t" @set="setToken" @follow="followAgain" />
            </EStack>
          </template>

          <template #space>
            <EStack :gap="4">
              <ESegmented
                :model-value="s.density"
                label="Density"
                :options="[{ value: 'comfortable', label: 'Comfortable' }, { value: 'compact', label: 'Compact' }]"
                hint="Compact tightens the space scale and makes controls the 44px tap target."
                @update:model-value="s.density = $event as State['density']"
              />
              <EGrid min="8rem" :gap="3">
                <ENumberField label="Spacing" hint="Percent of the default scale" suffix="%" :step="5" :min="50" :max="200" :model-value="s.spaceScale" @update:model-value="setField('spaceScale', $event)" />
                <ENumberField label="Control height" hint="Buttons, inputs" suffix="px" :min="32" :max="72" :model-value="s.controlHeight" @update:model-value="setField('controlHeight', $event)" />
              </EGrid>
              <TokenOverrides title="All space tokens" :items="LISTS.space" :tokens="tokens" :overridden="s.t" @set="setToken" @follow="followAgain" />
            </EStack>
          </template>

          <template #motion>
            <EStack :gap="4">
              <ESegmented :model-value="s.motion" label="Feel" :options="[{ value: 'default', label: 'Default' }, { value: 'snappy', label: 'Snappy' }, { value: 'gentle', label: 'Gentle' }]" :hint="`Tap ${tokens['duration-tap']}, move ${tokens['duration-move']}`" @update:model-value="setMotion" />
              <EText size="sm" tone="neutral">Try it with Replay in the preview. Everything stops under reduced motion.</EText>
              <TokenOverrides title="All motion tokens" :items="LISTS.motion" :tokens="tokens" :overridden="s.t" @set="setToken" @follow="followAgain" />
            </EStack>
          </template>
        </ETabs>
      </ControlsDock>

      <section class="stage" aria-labelledby="playground-result">
        <EVisuallyHidden as="h2" id="playground-result">Preview</EVisuallyHidden>
        <PlaygroundPreview :theme="built.theme" :locale="s.locale" :currency="s.currency" :variants="s.variants" />
      </section>
    </div>

    <EDrawer v-model:open="exporting" title="Export the theme" size="lg">
      <EStack :gap="3">
        <ESegmented v-model="format" label="Format" :options="[{ value: 'code', label: 'defineTheme' }, { value: 'css', label: 'CSS changes' }, { value: 'full', label: 'Full CSS' }]" />
        <HighlightedCode :lang="codeLang" :copy-label="copyLabel" :code="code" />
        <template v-if="variantTags">
          <EText size="sm" tone="neutral">Spacing is set with component props, not tokens. This look also used:</EText>
          <HighlightedCode lang="vue" copy-label="Copy spacing props" :code="variantTags" />
        </template>
        <EText size="sm" tone="neutral">{{ changedCount }} {{ changedCount === 1 ? "setting differs" : "settings differ" }} from the defaults. Copy link shares this theme.</EText>
      </EStack>
    </EDrawer>
  </div>
</template>

<style scoped>
.playground {
  display: grid;
  gap: var(--e-space-6);
  padding-block: var(--e-space-2) var(--e-space-4);
  min-width: 0;
}
.bar {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: var(--e-space-3) var(--e-space-5);
  padding-block-end: var(--e-space-6);
  border-bottom: var(--e-stroke-hair) solid var(--e-border);
  min-width: 0;
}
.bar-presets {
  flex: 1 1 22rem;
  max-width: 32rem;
}
.bar-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--e-space-2) var(--e-space-3);
  min-height: var(--e-control-height);
  min-width: 0;
}
.bar-buttons {
  display: flex;
  gap: var(--e-space-2);
}
.workbench {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: var(--e-space-4);
  align-items: start;
  min-width: 0;
}
.stage {
  display: grid;
  /* One column that can shrink below its content: an auto column would grow to the preview's min-content. */
  grid-template-columns: minmax(0, 1fr);
  gap: var(--e-space-3);
  min-width: 0;
  scroll-margin-top: calc(var(--site-header) + var(--e-space-4));
}
.groups :deep(.e-seg-text) {
  min-width: 0;
  padding-inline: var(--e-space-3);
}
@media (min-width: 64rem) {
  .workbench {
    grid-template-columns: minmax(22rem, 26rem) minmax(0, 1fr);
    gap: calc(var(--e-space-8) * 1.5);
  }
  .groups {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
  }
  .groups > :deep(.e-tabpanel) {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    /* At the end of the list a small wheel or trackpad movement would carry on into the page and move it under the sticky panel. */
    overscroll-behavior: contain;

    /* Scrolling clips sideways too, so a focused field's outline (which reaches outside it) would be cut where the field meets the panel. Room for it on the sides and below, taken back with the margin so the fields still line up with the column. */
    padding-inline: calc(2 * var(--e-stroke-focus));
    padding-block-end: calc(2 * var(--e-stroke-focus));
    margin-inline: calc(-2 * var(--e-stroke-focus));
  }
}
</style>
