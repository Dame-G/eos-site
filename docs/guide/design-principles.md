---
title: Design principles
description: "The rules that make every eos theme feel like the same system, and how to follow them on a screen of your own: compose, the parent owns space, one control height, depth, spacing, and tone, variant and status."
---

# Design principles

These rules hold in every theme. A theme changes colours, corners, fonts, scales and control height. It does not change the rules. Follow them and a screen of your own sits next to eos components without looking foreign. To draw a component of your own, see [Building your own components](/guide/building-components).

- **Compose.** A card is [`ESurface`](/components/Surface), buttons go in [`EActions`](/components/Actions), label and text rows are [`EDescriptionList`](/components/DescriptionList). If you need a custom box or a hand-written flex row, a building block is missing: report it.
- **The parent owns space.** Children set no outer margin. [`EStack`](/components/Stack), [`EInline`](/components/Inline), [`EGrid`](/components/Grid) and `EActions` space them with their `gap`. Two blocks of the same kind one after the other, such as two notices, are separated by `gap-base`, not by nothing.
- **One control height.** Buttons, inputs, selects and pickers share `--e-control-height` (48px by default), so a button lines up beside an input. A small button drops to the 44px [tap target](/guide/glossary#tap-target), `--e-tap`, and nothing goes below it.
- **Depth means "click" or "floats".** Buttons and rows have a raised bottom edge (the [slab](/guide/glossary#slab)), inputs are [wells](/guide/glossary#well), popovers and toasts float. Everything else is flat and outlined.
- **One filled button per page.** Put the main action first, left-aligned under what it acts on. Name it with a verb: "Pay $162.40".
- **The container decides.** Notices, rows, grids and actions use container queries, so a sidebar behaves like a phone.
- **Logical properties.** Spacing mirrors in right-to-left text.
- **Voice.** Sentence case. Lead with the status, then the reason, then the next step. More in [Words and language](/guide/language).

## Spacing

Spacing has two layers. The scale runs from `--e-space-1` to `--e-space-16` (steps 1 to 6, 8, 10, 12 and 16): 4, 8, 12, 16, 20, 24, 32, 40, 48 and 64px by default. On top of it sit semantic tokens that name the job. They are references to the scale, so a theme's `spaceScale` and [`density`](/guide/glossary#density) reach every one of them. In your own CSS reach for the semantic token first, and on a layout component use the gap's name: `<EStack gap="loose">`.

| Need | Token, and `gap` name | Default |
| --- | --- | --- |
| Icon and label, inside a chip, a label and its hint | `--e-gap-tight`, `tight` | 4px |
| Siblings in a row: toolbar controls, button groups, form actions | `--e-gap-snug`, `snug` | 8px |
| Blocks in a stack, a label and its control | `--e-gap-base`, `base` | 12px |
| Field to field in a form, cards in a grid, the parts of a dialog | `--e-gap-loose`, `loose` | 16px |
| Groups of related blocks, sections of a page | `--e-gap-section`, `section` | 24px |
| Inline padding of a text control (button, input, select, tab) | `--e-pad-control` | 16px |
| Inline padding of a quiet or compact control, a menu item, a list row | `--e-pad-control-sm` | 12px |
| Chip, stamp, tag | `--e-pad-chip` | 12px |
| Table and grid cells | `--e-pad-cell` | 12px, then 16px |
| Card, summary, notice, any bordered container | `--e-pad-card` | 16px |
| Dialog, drawer, popover section | `--e-pad-panel` | 24px |
| Side gutter of a page | `--e-gutter` | `--e-gutter-min` on a phone, growing to `--e-space-12` |

```css
.balance {
  display: grid;
  gap: var(--e-gap-base);
  padding: var(--e-pad-card);
}
```

- **Block size is never padding.** A control is `--e-control-height` tall. Its padding is inline only.
- **A toolbar is a wrapping cluster.** A row that wraps, with the same `gap-snug` between rows and columns. In a narrow container, inputs and selects take the full row, so nothing is squeezed and everything lines up on one left edge.
- **Tap spacing.** Every target is at least `--e-tap` (44px) square, and at least `gap-snug` from the next one.
- **Phones.** The page gutter shrinks to `gutter-min` and a container keeps its card padding. Do not shrink padding to fit something in: wrap or stack it.

## Type

Two font families. The sans is for reading and the mono is for kickers, chips and every amount, number and date. A text style is one token: `font: var(--e-type-kicker)` sets weight, size, line height and family at once. The styles are `type-h1` to `type-h6`, `type-deck`, `type-body`, `type-small`, `type-kicker`, `type-button`, `type-numeral` and `type-numeral-l`. Letter spacing is separate: `--e-tracking-label` for uppercase labels and `--e-tracking-tight` for large figures.

Sizes are in rem, so the visitor's browser font size scales text and the controls around it, and a theme's `textScale` multiplies on top. Line heights have no unit: `leading-none` 1, `-tight` 1.15 for titles and buttons, `-snug` 1.3 for section titles and numerals, `-normal` 1.5 for copy and `-loose` 1.7. Text is 12px at the smallest by default.

## Tone, variant and status

Three props that are easy to mix up. Each means one thing across the library.

| Word | Means | Values | Where |
| --- | --- | --- | --- |
| [`tone`](/guide/glossary#tone) | Meaning in a colour. Never a look | `neutral`, `info`, `success`, `warning`, `danger`; `EText` and `EMetric` also take `muted`, the quieter secondary colour | `ENotice`, `EToast`, `EStamp`, `ETag`, `EText`, and a subset on `EMetric` and `EEmptyState` |
| `variant` | Visual weight: how loudly something speaks, or what it is drawn as | `primary`, `secondary`, `outline`, `danger`, `quiet` on a button; `paper`, `raised`, `outline`, `tinted` on a surface | `EButton`, `EMenu`, `ESurface` |
| `status` | A preset word that sets the tone and the text together | `paid`, `due`, `overdue`, `scheduled` and more | `EStamp`, and `stamp` on `EDescriptionList` items |

`danger` is the one word in two columns: a `variant` on `EButton` (a destructive action, drawn filled in the danger colour) and a `tone` elsewhere (a message about something that went wrong).
