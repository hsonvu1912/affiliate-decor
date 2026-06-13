import { describe, expect, it } from "vitest";
import { formatVnd, parsePrice, slugify, normalizeForSearch, splitList, parseBool } from "./format";

describe("formatVnd", () => {
  it("formats VND and falls back for non-positive", () => {
    expect(formatVnd(350000)).toContain("350.000");
    expect(formatVnd(0)).toBe("Liên hệ");
    expect(formatVnd(-5)).toBe("Liên hệ");
  });
});

describe("parsePrice", () => {
  it("strips separators and currency", () => {
    expect(parsePrice("350.000 ₫")).toBe(350000);
    expect(parsePrice(480000)).toBe(480000);
    expect(parsePrice("")).toBe(0);
    expect(parsePrice(undefined)).toBe(0);
  });
});

describe("slugify", () => {
  it("converts Vietnamese diacritics to ascii slug", () => {
    expect(slugify("Đèn bàn mây tre đan")).toBe("den-ban-may-tre-dan");
    expect(slugify("Bình gốm men rạn cổ điển")).toBe("binh-gom-men-ran-co-dien");
  });
});

describe("normalizeForSearch", () => {
  it("is accent-insensitive", () => {
    expect(normalizeForSearch("Đèn")).toBe("den");
    expect(normalizeForSearch("GỐM")).toBe("gom");
  });
});

describe("splitList", () => {
  it("splits and trims comma lists", () => {
    expect(splitList("a, b ,c")).toEqual(["a", "b", "c"]);
    expect(splitList("")).toEqual([]);
    expect(splitList(undefined)).toEqual([]);
  });
});

describe("parseBool", () => {
  it("coerces sheet booleans", () => {
    expect(parseBool("TRUE")).toBe(true);
    expect(parseBool("false")).toBe(false);
    expect(parseBool(true)).toBe(true);
    expect(parseBool("")).toBe(false);
  });
});
