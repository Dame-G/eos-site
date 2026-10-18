# Accessibility

**Target:** WCAG 2.2 level AA for everything, and level AAA for text contrast wherever it does not change the brand. WCAG 3.0 is still a W3C working draft with no conformance levels, so conformance cannot be stated against it yet. What this system does track from it is the APCA contrast method its drafts use (Lc values below), and its emphasis on plain wording and cognitive load.

## What was checked

- **axe-core 4.10.2** on all 93 previews (WCAG 2.0 to 2.2 A and AA, the AAA contrast rule, best-practice rules), with dropdowns, calendars, popovers and menus open. No component-level violations at any level. The page-level rules (title, language, landmarks) cannot pass in a preview fragment; AppShell supplies the landmarks and skip link.
- **49 browser tests** (`tests/suite.js`): change events and attributes of every form control, keyboard behaviour of Select, Combobox, OtpField, Calendar, Tabs and Menu, locale switching, focus handling in ErrorSummary and toasts, SignaturePad, container-query layouts, accessible names, the 48px control height.
- **Contrast** for every text and surface pair in the tokens (table below) and every border, outline and fill that must show on white (3:1 or better).
- **Layout** at 360 CSS pixels: no horizontal page scroll in any preview. DataGrid becomes cards below 40rem of its own width.
- **Target size** measured on every interactive element; all meet the WCAG 2.2 minimum of 24px (see Rules).

**Needs a person:** real screen readers (NVDA, JAWS, VoiceOver, TalkBack), the text-spacing override (WCAG 1.4.12), 200% and 400% zoom by eye, real touch devices, and forced-colours mode in a browser (the CSS rules exist but were not exercised).

## Contrast

| Use | Pair | WCAG 2 ratio | APCA Lc |
| --- | --- | --- | --- |
| Body text | `ink` on `surface` | 21.0:1 | 106 |
| Secondary text | `muted` on `surface` | 7.9:1 | 88 |
| Secondary text on tint | `muted` on `surface-tint` | 7.1:1 | 80 |
| Links | `primary` on `surface` | 7.9:1 | 87 |
| Information chip, stamp | `primary` on `surface-tint` | 7.1:1 | 80 |
| Success chip, stamp | `secondary` on `secondary-soft` | 7.0:1 | 79 |
| Danger chip, stamp, error text | `danger` on `danger-soft` | 7.1:1 | 77 |
| Warning chip, stamp | `warning-strong` on `warning-soft` | 7.1:1 | 80 |
| Primary Button, selected day, checked box | `on-primary` on `primary` | 7.9:1 | 92 |
| Secondary Button | `on-secondary` on `secondary` | 7.9:1 | 92 |
| Danger Button | `on-danger` on `danger` | 8.3:1 | 92 |

Reference points: WCAG 2 needs 4.5:1 for small text (AA) and 7:1 (AAA). APCA suggests about Lc 75 for body text and Lc 60 for large or bold text; below Lc 45 it advises against use for text of any size.

Non-text contrast (needs 3:1): `border` 3.3:1, `border-strong` 4.5:1, `focus-ring` 21.0:1, `focus-field` (primary teal) 7.9:1, `primary` fill 7.9:1, `secondary` fill 7.9:1, `danger` fill 8.3:1. Pale tints (`*-soft`, `surface-tint`) are about 1.1:1 against white, so they never mark a boundary alone: every tinted chip, stamp or notice is also outlined in its strong colour.

### Decision: white text on deep action colours

Black text on the logo blue is 6.1:1 (passes AA) but only APCA Lc 42, and on the logo green Lc 62. The system therefore uses **deep action colours with white text**: `primary` #17586d, `secondary` #2b5c1b, `danger` #962019. Every filled control and selected state is white on one of them, at 7.9:1 or better and APCA Lc 92, so it passes WCAG AAA and the APCA body-text target at once. The exact logo colours remain as `brand-blue` and `brand-green`, for the cover and brand surfaces only. Filled buttons darken on hover and when pressed, so the white text only gains contrast. If you want the logo colours back, it is a two-token change per colour (set `primary` to `#2c95b4`, `on-primary` to `#000000`, and make the hover lighten instead of darken).

### Decision: two focus colours

