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
