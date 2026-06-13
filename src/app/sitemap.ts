import type { MetadataRoute } from "next";
import { env } from "@/lib/env";
import { getPublishedProducts } from "@/lib/data/products";
import { getPublishedCollections } from "@/lib/data/collections";
import { getPublishedCategories } from "@/lib/data/categories";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  const [products, collections, categories] = await Promise.all([
    getPublishedProducts(),
    getPublishedCollections(),
    getPublishedCategories(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: "daily", priority: 1 },
    { url: `${base}/bo-suu-tap`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/tim-kiem`, changeFrequency: "weekly", priority: 0.5 },
  ];

  return [
    ...staticRoutes,
    ...categories.map((c) => ({
      url: `${base}/danh-muc/${c.id}`,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    ...collections.map((c) => ({
      url: `${base}/bo-suu-tap/${c.id}`,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    ...products.map((p) => ({
      url: `${base}/san-pham/${p.slug}`,
      lastModified: p.updatedAt ? new Date(p.updatedAt) : undefined,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
