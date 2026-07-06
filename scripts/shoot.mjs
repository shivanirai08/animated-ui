// Dev-only verification: loads the experience at several journey points,
// captures console errors and screenshots. Not part of the artwork.
import puppeteer from "puppeteer-core";

const points = process.argv[2] ? process.argv[2].split(",") : ["intro", "0.13", "0.27", "0.42", "0.57", "0.74", "0.87", "0.97"];

const browser = await puppeteer.launch({
  executablePath: "/usr/bin/chromium-browser",
  headless: true,
  args: [
    "--no-sandbox",
    "--use-angle=swiftshader",
    "--enable-unsafe-swiftshader",
    "--window-size=1440,810",
    "--hide-scrollbars",
  ],
  defaultViewport: { width: 1440, height: 810 },
});

const page = await browser.newPage();
const errors = [];
page.on("console", (msg) => {
  if (msg.type() === "error" || msg.type() === "warning") errors.push(`${msg.type()}: ${msg.text().slice(0, 300)}`);
});
page.on("pageerror", (e) => errors.push(`pageerror: ${String(e).slice(0, 300)}`));

for (const p of points) {
  const url = p === "intro" ? "http://localhost:3011/" : `http://localhost:3011/?peek=${p}`;
  await page.goto(url, { waitUntil: "networkidle0", timeout: 60000 });
  // let the camera damping settle and the world animate
  await new Promise((r) => setTimeout(r, p === "intro" ? 7000 : 9000));
  await page.screenshot({ path: `/tmp/baarish-shots/shot-${p}.png` });
  console.log(`shot-${p}.png done`);
}

console.log("\n--- console output ---");
console.log(errors.length ? [...new Set(errors)].join("\n") : "(no errors or warnings)");
await browser.close();
