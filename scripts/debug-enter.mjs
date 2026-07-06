import puppeteer from "puppeteer-core";

const browser = await puppeteer.launch({
  executablePath: "/usr/bin/chromium-browser",
  headless: true,
  args: ["--no-sandbox", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
  defaultViewport: { width: 1440, height: 810 },
});
const page = await browser.newPage();
page.on("framenavigated", (f) => console.log("navigated:", f.url()));
page.on("response", (r) => {
  if (r.status() >= 400) console.log("HTTP", r.status(), r.url());
});
page.on("console", (m) => console.log(`[${m.type()}]`, m.text().slice(0, 200)));
page.on("pageerror", (e) => console.log("[pageerror]", String(e).slice(0, 400)));
await page.goto("http://localhost:3011/", { waitUntil: "networkidle0", timeout: 60000 });
await new Promise((r) => setTimeout(r, 8000));
await page.evaluate(() => {
  [...document.querySelectorAll("button")].find((b) => b.textContent?.includes("silence"))?.click();
});
await new Promise((r) => setTimeout(r, 1200));
const info = await page.evaluate(() => {
  const out = [];
  document.querySelectorAll("body *").forEach((el) => {
    const cs = getComputedStyle(el);
    if (cs.position === "fixed") {
      out.push(
        `${el.tagName}.${(el.className || "").toString().slice(0, 60)} z=${cs.zIndex} bg=${cs.backgroundColor} op=${cs.opacity} filter=${cs.filter.slice(0, 60)}`
      );
    }
  });
  const canvas = document.querySelector("canvas");
  return { fixed: out, canvasSize: canvas ? `${canvas.width}x${canvas.height}` : "none", bodyBg: getComputedStyle(document.body).backgroundColor };
});
console.log(JSON.stringify(info, null, 1));
await browser.close();
