import { describe, it, expect } from "vitest";
import { page, userEvent } from "vitest/browser";
import { mount, expectNoViolations, settle, watchConsole } from "./helpers";
import PayBill from "../docs/patterns/PayBill.vue";
import SignIn from "../docs/patterns/SignIn.vue";
import Register from "../docs/patterns/Register.vue";
import SignForm from "../docs/patterns/SignForm.vue";
import Statements from "../docs/patterns/Statements.vue";
import Dashboard from "../docs/patterns/Dashboard.vue";
import Settings from "../docs/patterns/Settings.vue";
import SearchFilters from "../docs/patterns/SearchFilters.vue";
import DataTable from "../docs/patterns/DataTable.vue";
import EmptyError from "../docs/patterns/EmptyError.vue";
import ConfirmDestructive from "../docs/patterns/ConfirmDestructive.vue";
import PageFrame from "../docs/patterns/PageFrame.vue";
import UploadFlow from "../docs/patterns/UploadFlow.vue";
import Palette from "../docs/patterns/Palette.vue";
import PagedList from "../docs/patterns/PagedList.vue";

const console_ = watchConsole();

describe("Pay a bill", () => {
  it("offers the full balance, reveals the amount field for another amount, and pays", async () => {
    await mount(PayBill);
    await settle();
    await expect.element(page.getByRole("button", { name: "Pay $162.40" })).toBeEnabled();
    await expectNoViolations(document.body);

    await page.getByRole("radio", { name: /Another amount/ }).click();
    await expect.element(page.getByRole("spinbutton", { name: "Amount" })).toBeVisible();
    await expect.element(page.getByRole("button", { name: "Pay $100.00" })).toBeVisible();

    await page.getByRole("button", { name: "Pay $100.00" }).click();
    await expect.element(page.getByText("Payment received")).toBeVisible();
    await expectNoViolations(document.body);
    console_.expectQuiet();
  });
});

describe("Sign in", () => {
  it("shows field errors after an empty submit, and the code step waits for six digits", async () => {
    await mount(SignIn);
    await settle();
    await expectNoViolations(document.body);

    await page.getByRole("button", { name: "Sign in" }).click();
    await expect.element(page.getByText("Enter your password").first()).toBeVisible();
    await expectNoViolations(document.body);

    await expect.element(page.getByRole("button", { name: "Verify and sign in" })).toBeDisabled();
    console_.expectQuiet();
  });
});

describe("Register", () => {
  it("blocks the first step until it is valid, then moves on", async () => {
    await mount(Register);
    await settle();
    await expectNoViolations(document.body);

    await page.getByRole("button", { name: "Continue" }).click();
    await expect.element(page.getByText("Enter your first name").first()).toBeVisible();
    await expectNoViolations(document.body);

    await page.getByRole("textbox", { name: /First name/ }).fill("Ana");
    await page.getByRole("textbox", { name: /Last name/ }).fill("Ruiz");
    await page.getByRole("textbox", { name: /Date of birth/ }).fill("03/14/1990");
    await userEvent.keyboard("{Tab}"); // the typed date is read when the box loses focus
    await page.getByRole("textbox", { name: /Mobile phone/ }).fill("5551234567");
    await page.getByRole("button", { name: "Continue" }).click();
    await expect.element(page.getByText("How you will pay").first()).toBeVisible();
    await expectNoViolations(document.body);
    console_.expectQuiet();
  });
});

describe("Sign a form", () => {
  it("cannot be submitted before it is signed", async () => {
    await mount(SignForm);
    await settle();
    await expect.element(page.getByRole("button", { name: "Submit signed form" })).toBeDisabled();
    await expectNoViolations(document.body);
    console_.expectQuiet();
  });
});

describe("Statements", () => {
  it("filters, searches and pages the list", async () => {
    await mount(Statements);
    await settle();
    await expect.element(page.getByText("6 statements")).toBeVisible();
    await expectNoViolations(document.body);

    await page.getByRole("button", { name: "Paid" }).click();
    await expect.element(page.getByText("4 statements")).toBeVisible();

    await page.getByRole("textbox", { name: "Search" }).fill("Lab");
    await userEvent.keyboard("{Enter}");
    await expect.element(page.getByText("1 statement", { exact: true })).toBeVisible();
    await expectNoViolations(document.body);
    console_.expectQuiet();
  });
});

