// Capture reference screenshots of jwanderson.com (or any reference site) to
// guide the redesign. RUN THIS LOCALLY — the cloud sandbox blocks the site and
// has no browser. It saves full-page PNGs at desktop + mobile widths, plus the
// rendered HTML, into reference/.
//
//   npm run capture:install   # one-time: download the Chromium binary
//   npm run capture           # capture the default page list
//
// Add/adjust URLs in PAGES below (find real product/listing URLs by browsing
// the site once). The script also auto-discovers the homepage nav links and
// prints them so you can copy the ones you want.

import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

const BASE = process.env.REF_BASE ?? "https://jwanderson.com";

// Edit this list with the pages you want as reference.
const PAGES = [
  { name: "home", path: "/en-vn" },
  // Add real URLs after browsing the site, e.g.:
  // { name: "shop", path: "/en-vn/shop/woman" },
  // { name: "product", path: "/en-vn/products/..." },
  // { name: "about", path: "/en-vn/about" },
];

const VIEWPORTS = [
  { label: "desktop", width: 1440, height: 900 },
  { label: "mobile", width: 390, height: 844 },
];

const OUT = "reference/jwanderson";

async function dismissCookies(page) {
  const selectors = [
    'button:has-text("Accept")',
    'button:has-text("ACCEPT")',
    'button:has-text("Agree")',
    'button:has-text("Đồng ý")',
    '[id*="accept" i]',
    '[class*="accept" i]',
  ];
  for (const sel of selectors) {
    try {
      const el = page.locator(sel).first();
      if (await el.isVisible({ timeout: 800 })) {
        await el.click({ timeout: 800 });
        await page.waitForTimeout(400);
        break;
      }
    } catch {
      /* ignore */
    }
  }
}

// Scroll to the bottom in steps so lazy-loaded imagery renders before capture.
async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let total = 0;
      const step = 400;
      const timer = setInterval(() => {
        window.scrollBy(0, step);
        total += step;
        if (total >= document.body.scrollHeight) {
          clearInterval(timer);
          window.scrollTo(0, 0);
          resolve();
        }
      }, 120);
    });
  });
  await page.waitForTimeout(600);
}

async function save(path, data) {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, data);
}

async function main() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36",
  });

  for (const { name, path } of PAGES) {
    const url = BASE + path;
    for (const vp of VIEWPORTS) {
      const page = await context.newPage();
      await page.setViewportSize({ width: vp.width, height: vp.height });
      try {
        console.log(`→ ${name} (${vp.label}): ${url}`);
        await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
        await dismissCookies(page);
        await autoScroll(page);
        const file = join(OUT, `${name}.${vp.label}.png`);
        await mkdir(dirname(file), { recursive: true });
        await page.screenshot({ path: file, fullPage: true });
        console.log(`   saved ${file}`);

        if (vp.label === "desktop") {
          // Save HTML + discovered nav links once per page.
          const html = await page.content();
          await save(join(OUT, `${name}.html`), html);
          const links = await page.$$eval("header a, nav a", (as) =>
            Array.from(new Set(as.map((a) => a.getAttribute("href")).filter(Boolean))),
          );
          console.log(`   nav links on ${name}:`, links.slice(0, 40));
        }
      } catch (err) {
        console.warn(`   ! failed ${name} (${vp.label}): ${err.message}`);
      } finally {
        await page.close();
      }
    }
  }

  await browser.close();
  console.log(`\nDone. Screenshots in ${OUT}/`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
