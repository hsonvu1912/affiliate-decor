import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types";
import { coverImageUrl } from "@/lib/image";
import { PriceTag } from "@/components/product/PriceTag";
import { BuyButton } from "@/components/product/BuyButton";
import { clsx } from "@/lib/cn";

// Asymmetric editorial spotlight for a single product. Alternating side
// creates the magazine rhythm down the page.
export function FeatureBlock({
  product,
  reverse = false,
  index,
}: {
  product: Product;
  reverse?: boolean;
  index: number;
}) {
  return (
    <article className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
      <Link
        href={`/san-pham/${product.slug}`}
        className={clsx(
          "group relative block lg:col-span-7",
          reverse && "lg:order-2",
        )}
      >
        <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-cream">
          <Image
            src={coverImageUrl(product.imageIds)}
            alt={product.name}
            fill
            sizes="(max-width: 1024px) 100vw, 58vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
        </div>
      </Link>

      <div className={clsx("lg:col-span-5", reverse && "lg:order-1")}>
        <p className="eyebrow mb-3">
          {String(index + 1).padStart(2, "0")} — {product.style}
        </p>
        <h3 className="font-display text-3xl leading-tight text-ink sm:text-4xl">
          <Link href={`/san-pham/${product.slug}`} className="hover:text-terracotta transition-colors">
            {product.name}
          </Link>
        </h3>
        <p className="mt-4 leading-relaxed text-charcoal/85">{product.shortDesc}</p>
        <div className="mt-6 flex flex-wrap items-center gap-5">
          <PriceTag product={product} className="text-2xl" />
          <BuyButton product={product} size="sm" />
        </div>
      </div>
    </article>
  );
}