describe("Dashboard overview", () => {
  it("shows the notice, the figures and the recent statements", async () => {
    await mount(Dashboard);
    await settle();
    await expect.element(page.getByText("One statement is due")).toBeVisible();
    await expect.element(page.getByText("Balance due")).toBeVisible();
    await expect.element(page.getByRole("table")).toBeVisible();
    await expectNoViolations(document.body);
    console_.expectQuiet();
  });
});

describe("Settings page", () => {
  it("shows field errors for an empty name and confirms a save with a toast", async () => {
    await mount(Settings);
    await settle();
    await expectNoViolations(document.body);

    await page.getByRole("textbox", { name: /Name/ }).fill("");
    await page.getByRole("button", { name: "Save changes" }).click();
    await expect.element(page.getByText("Enter your name").first()).toBeVisible();

    await page.getByRole("textbox", { name: /Name/ }).fill("Ana Ruiz");
    await page.getByRole("button", { name: "Save changes" }).click();
    await expect.element(page.getByText("Settings saved")).toBeVisible();
    await expectNoViolations(document.body);
    console_.expectQuiet();
  });
});

describe("Search with filters", () => {
  it("narrows by type, searches, and clears the filters", async () => {
    await mount(SearchFilters);
    await settle();
    await expect.element(page.getByText("6 documents")).toBeVisible();
    await expectNoViolations(document.body);

    await page.getByRole("radio", { name: "Receipt" }).click();
    await expect.element(page.getByText("2 documents")).toBeVisible();

    await page.getByRole("textbox", { name: "Search" }).fill("zzz");
    await userEvent.keyboard("{Enter}");
    await expect.element(page.getByText("0 documents")).toBeVisible();
    await expect.element(page.getByText(/Nothing found for/)).toBeVisible();
    await expectNoViolations(document.body);

    await page.getByRole("button", { name: "Clear filters" }).click();
    await expect.element(page.getByText("6 documents")).toBeVisible();
    console_.expectQuiet();
  });
});

describe("Data table with bulk actions", () => {
  it("offers bulk actions once rows are selected", async () => {
    await mount(DataTable);
    await settle();
    await expect.element(page.getByRole("table")).toBeVisible();
    await expectNoViolations(document.body);

    await page.getByRole("checkbox").nth(1).click();
    await expect.element(page.getByRole("button", { name: "Download receipts" })).toBeVisible();
    await page.getByRole("button", { name: "Remove" }).click();
    await expect.element(page.getByText("This cannot be undone.")).toBeVisible();
    await settle();
    await expectNoViolations(document.body);
    console_.expectQuiet();
  });
});

describe("Empty and error states", () => {
  it("starts on the error, retries through loading to the list, and previews the empty state", async () => {
    await mount(EmptyError);
    await settle();
    await expect.element(page.getByText("Statements did not load")).toBeVisible();
    await expectNoViolations(document.body);

    await page.getByRole("button", { name: "Try again" }).click();
    await expect.element(page.getByText("Annual check-up")).toBeVisible();

    await page.getByRole("radio", { name: "Empty" }).click();
    await expect.element(page.getByText("No statements yet")).toBeVisible();
    await settle(400); // the chosen segment finishes its colour transition
    await expectNoViolations(document.body);
    console_.expectQuiet();
  });
});

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
    await expect.element(page.getByText("Documents sent"), { timeout: 3000 }).toBeVisible();
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
    await expect.element(page.getByText("Showing 1 to 5 of 23"), { timeout: 3000 }).toBeVisible();
    await expectNoViolations(document.body);

    await page.getByRole("button", { name: /Next/ }).click();
    await expect.element(page.getByText("Showing 6 to 10 of 23"), { timeout: 3000 }).toBeVisible();
    await page.getByRole("button", { name: /Next/ }).click();
    await expect.element(page.getByText("Page did not load"), { timeout: 3000 }).toBeVisible();
    await expectNoViolations(document.body);

    await page.getByRole("button", { name: "Try again" }).click();
    await expect.element(page.getByText("Showing 11 to 15 of 23"), { timeout: 3000 }).toBeVisible();
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
