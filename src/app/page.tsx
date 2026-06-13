import Link from "next/link";
import { getSettings } from "@/lib/data/settings";
import { getFeaturedCollections, getPublishedCollections } from "@/lib/data/collections";
import { getFeaturedProducts, getPublishedProducts } from "@/lib/data/products";
import { getPublishedCategories } from "@/lib/data/categories";
import { Hero } from "@/components/editorial/Hero";
import { CollectionRail } from "@/components/editorial/CollectionRail";
import { FeatureBlock } from "@/components/editorial/FeatureBlock";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Container } from "@/components/ui/Container";
import { Section, SectionHeader } from "@/components/ui/Section";

export default async function HomePage() {
  const [settings, featuredCollections, collections, featured, latest, categories] =
    await Promise.all([
      getSettings(),
      getFeaturedCollections(),
      getPublishedCollections(),
      getFeaturedProducts(3),
      getPublishedProducts(),
      getPublishedCategories(),
    ]);

  const heroCollection = featuredCollections[0] ?? collections[0];

  return (
    <>
      <Hero settings={settings} collection={heroCollection} />

      {/* Featured products as alternating magazine spreads */}
      {featured.length > 0 ? (
        <Section tone="paper">
          <Container width="wide">
            <SectionHeader
              eyebrow="Được tuyển chọn"
              title="Những món đồ chúng tôi mê mẩn tháng này"
              intro="Mỗi món được chọn vì câu chuyện thiết kế và chất liệu — không phải vì giá rẻ."
            />
            <div className="space-y-24">
              {featured.map((p, i) => (
                <FeatureBlock key={p.id} product={p} reverse={i % 2 === 1} index={i} />
              ))}
            </div>
          </Container>
        </Section>
      ) : null}

      {/* Collections rail */}
      {collections.length > 0 ? (
        <Section tone="bone">
          <Container width="wide">
            <SectionHeader
              eyebrow="Bộ sưu tập"
              title="Tuyển tập theo chủ đề"
              intro="Những câu chuyện không gian được kể qua các món đồ có cùng tinh thần."
            />
            <CollectionRail collections={collections} />
          </Container>
        </Section>
      ) : null}

      {/* Browse by category */}
      <Section tone="paper">
        <Container width="wide">
          <SectionHeader eyebrow="Khám phá" title="Dạo theo danh mục" />
          <div className="grid grid-cols-2 border-l border-t border-line sm:grid-cols-3 lg:grid-cols-5">
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/danh-muc/${c.id}`}
                className="group flex items-center justify-center border-b border-r border-line px-5 py-10 text-center transition-colors hover:bg-ink"
              >
                <span className="text-sm uppercase tracking-[0.12em] text-ink transition-colors group-hover:text-paper">
                  {c.name}
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      {/* Latest grid */}
      <Section tone="paper" className="pt-0">
        <Container width="wide">
          <SectionHeader eyebrow="Mới cập nhật" title="Tất cả sản phẩm" />
          <ProductGrid products={latest.slice(0, 8)} />
          <div className="mt-16 text-center">
            <Link
              href="/tim-kiem"
              className="inline-flex items-center gap-3 border-b border-ink pb-1 text-xs font-medium uppercase tracking-[0.18em] text-ink transition-opacity hover:opacity-60"
            >
              Xem & lọc tất cả
              <span aria-hidden>→</span>
            </Link>
          </div>
        </Container>
      </Section>
    </>
  );
}
