import type { Router } from "vitepress";
import { warm } from "./demo-loading";

/** How long a move to another page waits for that page's demo before showing the page with its skeleton. */
const WAIT = 600;

/**
 * Gets each page's demo ready before it is needed, so a move inside the site shows the page whole, never a skeleton
 * that a demo then replaces:
 *   - a link that is pointed at, touched or focused warms the demo of the page it leads to;
 *   - a move to another page waits (up to WAIT) for that page's demo along with the page itself.
 * The page that is open loads its own demo itself (ComponentDemo.vue).
 * The page chunks themselves are VitePress's: it prefetches the links in view.
 */
export function preloadDemos(router: Router) {
  const intent = (e: Event) => {
    const link = (e.target as Element | null)?.closest?.<HTMLAnchorElement>("a[href]");
    if (link && link.origin === location.origin && link.target !== "_blank") void warm(link.href);
  };
  document.addEventListener("pointerover", intent, { passive: true });
  document.addEventListener("touchstart", intent, { passive: true });
  document.addEventListener("focusin", intent);

  // The first page is already in the HTML and hydrates its demo when it is seen, so only later moves wait.
  let first = true;
  let pending: Promise<unknown> = Promise.resolve();
  router.onBeforePageLoad = (href) => {
    pending = first ? Promise.resolve() : warm(href);
    first = false;
  };
  router.onAfterPageLoad = () =>
    Promise.race([pending, new Promise((done) => setTimeout(done, WAIT))]).then(() => undefined);
}
