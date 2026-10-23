---
title: Design principles
description: "The layout rules that make every EOS theme feel like the same system: spacing, type, depth, how a control answers the pointer, and what a theme changes."
---

# Design principles

These rules hold in every theme. A theme changes colours, corners, fonts, scales and control height. It does not change the rules. They are also how to build a screen of your own that sits next to EOS components without looking foreign.

- **Compose.** A card is [`ESurface`](/components/Surface), buttons go in [`EActions`](/components/Actions), label and text rows are [`EDescriptionList`](/components/DescriptionList). If you need a custom box or a hand-written flex row, a building block is missing: report it.
- **The parent owns space.** Children set no outer margin. [`EStack`](/components/Stack), [`EInline`](/components/Inline), [`EGrid`](/components/Grid) and `EActions` space them.
- **One control height.** Buttons, inputs, selects and pickers share `--e-control-height` (48px by default), so a button lines up beside an input. A small button drops to the 44px tap target, `--e-tap`, and nothing goes below it.
- **Depth means "click" or "floats".** Buttons and rows have a raised bottom edge (the slab), inputs are wells, popovers and toasts float. Everything else is flat and outlined.
- **One filled button per page.** Put the main action first, left-aligned under what it acts on. Name it with a verb: "Pay $162.40".
- **The container decides.** Notices, rows, grids and actions use container queries, so a sidebar behaves like a phone.
- **Logical properties.** Spacing mirrors in right-to-left text.
- **Voice.** Sentence case. Lead with the status, then the reason, then the next step.

## Spacing and layout conventions

Spacing has two layers. The scale is `--e-space-1` to `--e-space-16`: 4, 8, 12, 16, 20, 24, 28, 32, 40, 48 and 64px by default. On top of it sit semantic tokens that name the job. They are references to the scale, so a theme's `spaceScale` and `density: "compact"` reach every one of them. In your own CSS, reach for the semantic token first.

| Need | Token | Default |
| --- | --- | --- |
| Icon and label, inside a chip, a label and its hint | `--e-gap-tight` | 4px |
| Siblings in a row: toolbar controls, button groups, form actions | `--e-gap-snug` | 8px |
| Blocks in a stack, a label and its control | `--e-gap-base` | 12px |
| Field to field in a form, cards in a grid, the parts of a dialog | `--e-gap-loose` | 16px |
| Groups of related blocks, sections of a page | `--e-gap-section` | 24px |
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

The rules behind the table:

- **The parent owns the space.** Siblings are separated by the parent's `gap`, never by a child's `margin-bottom`. Two blocks of the same kind one after the other, such as two notices, are separated by `gap-base`, not by nothing.
- **Block size is never padding.** A control is `--e-control-height` tall. Its padding is inline only.
- **A toolbar is a wrapping cluster.** A flex row that wraps, with the same `gap-snug` between rows and columns. In a narrow container, inputs and selects take the full row, so nothing is squeezed and everything lines up on one left edge.
- **Tap spacing.** Every target is at least `--e-tap` (44px) square, and at least `gap-snug` from the next one.
- **Phones.** The page gutter shrinks to `gutter-min` and a container keeps its card padding. Do not shrink padding to fit something in: wrap or stack it.

### Type

Two font families. The sans is for reading and the mono is for kickers, chips and every amount, number and date. A text style is one token: `font: var(--e-type-kicker)` sets weight, size, line height and family at once. The styles are `type-h1` to `type-h6`, `type-deck`, `type-body`, `type-small`, `type-kicker`, `type-button`, `type-numeral` and `type-numeral-l`. Letter spacing is separate: `--e-tracking-label` for uppercase labels and `--e-tracking-tight` for large figures.

Sizes are in rem, so the visitor's browser font size scales text and the controls around it, and a theme's `textScale` multiplies on top. Line heights have no unit: `leading-none` 1, `-tight` 1.15 for titles and buttons, `-snug` 1.3 for section titles and numerals, `-normal` 1.5 for copy and `-loose` 1.7. Text is 12px at the smallest by default.

### The slab

