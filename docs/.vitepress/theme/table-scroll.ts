/**
 * Markdown tables are written as ETable's static markup (config.mts), so a page's tables cost no component. ETable
 * makes its frame a focusable, named region only while the table is wider than it: a tab stop that scrolls nothing is
 * noise. This does the same for the static tables: the frame carries its name in data-label, and gets tabindex, the
 * region role and the name only while it scrolls. Returns a function that stops watching.
 */
export function watchTableScroll(root: Element | null): () => void {
  const frames = root ? [...root.querySelectorAll<HTMLElement>(".e-table-scroll[data-label]")] : [];
  if (!frames.length) return () => {};
  const update = (frame: HTMLElement) => {
    const scrolls = frame.scrollWidth > frame.clientWidth + 1;
    if (scrolls) {
      frame.tabIndex = 0;
      frame.setAttribute("role", "region");
      frame.setAttribute("aria-label", frame.dataset["label"]!);
    } else {
      frame.removeAttribute("tabindex");
      frame.removeAttribute("role");
      frame.removeAttribute("aria-label");
    }
  };
  const observer = new ResizeObserver((entries) => {
    for (const e of entries) update((e.target.closest(".e-table-scroll") ?? e.target) as HTMLElement);
  });
  for (const frame of frames) {
    observer.observe(frame);
    const table = frame.querySelector("table");
    if (table) observer.observe(table);
    update(frame);
  }
  return () => observer.disconnect();
}
