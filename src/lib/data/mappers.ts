import type { RawRow } from "@/lib/google/sheets";
import type { Category, Collection, Product, ProductStatus, Style } from "@/types";
import { parseBool, parsePrice, slugify, splitList } from "@/lib/format";

// Convert raw sheet rows (string maps keyed by header) into typed domain
// objects. Tolerant of missing/extra columns; drops malformed rows.

function status(raw: string | undefined): ProductStatus {
  const s = (raw ?? "").trim().toLowerCase();
  if (s === "draft" || s === "archived") return s;
  return "published";
}

function num(raw: string | undefined, fallback = 0): number {
  const n = parseInt(String(raw ?? "").replace(/[^\d-]/g, ""), 10);
  return Number.isFinite(n) ? n : fallback;
}

export function toProduct(row: RawRow): Product | null {
  const id = (row.id ?? "").trim();
  const name = (row.name ?? "").trim();
  if (!id || !name) return null;
  return {
    id,
    name,
    slug: (row.slug ?? "").trim() || slugify(name),
    category: (row.category ?? "").trim(),
    style: (row.style ?? "").trim(),
    price: parsePrice(row.price),
    priceDisplay: (row.priceDisplay ?? "").trim() || undefined,
    retailer: (row.retailer ?? "").trim(),
    affiliateUrl: (row.affiliateUrl ?? "").trim(),
    imageIds: splitList(row.imageIds),
    shortDesc: (row.shortDesc ?? "").trim(),
    description: (row.description ?? "").trim(),
    collections: splitList(row.collections),
    tags: splitList(row.tags),
    featured: parseBool(row.featured),
    order: num(row.order, 999),
    status: status(row.status),
    updatedAt: (row.updatedAt ?? "").trim() || undefined,
  };
}

export function toCollection(row: RawRow): Collection | null {
  const id = (row.id ?? "").trim();
  const title = (row.title ?? "").trim();
  if (!id || !title) return null;
  return {
    id,
    title,
    subtitle: (row.subtitle ?? "").trim(),
    heroImageId: (row.heroImageId ?? "").trim(),
    editorialBody: (row.editorialBody ?? "").trim(),
    productIds: splitList(row.productIds),
    featured: parseBool(row.featured),
    order: num(row.order, 999),
    status: status(row.status),
  };
}

export function toCategory(row: RawRow): Category | null {
  const id = (row.id ?? "").trim();
  const name = (row.name ?? "").trim();
  if (!id || !name) return null;
  return {
    id,
    name,
    description: (row.description ?? "").trim(),
    heroImageId: (row.heroImageId ?? "").trim(),
    order: num(row.order, 999),
    status: status(row.status),
  };
}

export function toStyle(row: RawRow): Style | null {
  const id = (row.id ?? "").trim();
  const name = (row.name ?? "").trim();
  if (!id || !name) return null;
  return { id, name, order: num(row.order, 999) };
}

export function mapRows<T>(rows: RawRow[], fn: (row: RawRow) => T | null): T[] {
  return rows.map(fn).filter((x): x is T => x !== null);
}
