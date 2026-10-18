// Which group of the sidebar each component belongs to: the library's layers.
// Add a line when a component lands in the library. Components missing here appear under "More" until you do.
// The list may name components the library has not built yet; only folders that exist get a page.
export const GROUP_OF = {
  // Primitives: one job, no children of their own
  Avatar: "primitives", Button: "primitives", Chip: "primitives", Divider: "primitives", Heading: "primitives",
  Icon: "primitives", IconButton: "primitives", Kicker: "primitives", Link: "primitives", LoadingBar: "primitives",
  Progress: "primitives", Skeleton: "primitives", Spinner: "primitives", Stamp: "primitives", Text: "primitives",
  VisuallyHidden: "primitives",
  // Blocks: boxes and layout
  Actions: "blocks", DescriptionList: "blocks", Grid: "blocks", Inline: "blocks", MetaList: "blocks",
  Stack: "blocks", Surface: "blocks",
  // Form controls
  Autocomplete: "controls", Checkbox: "controls", Combobox: "controls", Field: "controls", Fieldset: "controls",
  MultiSelect: "controls", NumberField: "controls", OtpField: "controls", RadioGroup: "controls", SearchBar: "controls",
  Segmented: "controls", Select: "controls", SlotPicker: "controls", Switch: "controls", TextField: "controls",
  Textarea: "controls", Upload: "controls",
  // Composite controls: controls built from controls
  ButtonGroup: "composites", Calendar: "composites", CardField: "composites", CurrencyField: "composites",
  DatePicker: "composites", FormSection: "composites", Pagination: "composites", PasswordField: "composites",
  PhoneField: "composites", RangePicker: "composites", SignatureField: "composites", SignaturePad: "composites",
  Toggle: "composites", AddressField: "composites",
  // Containers and feedback
  Accordion: "containers", DataGrid: "containers", Dialog: "containers", Disclosure: "containers", Drawer: "containers",
  EmptyState: "containers", ErrorSummary: "containers", Menu: "containers", Notice: "containers", Panel: "containers",
  Popover: "containers", Tabs: "containers", Toast: "containers", ToastProvider: "containers", Tooltip: "containers",
  // Account
  Amount: "account", BookingCard: "account", DetailRow: "account", ItemList: "account", ItemRow: "account",
  StatementCard: "account", StatementRow: "account", Timeline: "account",
  // Page
  AppFooter: "page", AppHeader: "page", AppShell: "page", BackLink: "page", Breadcrumb: "page", NavList: "page",
  PageHeader: "page", SkipLink: "page", Stepper: "page",
};
