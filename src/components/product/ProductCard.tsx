import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types";
import { coverImageUrl, driveImageUrl } from "@/lib/image";
import { PriceTag } from "@/components/product/PriceTag";
import { BuyButton } from "@/components/product/BuyButton";
import { clsx } from "@/lib/cn";

// Lookbook product cell: portrait image that cross-fades to a second shot on
// hover, a quick-buy bar that slides up over the image, and a minimal name +
// price beneath. Stays a Server Component — the hover is pure CSS (works in the
// static export). The card link and the affiliate link are siblings (never an
// <a> nested inside another <a>).
export function ProductCard({
  product,
  priority = false,
  size = "default",
}: {
  product: Product;
  priority?: boolean;
  size?: "default" | "tall";
}) {
  const cover = coverImageUrl(product.imageIds);
  const second = product.imageIds[1] ? driveImageUrl(product.imageIds[1]) : null;
  const href = `/san-pham/${product.slug}`;
  const sizes = "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw";

  return (
    <div className="group">
      <div
        className={clsx(
          "relative overflow-hidden bg-bone",
          size === "tall" ? "aspect-[3/4]" : "aspect-[4/5]",
        )}
      >
        <Link href={href} className="absolute inset-0 z-10 block" aria-label={product.name}>
          <Image
            src={cover}
            alt={product.name}
            fill
            sizes={sizes}
            className={clsx(
              "object-cover transition-opacity duration-500",
              second && "group-hover:opacity-0",
            )}
            priority={priority}
          />
          {second ? (
            <Image
              src={second}
              alt=""
              aria-hidden
              fill
              sizes={sizes}
              className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />
          ) : null}
        </Link>

        {/* Quick-buy: slides up over the image bottom on hover (desktop). Sits
            above the card link (z-20) so the affiliate button stays clickable. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 hidden translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 md:block">
          <BuyButton product={product} size="sm" className="pointer-events-auto w-full" />
        </div>
      </div>

      <div className="mt-3 flex items-baseline justify-between gap-3">
        <h3 className="text-sm leading-snug text-ink">
          <Link href={href} className="transition-opacity hover:opacity-60">
            {product.name}
          </Link>
        </h3>
        <PriceTag product={product} className="shrink-0 text-sm text-mute" />
      </div>
    </div>
  );
}
