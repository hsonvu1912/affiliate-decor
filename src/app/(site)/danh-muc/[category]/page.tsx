import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getCategoryById, getPublishedCategories } from "@/lib/data/categories";
import { getProductsByCategory } from "@/lib/data/products";
import { driveImageUrl } from "@/lib/image";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ProductGrid } from "@/components/product/ProductGrid";

// Allow on-demand new entries on a server deploy; static export needs false.
export const dynamicParams = true;

export async function generateStaticParams() {
  const categories = await getPublishedCategories();
  return categories.map((c) => ({ category: c.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const cat = await getCategoryById(category);
  if (!cat) return {};
  return { title: cat.name, description: cat.description };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const cat = await getCategoryById(category);
  if (!cat) notFound();

  const products = await getProductsByCategory(cat.id);

  return (
    <>
      <section className="relative overflow-hidden bg-ink text-bone">
        {cat.heroImageId ? (
          <>
            <Image
              src={driveImageUrl(cat.heroImageId)}
              alt={cat.name}
              fill
              sizes="100vw"
              className="object-cover opacity-40"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-ink/30" />
          </>
        ) : null}
        <Container width="wide" className="relative py-20 sm:py-28">
          <Breadcrumb
            items={[{ label: "Trang chủ", href: "/" }, { label: cat.name }]}
          />
          <h1 className="mt-5 font-display text-5xl font-semibold sm:text-6xl">{cat.name}</h1>
          {cat.description ? (
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-bone/85">
              {cat.description}
            </p>
          ) : null}
        </Container>
      </section>

      <Container width="wide" className="py-16 sm:py-20">
        <p className="mb-8 text-sm text-stone">{products.length} sản phẩm</p>
        <ProductGrid products={products} />
      </Container>
    </>
  );
}
