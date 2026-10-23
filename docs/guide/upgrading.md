---
title: Upgrading
description: "Before and after for every breaking change in EOS since 0.1, newest first."
---

# Upgrading

EOS is pre-1.0, so a minor version can break things. This page shows what changed and what to write instead, newest first. The full notes are in the [changelog](/changelog).

How to upgrade:

1. Move both packages together. `@eos-ui/vue` and `@eos-ui/tokens` share one version.
2. Read the sections between your version and the new one.
3. Run `vue-tsc`. Removed props, renamed events and removed exports are type errors. Removed or renamed CSS variables are not, so search your styles for the names below.
4. Look at the page in a browser. A changed default (a close button, padding) shows only on screen.

## Not released yet

::: info Unreleased
Changes on the development branch that are in no published version. Each moves under a version heading when one ships, and until then it can still change.
:::

<!-- UNRELEASED:start -->

Read from the library's working tree, not from a release. Check each against the changelog when the version ships.

### Tokens

**Sizes are in rem.** `--e-text-xs` to `--e-text-4xl`, `--e-control-height`, `--e-chip-height` and the icon, checkbox and avatar boxes are `rem` now, not `px`. The visitor's browser font size scales text and the controls around it, and `textScale` multiplies on top. CSS that did arithmetic on these in pixels needs rem.

```css
/* before: a 48px control height was assumed */
.row { min-height: calc(var(--e-control-height) + 8px); }
/* after: keep the units in the calc */
.row { min-height: calc(var(--e-control-height) + 0.5rem); }
```

**Removed.** `--e-surface-raised` and `--e-surface-sunken`: use `--e-surface` or `--e-surface-tint` for the ground you want. `--e-shade-hover`, `--e-shade-press` and `--e-shade-slab` are now listed with the colours.

