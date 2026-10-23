/** Which sidebar group each component sits in. A few broad groups, named for what you reach for: not the library's cascade layers. */
const MEMBERS = {
  layout: ["Stack", "Inline", "Grid", "Container", "Surface", "Divider", "AppShell", "AppHeader", "AppFooter", "PageHeader"],
  content: [
    "Heading", "Text", "Kicker", "Highlight", "Kbd", "CodeBlock", "Icon", "Avatar", "AvatarGroup", "VisuallyHidden",
    "Table", "DataGrid", "DescriptionList", "Definition", "Metric", "Tag", "Stamp", "ExpandableRow",
  ],
  actions: ["Button", "IconButton", "CopyButton", "Link", "Actions"],
  forms: [
    "Form", "Field", "Fieldset", "TextField", "Textarea", "PasswordField", "NumberField", "CurrencyField", "PhoneField", "OtpField", "ColorField",
    "SearchBar", "SearchResults", "Checkbox", "CheckboxGroup", "RadioGroup", "Switch", "Segmented", "Select", "Combobox", "Slider",
    "Calendar", "DatePicker", "RangePicker", "Upload", "SignatureField", "SignaturePad",
  ],
  navigation: ["Tabs", "Breadcrumb", "NavList", "Pagination", "Stepper", "SkipLink"],
  feedback: ["Notice", "Toast", "ToastProvider", "Progress", "Spinner", "Skeleton", "EmptyState"],
  overlays: ["Dialog", "Drawer", "Menu", "Tooltip", "CommandPalette", "Disclosure"],
};

export const GROUP_OF = Object.fromEntries(Object.entries(MEMBERS).flatMap(([group, names]) => names.map((name) => [name, group])));
