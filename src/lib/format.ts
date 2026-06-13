// Formatting + parsing helpers (Vietnamese-aware).

const VND = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
});

/** Format a plain integer amount as Vietnamese đồng, e.g. 350000 -> "350.000 ₫". */
export function formatVnd(amount: number): string {
  if (!Number.isFinite(amount) || amount <= 0) return "Liên hệ";
  return VND.format(amount);
}

/** Parse a sheet price cell (may contain separators / currency) into an integer. */
export function parsePrice(raw: string | number | undefined | null): number {
  if (typeof raw === "number") return Math.round(raw);
  if (!raw) return 0;
  const digits = String(raw).replace(/[^\d]/g, "");
  return digits ? parseInt(digits, 10) : 0;
}

const VIETNAMESE_MAP: Record<string, string> = {
  à: "a", á: "a", ả: "a", ã: "a", ạ: "a", ă: "a", ằ: "a", ắ: "a", ẳ: "a", ẵ: "a", ặ: "a",
  â: "a", ầ: "a", ấ: "a", ẩ: "a", ẫ: "a", ậ: "a",
  è: "e", é: "e", ẻ: "e", ẽ: "e", ẹ: "e", ê: "e", ề: "e", ế: "e", ể: "e", ễ: "e", ệ: "e",
  ì: "i", í: "i", ỉ: "i", ĩ: "i", ị: "i",
  ò: "o", ó: "o", ỏ: "o", õ: "o", ọ: "o", ô: "o", ồ: "o", ố: "o", ổ: "o", ỗ: "o", ộ: "o",
  ơ: "o", ờ: "o", ớ: "o", ở: "o", ỡ: "o", ợ: "o",
  ù: "u", ú: "u", ủ: "u", ũ: "u", ụ: "u", ư: "u", ừ: "u", ứ: "u", ử: "u", ữ: "u", ự: "u",
  ỳ: "y", ý: "y", ỷ: "y", ỹ: "y", ỵ: "y",
  đ: "d",
};

/** Convert Vietnamese text to an ASCII URL slug. */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/g, (m) => VIETNAMESE_MAP[m] ?? m)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Lowercase + strip diacritics for accent-insensitive search matching. */
export function normalizeForSearch(input: string): string {
  return input
    .toLowerCase()
    .replace(/[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/g, (m) => VIETNAMESE_MAP[m] ?? m);
}

/** Split a comma-separated sheet cell into a trimmed, non-empty list. */
export function splitList(raw: string | undefined | null): string[] {
  if (!raw) return [];
  return String(raw)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Coerce a sheet boolean cell ("TRUE"/"1"/"x") to a real boolean. */
export function parseBool(raw: string | boolean | undefined | null): boolean {
  if (typeof raw === "boolean") return raw;
  if (!raw) return false;
  return ["true", "1", "x", "yes", "có", "co"].includes(String(raw).trim().toLowerCase());
}
