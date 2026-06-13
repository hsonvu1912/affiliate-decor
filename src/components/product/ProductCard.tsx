import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types";
import { coverImageUrl } from "@/lib/image";
import { PriceTag } from "@/components/product/PriceTag";
import { clsx } from "@/lib/cn";

export function ProductCard({
  product,
  priority = false,
  size = "default",
}: {
  product: Product;
  priority?: boolean;
  size?: "default" | "tall";
}) {
  return (
    <Link href={`/san-pham/${product.slug}`} className="group block">
      <div
        className={clsx(
          "relative overflow-hidden rounded-sm bg-cream",
          size === "tall" ? "aspect-[3/4]" : "aspect-[4/5]",
        )}
      >
        <Image
          src={coverImageUrl(product.imageIds)}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          priority={priority}
        />
        {product.featured ? (
          <span className="absolute left-3 top-3 rounded-full bg-bone/90 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-wider text-terracotta">
            Tuyển chọn
          </span>
        ) : null}
      </div>
      <div className="mt-3">
        <p className="text-[0.7rem] uppercase tracking-widest text-stone">{product.style}</p>
        <h3 className="mt-1 font-display text-lg leading-snug text-ink group-hover:text-terracotta transition-colors">
          {product.name}
        </h3>
        <PriceTag product={product} className="mt-1 block text-base" />
      </div>
    </Link>
  );
}
