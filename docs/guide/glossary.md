---
title: Glossary
description: "The words the eos docs and tokens use, defined once: ground, ink, wash, well, slab, frame, kicker, tone, value and place, paper, preset, density, tap target and more."
---

# Glossary

The words eos uses for its parts, in the docs, the token names and the props. Where a word means two things, the entry says so.

## Ground

The colour something sits on. eos has two: the page ground, `--e-background`, behind everything, and the surface, `--e-surface`, for anything on the page (cards, fields, popovers, dialogs). The tinted ground, `--e-surface-tint`, is a second step of the surface for wells, table headers and hovered rows. The `background` and `surface` inputs of [`defineTheme()`](/guide/theming#background-surface-and-foreground) set them, and a dark surface makes a dark theme.

## Ink

The text colour, `--e-ink`: body copy, headings and icons. `--e-muted` is ink softened for secondary text. The theme input that sets it is called `foreground`, not `ink`: `defineTheme({ foreground })` sets `--e-ink`, and derives `muted`, `border` and `border-strong` from it.

## Wash

A see-through fill laid over whatever is beneath, so the ground shows through. `--e-wash-hover` is the one hover fill for rows, items and quiet buttons, and `--e-wash-press` the pressed one. Both are made of the `surface-tint` colour, so a hovered row on a plain ground looks like the tinted ground. `--e-wash-ring` is the see-through edge of a hovered quiet control.

## Well

A part pressed into the page: inputs, meters and empty slots. `--e-well` is its shadow. With [slabs](#slab) and [floating](#float) parts, it is one of the three kinds of depth eos allows.

## Slab

The raised bottom edge under something you can press: a button, a checked box, the chosen day, the current nav item. It is a border in a darker shade of the face, thicker at the bottom, and pressing sinks the face over it. `--e-depth` is its thickness. See [Building your own components](/guide/building-components#the-slab).

## Frame

The flat outline of everything that is not clickable: cards, summaries, the search bar. `--e-frame` is a ring in `--e-border` with no depth. The `elevation` input changes how frames, wells and floating parts are drawn.

## Float

What a popover, a menu or a toast does: it floats over the page with a soft shadow, `--e-float`. Nothing in the flow of the page floats.

## Paper

Three related things. The `paper` variant of [`ESurface`](/components/Surface) is a warm ground and a pressed edge, for a statement or a receipt, and `--e-paper` is that edge. `"paper"` is also the default [preset](#preset): flat outlines, default corners and motion. The theme playground's "Paper" options are separate from both.

## Kicker

A small label above a value or a section, in the mono face and upper case: "Billing", "Due". [`EKicker`](/components/Kicker) draws it, and `EHeading` takes a `kicker`. It is a label, not a heading.

## Tone

Meaning carried by a colour: `neutral`, `info`, `success`, `warning` or `danger`, on `ENotice`, `EToast`, `EStamp` and `ETag` (`EText` takes all but `neutral`). A tone is never a look; `variant` is the look. `neutral` means no tone, the default look; `EText` and `EMetric` leave `tone` out for that, and take `muted` for the quieter secondary colour. One word is in both: `danger` is a `variant` on `EButton` (a destructive action) and a `tone` everywhere else (something went wrong). See [Tone, variant and status](/guide/design-principles#tone-variant-and-status).

## Status

A preset word, such as `paid`, `due` or `overdue`, that sets a stamp's tone and its text together, so the same state always reads the same.

## Value and place

The two ways eos shows "selected". **Value** is a value you set: a checked box, a switch, a chosen segment, the selected day, the current page of a pager. It is filled in `--e-primary`. **Place** is where you are: the selected tab, the current nav item. It has a washed face, primary text and a primary edge. A component uses one or the other, never both.

## Preset

A starting look for a theme: one word, `"paper"`, `"ink"` or `"quiet"`, that sets `elevation`, `strokes`, `radius` and `motion` together. Your own entries win over it. See [Presets](/guide/theming#presets). The theme playground's example themes are a different thing: full sets of inputs to start from.

## Density

How much room the space scale gives. `density: "compact"` scales every space token by 0.75 and makes controls exactly the 44px tap target. `"comfortable"` is the default. Named gaps follow it; raw pixel values do not.

## Gap

The space a layout component puts between its children, set with its `gap` prop. The named gaps, `tight`, `snug`, `base`, `loose` and `section` (4, 8, 12, 16 and 24px by default), follow `spaceScale` and density. See [Composing layouts](/guide/layouts#gaps).

## Tap target

The smallest area a finger can press reliably: `--e-tap`, 44px. No control is smaller, whatever the density or font size. `--e-control-height` (48px by default) is the height buttons and inputs share.

## Toggletip

A small panel that opens on a press (a click, Enter or Space), not on hover, and holds a short explanation, sometimes with a button. [`EToggletip`](/components/Toggletip) is one: a term in running text that opens its explanation in a non-modal panel. It was called `EDefinition` before 0.18. A tooltip (`ETooltip`) only names a control and never holds anything to read or click.

## Scoped theme

A theme applied to one part of the page instead of the whole document, with [`EConfigProvider`](/components/ConfigProvider) or `themeTarget`. See [Scoped themes](/guide/theming#scoped-themes).
