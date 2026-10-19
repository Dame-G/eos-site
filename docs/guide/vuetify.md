---
title: Migrating from Vuetify
description: "Concept mapping from Vuetify to Eos."
---

# Migrating from Vuetify

This page maps Vuetify concepts to Eos. It is not a codemod.

| Vuetify | Eos |
| --- | --- |
| `createVuetify({ theme })` | `createEos({ theme })` with `defineTheme()` |
| Theme colours | Tokens (`--e-primary`, `--e-danger`), derived from `brand` |
| Dark theme | A dark `surface`, `foreground` and `background` in `defineTheme()`; see [Theming](/guide/theming#background-surface-and-foreground) |
| `v-text-field` | `ETextField` (label above, not floating) |
| `v-select`, `v-combobox`, `v-autocomplete` | `ESelect`, `ECombobox`, `EAutocomplete`, `EMultiSelect` |
| `v-checkbox`, `v-radio-group`, `v-switch` | `ECheckbox`, `ERadioGroup`, `ESwitch` |
| `v-btn` | `EButton` with `variant` |
| `v-alert` | `ENotice` with a `tone` |
| `v-dialog`, `v-navigation-drawer` | `EDialog`, `EDrawer` |
| `v-snackbar` | `EToastProvider` and `useToast()` |
| `v-data-table` | `EDataGrid` |
| `v-date-picker` | `EDatePicker`, `ERangePicker`, `ECalendar` |
| `v-container`, `v-row`, `v-col` | `EStack`, `EInline`, `EGrid` |
| `v-card` | `ESurface`, `EPanel` |
| `v-form` rules | Your validation, the `error` prop, `EErrorSummary` |
| `v-icon` | `EIcon`, with [any icon set](/guide/icons) |
| Locale and i18n adapter | [`locale`, `currency`, `messages`](/guide/language) |

## Differences

- Errors and hints are props, not rule arrays: pass the first message as `error`.
- No spacing utility classes: the parent owns spacing.
- Every control has one height (48px by default, set with `controlHeight`). There are no density options.
- Labels are required (`hideLabel` hides one visually).

## Using both

Move one region at a time. Eos styles are layered, so Vuetify's unlayered styles win where both style an element. Keep the two in separate regions, or declare Vuetify in a layer before `e.reset` ([layers](/guide/theming#cascade-layers)). Each Eos component works without the plugin, so you can place one inside a Vuetify page first.
