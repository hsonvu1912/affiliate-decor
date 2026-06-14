import { getSettings } from "@/lib/data/settings";
import { getFeaturedCollections } from "@/lib/data/collections";
import { getPublishedProducts } from "@/lib/data/products";
import { MosaicGrid } from "@/components/editorial/MosaicGrid";

// JW-style home: a dense, edge-to-edge image mosaic spanning the full width.
// No hero — the grid is the page.
export default async function HomePage() {
  const [settings, products, featuredCollections] = await Promise.all([
    getSettings(),
    getPublishedProducts(),
    getFeaturedCollections(),
  ]);

  const promoCollection = featuredCollections[0];

  return (
    <MosaicGrid
      products={products}
      promo={{
        label: settings.heroEyebrow ?? "Tuyển tập mùa này",
        text: settings.heroHeadline ?? "Đồ decor có gu, tuyển chọn thủ công",
        href: promoCollection ? `/bo-suu-tap/${promoCollection.id}` : "/bo-suu-tap",
      }}
    />
  );
}
