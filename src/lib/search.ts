import type { Product, ProductFilters } from "@/types";
import { normalizeForSearch } from "@/lib/format";

// In-memory filtering + sorting over the (small) product catalog.

export function filterProducts(products: Product[], filters: ProductFilters): Product[] {
  let result = [...products];

  if (filters.q) {
    const q = normalizeForSearch(filters.q.trim());
    if (q) {
      result = result.filter((p) => {
        const haystack = normalizeForSearch(
          [p.name, p.shortDesc, p.style, p.tags.join(" ")].join(" "),
        );
        return haystack.includes(q);
      });
    }
  }

  if (filters.category) {
    result = result.filter((p) => p.category === filters.category);
  }

  if (filters.style) {
    result = result.filter((p) => p.style === filters.style);
  }

  if (typeof filters.minPrice === "number") {
    result = result.filter((p) => p.price >= filters.minPrice!);
  }

  if (typeof filters.maxPrice === "number") {
    result = result.filter((p) => p.price > 0 && p.price <= filters.maxPrice!);
  }

  switch (filters.sort) {
    case "gia-tang":
      result.sort((a, b) => a.price - b.price);
      break;
    case "gia-giam":
      result.sort((a, b) => b.price - a.price);
      break;
    case "noi-bat":
      result.sort((a, b) => Number(b.featured) - Number(a.featured) || a.order - b.order);
      break;
    case "moi-nhat":
    default:
      // Keep incoming order (already sorted by manual `order`).
      break;
  }

  return result;
}

/** Parse URL searchParams into a typed ProductFilters object. */
export function parseFilters(params: Record<string, string | string[] | undefined>): ProductFilters {
  const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
  const toNum = (v: string | undefined) => {
    if (!v) return undefined;
    const n = parseInt(v.replace(/[^\d]/g, ""), 10);
    return Number.isFinite(n) ? n : undefined;
  };
  const sortRaw = first(params.sort);
  const allowedSorts = ["moi-nhat", "gia-tang", "gia-giam", "noi-bat"];
  return {
    q: first(params.q) || undefined,
    category: first(params.danh_muc) || undefined,
    style: first(params.phong_cach) || undefined,
    minPrice: toNum(first(params.gia_min)),
    maxPrice: toNum(first(params.gia_max)),
    sort: allowedSorts.includes(sortRaw ?? "")
      ? (sortRaw as ProductFilters["sort"])
      : undefined,
  };
}
