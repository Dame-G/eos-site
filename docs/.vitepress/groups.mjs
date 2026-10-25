/**
 * The component groups: the one place a component is filed. The sidebar, the components overview, each component page's
 * group, llms.txt and the CI check that every component is grouped all read this list. Groups are named for what you
 * reach for, not for the library's cascade layers. Order here is the order everywhere.
 */
export const GROUPS = [
  { id: "layout", title: "Layout", members: ["Stack", "Inline", "Grid", "Container", "Surface", "Divider", "AppShell", "AppHeader", "AppFooter", "PageHeader"] },
  { id: "text-and-media", title: "Text and media", members: ["Heading", "Text", "Kicker", "Highlight", "Kbd", "CodeBlock", "Icon", "Avatar", "AvatarGroup", "VisuallyHidden"] },
  { id: "data-display", title: "Data display", members: ["Table", "DataGrid", "DescriptionList", "Definition", "Metric", "Tag", "Stamp", "ExpandableRow"] },
  { id: "actions", title: "Actions", members: ["Button", "IconButton", "CopyButton", "Link", "Actions"] },
  { id: "form-structure", title: "Form structure", members: ["Form", "Field", "Fieldset"] },
  { id: "text-inputs", title: "Text inputs", members: ["TextField", "Textarea", "PasswordField", "NumberField", "CurrencyField", "PhoneField", "OtpField", "ColorField"] },
  { id: "choices", title: "Choices", members: ["Checkbox", "CheckboxGroup", "RadioGroup", "Switch", "Segmented", "Select", "Combobox", "Slider"] },
  { id: "dates", title: "Dates", members: ["Calendar", "DatePicker", "RangePicker"] },
  { id: "files-and-signatures", title: "Files and signatures", members: ["Upload", "SignatureField", "SignaturePad"] },
  { id: "search-and-navigation", title: "Search and navigation", members: ["SearchBar", "SearchResults", "CommandPalette", "Tabs", "Breadcrumb", "NavList", "LinkCard", "Pagination", "Stepper", "SkipLink"] },
  { id: "feedback", title: "Feedback", members: ["Notice", "ToastProvider", "Toast", "Progress", "Spinner", "Skeleton", "EmptyState"] },
  { id: "overlays-and-disclosure", title: "Overlays and disclosure", members: ["Dialog", "Drawer", "Menu", "Tooltip", "Disclosure"] },
  { id: "app-config", title: "App config", members: ["ConfigProvider"] },
];

/** Where a component with no group lands, so a new library component still gets a page before it is filed. */
export const MORE = { id: "more", title: "More" };

/** Component folder name -> group id. */
export const GROUP_OF = Object.fromEntries(GROUPS.flatMap((g) => g.members.map((name) => [name, g.id])));

/** The title of a component's group, or "More". */
export function groupTitleOf(name) {
  return GROUPS.find((g) => g.id === GROUP_OF[name])?.title ?? MORE.title;
}

/** The components of `names` that no group lists. */
export function ungrouped(names) {
  return names.filter((n) => !(n in GROUP_OF));
}

/**
 * `names` by group, in group order, each group keeping the order of `names` (alphabetical from the library): [{ id, title, names }].
 * Ungrouped names come last under "More". A member the library does not have (yet, or any more) is left out, and so is an empty group.
 */
export function groupComponents(names) {
  return [
    ...GROUPS.map(({ id, title }) => ({ id, title, names: names.filter((n) => GROUP_OF[n] === id) })),
    { ...MORE, names: ungrouped(names) },
  ].filter((g) => g.names.length);
}

/** Warns about ungrouped components, and in CI throws, so a library release cannot ship a page filed under "More" by accident. */
export function checkGrouped(names) {
  const missing = ungrouped(names);
  if (!missing.length) return;
  const message = `[eos-site] No component group for: ${missing.map((c) => "E" + c).join(", ")}. Add them to docs/.vitepress/groups.mjs.`;
  if (process.env.CI) throw new Error(message);
  console.warn(message);
}
