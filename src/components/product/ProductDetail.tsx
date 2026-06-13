import Link from "next/link";
import type { Category, Product } from "@/types";
import { Gallery } from "@/components/product/Gallery";
import { BuyButton } from "@/components/product/BuyButton";
import { PriceTag } from "@/components/product/PriceTag";
import { RetailerBadge } from "@/components/ui/Badge";
import { AffiliateDisclosure } from "@/components/ui/AffiliateDisclosure";
import { renderMarkdown } from "@/lib/markdown";

export function ProductDetail({
  product,
  category,
}: {
  product: Product;
  category?: Category;
}) {
  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
      <Gallery imageIds={product.imageIds} alt={product.name} />

      <div className="lg:pt-6">
        <div className="flex flex-wrap items-center gap-2">
          <p className="eyebrow">{product.style}</p>
          {category ? (
            <Link
              href={`/danh-muc/${category.id}`}
              className="text-xs text-stone hover:text-terracotta"
            >
              · {category.name}
            </Link>
          ) : null}
        </div>

        <h1 className="mt-3 font-display text-4xl leading-tight text-ink sm:text-5xl">
          {product.name}
        </h1>

        <p className="mt-4 text-lg leading-relaxed text-charcoal">{product.shortDesc}</p>

        <div className="mt-6 flex items-center gap-4">
          <PriceTag product={product} className="text-3xl" />
          <RetailerBadge retailer={product.retailer} />
        </div>

        <div className="mt-7">
          <BuyButton product={product} />
        </div>

        {product.description ? (
          <div
            className="prose-editorial mt-10 border-t border-line pt-8"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(product.description) }}
          />
        ) : null}

        {product.tags.length > 0 ? (
          <div className="mt-8 flex flex-wrap gap-2">
            {product.tags.map((t) => (
              <span key={t} className="rounded-full bg-cream px-3 py-1 text-xs text-stone">
                #{t}
              </span>
            ))}
          </div>
        ) : null}

        <div className="mt-10 rounded-sm bg-cream/60 p-4">
          <AffiliateDisclosure />
        </div>
      </div>
    </div>
  );
}
