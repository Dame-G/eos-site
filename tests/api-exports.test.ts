import { describe, it, expect } from "vitest";
import * as library from "@eos-ui/vue";
import api from "../docs/guide/api.md?raw";
import composables from "../docs/guide/composables.md?raw";

// Everything @eos-ui/vue exports that is not a component or a component helper must be in the API reference, so an export the
// library adds cannot stay undocumented. Components have their own pages.

const COMPONENT = /^E[A-Z]/;

/** Exports that belong to a component page, not to the API reference. Add a name here only when its component page documents it. */
const COMPONENT_HELPERS = new Set<string>([]);

const names = Object.keys(library).filter((n) => !COMPONENT.test(n) && !COMPONENT_HELPERS.has(n));

describe("API reference", () => {
  it("finds the library's exports", () => {
    expect(names).toContain("createEos");
    expect(names).toContain("useToast");
  });

  it("mentions every export that is not a component", () => {
    const text = api + "\n" + composables;
    const missing = names.filter((n) => !new RegExp(String.raw`\b${n}\b`).test(text));
    expect(missing, "exports with no mention in docs/guide/api.md or composables.md").toEqual([]);
  });

  it("gives every use* composable its own heading in the API reference", () => {
    const composablesOf = names.filter((n) => /^use[A-Z]/.test(n));
    const missing = composablesOf.filter((n) => !new RegExp("^### `" + n + "\\b", "m").test(api));
    expect(missing, "composables without a ### heading in docs/guide/api.md").toEqual([]);
  });
});
