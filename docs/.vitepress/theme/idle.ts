/** Runs `run` once the browser is idle, at the latest after `timeout` ms; after `fallback` ms where there is no requestIdleCallback (Safari). Returns a function that cancels it. */
export function whenIdle(run: () => void, timeout: number, fallback: number): () => void {
  if (typeof window.requestIdleCallback === "function") {
    const handle = window.requestIdleCallback(run, { timeout });
    return () => window.cancelIdleCallback(handle);
  }
  const handle = window.setTimeout(run, fallback);
  return () => window.clearTimeout(handle);
}
