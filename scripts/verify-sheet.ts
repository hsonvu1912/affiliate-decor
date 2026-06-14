// Verify a live Google Sheet connection end-to-end before deploying.
//
//   npm run verify                     # read-only checks (auth, headers, map, image)
//   npm run verify -- --write-test-click  # also append one marker row to Clicks
//
// Confirms: credentials work, every tab exists with the headers the mappers
// expect, rows map cleanly, the Clicks header matches the click logger, and a
// real Drive image can be fetched. Exits non-zero if any check fails.

import { readTab, appendRow } from "@/lib/google/sheets";
import { sheetsClient } from "@/lib/google/auth";
import { requireGoogleEnv, env } from "@/lib/env";
import { ALL_TABS, TAB_HEADERS, type TabName } from "@/lib/sheet-schema";
import { mapRows, toProduct, toCollection, toCategory, toStyle } from "@/lib/data/mappers";
import { COLUMNS } from "@/lib/data/clicks";
import { fetchDriveFile } from "@/lib/google/drive";
import type { Product } from "@/types";

const TAB_TITLE: Record<TabName, string> = {
  Products: env.SHEET_TAB_PRODUCTS,
  Collections: env.SHEET_TAB_COLLECTIONS,
  Categories: env.SHEET_TAB_CATEGORIES,
  Styles: env.SHEET_TAB_STYLES,
  Settings: env.SHEET_TAB_SETTINGS,
  Clicks: env.SHEET_TAB_CLICKS,
};

type Sheets = ReturnType<typeof sheetsClient>;

let failures = 0;
const ok = (label: string, detail = "") =>
  console.log(`  ✓ ${label}${detail ? ` — ${detail}` : ""}`);
const bad = (label: string, detail = "") => {
  failures++;
  console.log(`  ✗ ${label}${detail ? ` — ${detail}` : ""}`);
};
const warn = (label: string) => console.log(`  ⚠ ${label}`);

async function readHeader(sheets: Sheets, spreadsheetId: string, title: string): Promise<string[]> {
  const res = await sheets.spreadsheets.values.get({ spreadsheetId, range: `${title}!1:1` });
  const first = res.data.values?.[0] ?? [];
  return first.map((c) => (c != null ? String(c).trim() : ""));
}

function arraysEqual(a: string[], b: string[]): boolean {
  return a.length === b.length && a.every((v, i) => v === b[i]);
}

function firstDriveId(products: Product[]): string | null {
  for (const p of products) {
    for (const id of p.imageIds) {
      if (id && !id.startsWith("http") && !id.startsWith("/")) return id;
    }
  }
  return null;
}

function countLine(label: string, raw: number, mapped: number): void {
  if (mapped < raw) warn(`${label}: ${raw} dòng, map được ${mapped} (${raw - mapped} dòng bị bỏ — thiếu id/name?)`);
  else ok(label, `${raw} dòng, map được ${mapped}`);
}

async function main(): Promise<void> {
  const writeClick = process.argv.includes("--write-test-click");
  const { sheetId } = requireGoogleEnv();
  if (env.USE_MOCK_DATA) {
    warn("USE_MOCK_DATA=true — đang ở chế độ mock; đặt false để kiểm tra dữ liệu thật.");
  }
  const sheets = sheetsClient();
  console.log(`→ Verify Spreadsheet ${sheetId}\n`);

  // 1) Access + tab presence.
  const meta = await sheets.spreadsheets.get({ spreadsheetId: sheetId });
  const titles = new Set(
    (meta.data.sheets ?? [])
      .map((s) => s.properties?.title)
      .filter((t): t is string => Boolean(t)),
  );
  ok("Truy cập Spreadsheet", `${titles.size} tab`);

  // 2) Header check per tab.
  for (const tab of ALL_TABS) {
    const title = TAB_TITLE[tab];
    if (!titles.has(title)) {
      bad(`Tab ${title}`, "không tồn tại — chạy `npm run seed`");
      continue;
    }
    const header = await readHeader(sheets, sheetId, title);
    const expected = TAB_HEADERS[tab];
    const missing = expected.filter((h) => !header.includes(h));
    const extra = header.filter((h) => h && !expected.includes(h));
    if (missing.length) bad(`Header ${title}`, `thiếu cột: ${missing.join(", ")}`);
    else ok(`Header ${title}`, extra.length ? `đủ (thừa: ${extra.join(", ")})` : "đủ cột");
  }

  // 3) Read + map sanity.
  const products = await readTab(TAB_TITLE.Products);
  const mappedProducts = mapRows(products, toProduct);
  countLine("Products", products.length, mappedProducts.length);

  const collections = await readTab(TAB_TITLE.Collections);
  countLine("Collections", collections.length, mapRows(collections, toCollection).length);

  const categories = await readTab(TAB_TITLE.Categories);
  countLine("Categories", categories.length, mapRows(categories, toCategory).length);

  const styles = await readTab(TAB_TITLE.Styles);
  countLine("Styles", styles.length, mapRows(styles, toStyle).length);

  const settings = await readTab(TAB_TITLE.Settings);
  ok("Settings", `${settings.length} dòng key/value`);

  // 4) Clicks header vs logger COLUMNS, + dry-run / test append.
  if (titles.has(TAB_TITLE.Clicks)) {
    const clickHeader = await readHeader(sheets, sheetId, TAB_TITLE.Clicks);
    if (arraysEqual(clickHeader, COLUMNS as string[])) ok("Clicks header khớp logger");
    else bad("Clicks header", `khác COLUMNS. Trên Sheet: [${clickHeader.join(", ")}]`);

    const testEvent: Record<string, string> = {
      timestamp: new Date().toISOString(),
      productId: "__verify__",
      productName: "Verify ping",
      retailer: "",
      affiliateUrl: "",
      referrer: "",
      country: "",
      device: "script",
      userAgent: "verify-sheet.ts",
    };
    const row = COLUMNS.map((c) => testEvent[c] ?? "");
    if (writeClick) {
      await appendRow(TAB_TITLE.Clicks, row);
      ok("Ghi 1 click test", "xoá dòng __verify__ trên Sheet nếu muốn");
    } else {
      console.log("  • Dry-run Clicks (dùng --write-test-click để ghi thử 1 dòng)");
    }
  }

  // 5) Drive image fetch.
  const driveId = firstDriveId(mappedProducts);
  if (!driveId) {
    warn("Chưa có Drive file ID trong imageIds (vẫn dùng ảnh picsum?) — bỏ qua test Drive.");
  } else {
    try {
      const file = await fetchDriveFile(driveId);
      ok("Tải ảnh Drive", `${file.contentType}, ${file.buffer.length} bytes`);
    } catch (e) {
      bad("Tải ảnh Drive", e instanceof Error ? e.message : String(e));
    }
  }

  console.log(
    failures === 0
      ? "\n✓ Tất cả kiểm tra PASS — sẵn sàng deploy."
      : `\n✗ ${failures} mục lỗi — sửa rồi chạy lại.`,
  );
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((err: unknown) => {
  const msg = err instanceof Error ? err.message : String(err);
  console.error(`\n✗ Verify thất bại: ${msg}`);
  console.error(
    "  Kiểm tra: GOOGLE_* trong .env.local, Sheet đã share cho service account, đã chạy `npm run seed` chưa.",
  );
  process.exit(1);
});
