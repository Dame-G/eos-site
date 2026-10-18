---
title: Migrating from Vuetify
description: "Concept mapping from Vuetify to Eos, and notes on using both while you move."
---

# Migrating from Vuetify

Eos is smaller and more opinionated than Vuetify. It does not try to cover every Material component. It covers forms, payments, statements, scheduling and signing, and makes the rules (spacing, control height, depth) the same everywhere. This page maps the ideas. It is a starting point, not a codemod.

## Concepts

| Vuetify | Eos |
| --- | --- |
| `createVuetify({ theme })` | `createEos({ theme })` with `defineTheme()` |
| Theme colours (`primary`, `error`) | Tokens (`--e-primary`, `--e-danger`). Derived from `brand` and checked for contrast |
| Dark theme | Not covered. Eos has one light theme |
| `v-text-field` | `ETextField`. The label is a kicker above the input, not floating |
| `v-select`, `v-combobox`, `v-autocomplete` | `ESelect`, `ECombobox`, `EAutocomplete`. Use `EMultiSelect` for several values |
| `v-checkbox`, `v-radio-group`, `v-switch` | `ECheckbox`, `ERadioGroup`, `ESwitch` |
| `v-btn` with `variant` and `color` | `EButton` with `variant`: primary, secondary, outline, danger, quiet |
| `v-alert` | `ENotice` with a `tone` |
| `v-dialog`, `v-navigation-drawer` | `EDialog`, `EDrawer` |
| `v-snackbar` | `EToastProvider` and `useToast()` |
| `v-data-table` | `EDataGrid` |
| `v-date-picker` | `EDatePicker`, `ERangePicker`, `ECalendar` |
| `v-container`, `v-row`, `v-col` | `EStack`, `EInline`, `EGrid` |
| `v-card` | `ESurface` and `EPanel` |
| `v-form` rules | Your own validation plus the `error` prop and `EErrorSummary` |
| `v-icon` with an icon font | `EIcon`, with [any icon set](/guide/icons) |
| Vuetify's locale and `i18n` adapter | `locale`, `currency` and `messages` in [`createEos`](/guide/language) |

## Differences to expect

- **Errors and hints are props**, not rule arrays. Run your validation, pass the first message as `error`.
- **No spacing utility classes.** Spacing belongs to the parent (`EStack`, `EInline`), so you will delete most `class="mb-4"` and `pa-6`.
- **Every control is 48px tall.** Density options do not exist.
- **Labels are required.** Hide one visually with `hideLabel`, never remove it.
- **Depth is meaningful.** Only things you can click or that float have shadows.

## Using both while you move

Both libraries can be installed in one app. Move one page or one region at a time.

- Eos styles live in layers named `e.*`. If Vuetify's styles are not in a layer, they beat the Eos layers on any element they both style. Keep the two in separate regions of the page, or put Vuetify in a layer declared before `e.reset` (see [Cascade layers](/guide/theming#cascade-layers)). Coexistence was not tested for this site, so check the first screen you move.
- Eos reads `--e-*` variables, Vuetify reads its own. Set both from one source of truth while you migrate.
- Each Eos component works without the plugin, so you can try one in a Vuetify page before installing anything else.
- Move shared pieces first: the form fields, the buttons, the notices. Leave the app shell and data tables for last.
