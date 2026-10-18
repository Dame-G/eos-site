---
title: Design principles
description: "Spacing rhythm, where depth is allowed, one control height, and where actions go. Why every Eos theme feels like the same system."
---

# Design principles

These rules are not options. They keep every theme feeling like the same system: a rebrand changes colours, corners and fonts, not how a page is laid out.

## Compose, do not copy

A card is an `ESurface`. A group of buttons is `EActions`. Rows of label and text are an `EDescriptionList`. A row of icon and text is an `EMetaList`. If a page needs a custom box or a hand-written flex row, a building block is missing: report it.

The [patterns](/patterns/) use only library components for this reason. They are the integration test of the whole system.

## Space belongs to the parent

Children never set their own outer margin. `EStack`, `EInline`, `EGrid` and `EActions` space them, so a component moves from a page into a drawer with no edits.

## Spacing rhythm

Related things sit close, groups sit apart.

| Space | Where |
| --- | --- |
| 4px (`--e-space-1`) | Lines of text that belong together: a label and its value, a kicker and a title, an amount and its details |
| 8px (`--e-space-2`) | A label and its control, a heading and its lead |
| 12px (`--e-space-3`) | Two blocks that belong to one idea |
| 16px (`--e-space-4`) | Between fields, and between the parts of a card. The default `EStack` gap |
| 24px (`--e-space-6`) | Between groups and sections of a page |
| 32px (`--e-space-8`) | Between page regions |

A control that depends on a choice follows it directly, as the amount field under "Another amount" does in [Pay a bill](/patterns/pay-a-bill).

## Where depth is allowed

**Depth means "you can click this" or "this floats".** Buttons and statement rows carry a 2px bottom edge and darken on hover. Inputs are wells, pressed into the page. Popovers, menus and toasts float, with the one `--e-float` shadow. Everything else is flat and outlined with `--e-edge`.

Edges show on white: cards and rows use `border` (3:1 or more), controls use `border-strong`. A pale tint never marks a boundary alone.

## One control height

Every tappable control is 48px tall: buttons, inputs, selects, date fields, time slots. A button beside an input lines up, and a field never shifts when it changes type. Inputs use 16px text or more so phones do not zoom on focus.

## Actions

- A group of buttons reads in the order of the content, main action first, left-aligned under the content it acts on.
- A page has one filled button. The others are outline or quiet.
- A single row-level action moves to the end of the row when the container is wide (in a notice, a toast, a row).
- On a phone, footer buttons stack full width with the main action on top.
- Buttons are verbs that say what happens: "Pay $162.40", "Reschedule", "Download receipt".

## Layout follows the container

What depends on the room a component has (notices, rows, grids, actions) uses container queries, not viewport media queries. A component in a sidebar behaves like one on a phone.

## Type

Two families. The sans for reading, the mono for kickers, chips, stamps and every amount, number and date. One scale of sizes, from 12px (never smaller) to 36px. Copy is 62 characters wide at most.

## Voice

Use sentence case. Lead with the status, then the reason, then the next step: "Your balance is due November 1. Pay now to avoid a late fee." Say who did something and when. Address the person as you and the practice as we. Use the words people use: Statement, Balance, Payment, Receipt, Appointment, Form.

## Logical properties

All spacing uses logical properties (`margin-inline-start`, `padding-inline`), so right-to-left text mirrors. Directional icons flip.
