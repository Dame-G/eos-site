<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from "vue";
import {
  EButton,
  EColorField,
  EGrid,
  EInline,
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
import {
  CURRENCIES,
  LOCALES,
  MONO,
  NEUTRAL,
  SAFE,
  SANS,
  applyPreset,
  applyRandom,
  build,
  cssChanges,
  cssFull,
  decode,
  derivedTokens,
  encode,
  groundOf,
  initialState,
  themeCode,
  variantCode,
  type State,
  type VariantKey,
} from "./playground/state";

const s = reactive<State>(initialState());
const built = computed(() => build(s));
const tokens = computed(() => built.value.theme.tokens);
const cssVars = computed(() => Object.fromEntries(Object.entries(tokens.value).map(([k, v]) => [`--e-${k}`, v])));

const sig = () => JSON.stringify({ ...s, preset: "" });
let snapshot = sig();
function usePreset(id: string) {
  if (id === "random" || id === "custom") return;
  applyPreset(s, id);
  snapshot = sig();
}
function useRandom() {
  applyRandom(s);
  snapshot = sig();
}
watch(sig, (v) => {
  if (v !== snapshot && s.preset !== "custom") s.preset = "custom";
});

let timer: ReturnType<typeof setTimeout> | undefined;
const HASH = "#t=";
watch(
  () => encode(s),
  (code) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      try {
        history.replaceState(null, "", code ? `${HASH}${code}` : location.pathname + location.search);
      } catch {
      }
    }, 200);
  },
);
const copied = ref("");
async function copyLink() {
  try {
    await navigator.clipboard.writeText(location.href);
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
    snapshot = sig();
  }
}
onMounted(() => {
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
  for (const k of ["edge", "well", "float"]) delete s.t[k];
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
const stageTab = ref("preview");
const stageItems = [
  { id: "preview", label: "Preview" },
  { id: "export", label: "Export" },
];

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
      <PresetPicker :model-value="s.preset" name="playground-preset" :tokens="tokens" select @select="usePreset" @random="useRandom" />
      <div class="bar-row">
        <div class="bar-info">
          <EText small muted role="status">{{ copied }}</EText>
        </div>
        <div class="bar-actions">
          <ESwitch v-model="wholePage" label="Apply to the whole page" />
          <div class="bar-buttons">
            <EButton variant="outline" @click="usePreset('eos')">Reset</EButton>
            <EButton variant="outline" icon="link" @click="copyLink">Copy link</EButton>
          </div>
        </div>
      </div>
    </section>

    <div class="workbench">
      <ControlsDock>
        <ETabs v-model="controlTab" :items="controlItems" class="groups">
          <template #colour>
            <EStack :gap="4">
              <ESegmented :model-value="s.scheme" label="Scheme" :options="schemeOptions" @update:model-value="setScheme" />
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
              <EKicker>Strokes</EKicker>
              <EGrid min="8rem" :gap="3">
                <ENumberField label="Hairline" hint="Dividers, edges" suffix="px" :step="0.5" :min="0.5" :max="8" :model-value="s.hair" @update:model-value="setField('hair', $event)" />
                <ENumberField label="Focus outline" hint="At least 2" suffix="px" :step="0.5" :min="0.5" :max="8" :model-value="s.focus" @update:model-value="setField('focus', $event)" />
              </EGrid>
              <EKicker>Spacing</EKicker>
              <EText small muted>Component props, not tokens. They are not part of defineTheme.</EText>
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
              <EGrid min="8rem" :gap="3">
                <ENumberField label="Spacing" hint="Percent of the default scale" suffix="%" :step="5" :min="50" :max="200" :model-value="s.spaceScale" @update:model-value="setField('spaceScale', $event)" />
                <ENumberField label="Control height" hint="Buttons, inputs" suffix="px" :min="32" :max="72" :model-value="s.controlHeight" @update:model-value="setField('controlHeight', $event)" />
              </EGrid>
              <TokenOverrides title="All space tokens" :items="LISTS.space" :tokens="tokens" :overridden="s.t" @set="setToken" @follow="followAgain" />
            </EStack>
          </template>

          <template #motion>
            <EStack :gap="4">
              <ESegmented :model-value="s.motion" label="Feel" :options="[{ value: 'default', label: 'Default' }, { value: 'snappy', label: 'Snappy' }, { value: 'gentle', label: 'Gentle' }, { value: 'none', label: 'None' }]" :hint="`Tap ${tokens['duration-tap']}, move ${tokens['duration-move']}`" @update:model-value="setMotion" />
              <EText small muted>Try it with Replay in the preview. Everything stops under reduced motion.</EText>
              <TokenOverrides title="All motion tokens" :items="LISTS.motion" :tokens="tokens" :overridden="s.t" @set="setToken" @follow="followAgain" />
            </EStack>
          </template>
        </ETabs>
      </ControlsDock>

      <section class="stage" aria-labelledby="playground-result">
        <EVisuallyHidden as="h2" id="playground-result">Result</EVisuallyHidden>
        <ETabs v-model="stageTab" :items="stageItems" class="stage-tabs">
          <template #preview>
            <PlaygroundPreview :tokens="cssVars" :locale="s.locale" :currency="s.currency" :variants="s.variants" />
          </template>
          <template #export>
            <EStack :gap="3">
              <EInline>
                <ESegmented v-model="format" label="Format" :options="[{ value: 'code', label: 'defineTheme' }, { value: 'css', label: 'CSS changes' }, { value: 'full', label: 'Full CSS' }]" />
              </EInline>
              <HighlightedCode :lang="codeLang" :copy-label="copyLabel" :code="code" />
              <template v-if="variantTags">
                <EText small muted>Spacing is set with component props, not tokens. This look also used:</EText>
                <HighlightedCode lang="vue" copy-label="Copy spacing props" :code="variantTags" />
              </template>
              <EText small muted>{{ changedCount }} {{ changedCount === 1 ? "setting differs" : "settings differ" }} from the defaults. The link in the address bar holds this theme.</EText>
            </EStack>
          </template>
        </ETabs>
      </section>
    </div>
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
  display: grid;
  gap: var(--e-space-3);
  padding-block-end: var(--e-space-6);
  border-bottom: var(--e-stroke-hair) solid var(--e-border);
  min-width: 0;
}
.bar-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--e-space-3) var(--e-space-5);
}
.bar-info {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  flex: 1 1 18rem;
  gap: var(--e-space-1) var(--e-space-3);
  min-width: 0;
}
.bar-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--e-space-3) var(--e-space-4);
  min-width: 0;
}
.bar-buttons {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--e-space-2);
  width: 100%;
}
@media (min-width: 30rem) {
  .bar-buttons {
    display: flex;
    width: auto;
  }
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
  gap: var(--e-space-3);
  min-width: 0;
}
.stage-tabs > :deep(.e-tabpanel) {
  padding-top: var(--e-space-3);
  min-width: 0;
}
.groups > :deep(.e-tablist) {
  overflow-x: hidden;
}
.groups > :deep(.e-tablist .e-tab) {
  flex: 1 1 0;
  min-width: 0;
  justify-content: center;
  padding-inline: var(--e-space-1);
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
    padding-inline-end: var(--e-space-1);
  }
}
</style>