A button, a checked box, the chosen day and the current nav item have a raised bottom edge: the slab. It is a border on all four sides in the slab colour, with the bottom one thicker. Pressing sinks the face over it. Its thickness is `--e-depth`, or `--e-slab-thin` for the two small parts, a key (`EKbd`) and a tag (`ETag`). Each tone has an edge colour, such as `--e-primary-slab`, and a neutral face uses `--e-slab-ink`. A slab drawn some other way (a gradient, a pseudo-element bar, an inset shadow) will not follow a theme.

**One bold tone edge.** A notice, a stamp and a toast mark their tone with one side edge, never a slab: the inline-start border, `--e-stroke-edge` plus `--e-slab-bold` wide, in the tone's colour. It mirrors in right-to-left text.

### Hover, press and focus

Each family of things that can be pressed answers the pointer one way. A border is recoloured, never thickened, so nothing shifts on hover.

| Family | Hover | Press |
| --- | --- | --- |
| Text link (`ELink`) | The ink colour. No wash, no ring | The same |
| Breadcrumb | A wash under the link text | The same |
| Disclosure summary (`EDisclosure`) | `--e-wash-hover` only: no ring, no underline | `--e-wash-press` |
| Bordered item: a tab, a segment, a card, a link card | The border turns `--e-wash-ring` | The border turns `--e-ink` |
| Unbordered row: a menu item, an option, a nav item, a page in a pager, a quiet button | `--e-wash-hover` and `box-shadow: var(--e-ring-hover)` | `--e-wash-press` and `box-shadow: var(--e-ring-press)` |
| Filled control: a button, a checked box | The tone's `-hover` fill | The tone's `-press` fill, and the slab sinks |

Every family changes over `transition: var(--e-transition-state)`, and hover styles apply only on devices that can hover. The text link is the one family where colour is the whole change: it is already underlined, so the underline carries it.

**Focus** is a solid `--e-stroke-focus` outline in `--e-focus-ring`. It sits outside the element, offset by `--e-stroke-focus`, except on rows that touch their neighbours or sit in a clipped list (a menu, an option list, a scrolling panel), where it is drawn inside the row so the clip never cuts it. A text input is different on purpose: its focus outline is `--e-focus-field` and lies exactly over its border.

**Rows are concentric with their panel.** A row in a menu or list panel is inset from the panel's edge by `--e-gap-tight`, and its corner is the panel's radius less that inset (`--e-radius-row`: 4px in an 8px panel), so the two curves share a centre. Inside a bordered container, take the border off as well. Never give a child the same radius as its parent.

### Selected

Two voices, and a component uses one. **Value** means a value you set: filled `--e-primary` with `--e-on-primary`, and a primary slab. Toggle buttons, checkboxes, radios, switches, segmented controls, the current page of a pager and the selected day use it. **Place** means where you are: a `--e-wash-hover` face, primary text and a primary edge, drawn two ways. A selected tab sits in a bordered strip beside its neighbours, so it thickens all four of its edges evenly, the bottom one primary. The current nav item stands alone, so it takes a slab under it.

### Disabled

A control keeps its box, drops its lift, dims to `--e-disabled-ink` and draws a dashed outline, so colour is never the only cue. A list row (a menu item, an option, a nav item) only dims its text and stops answering the pointer, since a dashed box on every unavailable row is noise.

### Motion

`--e-duration-tap` for hover and press, `--e-duration-fade` for things that fade (a dialog's scrim) and `--e-duration-move` for things that move. Something entering, such as a dialog, a drawer or the command palette, uses `--e-easing-enter`; leaving uses `--e-easing-exit`; every state change uses `--e-easing-out`. All three durations collapse under `prefers-reduced-motion`.

## Tone, variant and status

Three props that are easy to mix up. Each means one thing across the library.

| Word | Means | Values | Where |
| --- | --- | --- | --- |
| `tone` | Meaning in a colour. Never a look | `neutral`, `info`, `success`, `warning`, `danger` | `ENotice`, `EToast`, `EStamp`, `ETag`, `EText` |
| `variant` | Visual weight: how loudly something speaks, or what it is drawn as | `primary`, `secondary`, `outline`, `danger`, `quiet` on a button; `paper`, `raised`, `outline`, `tinted` on a surface | `EButton`, `EMenu`, `ESurface` |
| `status` | A preset word that sets the tone and the text together | `paid`, `due`, `overdue`, `scheduled` and more | `EStamp`, and `stamp` on `EDescriptionList` items |
