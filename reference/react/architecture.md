# Architecture

How the system is layered, so that a new component is composed from what exists and a change in one place reaches everything that uses it.

## The layers

Each layer may use the ones above it in this list and never the ones below.

0. **Tokens** (`tokens.json`): 20 colours, 6 spacing steps, 4 radii, 3 shadows, 8 type sizes, 3 sizes, 5 stroke and focus values, 2 durations and 1 easing, 4 layers. Components read these as CSS custom properties and never write a raw size, colour, duration or z-index. What the tokens cannot express (`color-mix` washes for hover and press) lives in the first lines of `bundle.css`.
1. **Primitives**, 2. **Building blocks**, 3. **Form controls**, 4. **Composite controls**, 5. **Containers and feedback**, 6. **The account**, 7. **The page**: listed below, with what each is built from (generated from the bundle).
8. **Patterns**: whole tasks (sign in, pay a bill, book a visit, register, find a statement, sign a form) built only from layers 1 to 7. They are cards in the gallery and double as integration tests: if a pattern needs a custom box or a hand-written flex row, a building block is missing.

### 1 Primitives

One job, no children of their own, no state beyond their own.

| Component | Built from |
| --- | --- |
| `Icon` | nothing |
| `Button` | `Icon` |
| `IconButton` | `Icon` |
| `Chip` | nothing |
| `Link` | nothing |
| `Spinner` | nothing |
| `Avatar` | nothing |
| `StatusStamp` | `Icon` |
| `Heading` | nothing |
| `Text` | nothing |
| `Kicker` | nothing |
| `VisuallyHidden` | nothing |
| `Divider` | nothing |
| `Progress` | nothing |
| `LoadingBar` | nothing |
| `Skeleton` | nothing |

### 2 Building blocks

The boxes and layout every card and form is made of. Nothing below this line draws its own card, row or footer.

| Component | Built from |
| --- | --- |
| `Surface` | `Actions` |
| `Stack` | nothing |
| `Inline` | nothing |
| `Grid` | nothing |
| `Actions` | nothing |
| `MetaList` | `Icon` |
| `DescriptionList` | nothing |

### 3 Form controls

Inputs and the shared label, hint and error around them.

| Component | Built from |
| --- | --- |
| `FormField` | nothing |
| `Fieldset` | nothing |
| `Field` | nothing |
| `Textarea` | nothing |
| `Checkbox` | nothing |
| `RadioGroup` | `Fieldset` |
| `Switch` | nothing |
| `Select` | `Icon` |
| `Combobox` | `Icon`, `Spinner` |
| `Autocomplete` | `Combobox` |
| `MultiSelect` | `Combobox` |
| `NumberField` | `Icon` |
| `SegmentedControl` | `Icon` |
| `FileUpload` | `Icon` |
| `SearchBar` | `Icon`, `Button` |
| `OtpField` | `Icon` |
| `TimeSlots` | `Icon`, `Fieldset` |

### 4 Composite controls

Controls built from other controls.

| Component | Built from |
| --- | --- |
| `Calendar` | `Icon`, `Button`, `IconButton`, `Actions` |
| `DatePicker` | `Calendar`, `Icon` |
| `DateRangePicker` | `Calendar`, `Icon`, `Button` |
| `PasswordField` | `Icon` |
| `PhoneField` | `Field` |
| `CurrencyField` | `NumberField` |
| `AddressFields` | `Field`, `Select`, `Fieldset` |
| `PaymentCardField` | `Icon`, `Spinner` |
| `SignaturePad` | `Icon`, `Button` |
| `SignatureField` | `SegmentedControl`, `Field`, `Checkbox`, `SignaturePad` |
| `FormSection` | `Stack` |
| `ToggleButton` | `Icon` |
| `ButtonGroup` | nothing |
| `Pagination` | `Icon`, `Button` |

### 5 Containers and feedback

Things that hold or announce content.

| Component | Built from |
| --- | --- |
| `Panel` | `Surface` |
| `Tabs` | nothing |
| `Disclosure` | nothing |
| `Accordion` | `Disclosure` |
| `Notice` | `Icon`, `IconButton`, `Actions` |
| `ErrorSummary` | `Notice` |
| `Toast` | `Icon`, `IconButton`, `Surface`, `Actions` |
| `ToastProvider` | `Toast` |
| `Tooltip` | nothing |
| `Popover` | `Icon`, `IconButton`, `Actions` |
| `Menu` | `Icon` |
| `Dialog` | `IconButton`, `Actions` |
| `Drawer` | `IconButton`, `Actions` |
| `EmptyState` | `Icon` |
| `DataGrid` | `EmptyState`, `Icon`, `Button`, `Popover`, `Select`, `Checkbox`, `Pagination` |

