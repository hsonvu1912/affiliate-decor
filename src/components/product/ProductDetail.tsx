import Link from "next/link";
import type { Category, Product } from "@/types";
import { Gallery } from "@/components/product/Gallery";
import { BuyButton } from "@/components/product/BuyButton";
import { PriceTag } from "@/components/product/PriceTag";
import { RetailerBadge } from "@/components/ui/Badge";
import { AffiliateDisclosure } from "@/components/ui/AffiliateDisclosure";
import { renderMarkdown } from "@/lib/markdown";

// PDP: narrow sticky info column on the left, stacked gallery on the right
// (desktop). On mobile the gallery comes first, then the info. Expandable
// sections use native <details> — accessible and JS-free (static-export safe).
export function ProductDetail({
  product,
  category,
}: {
  product: Product;
  category?: Category;
}) {
  return (
    <div className="grid gap-8 lg:grid-cols-[340px_minmax(0,1fr)] lg:gap-14">
      {/* Info */}
      <div className="order-2 lg:order-1 lg:sticky lg:top-28 lg:self-start">
        <div className="flex flex-wrap items-center gap-2 text-[0.6875rem] uppercase tracking-[0.14em] text-mute">
          <span>{product.style}</span>
          {category ? (
            <Link href={`/danh-muc/${category.id}`} className="transition-opacity hover:opacity-60">
              · {category.name}
            </Link>
          ) : null}
        </div>

        <h1 className="mt-3 font-display text-2xl font-medium leading-tight text-ink sm:text-3xl">
          {product.name}
        </h1>

        <div className="mt-4 flex items-center gap-3">
          <PriceTag product={product} className="text-lg text-ink" />
          <RetailerBadge retailer={product.retailer} />
        </div>

        <p className="mt-5 text-sm leading-relaxed text-mute">{product.shortDesc}</p>

        <div className="mt-7">
          <BuyButton product={product} className="w-full" />
        </div>

        <div className="mt-8 border-t border-line">
          {product.description ? (
            <Accordion summary="Chi tiết sản phẩm" defaultOpen>
              <div
                className="prose-editorial"
                // Owner-authored Markdown from the Sheet CMS (trusted, single-curator).
                dangerouslySetInnerHTML={{ __html: renderMarkdown(product.description) }}
              />
            </Accordion>
          ) : null}

          <Accordion summary="Vận chuyển & tiếp thị liên kết">
            <div className="space-y-3 text-sm leading-relaxed text-mute">
              <p>
                Sản phẩm được bán và giao bởi {product.retailer || "nhà bán lẻ đối tác"}. Thời gian
                và phí vận chuyển theo chính sách của nơi bán.
              </p>
              <AffiliateDisclosure />
            </div>
          </Accordion>
        </div>

        {product.tags.length > 0 ? (
          <div className="mt-8 flex flex-wrap gap-2">
            {product.tags.map((t) => (
              <span
                key={t}
                className="border border-line px-3 py-1 text-[0.6875rem] uppercase tracking-[0.1em] text-mute"
              >
                {t}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      {/* Gallery */}
      <div className="order-1 lg:order-2">
        <Gallery imageIds={product.imageIds} alt={product.name} />
      </div>
    </div>
  );
}

// Native disclosure styled as a hairline accordion row.
function Accordion({
  summary,
  children,
  defaultOpen = false,
}: {
  summary: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details open={defaultOpen} className="group border-b border-line">
      <summary className="flex cursor-pointer list-none items-center justify-between py-4 text-[0.6875rem] uppercase tracking-[0.16em] text-ink [&::-webkit-details-marker]:hidden">
        {summary}
        <span aria-hidden className="text-base leading-none text-mute transition-transform group-open:rotate-45">
          +
        </span>
      </summary>
      <div className="pb-6">{children}</div>
    </details>
  );
}
