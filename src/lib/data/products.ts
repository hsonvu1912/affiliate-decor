import { getProductsCached } from "@/lib/data/cache";
import type { Product } from "@/types";

const byOrder = (a: Product, b: Product) => a.order - b.order;

/** All published products, sorted by manual order. */
export async function getPublishedProducts(): Promise<Product[]> {
  const all = await getProductsCached();
  return all.filter((p) => p.status === "published").sort(byOrder);
}

export async function getProductById(id: string): Promise<Product | undefined> {
  const all = await getProductsCached();
  // Click tracking should resolve even drafts; status filtering is for listings.
  return all.find((p) => p.id === id);
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const published = await getPublishedProducts();
  return published.find((p) => p.slug === slug);
}

export async function getProductsByCategory(categoryId: string): Promise<Product[]> {
  const published = await getPublishedProducts();
  return published.filter((p) => p.category === categoryId);
}

export async function getProductsByCollection(collectionId: string): Promise<Product[]> {
  const published = await getPublishedProducts();
  return published.filter((p) => p.collections.includes(collectionId));
}

export async function getFeaturedProducts(limit?: number): Promise<Product[]> {
  const published = await getPublishedProducts();
  const featured = published.filter((p) => p.featured);
  return typeof limit === "number" ? featured.slice(0, limit) : featured;
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const published = await getPublishedProducts();
  return published
    .filter((p) => p.id !== product.id && (p.category === product.category || p.style === product.style))
    .slice(0, limit);
}
