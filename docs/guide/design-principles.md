---
title: Design principles
description: "The layout rules that make every Eos theme feel like the same system."
---

# Design principles

These rules hold in every theme. A theme changes colours, corners, fonts, scales and control height. It does not change the rules.

- **Compose.** A card is `ESurface`, buttons go in `EActions`, label and text rows are `EDescriptionList`. If you need a custom box or a hand-written flex row, a building block is missing: report it.
- **The parent owns space.** Children set no outer margin. `EStack`, `EInline`, `EGrid` and `EActions` space them.
- **One control height.** Every tappable control has the same height (48px by default), so a button lines up beside an input.
- **Depth means "click" or "floats".** Buttons and rows have a bottom edge (the `depth` token), inputs are wells, popovers and toasts float. Everything else is flat and outlined.
- **One filled button per page.** Put the main action first, left-aligned under what it acts on. Name it with a verb: "Pay $162.40".
- **The container decides.** Notices, rows, grids and actions use container queries, so a sidebar behaves like a phone.
- **Logical properties.** Spacing mirrors in right-to-left text.
- **Voice.** Sentence case. Lead with the status, then the reason, then the next step.

## Spacing

Default values. `spaceScale` scales them together.

| Space | Where |
| --- | --- |
| 4px (`--e-space-1`) | Lines of text that belong together |
| 8px (`--e-space-2`) | A label and its control |
| 12px (`--e-space-3`) | Two blocks of one idea |
| 16px (`--e-space-4`) | Between fields and card parts. Default `EStack` gap |
| 24px (`--e-space-6`) | Between groups and sections |
| 32px (`--e-space-8`) | Between page regions |

## Type

There are two font families. The sans is for reading. The mono is for kickers, chips and every amount, number and date. Text is 12px at the smallest by default.
