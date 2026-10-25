---
title: Upgrading
description: "The changes that need something from you, minor version by minor version, newest first."
---

# Upgrading

Before 1.0 a minor version can change the API: an old name is removed outright, with no deprecated alias. This page lists, for each recent minor, what you may have to change in your code. Patch versions never need changes. The full notes, including new features and fixes, are in the [changelog](/changelog). See [Versioning and support](/guide/versioning) for how version ranges behave before 1.0.

## 0.18 (next release)

These changes are on the library's main branch and not released yet. See the [changelog](/changelog) once 0.18 is out for the full list.

- `EDefinition` is renamed `EToggletip`. `EDefinition` still works in 0.18 as a deprecated alias that warns in development.
- `ETable` `size="sm"` is the boolean `dense`, which `EDataGrid` takes too. `EDataGrid` `cards` is opt-in: pass `cards` to keep rows turning into cards below 40rem.
- `EContainer` `size` is renamed `width`.
- `ESurface` `size` is removed: set `padding` (`size="lg"` was `padding="section"`).
- `EAvatar` `as="button"` is the boolean `interactive`.
- `EText` and `EMetric` take `tone="muted"` for the quieter colour; `tone="neutral"` still renders muted in 0.18 and warns, and will mean the default ink.
- The message `codeCopied` is renamed `copied`.
- `success` and `success-soft` are their own colours, from a new `success` input of `defineTheme()`. A theme that set `accent` to change success states sets `success` instead.
- `createEos()` without a `theme` applies nothing (`style.css` carries the default), and with one adds it as a stylesheet in the `e.tokens` layer instead of inline custom properties.
- `EConfigProvider` renders menus, dialogs, tooltips and toasts inside itself only when it sets a `theme` or `scheme`.

## 0.17

No code changes. The default colours moved: `surface-tint` is deeper and carries a light touch of the brand hue (in a dark theme too, from 0.17.1), the default `border` is `#6d7d84` (was `#7c8c93`), and the hover and press washes are made from the tint instead of from `ink`. If you relied on the old values, set them in `defineTheme({ tokens })`.

## 0.16 and 0.15

No code changes. `ENotice` became full width and square in 0.15, then bordered on every side and rounded again in 0.16. The `EAppShell` side ground became a mix of the brand colour.

## 0.14

No code changes. The default theme is now pastel lavender: `brand` `#bfa8f5`, `brand-accent` `#9ad9b4`, `primary` `#624b90`, `secondary` `#266444`, and a default dark surface of `#15121b`. A theme that sets its own `brand`, `accent` and `surface` looks the same as before. To keep the old look, set those three.

## 0.13

The big clean-up: every old spelling was removed.

**Props**

| Removed | Use |
| --- | --- |
| `small`, `large` on `EAvatar`, `ESpinner`, `ESurface`, `EText`; `small` on `EIcon`, `EKbd`, `EStamp`; `dense` on `ETable` | `size="sm"`, `size="lg"` |
| `ESurface` `paper`, `raised` | `variant="paper"`, `variant="raised"` |
| `ESurface` `pad` | `size`, `padding` or `flush` |
| `ESurface` `variant="tone"` | `variant="tinted"` |
| `EText` `muted` and `tone="muted"`; `EStamp` `tone="ink"` | `tone="neutral"` |
| `EAvatar` `status` | `presence` |
| `EDescriptionList` item `badge`, `badgeTone` | `stamp`, `stampTone` |
| `EDataGrid` `bare` | `ETable` for a short static list |
| `EUpload` `@files` | `v-model` or `@update:model-value` |
| `EMenu`, `EDrawer` `side="left"`, `"right"`; `useLogicalSide()` with `left`, `right` | `start`, `end` |
| `EInline` `nowrap` | `:wrap="false"` |
| `ESearchResults` `@edge` | `@exit-top` |

**Changed defaults and sizes**

- `clearable` is off by default in every field, `ESearchBar` and `ECombobox` included. Add `clearable` where you want the clear button.
- `EIcon` sizes: `md` is 20px (was 28px) and `lg` is 28px (was 40px). Change `size="md"` to `size="lg"`, and `size="lg"` to `size="xl"`.
- `ETable` `skeletonRows` defaults to 5 (was 3).

**Behaviour**

- `ETooltip` no longer emits `close` when you set `open` to false.
- `ECommandPalette` emits `close` when a command is chosen.
- A disabled `EStepper` step stays focusable, with `aria-disabled`.

**Messages**

- `dragHere` is `dropFile`, with a `{choose}` placeholder. `closeToast` is removed: the toast's button uses `dismiss` and reads "Dismiss".
- The brackets of the stepper's `done` and `stepError` messages moved into the messages: "(done)", "(has an error)". If you translated them, add the brackets.

**Themes and tokens**

- `defineTheme`: `strokes.edge` and `strokes.card` are removed (`strokes.hair` derives both; pin them with `tokens: { "stroke-edge": … }`). `motion: "none"` is removed: set `duration-tap`, `duration-fade` and `duration-move` in `tokens`.
- Renamed tokens: `slab` → `depth`, `stroke-ring` → `stroke-edge`, `surface-hover` and `surface-press` → `wash-hover` and `wash-press`, `brand-blue` and `brand-green` → `brand` and `brand-accent`, `easing-standard` → `ease-in-out`, `on-info`, `on-success`, `on-warning` → `on-primary`, `on-secondary`, `surface`. `shade-hover`, `shade-press` and `shade-slab` → each fill's `*-hover`, `*-press` and `*-slab`, or `slab-ink`.
- Removed tokens: `leading-loose` and `space-7` (use a neighbouring step; a `gap` or padding of `7` is no longer valid), and `bp-narrow`, `bp-medium`, `bp-wide` (write `26rem`, `36rem`, `48rem`).
- `@eos-ui/tokens` no longer exports `deprecated`, and the DTCG export drops `$deprecated`.
- The undocumented classes `.e-slab` (and its variants), `.e-selected--value`, `.e-selected--place`, `.e-disabled`, `.e-disabled-row` and `.e-interact--field` are gone from `base.css`.

**Imports**

- Global component types moved to `@eos-ui/vue/globals`: add `import type {} from "@eos-ui/vue/globals"` if you register components globally.
- `useSize`, `useDetails`, `useFieldControl`, `useFormField`, `FORM_KEY`, `isApple` and `localeDirection` are no longer exported.
- The package root registers the built-in icons. An app that imports only per-component paths adds `import "@eos-ui/vue/icons/builtin"` once.

## 0.12

Visual changes. `ETag` is a square paper tag with quiet tones, no longer a pill: use `EStamp` for a status. `ECombobox` draws its chips with `ETag`, so CSS aimed at its old chip classes must change. `ELink` lost its hover background and `EDisclosure` its link-style underline.

## 0.11

- `ESearchBar` renders a `div` with `role="search"` instead of a `form`: Enter emits `submit`, and there is no default `name="q"`.
- `ESwitch` puts `class` and `style` on a wrapper `div`.
- `ESegmented` no longer emits `update:modelValue` on mount.
- `EStack`'s default gap is 12px (`base`, was 16px), `EInline`'s is `snug` and `EGrid`'s is `loose`.
- The message `opensInNewTab` is `opensNewTab`.
- `package.json` has no `main` or `module`: the package is ES modules only.
- The tokens `surface-raised` and `surface-sunken` are removed.

For anything older, see the [changelog](/changelog).
