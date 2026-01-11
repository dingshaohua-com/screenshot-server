import type { Browser } from "playwright";
import { chromium } from "playwright";

let browser: Browser | undefined;
const debug = false;

export async function closeBrowser() {
  if (browser) {
    await browser.close();
    browser = undefined;
  }
}

export async function launchBrowser() {
  if (!browser) {
    browser = await chromium.launch({ headless: !debug, devtools: debug });
    // 1. 正常退出
    process.once("beforeExit", closeBrowser);
    // 2. Ctrl-C
    process.once("SIGINT", closeBrowser);
    process.once("SIGTERM", closeBrowser);
  }
}

export async function getBrowser() {
  await launchBrowser();
  return browser!;
}

export async function getCtxAndPage(width?: number, height?: number) {
  const browser = await getBrowser();
  const context = await browser.newContext({
    ignoreHTTPSErrors: true,
    bypassCSP: true, // 绕过内容安全策略
    javaScriptEnabled: true,
  });
  const page = await context.newPage();
  if (width && height) {
    await page.setViewportSize({ width, height });
  }
  return { context, page };
}
