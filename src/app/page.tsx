import { getSettings } from "@/lib/data/settings";
import { getFeaturedCollections } from "@/lib/data/collections";
import { getPublishedProducts } from "@/lib/data/products";
import { MosaicGrid } from "@/components/editorial/MosaicGrid";

// JW-style home: a dense, edge-to-edge image mosaic with a giant vertical
// wordmark down the right gutter (desktop). No hero — the grid is the page.
export default async function HomePage() {
  const [settings, products, featuredCollections] = await Promise.all([
    getSettings(),
    getPublishedProducts(),
    getFeaturedCollections(),
  ]);

  const title = settings.siteTitle ?? "Tổ Ấm";
  const promoCollection = featuredCollections[0];

  return (
    <div className="relative">
      {/* Reserve the right gutter for the vertical wordmark on desktop. */}
      <div className="lg:mr-[16vw]">
        <MosaicGrid
          products={products}
          promo={{
            label: settings.heroEyebrow ?? "Tuyển tập mùa này",
            text: settings.heroHeadline ?? "Đồ decor có gu, tuyển chọn thủ công",
            href: promoCollection ? `/bo-suu-tap/${promoCollection.id}` : "/bo-suu-tap",
          }}
        />
      </div>

      {/* Oversized vertical wordmark — JW signature: reads bottom-to-top down
          the right gutter (desktop only). */}
      <span
        aria-hidden
        className="pointer-events-none absolute right-[1vw] top-6 hidden select-none font-display text-[12vw] font-semibold uppercase leading-[0.85] tracking-tight text-ink lg:block [writing-mode:vertical-rl] [transform:rotate(180deg)]"
      >
        {title}
      </span>
    </div>
  );
}
