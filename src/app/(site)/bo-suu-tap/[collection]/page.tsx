import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import {
  getCollectionById,
  getCollectionProducts,
  getPublishedCollections,
} from "@/lib/data/collections";
import { driveImageUrl } from "@/lib/image";
import { renderMarkdown } from "@/lib/markdown";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ProductGrid } from "@/components/product/ProductGrid";

export const dynamicParams = true;

export async function generateStaticParams() {
  const collections = await getPublishedCollections();
  return collections.map((c) => ({ collection: c.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ collection: string }>;
}): Promise<Metadata> {
  const { collection } = await params;
  const col = await getCollectionById(collection);
  if (!col) return {};
  return { title: col.title, description: col.subtitle };
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ collection: string }>;
}) {
  const { collection } = await params;
  const col = await getCollectionById(collection);
  if (!col) notFound();

  const products = await getCollectionProducts(col);

  return (
    <>
      <section className="relative overflow-hidden bg-ink text-paper">
        {col.heroImageId ? (
          <>
            <Image
              src={driveImageUrl(col.heroImageId)}
              alt={col.title}
              fill
              sizes="100vw"
              className="object-cover opacity-50"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/35" />
          </>
        ) : null}
        <Container width="narrow" className="relative py-28 text-center sm:py-36">
          <div className="flex justify-center">
            <Breadcrumb
              items={[
                { label: "Trang chủ", href: "/" },
                { label: "Bộ sưu tập", href: "/bo-suu-tap" },
                { label: col.title },
              ]}
            />
          </div>
          <p className="eyebrow mt-6">Tuyển tập</p>
          <h1 className="mt-3 font-display text-4xl font-medium leading-tight tracking-tight sm:text-5xl">
            {col.title}
          </h1>
          {col.subtitle ? (
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-paper/80">
              {col.subtitle}
            </p>
          ) : null}
        </Container>
      </section>

      {col.editorialBody ? (
        <Container width="narrow" className="py-16 sm:py-24">
          <div
            className="prose-editorial"
            // Owner-authored Markdown from the Sheet CMS (trusted, single-curator).
            dangerouslySetInnerHTML={{ __html: renderMarkdown(col.editorialBody) }}
          />
        </Container>
      ) : null}

      <Container width="wide" className="pb-24">
        <div className="mb-10 border-t border-line pt-10">
          <p className="eyebrow mb-2 text-mute">Trong bộ sưu tập</p>
          <h2 className="font-display text-2xl font-medium text-ink sm:text-3xl">
            {products.length} món đồ tuyển chọn
          </h2>
        </div>
        <ProductGrid products={products} />
      </Container>
    </>
  );
}