Buttons, links, tabs, rows and every non-input control use a black `focus-ring` (21:1). Text inputs, and everything that looks like one (Field, Select, Combobox, DatePicker, NumberField, SearchBar, PaymentCardField, OtpField), use the primary teal `focus-field` (7.9:1) for the edge and a 1px-offset outline, and keep `danger` when the field is invalid. The colour change tells a person which kind of control they are on; both pass 3:1 on every surface they sit on.

## Patterns used

| Component | Pattern | Notes |
| --- | --- | --- |
| Select | Combobox (ARIA 1.2) with a listbox | `aria-expanded`, `aria-controls`, `aria-activedescendant`; arrows, Home, End, Enter, Escape, type-ahead |
| Combobox, Autocomplete, MultiSelect | Editable combobox with list autocomplete | Focus stays in the input; each tag has a labelled Remove button; text snaps back to a valid choice |
| Calendar, DatePicker, DateRangePicker | Date grid | Focus moves to the selected day when the calendar opens; arrow, Home, End, Page Up and Page Down follow the locale's week; month and year pickers are buttons with `aria-expanded`; every day has a full-date label, marked days say "times available"; unavailable days are disabled |
| OtpField | Group of single-character inputs | Each box is labelled "Digit n of N"; the first has `autocomplete="one-time-code"`; paste and SMS autofill fill every box; focus cannot skip a gap |
| PasswordField | Input with a toggle | The toggle is a button with `aria-pressed`; rules are a list that says "met" or "not met yet" in words |
| ErrorSummary | Alert with a list | Takes focus when errors appear; the list says what to fix and each field shows its own error |
| Fieldset, RadioGroup, TimeSlots, AddressFields | Fieldset and legend | Hint and error are announced with the group; disabling the fieldset disables its controls |
| SignaturePad, SignatureField | Canvas with a typed alternative | The canvas is labelled and says how to use Type instead; a drawn signature is never the only option |
| DataGrid | Table with sortable headers | `aria-sort`; a live region announces sort and row count; `aria-rowcount` and `aria-rowindex` when virtual; column edges are keyboard-operable separators; as cards on a narrow container it keeps table roles and labels every cell |
| Tabs | Tabs | Roving tabindex, arrows, Home, End |
| Dialog, Drawer | Native dialog | Focus trap, Escape and inert background come from the browser |
| Popover, Menu | Native popover | Light dismiss and Escape; Menu has menu roles, moves focus to the first item when it opens, and arrow keys move between items |
| Tooltip | Tooltip | Shows on hover, focus and touch; Escape hides it; never holds required content |
| Checkbox, RadioGroup, Switch | Native inputs, styled | Whole 48px row is the target; Switch has `role="switch"` |
| Stepper, Breadcrumb, Pagination, NavList | Landmarks with `aria-current` | Current item is also bold or outlined, not colour alone |
| AppShell, SkipLink, PageHeader | Landmarks | Skip link is first in tab order; `main` takes focus when it is used; one `h1` per page, from PageHeader |
| Toast, ToastProvider, Notice | Status and alert | Errors use `role="alert"`; errors and toasts with an action never auto-dismiss; timers pause while the pointer or focus is on a toast (WCAG 2.2.1) |

## Rules the components follow

- **Colour never carries meaning alone.** A status has a word and a glyph; a selected tab, day, page or option is bold, outlined or marked as well as coloured; errors have an alert glyph; rule lists use a tick and words.
- **Target size:** every control is 48px tall (`control-height`). A smaller button inside a 48px field (show options, tag remove, stepper) gets a 48px tap area from an invisible pseudo-element. Below 48px, always above the WCAG minimum of 24px: links inside running text, the DataGrid column resizer (24px wide), and OtpField boxes (48px tall, 30px wide minimum so eight fit on a 360px phone).
- **Focus** is never removed; the two colours are explained above.
- **Motion** stops under `prefers-reduced-motion`; the LoadingBar becomes a static stripe.
- **Forced colours:** selected states, checked controls, borders and the loading bar have Windows high-contrast rules.
- **Forms:** every input takes `autoComplete` so browsers can fill personal details (WCAG 1.3.5); errors appear in an ErrorSummary and beside the field; required and optional are words, not asterisks.
- **Language:** set `lang` and `dir` on the page's `html` element; `configure` replaces every built-in word.
