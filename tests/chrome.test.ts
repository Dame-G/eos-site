import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { page, userEvent } from "vitest/browser";
import { BOOT_SCRIPT, STORAGE_KEY } from "../docs/.vitepress/scheme";
import { mount, settle } from "./helpers";
import Layout from "../docs/.vitepress/theme/Layout.vue";

const { go } = vi.hoisted(() => ({ go: vi.fn() }));

vi.mock("vitepress", async () => {
  const { h, reactive, ref } = await import("vue");
  const route = reactive({ path: "/guide/theming" });
  return {
    useData: () => ({
      theme: ref({
        nav: [{ text: "Guide", link: "/guide/getting-started", activeMatch: "/guide/" }],
        sidebar: { "/guide/": [{ text: "Guide", items: [{ text: "Theming", link: "/guide/theming" }] }] },
        socialLinks: [],
      }),
      page: ref({ relativePath: "guide/theming.md", title: "Theming", isNotFound: false, params: {}, headers: [{ level: 2, title: "First", slug: "a" }, { level: 2, title: "Second", slug: "b" }] }),
      frontmatter: ref({}),
    }),
    useRoute: () => route,
    useRouter: () => ({ go }),
    Content: { render: () => h("div", [h("h1", "Theming"), h("h2", { id: "a" }, "First"), h("h2", { id: "b" }, "Second")]) },
    onContentUpdated: () => {},
  };
});

beforeEach(() => {
  go.mockClear();
  localStorage.clear();
});
afterEach(() => {
  localStorage.clear();
  document.documentElement.removeAttribute("data-scheme");
});

describe("site chrome", () => {
  it("the skip link is the first stop and moves focus to the main content", async () => {
    await mount(Layout);
    await userEvent.tab();
    const skip = document.activeElement as HTMLElement;
    expect(skip.textContent?.toLowerCase()).toContain("skip");
    await userEvent.keyboard("{Enter}");
    await settle();
    expect(document.activeElement?.id).toBe("main");
  });

  it("opens search with / and with Ctrl+K, finds a component by another library's word, and opens it with Enter", async () => {
    await mount(Layout);
    await userEvent.keyboard("/");
    const box = page.getByRole("combobox", { name: "Search the docs" });
    await expect.element(box).toBeVisible();
    expect(document.activeElement).toBe(box.element());
    await userEvent.keyboard("dropdown");
    await settle(150);
    // Every result names where it lives.
    await expect.element(page.getByText("Components › Form controls")).toBeVisible();
    await expect.element(page.getByText("ESelect")).toBeVisible();
    await userEvent.keyboard("{Enter}");
    expect(go).toHaveBeenCalledWith("/components/Select");

    await userEvent.keyboard("{Control>}k{/Control}");
    await expect.element(page.getByRole("combobox", { name: "Search the docs" })).toBeVisible();
  });

  it("labels a page hit with its area when it has no headings above it", async () => {
    await mount(Layout);
    await userEvent.keyboard("/");
    await userEvent.keyboard("defineTheme");
    await settle(150);
    await expect.element(page.getByText("Guide", { exact: true }).first()).toBeVisible();
  });

  it("says so when nothing matches", async () => {
    await mount(Layout);
    await userEvent.keyboard("/");
    await userEvent.keyboard("zzqxjvv");
    await settle(150);
    await expect.element(page.getByText("Nothing found", { exact: false })).toBeVisible();
  });

  it("builds the outline from the page headers, with one landmark and the first heading current", async () => {
    await mount(Layout);
    const outline = page.getByRole("navigation", { name: "On this page" });
    await expect.element(outline.getByRole("link", { name: "First" })).toHaveAttribute("href", "#a");
    await expect.element(outline.getByRole("link", { name: "Second" })).toHaveAttribute("href", "#b");
    await expect.element(outline.getByRole("link", { name: "First" })).toHaveAttribute("aria-current", "page");
    expect(document.querySelectorAll("aside")).toHaveLength(0);
  });

  it("Escape closes search and puts focus back on the button that opened it", async () => {
    await mount(Layout);
    const opener = page.getByRole("button", { name: /^Search/ });
    await opener.click();
    await expect.element(page.getByRole("combobox", { name: "Search the docs" })).toBeVisible();
    await userEvent.keyboard("{Escape}");
    await settle(500);
    expect(document.querySelector("[role=dialog]")).toBeNull();
    expect(document.activeElement).toBe(opener.element());
  });

  it("the colour scheme select lists the three modes, announces the change and remembers it", async () => {
    await mount(Layout);
    const pick = async (name: string) => {
      await page.getByRole("combobox", { name: "Colour scheme" }).click();
      await page.getByRole("option", { name }).click();
    };
    await pick("Light");
    expect(localStorage.getItem(STORAGE_KEY)).toBe("light");
    expect(document.documentElement.dataset.scheme).toBe("light");
    await expect.element(page.getByText("Colour scheme: light", { exact: true })).toBeInTheDocument();
    await pick("Dark");
    expect(localStorage.getItem(STORAGE_KEY)).toBe("dark");
    expect(document.documentElement.dataset.scheme).toBe("dark");
    await pick("System");
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it("the head script restores a saved choice before the page paints", () => {
    localStorage.setItem(STORAGE_KEY, "dark");
    new Function(BOOT_SCRIPT)();
    expect(document.documentElement.dataset.scheme).toBe("dark");
    localStorage.setItem(STORAGE_KEY, "light");
    new Function(BOOT_SCRIPT)();
    expect(document.documentElement.dataset.scheme).toBe("light");
  });
});
