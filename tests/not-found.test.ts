import { afterEach, describe, expect, it, vi } from "vitest";
import { mount, settle } from "./helpers";
import { pageByCase } from "../docs/.vitepress/theme/nav";
import NotFoundPage from "../docs/.vitepress/theme/NotFoundPage.vue";

const SIDEBAR = {
  "/guide/": [{ text: "Guide", items: [{ text: "Theming", link: "/guide/theming" }] }],
  "/components/": [{ text: "Actions", items: [{ text: "EButton", link: "/components/Button" }, { text: "EDataGrid", link: "/components/DataGrid" }] }],
};

const { go } = vi.hoisted(() => ({ go: vi.fn(async () => {}) }));
vi.mock("vitepress", async () => {
  const { ref } = await import("vue");
  return { useData: () => ({ theme: ref({ sidebar: SIDEBAR }) }), useRouter: () => ({ go }) };
});

describe("addresses in the wrong case", () => {
  it("finds the page that differs only in case or hyphens", () => {
    expect(pageByCase(SIDEBAR, "/components/data-grid")).toBe("/components/DataGrid");
    expect(pageByCase(SIDEBAR, "/components/button")).toBe("/components/Button");
    expect(pageByCase(SIDEBAR, "/components/DATAGRID.html")).toBe("/components/DataGrid");
    expect(pageByCase(SIDEBAR, "/Guide/Theming/")).toBe("/guide/theming");
  });

  it("finds nothing for a page that does not exist or is already right", () => {
    expect(pageByCase(SIDEBAR, "/components/Buttons")).toBeUndefined();
    expect(pageByCase(SIDEBAR, "/components/Button")).toBeUndefined();
    expect(pageByCase(undefined, "/components/button")).toBeUndefined();
  });

  const start = location.href;
  afterEach(() => history.replaceState(null, "", start));

  it("the not-found page replaces the address and goes to the right page, keeping the hash", async () => {
    history.replaceState(null, "", "/components/datagrid#props");
    await mount(NotFoundPage);
    await settle();
    expect(go).toHaveBeenCalledWith("/components/DataGrid#props");
    expect(location.pathname + location.hash).toBe("/components/DataGrid#props");
  });
});
