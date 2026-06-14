import { getCategoriesCached, getStylesCached } from "@/lib/data/cache";
import type { Category, Style } from "@/types";

const byOrder = (a: { order: number }, b: { order: number }) => a.order - b.order;

export async function getPublishedCategories(): Promise<Category[]> {
  const all = await getCategoriesCached();
  return all.filter((c) => c.status === "published").sort(byOrder);
}

export async function getCategoryById(id: string): Promise<Category | undefined> {
  const all = await getPublishedCategories();
  return all.find((c) => c.id === id);
}

export async function getStyles(): Promise<Style[]> {
  const all = await getStylesCached();
  return [...all].sort(byOrder);
}
