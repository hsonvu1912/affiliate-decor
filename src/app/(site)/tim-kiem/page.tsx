import type { Metadata } from "next";
import { getPublishedProducts } from "@/lib/data/products";
import { getPublishedCategories, getStyles } from "@/lib/data/categories";
import { filterProducts, parseFilters } from "@/lib/search";
import { FilterPanel } from "@/components/search/FilterPanel";
import { ProductCard } from "@/components/product/ProductCard";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

export const metadata: Metadata = {
  title: "Tìm kiếm & lọc",
  description: "Lọc đồ decor theo danh mục, phong cách và khoảng giá.",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const filters = parseFilters(sp);

  const [allProducts, categories, styles] = await Promise.all([
    getPublishedProducts(),
    getPublishedCategories(),
    getStyles(),
  ]);

  const results = filterProducts(allProducts, filters);

  return (
    <Container width="wide" className="py-12 sm:py-16">
      <Breadcrumb items={[{ label: "Trang chủ", href: "/" }, { label: "Tìm kiếm" }]} />
      <h1 className="mt-5 font-display text-4xl font-semibold text-ink sm:text-5xl">
        Tìm kiếm & lọc
      </h1>

      <div className="mt-10 grid gap-10 lg:grid-cols-[260px_1fr]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <FilterPanel categories={categories} styles={styles} filters={filters} />
        </aside>

        <div>
          <p className="mb-6 text-sm text-stone">
            {results.length} kết quả
            {filters.q ? ` cho “${filters.q}”` : ""}
          </p>
          {results.length > 0 ? (
            <div className="grid grid-cols-2 gap-x-5 gap-y-10 xl:grid-cols-3">
              {results.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="rounded-sm border border-line bg-cream/50 py-20 text-center">
              <p className="font-display text-2xl text-ink">Không tìm thấy sản phẩm</p>
              <p className="mt-2 text-stone">Thử nới rộng bộ lọc hoặc đổi từ khóa.</p>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}
