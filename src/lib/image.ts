// Map Google Drive file IDs to same-origin, cacheable image URLs served by
// the /img/[id] proxy route. Keeping everything same-origin means next/image
// works without remotePatterns config and Vercel can edge-cache the result.

const PLACEHOLDER = "/placeholder.svg";

export function driveImageUrl(id: string | undefined | null): string {
  if (!id) return PLACEHOLDER;
  const trimmed = id.trim();
  if (!trimmed) return PLACEHOLDER;
  // Allow passing a full path/URL through untouched (e.g. mock local assets).
  if (trimmed.startsWith("/") || trimmed.startsWith("http")) return trimmed;
  return `/img/${encodeURIComponent(trimmed)}`;
}

export function coverImageUrl(imageIds: string[] | undefined): string {
  return driveImageUrl(imageIds?.[0]);
}
