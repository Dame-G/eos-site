import { defineAsyncComponent, h, hydrateOnVisible, type Component } from "vue";
import DemoSkeleton from "./DemoSkeleton.vue";

const loaders = import.meta.glob("../../components/demos/*.vue");

type Async = Component & { __asyncLoader: () => Promise<unknown>; readonly __asyncResolved?: Component };

/** The demo frame every component page shows. Until its code has loaded, a skeleton of the frame holds its place. */
export const ComponentDemo = defineAsyncComponent({
  loader: () => import("./ComponentDemo.vue"),
  loadingComponent: DemoSkeleton,
  delay: 0,
}) as unknown as Async;

const StageSkeleton = { name: "DemoStageSkeleton", render: () => h(DemoSkeleton, { stage: true }) };

/**
 * One async component per demo, kept for the session: once a demo's code has loaded (or been warmed ahead of a visit),
 * every later visit renders it at once instead of showing the skeleton for a tick. The markup is in the built page, and
 * it only becomes interactive once it scrolls into view.
 */
const demos = new Map<string, Async>();
export function demoOf(name: string): Async | null {
  const loader = loaders[`../../components/demos/${name}.vue`] as (() => Promise<{ default: Component }>) | undefined;
  if (!loader) return null;
  let demo = demos.get(name);
  if (!demo) {
    demo = defineAsyncComponent({ loader, hydrate: hydrateOnVisible(), loadingComponent: StageSkeleton, delay: 0 }) as unknown as Async;
    demos.set(name, demo);
  }
  return demo;
}

/** The component a page address shows a demo of: `/components/DataGrid` is `DataGrid`. */
export function demoName(href: string): string | undefined {
  const { pathname } = new URL(href, location.href);
  return /^\/components\/([A-Z][A-Za-z]*)(?:\.html)?$/.exec(pathname)?.[1];
}

/** Loads the frame and the demo of the page at `href`, so it renders whole the moment the page is shown. */
export function warm(href: string): Promise<unknown> {
  const name = demoName(href);
  const demo = name && demoOf(name);
  if (!demo) return Promise.resolve();
  return Promise.all([ComponentDemo.__asyncLoader(), demo.__asyncLoader()]).catch(() => undefined);
}
