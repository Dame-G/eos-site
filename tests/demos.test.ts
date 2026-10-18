import { describe, it, expect } from "vitest";
import { mount, expectNoViolations, settle, watchConsole } from "./helpers";

declare const __COMPONENTS__: string[];

// Every component folder in the library needs a demo here, and every demo must render quietly and pass axe.
const demos = import.meta.glob("../docs/components/demos/*.vue");
const console_ = watchConsole();

describe("component demos", () => {
  it("has a demo for every component in the library", () => {
    const have = new Set(Object.keys(demos).map((p) => p.split("/").pop()!.replace(".vue", "")));
    const missing = __COMPONENTS__.filter((n) => !have.has(n));
    expect(missing, "components without docs/components/demos/<Name>.vue").toEqual([]);
  });

  it.each(__COMPONENTS__)("%s renders without console errors or axe violations", async (name) => {
    const load = demos[`../docs/components/demos/${name}.vue`];
    expect(load, `docs/components/demos/${name}.vue`).toBeTypeOf("function");
    const { default: Demo } = (await load!()) as { default: object };
    const screen = await mount(Demo);
    await settle();
    expect(screen.container.querySelector("*"), "the demo draws something").not.toBeNull();
    await expectNoViolations(document.body);
    console_.expectQuiet();
  });
});
