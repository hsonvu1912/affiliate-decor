import { appendRow } from "@/lib/google/sheets";
import { env } from "@/lib/env";
import type { ClickEvent } from "@/types";

// Column order must match the Clicks tab header.
const COLUMNS: (keyof ClickEvent)[] = [
  "timestamp",
  "productId",
  "productName",
  "retailer",
  "affiliateUrl",
  "referrer",
  "country",
  "device",
  "userAgent",
];

/** Append a click to the Clicks sheet. In mock mode, log instead of writing. */
export async function logClick(event: ClickEvent): Promise<void> {
  if (env.USE_MOCK_DATA) {
    console.log("[mock click]", event.productId, "→", event.affiliateUrl);
    return;
  }
  const row = COLUMNS.map((key) => event[key] ?? "");
  await appendRow(env.SHEET_TAB_CLICKS, row);
}

export function deviceFromUA(ua: string): string {
  if (/mobile|android|iphone|ipad|ipod/i.test(ua)) return "mobile";
  if (/tablet/i.test(ua)) return "tablet";
  return "desktop";
}
