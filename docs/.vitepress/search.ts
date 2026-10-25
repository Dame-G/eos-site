const COMPONENT_TITLE = /^E([A-Z][A-Za-z0-9]*)$/;

/**
 * The words people type for a component that are not its name. They are indexed with the component, so "dropdown"
 * finds ESelect and "snackbar" finds EToast. Keep them to the commonly used alternatives, not loose associations.
 */
export const SYNONYMS: Record<string, string> = {
  Select: "dropdown drop-down picker listbox",
  Combobox: "autocomplete auto-complete typeahead autosuggest suggest",
  Dialog: "modal popup pop-up lightbox",
  Drawer: "sidebar sheet offcanvas panel",
  Toast: "snackbar notification toaster flash message",
  ToastProvider: "snackbar notification toaster",
  DatePicker: "datepicker date picker calendar input",
  RangePicker: "date range datepicker range",
  Calendar: "date month",
  Menu: "dropdown menu context menu actions menu",
  Notice: "alert banner callout message",
  Disclosure: "accordion collapse collapsible expand details",
  ExpandableRow: "accordion row expand",
  Stepper: "wizard steps progress steps",
  Pagination: "pager pages paging",
  Progress: "progress bar loader",
  Spinner: "loading loader busy",
  Skeleton: "placeholder shimmer loading",
  Upload: "file input file upload dropzone attach",
  TextField: "input text input",
  Textarea: "multiline text area",
  ColorField: "colour picker color picker",
  CommandPalette: "command menu spotlight quick open",
  DataGrid: "data table spreadsheet grid",
  Table: "data table",
  EmptyState: "zero state no results blank slate",
  Avatar: "profile picture user image",
  Breadcrumb: "crumbs trail",
  NavList: "navigation nav links sidebar",
  SearchBar: "search box search field",
  SearchResults: "search list",
  PasswordField: "password input secret",
  OtpField: "pin code one time code verification code",
  Kbd: "keyboard shortcut key",
  CopyButton: "clipboard copy",
  Highlight: "mark inline code",
  Divider: "separator rule hr",
  Segmented: "segmented control button group toggle group",
  Definition: "glossary term toggletip tooltip popover",
  CurrencyField: "money amount price",
  PhoneField: "telephone phone number",
  SignaturePad: "signature draw sign",
  SignatureField: "signature sign",
  Switch: "toggle on off",
  Checkbox: "tick check box",
  RadioGroup: "radio option group",
  Tooltip: "hint popover",
  Tabs: "tab bar tab panel",
  Icon: "glyph symbol",
  // A badge shows where something stands (Stamp); a chip or pill labels and categorises, and can be removed (Tag).
  Stamp: "badge status indicator label",
  Tag: "chip pill label category filter removable token",
  Surface: "card panel",
  AppShell: "layout page frame",
  AppHeader: "navbar top bar header",
  AppFooter: "footer page bottom",
  PageHeader: "page title heading",
  SkipLink: "skip to content bypass",
};

function componentWords(title: string): string {
  const match = COMPONENT_TITLE.exec(title.trim());
  if (!match) return "";
  const name = match[1]!;
  const words = name.replace(/([a-z0-9])([A-Z])/g, "$1 $2");
  return [words === name ? name : `${words} ${name}`, SYNONYMS[name]].filter(Boolean).join(" ");
}

export const searchBuildOptions = {
  fields: ["title", "titles", "text"],
  storeFields: ["title", "titles"],
};

export const searchOptions = {
  fuzzy: 0.2,
  prefix: true,
  boost: { title: 6, titles: 1, text: 1 },
};

export function renderForSearch(
  src: string,
  env: { relativePath?: string },
  md: { render: (src: string, env: unknown) => string },
): string {
  const html = md.render(src, env);
  const name = /^components\/([A-Za-z0-9]+)\.md$/.exec(env.relativePath ?? "")?.[1];
  const words = name && name !== "index" ? componentWords(`E${name}`) : "";
  return words ? `${html}<p>${words}</p>` : html;
}

export function titleRank(title: string, query: string): number {
  const q = query.trim().toLowerCase();
  const name = (COMPONENT_TITLE.test(title) ? title.slice(1) : title).toLowerCase();
  if (name === q) return 0;
  if (name.startsWith(q)) return 1;
  return 2;
}

export const componentSearchOptions = {
  fields: ["title", "names", "text"],
  storeFields: ["title", "titles"],
  searchOptions: { fuzzy: 0.2, prefix: true, boost: { names: 12, title: 6, text: 1 } },
};

export interface ComponentGroup {
  title: string;
  items: { name: string; summary: string }[];
}

export function componentDocs(groups: ComponentGroup[]) {
  return groups.flatMap((g) =>
    g.items.map((c) => ({
      id: `/components/${c.name}`,
      title: `E${c.name}`,
      titles: [g.title],
      names: componentWords(`E${c.name}`),
      text: c.summary,
    })),
  );
}

/** The area of the site a page id belongs to, used as the first step of the breadcrumb line under a result. */
export function areaOf(id: string): string {
  const path = id.replace(/[#?].*$/, "").replace(/\.html$/, "");
  if (path === "/" || path === "") return "Home";
  if (path.startsWith("/guide/") || path === "/changelog") return "Guide";
  if (path.startsWith("/components")) return "Components";
  if (path.startsWith("/patterns")) return "Patterns";
  if (path === "/playground") return "Design";
  return "Docs";
}

/**
 * The line under a result: where it lives, then the headings above it. A page's own title heading is not repeated.
 * Every result gets at least its area, so no result is left without a place to belong to.
 */
export function breadcrumb(id: string, title: string, titles: string[]): string {
  const rest = titles.filter((t) => t && t !== title);
  const area = areaOf(id);
  const trail = rest[0] === area ? rest : [area, ...rest];
  return trail.join(" › ");
}
