// Seed a real Google Sheet from the demo fixtures.
//
//   npm run seed                  # create missing tabs + seed content tabs
//   npm run seed -- --force       # overwrite tabs that already have data
//   npm run seed -- --skip-images # leave image columns blank to fill in later
//   npm run seed -- --only=Products,Settings
//
// Prereq: the owner created a blank Spreadsheet, put its ID in GOOGLE_SHEET_ID,
// and shared it (Editor) with the service account. Reuses the app's own auth +
// schema so the written headers exactly match what the live site reads.

import { sheetsClient } from "@/lib/google/auth";
import { requireGoogleEnv, env } from "@/lib/env";
import {
  ALL_TABS,
  IMAGE_COLUMNS,
  TAB_HEADERS,
  fixtureGrid,
  type TabName,
} from "@/lib/sheet-schema";

// Logical tab → actual sheet title (owner may rename via SHEET_TAB_* env vars).
const TAB_TITLE: Record<TabName, string> = {
  Products: env.SHEET_TAB_PRODUCTS,
  Collections: env.SHEET_TAB_COLLECTIONS,
  Categories: env.SHEET_TAB_CATEGORIES,
  Styles: env.SHEET_TAB_STYLES,
  Settings: env.SHEET_TAB_SETTINGS,
  Clicks: env.SHEET_TAB_CLICKS,
};

type Sheets = ReturnType<typeof sheetsClient>;

interface Flags {
  force: boolean;
  skipImages: boolean;
  only: TabName[] | null;
}

function parseFlags(argv: string[]): Flags {
  const force = argv.includes("--force");
  const skipImages = argv.includes("--skip-images");
  const onlyArg = argv.find((a) => a.startsWith("--only="));
  let only: TabName[] | null = null;
  if (onlyArg) {
    const names = onlyArg.slice("--only=".length).split(",").map((s) => s.trim());
    only = ALL_TABS.filter((t) => names.includes(t));
    if (only.length === 0) {
      console.error(`✗ --only không khớp tab nào. Hợp lệ: ${ALL_TABS.join(", ")}`);
      process.exit(1);
    }
  }
  return { force, skipImages, only };
}

// Blank Drive-image columns so the owner replaces the picsum demo values.
function blankImages(tab: TabName, grid: string[][]): string[][] {
  const cols = IMAGE_COLUMNS[tab];
  if (!cols || cols.length === 0) return grid;
  const header = grid[0];
  const idxs = cols.map((c) => header.indexOf(c)).filter((i) => i >= 0);
  return grid.map((row, r) =>
    r === 0 ? row : row.map((v, i) => (idxs.includes(i) ? "" : v)),
  );
}

// Non-empty values of column A (from `fromRow` down) — used to detect existing data.
async function readColumnA(
  sheets: Sheets,
  spreadsheetId: string,
  title: string,
  fromRow = 1,
): Promise<string[]> {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${title}!A${fromRow}:A`,
  });
  const values = res.data.values ?? [];
  return values
    .map((r) => (r && r[0] != null ? String(r[0]).trim() : ""))
    .filter(Boolean);
}

async function writeGrid(
  sheets: Sheets,
  spreadsheetId: string,
  title: string,
  grid: string[][],
): Promise<void> {
  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `${title}!A1`,
    valueInputOption: "RAW",
    requestBody: { values: grid },
  });
}

async function main(): Promise<void> {
  const { sheetId } = requireGoogleEnv();
  const flags = parseFlags(process.argv.slice(2));
  const sheets = sheetsClient();
  const targets: TabName[] = flags.only ?? ALL_TABS;

  console.log(`→ Seed Spreadsheet ${sheetId}`);
  console.log(`  Tabs: ${targets.map((t) => TAB_TITLE[t]).join(", ")}`);
  if (flags.skipImages) console.log("  (--skip-images: cột ảnh để trống)");

  // 1) Existing tab titles.
  const meta = await sheets.spreadsheets.get({ spreadsheetId: sheetId });
  const existing = new Set(
    (meta.data.sheets ?? [])
      .map((s) => s.properties?.title)
      .filter((t): t is string => Boolean(t)),
  );

  // 2) Create missing tabs in one batch.
  const toCreate = targets
    .map((t) => TAB_TITLE[t])
    .filter((title) => !existing.has(title));
  if (toCreate.length > 0) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: sheetId,
      requestBody: {
        requests: toCreate.map((title) => ({ addSheet: { properties: { title } } })),
      },
    });
    console.log(`  ✓ Tạo tab: ${toCreate.join(", ")}`);
  }

  // 3) Seed each tab.
  for (const tab of targets) {
    const title = TAB_TITLE[tab];

    if (tab === "Clicks") {
      // Header only — never seed or clear click data.
      const head = await readColumnA(sheets, sheetId, title, 1);
      if (head.length > 0) {
        console.log(`  • ${title}: đã có header — bỏ qua`);
      } else {
        await writeGrid(sheets, sheetId, title, [TAB_HEADERS.Clicks]);
        console.log(`  ✓ ${title}: ghi header`);
      }
      continue;
    }

    const dataRows = await readColumnA(sheets, sheetId, title, 2);
    if (dataRows.length > 0 && !flags.force) {
      console.log(
        `  • ${title}: đã có ${dataRows.length} dòng — bỏ qua (dùng --force để ghi đè)`,
      );
      continue;
    }
    if (dataRows.length > 0 && flags.force) {
      await sheets.spreadsheets.values.clear({ spreadsheetId: sheetId, range: title });
      console.log(`  ! ${title}: --force, đã xoá dữ liệu cũ`);
    }

    let grid = fixtureGrid(tab);
    if (flags.skipImages) grid = blankImages(tab, grid);
    await writeGrid(sheets, sheetId, title, grid);
    console.log(`  ✓ ${title}: ghi ${grid.length - 1} dòng`);
  }

  if (!flags.skipImages) {
    console.log(
      "\n⚠ Dữ liệu mẫu dùng ảnh picsum.photos (không phải Drive). Sau khi seed, " +
        "thay cột imageIds/heroImageId bằng Drive file ID thật rồi chạy `npm run verify`.",
    );
  }
  console.log("✓ Seed xong.");
}

main().catch((err: unknown) => {
  const msg = err instanceof Error ? err.message : String(err);
  console.error(`\n✗ Seed thất bại: ${msg}`);
  console.error(
    "  Kiểm tra: GOOGLE_* trong .env.local, và Sheet đã share quyền Editor cho service account chưa.",
  );
  process.exit(1);
});
