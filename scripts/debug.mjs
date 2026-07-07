import puppeteer from "puppeteer-core";
import { mkdirSync } from "fs";

mkdirSync("/tmp/baarish-shots", { recursive: true });

const browser = await puppeteer.launch({
  executablePath: "/usr/bin/chromium-browser",
  headless: true,
  args: ["--no-sandbox", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--hide-scrollbars"],
  defaultViewport: { width: 1440, height: 810 },
});
const page = await browser.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(String(e)));

await page.goto("http://localhost:3011/?peek=0.45", { waitUntil: "networkidle0", timeout: 60000 });
await new Promise((r) => setTimeout(r, 8000));
await page.screenshot({ path: "/tmp/baarish-shots/fixed-0.45.png" });

await page.goto("http://localhost:3011/", { waitUntil: "networkidle0" });
await page.waitForFunction(() => {
  const el = document.querySelector(".enter");
  return el && parseFloat(getComputedStyle(el).opacity) > 0.5;
}, { timeout: 30000 });
await page.evaluate(() => {
  [...document.querySelectorAll("button")].find((b) => b.textContent?.includes("silence"))?.click();
});
await new Promise((r) => setTimeout(r, 9000));
await page.screenshot({ path: "/tmp/baarish-shots/fixed-enter.png" });

console.log("errors:", errors.length ? errors[0] : "none");
await browser.close();
