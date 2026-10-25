import { existsSync } from "node:fs";
import { chromium } from "playwright";

/**
 * How the tests and the page checks start a browser: Playwright's own Chromium (what CI installs and uses) when it is
 * there, otherwise the Microsoft Edge every Windows machine has, so a checkout runs without `playwright install`.
 */
export function launchOptions() {
  return process.env.CI || existsSync(chromium.executablePath()) ? {} : { channel: "msedge" };
}
