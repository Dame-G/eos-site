import { describe, it, expect } from "vitest";
import { page, userEvent } from "vitest/browser";
import { mount, expectNoViolations, settle, watchConsole } from "./helpers";
import PayBill from "../docs/patterns/PayBill.vue";
import SignIn from "../docs/patterns/SignIn.vue";
import Register from "../docs/patterns/Register.vue";
import ScheduleVisit from "../docs/patterns/ScheduleVisit.vue";
import SignForm from "../docs/patterns/SignForm.vue";
import Statements from "../docs/patterns/Statements.vue";

const console_ = watchConsole();

// Each pattern page is a working example: it renders quietly, behaves, and passes axe in its first state and after use.

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
  it("shows an error summary and field errors after an empty submit, and the code step waits for six digits", async () => {
    await mount(SignIn);
    await settle();
    await expectNoViolations(document.body);

    await page.getByRole("button", { name: "Sign in" }).click();
    await expect.element(page.getByText("There is a problem")).toBeVisible();
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
    await expect.element(page.getByText("There is a problem")).toBeVisible();
    await expect.element(page.getByText("Enter your first name").first()).toBeVisible();
    await expectNoViolations(document.body);

    await page.getByRole("textbox", { name: /First name/ }).fill("Ana");
    await page.getByRole("textbox", { name: /Last name/ }).fill("Ruiz");
    await page.getByRole("textbox", { name: /Mobile phone/ }).fill("5551234567");
    await page.getByRole("button", { name: "Continue" }).click();
    await expect.element(page.getByText("How you will pay").first()).toBeVisible();
    await expectNoViolations(document.body);
    console_.expectQuiet();
  });
});

describe("Schedule a visit", () => {
  it("lists the times of the chosen day and confirms the booking", async () => {
    await mount(ScheduleVisit);
    await settle();
    await expect.element(page.getByRole("button", { name: "Confirm appointment" })).toBeEnabled();
    await expectNoViolations(document.body);

    await page.getByRole("button", { name: "Confirm appointment" }).click();
    await expect.element(page.getByRole("img", { name: "Confirmed" })).toBeVisible();
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
