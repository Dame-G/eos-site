import type { DefaultTheme } from "vitepress";
import type { NavItem, NavSection } from "@eos-ui/vue";

/** A page path without the extension, the trailing slash or `index`, so `/a/b.html`, `/a/b/` and `/a/b` compare equal. */
export function cleanPath(path: string): string {
  const p = path.replace(/[?#].*$/, "").replace(/(^|\/)index(\.html)?$/, "$1").replace(/\.html$/, "");
  return p.length > 1 ? p.replace(/\/$/, "") : "/";
}

/** The sidebar of a path: the config key with the longest prefix that matches. */
export function sidebarFor(sidebar: DefaultTheme.Sidebar | undefined, path: string): DefaultTheme.SidebarItem[] {
  if (!sidebar) return [];
  if (Array.isArray(sidebar)) return sidebar;
  const clean = cleanPath(path);
  const key = Object.keys(sidebar)
    .filter((k) => clean === cleanPath(k) || clean.startsWith(cleanPath(k).replace(/\/?$/, "/")))
    .sort((a, b) => b.length - a.length)[0];
  if (key === undefined) return [];
  const value = sidebar[key];
  return Array.isArray(value) ? value : (value?.items ?? []);
}

/**
 * Turns VitePress sidebar items into navigation sections. Top-level links gather into one section without a heading;
 * a top-level group becomes a section headed by its text. A sidebar with a single section gets no heading at all.
 */
export function toSections(items: DefaultTheme.SidebarItem[], path: string): NavSection[] {
  const here = cleanPath(path);
  const leaf = (item: DefaultTheme.SidebarItem): NavItem => ({
    label: item.text ?? "",
    href: item.link,
    current: item.link ? cleanPath(item.link) === here : false,
  });
  const sections: NavSection[] = [];
  let loose: NavItem[] | null = null;
  for (const item of items) {
    if (item.items?.length) {
      loose = null;
      sections.push({ label: item.text, items: item.items.map(leaf) });
    } else {
      if (!loose) {
        loose = [];
        sections.push({ items: loose });
      }
      loose.push(leaf(item));
    }
  }
  return sections.length === 1 ? [{ items: sections[0]!.items }] : sections;
}

/** Every link of the sections in reading order, for previous and next. */
export function flatten(sections: NavSection[]): NavItem[] {
  return sections.flatMap((s) => s.items).filter((i) => i.href);
}