**Added.** The semantic spacing tokens (`gap-*`, `pad-*`, `gutter`), the type styles (`type-*`) with `tracking-*` and `leading-*`, `duration-fade`, `easing-enter`, `easing-exit`, and the slab and interaction tokens (`slab-thin`, `slab-bold`, `stroke-ring`, `ring-hover`, `ring-press`, `wash-hover`, `wash-press`, `transition-state`). See [Spacing and layout conventions](/guide/design-principles#spacing-and-layout-conventions). Nothing to change unless you set one by name.

### Theme

- `defineTheme()` takes `preset` (`"paper"`, `"ink"`, `"quiet"`), and a theme has `warnings` and `explain(token)`. See [Presets](/guide/theming#presets).
- `@eos-ui/tokens/tokens.auto.css` is the stylesheet that follows `prefers-color-scheme`. `tokens.css` stays light.

### Language and direction

`createEos({ locale })` now sets `lang` on the theme target in a browser, and sets `dir` from the locale when you do not give one: Arabic, Hebrew, Persian and Urdu are right to left. Before, `dir` was set only when you passed it, and `lang` never. If you set `lang` or `dir` on `<html>` yourself and the locale disagrees, the plugin now wins in the browser.

```ts
// before: dir had to be given for a right to left locale
createEos({ locale: "ar", dir: "rtl" });
// after: the locale is enough
createEos({ locale: "ar" });
```

`useDir()` returns the direction in use, for a third-party part that assumes left to right.

### Scoped themes

Set `themeTarget` and `portalTarget` together in `createEos()`. The docs used to show setting `eos.config.portalTarget` afterwards, which still works. A `portalTarget` outside the theme target leaves floating parts unthemed.

```ts
// before
const eos = createEos({ theme, themeTarget: el });
eos.config.portalTarget = el;
// after
createEos({ theme, themeTarget: el, portalTarget: el });
```


### Components

**New.** [`EForm`](/components/Form) (an error summary, focus on the first problem, a `submitting` state), [`ESlider`](/components/Slider) (one value or a range, marks, `format`), [`ETag`](/components/Tag), [`EMetric`](/components/Metric), [`EAvatarGroup`](/components/AvatarGroup), [`ECheckboxGroup`](/components/CheckboxGroup) and [`EContainer`](/components/Container). Nothing to change unless you wrote your own.

**Default gaps changed.** `EStack` now defaults to `gap="base"` (12px), `EInline` to `snug` (8px) and `EGrid` to `loose` (16px). `gap` takes `tight`, `snug`, `base`, `loose` or `section`, as well as a space token number or any CSS length. A stack that relied on the old default now spaces differently: set the `gap` you want.

```vue
<!-- before: the old default -->
<EStack>...</EStack>
<!-- after: say what you mean -->
<EStack gap="loose">...</EStack>
```

**`ESearchBar` is not a form.** It renders a `div` with `role="search"`, emits `submit` on Enter or the button, and has no default `name`. Wrap it in your own `form` when you need a native submit, and pass `name` when a value must be posted.

**`EDrawer` sides.** `side="left"` and `side="right"` are deprecated and warn in development. Use `start` and `end`, which follow the reading direction.

```vue
<!-- before -->
<EDrawer side="left" />
<!-- after -->
<EDrawer side="start" />
```

**`EAppShell` on a narrow screen.** Below 48rem the sidebar renders in a drawer, opened with `v-model:navOpen` or the header's `navToggle`. The `aside` landmark is named "Sidebar". A test that looked for the sidebar by its old name needs the new one.

**`ESwitch` wrapper.** `class` and `style` now land on a wrapper `div`, not on the input. Target the input with `:deep()` or a descendant selector.

**Also new, with nothing to change:**

- `size` on `EStamp`, `EKbd`, `ESpinner`, `EAvatar`, `EIcon`, `EButton` and the fields, alongside the older `small` and `large` flags. `size` wins.
- `EText` gained `size`, `tone`, `align`, `weight`, `mono`, `truncate` and `lines`. `ESurface` gained `size`, `padding` and `variant`.
- `ETabs`, `ENavList` (nested groups, `disabled`, `isCurrent`), `EBreadcrumb` (`label`, `maxItems`), `EStepper` (interactive, `orientation`, an error state), `EDisclosure` and `EExpandableRow` (`disabled`, `animated`), `EIconButton` (`variant`, `size`, `loading`, `tooltip`).
- `EDialog` and `EDrawer` `size` and `initialFocus`. `ECommandPalette` `v-model:query` and `:filter="false"` for a server search. `EMenu` rows for links, labels, checkboxes, radio groups and submenus, and `side` `start` or `end`.
- `EToastProvider` `limit`; `useToast()` `key`, `update` and `promise`; F8 moves focus to the toast region.
- `ESelect` `multiple`, `clearable`, `loading`, `readonly`; `ESelect`, `ECombobox`, `ERadioGroup` and `ESegmented` are generic over their value type. `ECheckbox` and `ESwitch` take `hint`, `error`, `required`, `readonly`. `EDatePicker` and `ERangePicker` take `valueFormat="iso"`. `ETextField` `clearable`, `counter`, `maxlength`, `submitValue`; `ETextarea` `autoGrow`; `ENumberField` commits as you type; `EPhoneField` `valueFormat`.
- `EDataGrid` `error` with a retry, `rowLabel`, rows that stay while `loading`, and announced selection. `ETable` `loading`, `empty`, `cards` and `size`. `ECodeBlock` `wrap` and `lineNumbers`.
- New exports for building your own parts: [`useDetails`, `useOverflow`, `useSize`, `useFieldControl`, `useFormField`](/guide/api#usedetails-open-options).

<!-- UNRELEASED:end -->

## 0.10.0

The audit release. Breaking changes are grouped by what you touch.

### Tokens and CSS

| Before | After |
| --- | --- |
| `var(--e-edge)` | `var(--e-frame)` |
| `var(--e-focus-gap)` | `var(--e-stroke-focus)`: the focus outline's width is also its gap. A field's outline still follows `--e-focus-gap-field` |
| `var(--e-print-ink)`, `var(--e-print-paper)` | Removed. Printing sets `ink`, borders and grounds to black and white for you |

```css
.card {
  box-shadow: var(--e-frame);
  outline-offset: var(--e-stroke-focus);
}
```

### Components

**`ECommandPalette`: `filter` is now `score`.** `filter` decided yes or no. `score` returns a number: above 0 includes the item, higher lists first, 0 leaves it out. The query is trimmed, lower case and without accents.

```vue
<!-- before -->
<ECommandPalette :items="commands" :filter="(item, q) => item.label.toLowerCase().includes(q)" />
<!-- after -->
<ECommandPalette :items="commands" :score="(item, q) => (item.label.toLowerCase().includes(q) ? 1 : 0)" />
```

**`ETabs`: `framed` is removed, and panel slots are `panel-<id>`.** There is one look for tabs. A panel slot is named for the tab's `id` with a `panel-` prefix.

```vue
<!-- before -->
<ETabs v-model="tab" framed :items="items">
  <template #open>Open statements</template>
</ETabs>
<!-- after -->
<ETabs v-model="tab" :items="items">
  <template #panel-open>Open statements</template>
</ETabs>
```

**Close and clear buttons.**

| Component | Now |
| --- | --- |
| `ENotice` | Shows its close button only with `closable`. Handle `@close` to remove it |
| `EToast` | Shows its dismiss button by default. `:closable="false"` hides it |
| `ECalendar` | Shows Clear only with `clearable` |

```vue
<!-- before: the close button was there without asking -->
<ENotice title="Form due" @close="hide" />
<!-- after -->
<ENotice title="Form due" closable @close="hide" />
```

**`ESurface` is padded by default.** `flush` removes the padding for a table or image that runs to the edge. `pad` is deprecated: use `small`, `large` or `flush`.

```vue
<!-- before -->
<ESurface pad="md">...</ESurface>
<!-- after -->
<ESurface>...</ESurface>
<ESurface flush>...a table that runs to the edge...</ESurface>
```

**`EDataGrid`.** `v-model:selected` keeps the type of the row ids, so a numeric `id` stays a number. In `manual` mode `queryChange` fires once on mount, so the first fetch needs no code of its own. Delete the fetch you wrote for the first page, or it loads twice.

**`ESearchResults`.** Entries with no link render as buttons. The `edge` event is deprecated: use `exit-top` and `exit-bottom`.

**`EUpload`.** With `multiple`, a choice is added to the list and no longer replaces it. Clear the model yourself if you relied on replacing.

**`EPagination`.** Previous and Next are `aria-disabled` at the ends, not `disabled`, so they keep focus. Select them in tests by `aria-disabled="true"`.

**`ENavList`.** An item with no `href` or `to` is plain text, not a link.

**Fixes that change behaviour.** Tab no longer traps in `EOtpField`. `EPagination` and `ENumberField` keep focus at their limits. `ECheckbox` keeps focus when `error` toggles. `ESignatureField` no longer announces every keystroke. Nothing to change in your code.

## 0.9.0

No removed props. Two things to check:

- The messages `you`, `team`, `automatic` and `activity` are removed. Delete any override of them.
- `rangeDone` (used by `ECalendar`) is a plural message and takes `n`. An override that uses `{days}` keeps working.

A message can now be a plural object (`{ one, other }`). A plain string still works.

## 0.5.0

`EStamp`: the `size` prop is gone, and `small` is a boolean, like `EIcon`, `EAvatar` and `EKbd`.

```vue
<!-- before -->
<EStamp status="paid" size="sm" />
<!-- after -->
<EStamp status="paid" small />
```

## 0.2.0

The big prop and component sweep. If you started on 0.1, expect to touch most of this.

### Replaced components

| Removed | Use instead |
| --- | --- |
| `EAutocomplete` | `<ECombobox freeform>`. The model is the typed text |
| `EMultiSelect` | `<ECombobox multiple>`. The model is a `string[]`, shown as tags |
| `EPopover` | `EDefinition`, with the same props, slots and behaviour |
| `EButtonGroup` | `EActions`. Give it a `label` for `role="group"` |
| `ELoadingBar` | `EProgress` with no `value` |
| `EChip` | `EStamp` |
| `EAccordion` | `EDisclosure` items sharing a `group` |
| `EMetaList`, `EDetailRow`, `EItemList`, `EItemRow` | `EDescriptionList` (`label`, `icon`, `badge`, `editable` and an `action` slot) |
| `EFormSection` | `EFieldset` with `section` (`legend` is the title, `hint` the description) |
| `EErrorSummary` | Each field's own `error`. For a summary at the top, see [Error summary](/guide/forms#error-summary) |
| `EToggle`, `ELinkCard`, `EBackLink`, `EPanel` | [Recipes](/guide/recipes) built from `EButton`, `ESurface`, `ELink` and `EHeading` |
| `EAmount`, `ETimeline` | `EKicker` with your own numerals, `EDescriptionList` or a plain list |
| `EStatementCard`, `EStatementRow`, `EBookingCard`, `ESlotPicker`, `ECardField`, `EAddressField` | Compose them from `EFieldset`, `ETextField`, `ESelect`, `ESurface`, `EDescriptionList`, `EExpandableRow`, `EStamp` and `EDisclosure`. The `@eos-ui/vue/patterns` entry point is gone |

```vue
<!-- before -->
<EAutocomplete v-model="query" label="Clinic" :options="clinics" />
<EMultiSelect v-model="days" label="Days" :options="week" />
<!-- after -->
<ECombobox v-model="query" label="Clinic" :options="clinics" freeform />
<ECombobox v-model="days" label="Days" :options="week" multiple />
```

### Renamed props

| Component | Before | After |
| --- | --- | --- |
| `EText` | `variant="small"` | `small` |
| `EText` | `variant="deck"` | `large` |
| `ESurface` | `tone="tint"` | Removed |
| `ESurface` | `tone="float"` | `raised` |
| `EDataGrid` | `plain` | `bare` |
| `EOtpField` | `type` | `inputmode` |
| `EStamp` | Default tone without a status was `info` | `neutral`. There are new `neutral` and `ink` tones |
| `EChip`, `EStamp`, `EDisclosure` | `variant` | Removed. `variant` is only for `EButton` and `EMenu` |
| `ENavList`, `ETabs` | `dense` | Removed |
| `ETabs` | Link mode (`href`, `to`, `current`, `linkComponent`) | Removed. Tabs switch panels only, and `ENavList` is every list of links |

### Tokens

`--e-stroke-edge` is a whole pixel (1px by default). `--e-z-sticky` is 2. `--e-focus-gap-field` is `calc(-1 * var(--e-stroke-edge))`, so a field's focus outline lies over its border. Check any of these you set by hand.
