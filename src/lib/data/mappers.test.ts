import { describe, expect, it } from "vitest";
import { toProduct, toCollection, toCategory, mapRows } from "./mappers";

describe("toProduct", () => {
  it("coerces sheet strings into typed product", () => {
    const p = toProduct({
      id: "den-001",
      name: "Đèn bàn mây",
      slug: "",
      category: "den-trang-tri",
      style: "wabi-sabi",
      price: "480.000 ₫",
      retailer: "Shopee",
      affiliateUrl: "https://shopee.vn/x",
      imageIds: "id1, id2 ,id3",
      featured: "TRUE",
      collections: "goc-doc-sach",
      tags: "đèn, mây",
      order: "2",
      status: "published",
    });
    expect(p).not.toBeNull();
    expect(p!.price).toBe(480000);
    expect(p!.slug).toBe("den-ban-may"); // generated from name
    expect(p!.imageIds).toEqual(["id1", "id2", "id3"]);
    expect(p!.featured).toBe(true);
    expect(p!.collections).toEqual(["goc-doc-sach"]);
    expect(p!.order).toBe(2);
  });

  it("drops rows missing id or name", () => {
    expect(toProduct({ name: "X" })).toBeNull();
    expect(toProduct({ id: "x" })).toBeNull();
  });

  it("defaults missing status to published", () => {
    expect(toProduct({ id: "a", name: "A" })!.status).toBe("published");
    expect(toProduct({ id: "a", name: "A", status: "draft" })!.status).toBe("draft");
  });
});

describe("toCollection / toCategory", () => {
  it("maps collection productIds list", () => {
    const c = toCollection({ id: "c1", title: "Góc đọc", productIds: "a,b,c" });
    expect(c!.productIds).toEqual(["a", "b", "c"]);
  });
  it("maps category", () => {
    const c = toCategory({ id: "cat", name: "Đèn", order: "3" });
    expect(c!.order).toBe(3);
  });
});

describe("mapRows", () => {
  it("filters out null results", () => {
    const rows = [{ id: "a", name: "A" }, { name: "no id" }] as Record<string, string>[];
    expect(mapRows(rows, toProduct)).toHaveLength(1);
  });
});
