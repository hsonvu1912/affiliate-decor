import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getProductBySlug,
  getPublishedProducts,
  getRelatedProducts,
} from "@/lib/data/products";
import { getCategoryById } from "@/lib/data/categories";
import { coverImageUrl } from "@/lib/image";
import { ProductDetail } from "@/components/product/ProductDetail";
import { ProductCard } from "@/components/product/ProductCard";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

export const dynamicParams = true;

export async function generateStaticParams() {
  const products = await getPublishedProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.shortDesc,
    openGraph: {
      title: product.name,
      description: product.shortDesc,
      images: [{ url: coverImageUrl(product.imageIds) }],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [category, related] = await Promise.all([
    getCategoryById(product.category),
    getRelatedProducts(product),
  ]);

  return (
    <Container width="wide" className="py-10 sm:py-14">
      <Breadcrumb
        items={[
          { label: "Trang chủ", href: "/" },
          ...(category ? [{ label: category.name, href: `/danh-muc/${category.id}` }] : []),
          { label: product.name },
        ]}
      />

      <div className="mt-8">
        <ProductDetail product={product} category={category} />
      </div>

      {related.length > 0 ? (
        <section className="mt-24 border-t border-line pt-14">
          <p className="eyebrow mb-2 text-mute">Có thể bạn thích</p>
          <h2 className="mb-10 font-display text-2xl font-medium text-ink sm:text-3xl">
            Gợi ý liên quan
          </h2>
          <div className="grid grid-cols-2 gap-x-2 gap-y-10 sm:gap-x-3 md:grid-cols-3 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      ) : null}
    </Container>
  );
}
