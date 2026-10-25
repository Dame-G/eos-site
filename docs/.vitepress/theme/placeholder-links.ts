/**
 * Demos link to stand-in addresses such as #statements. Followed, one would change the page's address and set off its
 * section flash, so a click on a link to a #hash that names nothing on the page is stopped. A link to something that
 * is there (a skip link to its own demo's main) still works. The container also needs the class `vp-raw`, or
 * VitePress's router handles the click before it gets here.
 */
export function stopPlaceholderLinks(e: MouseEvent) {
  const link = (e.target as Element | null)?.closest?.("a[href^='#']");
  if (!link) return;
  const id = decodeURIComponent(link.getAttribute("href")!.slice(1));
  if (!id || !document.getElementById(id)) e.preventDefault();
}
