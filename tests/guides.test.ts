import { describe, it, expect } from "vitest";
import { mount, expectNoViolations, settle, watchConsole } from "./helpers";

const examples = import.meta.glob("../docs/guide/examples/*.vue");
const console_ = watchConsole();

describe("guide examples", () => {
  it("has examples", () => {
    expect(Object.keys(examples).length).toBeGreaterThan(0);
  });

  it.each(Object.keys(examples))("%s renders without console errors or axe violations", async (path) => {
    const { default: Example } = (await examples[path]!()) as { default: object };
    const screen = await mount(Example);
    await settle(400);
    expect(screen.container.querySelector("*"), "the example draws something").not.toBeNull();
    await expectNoViolations(document.body);
    console_.expectQuiet();
  });
});
