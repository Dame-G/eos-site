# OpenPractice UI

Components and tokens for the OpenPractice portal: people pay bills, read statements and receipts, book visits, update their details, sign forms and register. Any kind of practice can use it, so nothing here assumes a profession. Colours and logo come from the OpenPractice brand.

**Where to read next**

- Before building anything: **Architecture** (layers, what each component is built from, rules for composing).
- Before using a component: its README, then its props in `components/index.d.ts`.
- Before building a page: the **Patterns** cards (sign in, pay a bill, book a visit, register, find a statement, sign a form) and **Form states**.
- To check a claim about contrast, focus, targets or keyboard: **Accessibility**.
- To port to Vue: **Handing this to Vue**. To verify a change: **Tests**.

## Voice

- The product is **OpenPractice**, one word. The descriptor is "Cloud-Based PM and RCM Solutions"; spell out PM and RCM on first use.
- Address the person as **you**. The practice speaks as **we** ("We received your payment"). Refer to other people on the account by name ("Leo's visit"), never by their role.
- Write in sentence case. Lead with the status, then the reason, then the next step: "Your balance is due November 1. Pay now to avoid a late fee." Say who did something and when: "Statement sent by email, Oct 14."
- Buttons are verbs that say what happens: "Pay $162.40", "Reschedule", "Download receipt", "Sign form". Uppercase belongs to mono labels (kickers, chips, stamps).
- Use the words people use: Statement, Balance, Payment, Receipt, Appointment, Form, Account, Details; "visit" or "session" for what happens at the practice. Words that only one kind of practice would recognise stay out.
- Money is numerals with two decimals ($162.40). Dates are spelled out (Thursday, October 22).

## Look

- **Ground:** pages and cards are `surface` (white). Wells, hovered rows, table headers and footers use `surface-tint`. One theme, light.
- **Depth means "you can click this".** Buttons and StatementRows carry a 2px bottom edge and darken on hover. Everything else is flat and outlined (`edge`); inputs are wells. Popovers, menus and toasts are the only things that float.
- **Colour:** `primary` (deep teal) fills the main Button and every selected state; `secondary` (deep green) and `danger` (deep red) fill their Buttons; text on all three is white. Status tones are success (green: paid, confirmed, signed), information (blue: due, scheduled, pending), warning (amber: the person must act) and danger (red: overdue, cancelled, failed). Each is a soft tint with strong text and a matching outline, and always travels with a word and a glyph. The logo colours (`brand-blue`, `brand-green`) decorate; they never carry text.
- **Edges:** cards and rows use `border` (3.4:1 on white), controls use `border-strong` (4.5:1). A pale tint never marks a boundary alone.
- **Type:** Jost for reading; Spline Sans Mono for kickers, chips, stamps and every amount, number and date. Sizes come from the `fontSize` tokens. Copy is 62 characters wide at most.
- **Shape and space:** the `space-*` scale; `radius-md` on buttons, inputs and cards, `radius-sm` on stamps, `radius-pill` on chips, `radius-lg` on dialogs.
- **Focus:** a 2px outline. Text inputs and what is built on them use `focus-field` (teal; `danger` when invalid); everything else uses `focus-ring` (black).
- **Actions:** a group of Buttons reads in the order of the content, main action first, left-aligned under the content it acts on. A single row-level action moves to the end of the row when the container is wide (Notice, Toast, ItemRow, DetailRow). On a phone, footer Buttons stack full width with the main action on top.
- **Motion:** an 80ms hover and press, nothing else; it stops under reduced motion.
- **Layout follows the container.** Notice, ItemRow, StatementRow, DataGrid and Actions rearrange by the width they are given, not the screen's.
- **Words, dates, direction:** `configure({ locale, currency, dir, messages })` once. Every word a component writes can be replaced; month names, week start, date order and money follow the locale; spacing uses logical properties so right-to-left text mirrors.
- **Print:** statements, receipts and forms print without chrome, shadows or buttons, and do not break inside a card.
- **Imagery:** the logo only. Use `assets/Logos/openpractice-logo.webp` on `surface` or `surface-tint`, copied as is.

## What the portal needs

- **Sign in:** Field (`username`), PasswordField, OtpField, BackLink, Notice.
- **Pay bills:** StatementCard, StatementRow, AmountFigure, RadioGroup, CurrencyField, Select, PaymentCardField, Toast.
- **Statements and receipts:** PageHeader, SearchBar, ToggleButton, StatementRow, DataGrid, Drawer, DateRangePicker.
- **Scheduling:** Calendar and TimeSlots, AppointmentCard, Dialog.
- **Details:** Panel with DetailRow; Field, PhoneField, AddressFields, DatePicker.
- **Forms:** ItemList with ItemRow, SignatureField, FileUpload, ErrorSummary.
- **Registration:** Stepper, FormSection, ErrorSummary, OtpField.
- **Around it:** AppShell, AppHeader, AppFooter, SkipLink, ToastProvider.

If a page needs something not listed, a component is missing.

## Icons

Phosphor (MIT): regular weight at 20px, bold at 14px inside chips and stamps. `Icon.names` lists every name. An icon never carries meaning alone; a stamp's glyph sits beside its word.

## Building from this system

- **Fonts:** previews load Jost and Spline Sans Mono from Google Fonts. In the product, self-host the WOFF2 files (SIL Open Font License): a page for paying bills should not send visitors' addresses to a third party.
- **Icons in Vue:** `@phosphor-icons/vue`, mapped by the same names.
- **Native or custom:** checkbox, radio, switch, file input, dialog and popover are the browser's own elements. Select and the date input are custom, so they look and behave the same everywhere.
- **Browsers:** current Chrome, Edge, Safari and Firefox (native `popover`, `dialog`, `details name`, container queries, `:has()`).
- **Tokens:** `tokens.json` holds colour, type, spacing, radius, shadow, type size, size, stroke, duration, easing and z-index; the page compiles them to CSS custom properties. Only the `color-mix` washes live in `bundle.css`.
- **Not covered:** a dark theme, time and date-time pickers, a tree view, real-screen-reader and real-device testing, and a drawer that follows text direction (it opens from the right; set `side`).