### 6 The account

The portal's own vocabulary: statements, visits, forms, details.

| Component | Built from |
| --- | --- |
| `AmountFigure` | nothing |
| `ActivityList` | `Chip` |
| `StatementCard` | `Disclosure`, `StatusStamp`, `AmountFigure`, `ActivityList`, `Surface`, `DescriptionList` |
| `StatementRow` | `Disclosure`, `StatusStamp`, `ActivityList`, `Surface`, `Actions`, `DescriptionList` |
| `DetailRow` | `Button`, `Chip` |
| `ItemRow` | `Icon`, `StatusStamp`, `ItemList` |
| `ItemList` | nothing |
| `AppointmentCard` | `StatusStamp`, `Avatar`, `Surface`, `MetaList` |

### 7 The page

Navigation and the frame of a page.

| Component | Built from |
| --- | --- |
| `Breadcrumb` | `Icon` |
| `NavList` | `Icon` |
| `Stepper` | `Icon` |
| `SkipLink` | nothing |
| `AppHeader` | nothing |
| `AppFooter` | nothing |
| `AppShell` | `SkipLink` |
| `PageHeader` | `Actions` |
| `BackLink` | `Icon` |

## Rules

- **Compose, do not copy.** A card is a Surface. A group of Buttons is Actions. A list of label and text rows is a DescriptionList. A row of icon and text is a MetaList. If two components need the same box, it moves into a building block.
- **Space belongs to the parent.** Children never set their own outer margins; Stack, Inline, Grid and Actions space them. This is what lets a component move from a page into a drawer without edits.
- **Spacing rhythm: related things sit close, groups sit apart.** 8px (`space-2`) between a label and its control and between a heading and its lead; text that belongs to a control (a hint, an error, password rules, the card note) sits 2px under it; a control that depends on a choice follows it directly, because the choice already has 10px of padding (an amount that appears under `Another amount`); 16px (`space-4`) between fields and between the parts of a card, the default Stack gap; 24px (`space-6`) between groups and sections of a page; 32px (`space-8`) between page regions. Nest Stacks to express the grouping: a page is a Stack of groups, each group a Stack of its own parts. One gap for everything makes every item look equally unrelated.
- **Text blocks share one rhythm.** Lines of text that belong together (a label and its value, a kicker and a title, a title and its subtitle, an amount and its details) sit 4px apart (`space-1`), titles have a 1.25 line height, and two blocks that belong to one idea sit 12px apart. This holds in Heading, AmountFigure, StatementCard, StatementRow, ItemRow, DetailRow and AppointmentCard.
- **Widths come from the container.** Layout that depends on the room a component has (Notice, ItemRow, StatementRow, DataGrid, Actions) uses container queries, not viewport media queries, so a component in a sidebar behaves like one on a phone. The only viewport query left is the shell's two-column sidebar.
- **One source for sizes.** Type sizes are `--text-*`, control height is `--control-height`, outlines are `--stroke-*` and `--focus-gap`. A new size means a new token and a note in its usage.
- **Logical properties.** `margin-inline-start`, `padding-inline`, `inset-inline-end` and `text-align: start`, never left and right, so right-to-left text mirrors. Directional icons carry `op-icon--dir`.
- **Value-first events.** Every form control's `onChange(value, event)` gives the new value first. In Vue that is `v-model`.
- **Heading levels are the page's choice.** Components that render a title take `headingLevel`.
- **Words are replaceable.** Every string a component writes goes through `t(key)` and can be overridden with `configure({ messages })`. A local variable called `t` is a build error.

## Adding a component

1. Find the lowest layer that fits and check whether an existing component already does most of it.
2. Build it from blocks; add CSS only for what is new, using tokens and logical properties.
3. Give it a folder with `README.md` (what the consumer provides, what it does, the rules) and `preview.html` (a few states, no more), a props line in `index.d.ts`, and its name in `src/exports.json`.
4. Add contract and interaction tests to `tests/suite.js`: change event, keyboard, accessible name.
5. Run the build (it lints the bundle), the axe audit at 360px and 640px, and the test suite.

## Source layout

The published `bundle.js` is built from four source files, concatenated in this order: `core.js` (configuration, icons, primitives, form controls, pickers, DataGrid and the account components), `blocks.js` (layer 2), `forms.js` (layer 4 form controls) and `shell.js` (the page, toasts, toggles). In Vue each component becomes a single-file component and the files below it become composables.
