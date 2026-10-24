import { describe, expect, it } from "vitest";
import { page, userEvent } from "vitest/browser";
import { defineComponent, h } from "vue";
import { EConfigProvider, ESelect } from "@eos-ui/vue";
import { mount, settle } from "./helpers";

// The demos and the playground preview sit in an EConfigProvider. Menus and option lists portal into it and leave an empty wrapper behind, so the scope must not add space per wrapper.
describe("EConfigProvider as the demo scope", () => {
  it("keeps its height when an option list opens and closes", async () => {
    const Demo = defineComponent({
      render: () =>
        h(EConfigProvider, { theme: { name: "light" }, class: "probe" }, () =>
          h(ESelect, { label: "Plan", options: ["Basic", "Team"], modelValue: "Basic" }),
        ),
    });
    await mount(Demo);
    const scope = document.querySelector<HTMLElement>(".probe")!;
    const content = scope.firstElementChild as HTMLElement;
    // Empty portal wrappers sit after the content; none of them may add height.
    expect(scope.children.length).toBeGreaterThan(1);
    expect(scope.getBoundingClientRect().height).toBe(content.getBoundingClientRect().height);
    const before = scope.getBoundingClientRect().height;
    for (let i = 0; i < 3; i++) {
      await page.getByRole("combobox", { name: "Plan" }).click();
      await settle(300);
      await userEvent.keyboard("{Escape}");
      await settle(400);
    }
    expect(scope.getBoundingClientRect().height).toBe(before);
  });
});
