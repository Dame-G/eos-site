import { describe, it, expect } from "vitest";
import { page, userEvent } from "vitest/browser";
import { mount, expectNoViolations, settle, watchConsole } from "./helpers";
import ConfirmDestructive from "../docs/patterns/ConfirmDestructive.vue";
import PageFrame from "../docs/patterns/PageFrame.vue";
import UploadFlow from "../docs/patterns/UploadFlow.vue";
import Palette from "../docs/patterns/Palette.vue";
import PagedList from "../docs/patterns/PagedList.vue";
import SignIn from "../docs/patterns/SignIn.vue";

const console_ = watchConsole();

describe("Confirm a destructive action", () => {
  it("asks first, removes on confirm, and offers Undo", async () => {
    await mount(ConfirmDestructive);
    await settle();
    await expectNoViolations(document.body);

    await page.getByRole("button", { name: "Remove Visa ending 4242" }).click();
    const dialog = page.getByRole("alertdialog");
    await expect.element(dialog).toBeVisible();
    await expect.element(page.getByText("Remove Visa ending 4242?")).toBeVisible();
    await expectNoViolations(document.body);

    // Keep leaves the card where it was.
    await page.getByRole("button", { name: "Keep card" }).click();
    await expect.element(page.getByRole("button", { name: "Remove Visa ending 4242" })).toBeVisible();

    await page.getByRole("button", { name: "Remove Visa ending 4242" }).click();
    await page.getByRole("button", { name: "Remove card" }).click();
    const toasts = page.getByRole("region", { name: "Notifications" });
    await expect.element(toasts.getByText("Visa ending 4242 removed")).toBeVisible();
    await expect.element(page.getByRole("button", { name: "Remove Visa ending 4242" })).not.toBeInTheDocument();

    // Hovering a toast holds its timer, so a slow run cannot let the 8 seconds lapse.
    await toasts.getByText("Visa ending 4242 removed").hover();
    await toasts.getByRole("button", { name: "Undo" }).click();
    await expect.element(page.getByRole("button", { name: "Remove Visa ending 4242" })).toBeVisible();
    console_.expectQuiet();
  });
});

describe("AppShell page frame", () => {
  it("draws the landmarks and moves the current item with the page", async () => {
    await mount(PageFrame);
    await settle();
    await expect.element(page.getByRole("link", { name: /Statements/ }).first()).toHaveAttribute("aria-current", "page");
    await expect.element(page.getByRole("heading", { name: "Statements" })).toBeVisible();
    await expectNoViolations(document.body, { disable: ["landmark-main-is-top-level", "landmark-no-duplicate-main", "landmark-no-duplicate-banner"] });

    await page.getByRole("button", { name: "Home" }).click();
    await expect.element(page.getByRole("heading", { name: "Home", exact: true })).toBeVisible();
    await expect.element(page.getByRole("link", { name: "Home" }).first()).toHaveAttribute("aria-current", "page");
    console_.expectQuiet();
  });
});

describe("Upload flow", () => {
  it("refuses an empty send and a wrong type, then sends and confirms", async () => {
    await mount(UploadFlow);
    await settle();
    await expectNoViolations(document.body);

    await page.getByRole("button", { name: "Send documents" }).click();
    await expect.element(page.getByText("Choose at least one file to send.").first()).toBeVisible();

    const input = page.getByLabelText(/Documents/);
    await userEvent.upload(input, new File(["x"], "notes.txt", { type: "text/plain" }));
    await expect.element(page.getByText(/notes\.txt is not a PDF, JPG or PNG/).first()).toBeVisible();

    await userEvent.upload(input, new File(["%PDF"], "card.pdf", { type: "application/pdf" }));
    await expect.element(page.getByRole("button", { name: "Send 1 document" })).toBeVisible();
    await page.getByRole("button", { name: "Send 1 document" }).click();
    await expect.element(page.getByText("Documents sent")).toBeVisible({ timeout: 3000 });
    await expect.element(page.getByText(/We received 1 document\./)).toBeVisible();
    await expectNoViolations(document.body);
    console_.expectQuiet();
  });
});

describe("Command palette", () => {
  it("opens from the button, filters, runs a command and returns focus", async () => {
    await mount(Palette);
    await settle();
    await expectNoViolations(document.body);
    await expect.element(page.getByText("$162.40 due")).toBeVisible();

    await page.getByRole("button", { name: "Search commands" }).click();
    const box = page.getByRole("combobox");
    await expect.element(box).toBeVisible();
    await box.fill("bills");
    await expect.element(page.getByRole("option", { name: /Statements/ })).toBeVisible();
    await userEvent.keyboard("{Enter}");
    await expect.element(page.getByText("Statements", { exact: true }).first()).toBeVisible();
    await expect.element(page.getByRole("button", { name: "Search commands" })).toHaveFocus();

    await page.getByRole("button", { name: "Search commands" }).click();
    await page.getByRole("combobox").fill("pay");
    await userEvent.keyboard("{Enter}");
    await expect.element(page.getByText("October statement paid")).toBeVisible();
    await expect.element(page.getByText("Paid", { exact: true })).toBeVisible();
    // The palette leaves on easing-exit and keeps the page aria-hidden until it has gone, while focus is already back on the button. Check once it has left.
    await settle(1000);
    await expectNoViolations(document.body);
    console_.expectQuiet();
  });
});

describe("Loading and paging", () => {
  it("shows skeletons, then rows, fails page 3 once and recovers", async () => {
    await mount(PagedList);
    await expect.element(page.getByRole("list", { name: "Statements" })).toHaveAttribute("aria-busy", "true");
    await expect.element(page.getByText("Showing 1 to 5 of 23")).toBeVisible({ timeout: 3000 });
    await expectNoViolations(document.body);

    await page.getByRole("button", { name: /Next/ }).click();
    await expect.element(page.getByText("Showing 6 to 10 of 23")).toBeVisible({ timeout: 3000 });
    await page.getByRole("button", { name: /Next/ }).click();
    await expect.element(page.getByText("Page did not load")).toBeVisible({ timeout: 3000 });
    await expectNoViolations(document.body);

    await page.getByRole("button", { name: "Try again" }).click();
    await expect.element(page.getByText("Showing 11 to 15 of 23")).toBeVisible({ timeout: 3000 });
    console_.expectQuiet();
  });
});

describe("Sign in error summary", () => {
  it("lists the problems in EForm's summary, which takes focus, and each entry moves focus to its field", async () => {
    await mount(SignIn);
    await settle();
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect.element(page.getByText("There is a problem")).toBeVisible();
    await expect.poll(() => document.activeElement?.textContent ?? "").toContain("There is a problem");

    await page.getByRole("link", { name: /Password: Enter your password/ }).click();
    await expect.element(page.getByLabelText(/^Password/)).toHaveFocus();
    await expectNoViolations(document.body);
    console_.expectQuiet();
  });
});
