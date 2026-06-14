import { getCollectionsCached } from "@/lib/data/cache";
import { getProductsByCollection, getPublishedProducts } from "@/lib/data/products";
import type { Collection, Product } from "@/types";

const byOrder = (a: Collection, b: Collection) => a.order - b.order;

export async function getPublishedCollections(): Promise<Collection[]> {
  const all = await getCollectionsCached();
  return all.filter((c) => c.status === "published").sort(byOrder);
}

export async function getCollectionById(id: string): Promise<Collection | undefined> {
  const all = await getPublishedCollections();
  return all.find((c) => c.id === id);
}

export async function getFeaturedCollections(limit?: number): Promise<Collection[]> {
  const all = await getPublishedCollections();
  const featured = all.filter((c) => c.featured);
  return typeof limit === "number" ? featured.slice(0, limit) : featured;
}

/**
 * Resolve a collection's products. If the collection lists explicit
 * `productIds`, honour that order; otherwise reverse-lookup by membership.
 */
export async function getCollectionProducts(collection: Collection): Promise<Product[]> {
  if (collection.productIds.length > 0) {
    const published = await getPublishedProducts();
    const byId = new Map(published.map((p) => [p.id, p]));
    return collection.productIds
      .map((id) => byId.get(id))
      .filter((p): p is Product => p !== undefined);
  }
  return getProductsByCollection(collection.id);
}
