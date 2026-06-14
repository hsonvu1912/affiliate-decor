// Single source of truth for the Google Sheet schema used by the seed + verify
// scripts. Header NAMES must match what src/lib/data/mappers.ts reads (mappers
// key each row by header name, so column order is free — but the names matter),
// and the Clicks header must match the COLUMNS order in src/lib/data/clicks.ts
// (a vitest assertion guards this). This module is intentionally pure (no
// googleapis / env) so it stays cheap to import and unit-test.

import productsFixture from "@/fixtures/products.json";
import collectionsFixture from "@/fixtures/collections.json";
import categoriesFixture from "@/fixtures/categories.json";
import stylesFixture from "@/fixtures/styles.json";
import settingsFixture from "@/fixtures/settings.json";

export type TabName =
  | "Products"
  | "Collections"
  | "Categories"
  | "Styles"
  | "Settings"
  | "Clicks";

export const TAB_HEADERS: Record<TabName, string[]> = {
  Products: [
    "id", "name", "slug", "category", "style", "price", "priceDisplay",
    "retailer", "affiliateUrl", "imageIds", "shortDesc", "description",
    "collections", "tags", "featured", "order", "status", "updatedAt",
  ],
  Collections: [
    "id", "title", "subtitle", "heroImageId", "editorialBody", "productIds",
    "featured", "order", "status",
  ],
  Categories: ["id", "name", "description", "heroImageId", "order", "status"],
  Styles: ["id", "name", "order"],
  Settings: ["key", "value"],
  Clicks: [
    "timestamp", "productId", "productName", "retailer", "affiliateUrl",
    "referrer", "country", "device", "userAgent",
  ],
};

// Content tabs carry seed data; Clicks is written header-only and never seeded.
export const CONTENT_TABS: TabName[] = [
  "Products", "Collections", "Categories", "Styles", "Settings",
];
export const ALL_TABS: TabName[] = [...CONTENT_TABS, "Clicks"];

// Columns whose values are Drive file IDs (or picsum URLs in the demo). The
// seed script can blank these with --skip-images so the owner fills them in.
export const IMAGE_COLUMNS: Partial<Record<TabName, string[]>> = {
  Products: ["imageIds"],
  Collections: ["heroImageId"],
  Categories: ["heroImageId"],
};

// Coerce any fixture value into a single Sheets cell string. Arrays are joined
// with ", " (mirroring splitList in src/lib/format.ts); booleans become
// TRUE/FALSE (mirroring parseBool).
function cell(value: unknown): string {
  if (value == null) return "";
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "boolean") return value ? "TRUE" : "FALSE";
  return String(value);
}

function recordToRow(headers: string[], rec: Record<string, unknown>): string[] {
  return headers.map((h) => cell(rec[h]));
}

function asRecords(data: unknown): Record<string, unknown>[] {
  return data as Record<string, unknown>[];
}

/** Seed data rows for a tab (NOT including the header). Clicks → []. */
export function fixtureRows(tab: TabName): string[][] {
  const headers = TAB_HEADERS[tab];
  switch (tab) {
    case "Products":
      return asRecords(productsFixture).map((r) => recordToRow(headers, r));
    case "Collections":
      return asRecords(collectionsFixture).map((r) => recordToRow(headers, r));
    case "Categories":
      return asRecords(categoriesFixture).map((r) => recordToRow(headers, r));
    case "Styles":
      return asRecords(stylesFixture).map((r) => recordToRow(headers, r));
    case "Settings":
      return Object.entries(settingsFixture as Record<string, string>).map(
        ([k, v]) => [k, cell(v)],
      );
    case "Clicks":
      return [];
    default:
      return [];
  }
}

/** Full grid (header row + data rows) for writing a tab. */
export function fixtureGrid(tab: TabName): string[][] {
  return [TAB_HEADERS[tab], ...fixtureRows(tab)];
}
