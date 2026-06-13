import { env } from "@/lib/env";
import { readTab } from "@/lib/google/sheets";
import type { RawRow } from "@/lib/google/sheets";
import { mapRows, toCategory, toCollection, toProduct, toStyle } from "@/lib/data/mappers";
import type { Category, Collection, Product, SiteSettings, Style } from "@/types";

import productsFixture from "@/fixtures/products.json";
import collectionsFixture from "@/fixtures/collections.json";
import categoriesFixture from "@/fixtures/categories.json";
import stylesFixture from "@/fixtures/styles.json";
import settingsFixture from "@/fixtures/settings.json";

// Single source of truth that abstracts mock-vs-live. Everything downstream
// (cache, data getters) consumes typed entities and never knows the origin.

const useMock = env.USE_MOCK_DATA;

function asRows(data: unknown): RawRow[] {
  return data as RawRow[];
}

export async function loadProducts(): Promise<Product[]> {
  const rows = useMock ? asRows(productsFixture) : await readTab(env.SHEET_TAB_PRODUCTS);
  return mapRows(rows, toProduct);
}

export async function loadCollections(): Promise<Collection[]> {
  const rows = useMock ? asRows(collectionsFixture) : await readTab(env.SHEET_TAB_COLLECTIONS);
  return mapRows(rows, toCollection);
}

export async function loadCategories(): Promise<Category[]> {
  const rows = useMock ? asRows(categoriesFixture) : await readTab(env.SHEET_TAB_CATEGORIES);
  return mapRows(rows, toCategory);
}

export async function loadStyles(): Promise<Style[]> {
  const rows = useMock ? asRows(stylesFixture) : await readTab(env.SHEET_TAB_STYLES).catch(() => []);
  return mapRows(rows, toStyle);
}

export async function loadSettings(): Promise<SiteSettings> {
  if (useMock) return settingsFixture as SiteSettings;
  // Settings tab is key/value: columns `key`, `value`.
  const rows = await readTab(env.SHEET_TAB_SETTINGS).catch(() => []);
  const out: SiteSettings = {};
  for (const row of rows) {
    const key = (row.key ?? "").trim();
    if (key) out[key] = (row.value ?? "").trim();
  }
  return out;
}
