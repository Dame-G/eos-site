---
title: Accessibility
description: "The target, contrast of every colour pair, keyboard use and built-in behaviour."
---

# Accessibility

Eos targets WCAG 2.2 AA, and AAA for text contrast wherever the brand allows. Every component is keyboard operable and has an accessible name.

Test your own pages with real screen readers, zoom, touch and forced colours.

## Contrast

The ratios below come from `@eos-ui/tokens`. `defineTheme()` checks the same pairs for your theme. Text needs 4.5:1. Edges and focus rings need 3:1. Pale tints (`*-soft`) never mark a boundary alone.

<ContrastTable />

Filled controls use deep action colours with white text (7.9:1 or better in the default theme). `defineTheme()` derives each deep colour from your `brand`, `accent` or `danger` colour. On a dark `surface` it switches to light action colours with black text. Buttons and links have a solid focus ring in the ink colour. Inputs use the primary colour, and red when invalid.

## Keyboard

| Component | Keys |
| --- | --- |
| Select | Enter, Space, ArrowDown and ArrowUp open. Arrows move, Home and End jump to the ends, letters jump to a match, Escape closes |
| Combobox (also free text and multiple) | Focus stays in the input. Arrows move, Enter chooses, Escape closes |
| Calendar | Arrows move by day and week, Page Up and Page Down by month (with Shift, by year), Home and End jump to the ends, Enter chooses |
| Tabs | Arrows, Home and End |
| Menu, Definition | Arrows move between items, Escape closes |
| Dialog, Drawer | Focus is trapped. Escape closes and focus returns to the opener |
| Checkbox, Radio, Switch | Native inputs. Space toggles, arrows move between radios |

## Built in

- Colour never carries meaning alone: statuses have a word and an icon.
- Every control is 48px tall by default (`controlHeight`).
- Motion stops under `prefers-reduced-motion`.
- Selected states, borders and checked controls work in forced-colours mode.
- Required and optional are words, not asterisks. Inputs take `autocomplete`.
- Components that render a title take `headingLevel`, so the heading order is yours.
- Set `lang` and `dir` on `<html>`. See [Words and language](/guide/language).
