/** Which sidebar group each component sits in. The groups follow what you are trying to do, not the library's cascade layers. */
const MEMBERS = {
  actions: ["Button", "IconButton", "CopyButton", "Link", "Actions"],
  content: ["Heading", "Text", "Kicker", "Highlight", "Kbd", "CodeBlock", "Icon", "Avatar", "AvatarGroup", "VisuallyHidden"],
  layout: ["Stack", "Inline", "Grid", "Container", "Surface", "Divider"],
  form: ["Form", "Field", "Fieldset"],
  text: ["TextField", "Textarea", "PasswordField", "NumberField", "CurrencyField", "PhoneField", "OtpField", "ColorField", "SearchBar", "SearchResults"],
  choices: ["Checkbox", "CheckboxGroup", "RadioGroup", "Switch", "Segmented", "Select", "Combobox", "Slider"],
  pickers: ["Calendar", "DatePicker", "RangePicker", "Upload", "SignatureField", "SignaturePad"],
  data: ["Table", "DataGrid", "DescriptionList", "Definition", "Metric", "Tag", "Stamp", "ExpandableRow"],
  feedback: ["Notice", "Toast", "ToastProvider", "Progress", "Spinner", "Skeleton", "EmptyState"],
  overlays: ["Dialog", "Drawer", "Menu", "Tooltip", "CommandPalette", "Disclosure"],
  navigation: ["Tabs", "Breadcrumb", "NavList", "Pagination", "Stepper", "SkipLink"],
  page: ["AppShell", "AppHeader", "AppFooter", "PageHeader"],
};

export const GROUP_OF = Object.fromEntries(Object.entries(MEMBERS).flatMap(([group, names]) => names.map((name) => [name, group])));
