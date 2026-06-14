import { z } from "zod";

// Environment access with validation. Google credentials are optional at
// load time so the site can run on mock data (USE_MOCK_DATA=true) without
// any secrets. requireGoogleEnv() enforces them only when live data is used.

const schema = z.object({
  USE_MOCK_DATA: z
    .string()
    .optional()
    .transform((v) => v === "true"),

  GOOGLE_SERVICE_ACCOUNT_EMAIL: z.string().optional(),
  GOOGLE_PRIVATE_KEY: z.string().optional(),
  GOOGLE_SHEET_ID: z.string().optional(),
  GOOGLE_DRIVE_FOLDER_ID: z.string().optional(),

  SHEET_TAB_PRODUCTS: z.string().default("Products"),
  SHEET_TAB_COLLECTIONS: z.string().default("Collections"),
  SHEET_TAB_CATEGORIES: z.string().default("Categories"),
  SHEET_TAB_STYLES: z.string().default("Styles"),
  SHEET_TAB_SETTINGS: z.string().default("Settings"),
  SHEET_TAB_CLICKS: z.string().default("Clicks"),

  REVALIDATE_SECRET: z.string().optional(),
  NEXT_PUBLIC_SITE_URL: z.string().default("http://localhost:3000"),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  // Surface a readable message rather than a raw zod dump.
  console.error("❌ Sai cấu hình biến môi trường:", parsed.error.flatten().fieldErrors);
  throw new Error("Biến môi trường không hợp lệ. Xem .env.example.");
}

export const env = parsed.data;

export interface GoogleEnv {
  email: string;
  privateKey: string;
  sheetId: string;
}

/**
 * Returns the Google credentials, throwing a clear error if any are missing.
 * Call this only on code paths that actually talk to Google (live mode).
 */
export function requireGoogleEnv(): GoogleEnv {
  const { GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY, GOOGLE_SHEET_ID } = env;
  if (!GOOGLE_SERVICE_ACCOUNT_EMAIL || !GOOGLE_PRIVATE_KEY || !GOOGLE_SHEET_ID) {
    throw new Error(
      "Thiếu cấu hình Google (GOOGLE_SERVICE_ACCOUNT_EMAIL / GOOGLE_PRIVATE_KEY / GOOGLE_SHEET_ID). " +
        "Đặt USE_MOCK_DATA=true để chạy bằng dữ liệu mẫu, hoặc khai báo credential. Xem .env.example.",
    );
  }
  return {
    email: GOOGLE_SERVICE_ACCOUNT_EMAIL,
    // Private keys are stored with escaped newlines in env vars.
    privateKey: GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    sheetId: GOOGLE_SHEET_ID,
  };
}
