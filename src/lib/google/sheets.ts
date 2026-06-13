import { sheetsClient } from "@/lib/google/auth";
import { requireGoogleEnv } from "@/lib/env";

export type RawRow = Record<string, string>;

/**
 * Read a tab and return rows as objects keyed by the (trimmed) header row.
 * Reading by header name keeps the owner free to reorder/add columns.
 */
export async function readTab(tabName: string): Promise<RawRow[]> {
  const { sheetId } = requireGoogleEnv();
  const sheets = sheetsClient();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: `${tabName}!A1:Z`,
    valueRenderOption: "UNFORMATTED_VALUE",
    dateTimeRenderOption: "FORMATTED_STRING",
  });

  const values = res.data.values;
  if (!values || values.length < 2) return [];

  const headers = (values[0] as unknown[]).map((h) => String(h ?? "").trim());
  const rows: RawRow[] = [];
  for (let i = 1; i < values.length; i++) {
    const raw = values[i] as unknown[];
    if (!raw || raw.every((c) => c === "" || c == null)) continue; // skip blank rows
    const obj: RawRow = {};
    headers.forEach((header, idx) => {
      if (!header) return;
      obj[header] = raw[idx] != null ? String(raw[idx]) : "";
    });
    rows.push(obj);
  }
  return rows;
}

/** Append a single row to a tab. Order of `values` must match the tab columns. */
export async function appendRow(tabName: string, values: (string | number)[]): Promise<void> {
  const { sheetId } = requireGoogleEnv();
  const sheets = sheetsClient();
  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: `${tabName}!A:Z`,
    valueInputOption: "RAW",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values: [values] },
  });
}
