---
title: Building your own components
description: "How eos draws things, for a component of your own that sits beside the library: the slab, the tone edge, hover and press by family, focus, concentric rows, selected, disabled and motion."
---

# Building your own components

Compose from eos first: most screens need no CSS of their own (see [Design principles](/guide/design-principles)). When you do draw a component yourself, these are the rules the library follows, written as tokens so your component follows every theme. The spacing tokens are in [Design principles](/guide/design-principles#spacing), and every token is in the [token reference](/guide/tokens). [`useFieldAttrs()`](/guide/composables#smaller-helpers), [`EField`](/components/Field) and the other helpers for a control of your own are under [Composables](/guide/composables).

## The slab

A button, a checked box, the chosen day and the current nav item have a raised bottom edge: the slab. It is a border on all four sides in the slab colour, with the bottom one thicker. Pressing sinks the face over it. Its thickness is `--e-depth`, or `--e-slab-thin` for the two small parts, a key (`EKbd`) and a tag (`ETag`). Each tone has an edge colour, such as `--e-primary-slab`, and a neutral face uses `--e-slab-ink`. A slab drawn some other way (a gradient, a pseudo-element bar, an inset shadow) will not follow a theme.

**One bold tone edge.** A notice, a stamp and a toast mark their tone with one thick side, never a slab: the inline-start border is `--e-stroke-edge` plus `--e-slab-bold` wide, in the tone's colour (a notice and a stamp also draw the other sides at `--e-stroke-edge`). It mirrors in right-to-left text.

## Hover, press and focus

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

## Selected

Two voices, and a component uses one. **Value** means a value you set: filled `--e-primary` with `--e-on-primary`, and a primary slab. Toggle buttons, checkboxes, radios, switches, segmented controls, the current page of a pager and the selected day use it. **Place** means where you are: a `--e-wash-hover` face, primary text and a primary edge, drawn two ways. A selected tab sits in a bordered strip beside its neighbours, so it thickens all four of its edges evenly, the bottom one primary. The current nav item stands alone, so it takes a slab under it.

## Disabled

A control keeps its box, drops its lift, dims to `--e-disabled-ink` and draws a dashed outline, so colour is never the only cue. A list row (a menu item, an option, a nav item) only dims its text and stops answering the pointer, since a dashed box on every unavailable row is noise.

## Motion

`--e-duration-tap` for hover and press, `--e-duration-fade` for things that fade (a dialog's scrim) and `--e-duration-move` for things that move. Something entering, such as a dialog, a drawer or the command palette, uses `--e-easing-enter`; leaving uses `--e-easing-exit`; every state change uses `--e-easing-out`. All three durations collapse under `prefers-reduced-motion`.

