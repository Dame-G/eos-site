import axe from "axe-core";
import { vi, expect, afterEach, beforeEach } from "vitest";
import { render } from "vitest-browser-vue";
import { createEos } from "@eos-ui/vue";
import type { Component } from "vue";

const PAGE_RULES = [
  "region",
  "landmark-one-main",
  "page-has-heading-one",
  "document-title",
  "html-has-lang",
  "landmark-no-duplicate-contentinfo",
  "landmark-unique",
  "bypass",
];

export async function expectNoViolations(root: Element, options: { disable?: string[] } = {}): Promise<void> {
  // Colours sampled halfway through a fade or slide read as low contrast.
  const finite = document.getAnimations().filter((a) => a.effect?.getComputedTiming().iterations !== Infinity);
  await Promise.all(finite.map((a) => a.finished.catch(() => undefined)));
  const rules = Object.fromEntries([...PAGE_RULES, ...(options.disable ?? [])].map((id) => [id, { enabled: false }]));
  const result = await axe.run(root, { rules, resultTypes: ["violations"] });
  if (result.violations.length) {
    const text = result.violations
      .map(
        (v) =>
          `${v.id} (${v.impact}): ${v.help}\n` +
          v.nodes.map((n) => `    ${n.target.join(" ")}\n    ${n.html.slice(0, 200)}\n    ${n.failureSummary?.replace(/\n/g, " ")}`).join("\n"),
      )
      .join("\n");
    throw new Error("Accessibility violations:\n" + text);
  }
}

/** Collects console errors and Vue warnings while a test runs; `expectQuiet()` fails the test when there are any. */
export function watchConsole() {
  const seen: string[] = [];
  beforeEach(() => {
    seen.length = 0;
    vi.spyOn(console, "error").mockImplementation((...a) => void seen.push("error: " + a.map(String).join(" ")));
    vi.spyOn(console, "warn").mockImplementation((...a) => void seen.push("warn: " + a.map(String).join(" ")));
  });
  afterEach(() => vi.restoreAllMocks());
  return {
    expectQuiet() {
      expect(seen, "console errors and warnings").toEqual([]);
    },
  };
}

/** Mounts a component the way the site does: with the eos plugin installed, inside an `e-root` stage. */
export async function mount(component: Component, options: { locale?: string; currency?: string } = {}) {
  const screen = await render(component, {
    global: { plugins: [createEos({ locale: options.locale ?? "en-US", currency: options.currency ?? "USD", warnOnContrast: false })] },
  });
  return screen;
}

/** Lets pending promises, timers of 0 and one frame pass: enough for async components and popovers to settle. */
export async function settle(ms = 50) {
  await new Promise((r) => setTimeout(r, ms));
  await new Promise((r) => requestAnimationFrame(() => r(null)));
}
