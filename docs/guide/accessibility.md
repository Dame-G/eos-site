---
title: Accessibility
description: "The target, contrast of every colour pair, keyboard use and built-in behaviour."
---

# Accessibility

EOS targets WCAG 2.2 AA, and AAA for text contrast wherever the brand allows. Every component is keyboard operable and has an accessible name.

Test your own pages with real screen readers, zoom, touch and forced colours.

## Contrast

The ratios below come from `@eos-ui/tokens`. `defineTheme()` checks the same pairs for your theme. Text needs 4.5:1. Edges and focus rings need 3:1. Pale tints (`*-soft`) never mark a boundary alone.

<ContrastTable />

Filled controls use deep action colours with white text (7.9:1 or better in the default theme). `defineTheme()` derives each deep colour from your `brand`, `accent` or `danger` colour. On a dark `surface` it switches to light action colours with black text. Buttons and links have a solid focus ring in the ink colour. Inputs use the primary colour, and red when invalid.

## Keyboard

Every component page has a Keyboard section with its keys. The common ones:

| Component | Keys |
| --- | --- |
| [Select](/components/Select) | Enter, Space, ArrowDown and ArrowUp open. Arrows move, Home and End jump to the ends, letters jump to a match, Escape closes |
| [Combobox](/components/Combobox) (also free text and multiple) | Focus stays in the input. Arrows move, Enter chooses, Escape closes |
| [Calendar](/components/Calendar), [DatePicker](/components/DatePicker) | Arrows move by day and week, Page Up and Page Down by month (with Shift, by year), Home and End jump to the ends, Enter chooses |
| [Tabs](/components/Tabs) | Arrows, Home and End |
| [Menu](/components/Menu), [Definition](/components/Definition) | Arrows move between items, Escape closes |
| [Dialog](/components/Dialog), [Drawer](/components/Drawer) | Focus is trapped. Escape closes and focus returns to the opener |
| [CommandPalette](/components/CommandPalette) | Opens with Ctrl or Cmd and K by default. Arrows move, Enter runs, Escape closes |
| [DataGrid](/components/DataGrid) | Sort buttons and filters are in the tab order. Arrow keys resize a column edge |
| [Checkbox](/components/Checkbox), [RadioGroup](/components/RadioGroup), [Switch](/components/Switch) | Space toggles, arrows move between radios |
| [Toast](/components/ToastProvider) | Timers pause while focus is on a toast, and it can be dismissed from the keyboard |

Add your own shortcuts with [`useShortcuts()`](/guide/composables#useshortcuts-map-options). Keys that type a character are ignored while a text field has focus.

## Built in

- Colour never carries meaning alone: statuses have a word and an icon.
- Controls share `--e-control-height`, 48px by default (`controlHeight`). A small button drops to the 44px tap target, `--e-tap`, and no target is smaller.
- Motion stops under `prefers-reduced-motion`.
- Selected states, borders and checked controls work in forced-colours mode.
- Required and optional are words, not asterisks. Inputs take `autocomplete`.
- Components that render a title take `headingLevel`, so the heading order is yours.
- Every field has a visible `label`. `hideLabel` keeps it for assistive technology only. See [Forms and validation](/guide/forms#labels).
- Changes nobody can see are announced with [`useAnnouncer()`](/guide/composables#useannouncer), and confirmations with [toasts](/guide/toasts).
- Set `lang` and `dir` on `<html>`. Words, dates and direction follow the locale: see [Words and language](/guide/language).
- Dark themes are checked for contrast like any other: see [Light and dark](/guide/theming#light-and-dark).
