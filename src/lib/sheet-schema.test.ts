import { describe, it, expect } from "vitest";
import {
  TAB_HEADERS,
  ALL_TABS,
  CONTENT_TABS,
  fixtureRows,
  fixtureGrid,
} from "@/lib/sheet-schema";
import { COLUMNS } from "@/lib/data/clicks";

describe("sheet-schema", () => {
  it("Clicks header matches the clicks logger column order", () => {
    // If these drift, appended click rows land in the wrong columns.
    expect(TAB_HEADERS.Clicks).toEqual(COLUMNS);
  });

  it("every content tab produces rows with one cell per header", () => {
    for (const tab of CONTENT_TABS) {
      const rows = fixtureRows(tab);
      expect(rows.length).toBeGreaterThan(0);
      for (const row of rows) {
        expect(row.length).toBe(TAB_HEADERS[tab].length);
      }
    }
  });

  it("Clicks seeds no data rows (header only)", () => {
    expect(fixtureRows("Clicks")).toEqual([]);
    expect(fixtureGrid("Clicks")).toEqual([TAB_HEADERS.Clicks]);
  });

  it("Settings expands the object into [key, value] rows", () => {
    const rows = fixtureRows("Settings");
    expect(rows.every((r) => r.length === 2)).toBe(true);
    expect(rows.some(([k]) => k === "siteTitle")).toBe(true);
  });

  it("Products: list fields are comma-joined and booleans become TRUE/FALSE", () => {
    const header = TAB_HEADERS.Products;
    const imageIdx = header.indexOf("imageIds");
    const featuredIdx = header.indexOf("featured");
    const rows = fixtureRows("Products");
    // den-may-001 (first fixture) has two images → comma-joined cell.
    expect(rows[0][imageIdx]).toContain(", ");
    // featured cell is always a sheet boolean literal.
    for (const row of rows) {
      expect(["TRUE", "FALSE"]).toContain(row[featuredIdx]);
    }
  });

  it("Collections: productIds array is joined into a CSV cell", () => {
    const header = TAB_HEADERS.Collections;
    const idx = header.indexOf("productIds");
    const rows = fixtureRows("Collections");
    expect(rows[0][idx]).toContain(", "); // first collection has several ids
  });

  it("ALL_TABS = content tabs + Clicks", () => {
    expect(ALL_TABS).toEqual([...CONTENT_TABS, "Clicks"]);
  });
});
