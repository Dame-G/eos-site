---
title: Which component?
description: "Pairs of components that look alike, with the rule that picks between them."
---

<script setup>
import Choosing from "./examples/Choosing.vue";
</script>

# Which component?

Every component page says what it is for in its first line. This page collects the pairs people mix up.

## Choosing one value

<div class="pattern-stage">
  <Choosing />
</div>

| Options | Use |
| --- | --- |
| Two to five, and the reader should see all at once | [`ERadioGroup`](/components/RadioGroup) |
| Two to five, and it changes how a list is filtered or shown | [`ESegmented`](/components/Segmented) |
| About six to a few dozen | [`ESelect`](/components/Select) |
| Long, or found by typing | [`ECombobox`](/components/Combobox) |
| Any text, with suggestions | [`ECombobox`](/components/Combobox) with `freeform` |
| Several values | [`ECombobox`](/components/Combobox) with `multiple`, or a group of [`ECheckbox`](/components/Checkbox) |
| Yes or no, submitted later | [`ECheckbox`](/components/Checkbox) |
| Yes or no, takes effect now | [`ESwitch`](/components/Switch) |

## Showing more

| Need | Use |
| --- | --- |
| A short decision that blocks the page | [`EDialog`](/components/Dialog) |
| Reading a record beside a list, or a filter panel | [`EDrawer`](/components/Drawer) |
| Secondary detail inside the page | [`EDisclosure`](/components/Disclosure). Give several the same `group` for an accordion |
| A list row that opens to more | [`EExpandableRow`](/components/ExpandableRow) |
| Switching views of the same record | [`ETabs`](/components/Tabs) |
| Links to other pages | [`ENavList`](/components/NavList) |
| A card that is one link, in an index of pages | [`ELinkCard`](/components/LinkCard) |
| A few actions with no room for buttons | [`EMenu`](/components/Menu) |
| A name for an icon-only button | [`ETooltip`](/components/Tooltip) |
| An explanation of a term | [`EDefinition`](/components/Definition) |

## Telling people things

| Need | Use |
| --- | --- |
| Confirm what they just did, then go | [`useToast()`](/guide/toasts) |
| A message that stays until dealt with | [`ENotice`](/components/Notice) |
| An error beside a field | the `error` prop of the field |
| Nothing to show yet | [`EEmptyState`](/components/EmptyState) |
| Content is loading | [`ESkeleton`](/components/Skeleton) for a block, [`ESpinner`](/components/Spinner) for one action, [`EProgress`](/components/Progress) for a known length |

## Finding things

| Need | Use |
| --- | --- |
| One search box for a page | [`ESearchBar`](/components/SearchBar) with [`ESearchResults`](/components/SearchResults) |
| Run a command from the keyboard | [`ECommandPalette`](/components/CommandPalette) |
| Pick a value in a form | [`ECombobox`](/components/Combobox) |
| A table to read | [`ETable`](/components/Table) |
| A table to work in | [`EDataGrid`](/components/DataGrid). See [Data tables](/guide/data-tables) |
| Many pages of a list | [`EPagination`](/components/Pagination) |

## Dates and numbers

[`EDatePicker`](/components/DatePicker) for one date, [`ERangePicker`](/components/RangePicker) for two, [`ECalendar`](/components/Calendar) to show a month. [`ENumberField`](/components/NumberField) for a count, [`ECurrencyField`](/components/CurrencyField) for money, [`EOtpField`](/components/OtpField) for a code.
