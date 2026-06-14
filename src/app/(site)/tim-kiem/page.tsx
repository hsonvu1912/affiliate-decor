import type { Metadata } from "next";
import { Suspense } from "react";
import { getPublishedProducts } from "@/lib/data/products";
import { getPublishedCategories, getStyles } from "@/lib/data/categories";
import { SearchExplorer } from "@/components/search/SearchExplorer";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

export const metadata: Metadata = {
  title: "Tìm kiếm & lọc",
  description: "Lọc đồ decor theo danh mục, phong cách và khoảng giá.",
};

export default async function SearchPage() {
  const [products, categories, styles] = await Promise.all([
    getPublishedProducts(),
    getPublishedCategories(),
    getStyles(),
  ]);

  return (
    <Container width="wide" className="py-12 sm:py-16">
      <Breadcrumb items={[{ label: "Trang chủ", href: "/" }, { label: "Tìm kiếm" }]} />
      <h1 className="mt-5 font-display text-3xl font-medium tracking-tight text-ink sm:text-4xl">
        Tìm kiếm & lọc
      </h1>

      <Suspense fallback={<p className="mt-10 text-sm text-mute">Đang tải…</p>}>
        <SearchExplorer products={products} categories={categories} styles={styles} />
      </Suspense>
    </Container>
  );
}
