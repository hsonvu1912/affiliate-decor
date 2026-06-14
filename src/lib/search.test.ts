import { describe, expect, it } from "vitest";
import { filterProducts, parseFilters } from "./search";
import type { Product } from "@/types";

function makeProduct(overrides: Partial<Product>): Product {
  return {
    id: overrides.id ?? "p",
    name: overrides.name ?? "Sản phẩm",
    slug: overrides.slug ?? "san-pham",
    category: overrides.category ?? "den-trang-tri",
    style: overrides.style ?? "toi-gian",
    price: overrides.price ?? 100000,
    retailer: overrides.retailer ?? "Shopee",
    affiliateUrl: overrides.affiliateUrl ?? "https://example.com",
    imageIds: overrides.imageIds ?? [],
    shortDesc: overrides.shortDesc ?? "",
    description: overrides.description ?? "",
    collections: overrides.collections ?? [],
    tags: overrides.tags ?? [],
    featured: overrides.featured ?? false,
    order: overrides.order ?? 1,
    status: overrides.status ?? "published",
  };
}

const catalog: Product[] = [
  makeProduct({ id: "a", name: "Đèn mây tre", category: "den-trang-tri", style: "wabi-sabi", price: 480000, tags: ["đèn"] }),
  makeProduct({ id: "b", name: "Bình gốm", category: "binh-gom", style: "toi-gian", price: 320000 }),
  makeProduct({ id: "c", name: "Thảm jute", category: "do-may-tre", style: "bac-au", price: 690000, featured: true }),
];

describe("filterProducts", () => {
  it("filters by accent-insensitive keyword", () => {
    expect(filterProducts(catalog, { q: "den" }).map((p) => p.id)).toEqual(["a"]);
    expect(filterProducts(catalog, { q: "GỐM" }).map((p) => p.id)).toEqual(["b"]);
  });

  it("filters by category and style", () => {
    expect(filterProducts(catalog, { category: "binh-gom" }).map((p) => p.id)).toEqual(["b"]);
    expect(filterProducts(catalog, { style: "bac-au" }).map((p) => p.id)).toEqual(["c"]);
  });

  it("filters by price range", () => {
    expect(filterProducts(catalog, { minPrice: 400000 }).map((p) => p.id)).toEqual(["a", "c"]);
    expect(filterProducts(catalog, { maxPrice: 400000 }).map((p) => p.id)).toEqual(["b"]);
  });

  it("sorts by price ascending and descending", () => {
    expect(filterProducts(catalog, { sort: "gia-tang" }).map((p) => p.id)).toEqual(["b", "a", "c"]);
    expect(filterProducts(catalog, { sort: "gia-giam" }).map((p) => p.id)).toEqual(["c", "a", "b"]);
  });
});

describe("parseFilters", () => {
  it("maps Vietnamese query params and ignores bad sort", () => {
    const f = parseFilters({
      q: "đèn",
      danh_muc: "den-trang-tri",
      phong_cach: "wabi-sabi",
      gia_min: "100.000",
      gia_max: "500000",
      sort: "bad",
    });
    expect(f).toMatchObject({
      q: "đèn",
      category: "den-trang-tri",
      style: "wabi-sabi",
      minPrice: 100000,
      maxPrice: 500000,
      sort: undefined,
    });
  });
});
