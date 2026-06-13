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
        <Section tone="bone">
          <Container width="wide">
            <SectionHeader
              eyebrow="Được tuyển chọn"
              title="Những món đồ chúng tôi mê mẩn tháng này"
              intro="Mỗi món được chọn vì câu chuyện thiết kế và chất liệu — không phải vì giá rẻ."
            />
            <div className="space-y-20">
              {featured.map((p, i) => (
                <FeatureBlock key={p.id} product={p} reverse={i % 2 === 1} index={i} />
              ))}
            </div>
          </Container>
        </Section>
      ) : null}

      {/* Collections rail */}
      {collections.length > 0 ? (
        <Section tone="cream">
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
      <Section tone="bone">
        <Container width="wide">
          <SectionHeader eyebrow="Khám phá" title="Dạo theo danh mục" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/danh-muc/${c.id}`}
                className="rounded-sm border border-line bg-cream/50 px-5 py-6 text-center transition-colors hover:border-terracotta hover:bg-cream"
              >
                <span className="font-display text-lg text-ink">{c.name}</span>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      {/* Latest grid */}
      <Section tone="bone" className="pt-0">
        <Container width="wide">
          <SectionHeader eyebrow="Mới cập nhật" title="Tất cả sản phẩm" />
          <ProductGrid products={latest.slice(0, 8)} />
          <div className="mt-12 text-center">
            <Link
              href="/tim-kiem"
              className="inline-flex items-center gap-2 rounded-full border border-ink/20 px-7 py-3.5 text-base font-medium text-ink hover:border-terracotta hover:text-terracotta"
            >
              Xem & lọc tất cả →
            </Link>
          </div>
        </Container>
      </Section>
    </>
  );
}
