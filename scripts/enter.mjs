// Dev-only: simulates a real visitor — waits for the intro, clicks
// "enter in silence", and captures the world opening its eyes.
import puppeteer from "puppeteer-core";

const browser = await puppeteer.launch({
  executablePath: "/usr/bin/chromium-browser",
  headless: true,
  args: ["--no-sandbox", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--hide-scrollbars"],
  defaultViewport: { width: 1440, height: 810 },
});
const page = await browser.newPage();
page.on("console", (m) => {
  if (m.type() === "error" || m.type() === "warning") console.log(`[${m.type()}]`, m.text().slice(0, 250));
});
page.on("pageerror", (e) => console.log("[pageerror]", String(e).slice(0, 250)));

await page.goto("http://localhost:3011/", { waitUntil: "networkidle0", timeout: 60000 });
// wait until the enter buttons have actually faded in
await page.waitForFunction(
  () => {
    const el = document.querySelector(".enter");
    return el && parseFloat(getComputedStyle(el).opacity) > 0.5;
  },
  { timeout: 30000 }
);
await page.evaluate(() => {
  const btns = [...document.querySelectorAll("button")];
  btns.find((b) => b.textContent?.includes("silence"))?.click();
});
for (const s of [1, 3, 5, 8]) {
  await new Promise((r) => setTimeout(r, s === 1 ? 1000 : 2500));
  await page.screenshot({ path: `/tmp/baarish-shots/enter-${s}s.png` });
}
// then scroll a little, like a first hesitant step
await page.evaluate(() => window.scrollBy(0, 2500));
await new Promise((r) => setTimeout(r, 6000));
await page.screenshot({ path: "/tmp/baarish-shots/first-steps.png" });
console.log("done");
await browser.close();
