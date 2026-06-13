import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types";
import { coverImageUrl, driveImageUrl } from "@/lib/image";
import { PriceTag } from "@/components/product/PriceTag";
import { BuyButton } from "@/components/product/BuyButton";
import { clsx } from "@/lib/cn";

// Asymmetric editorial spotlight for a single product. Alternating sides build
// the magazine rhythm; the image cross-fades to a second shot on hover.
export function FeatureBlock({
  product,
  reverse = false,
  index,
}: {
  product: Product;
  reverse?: boolean;
  index: number;
}) {
  const cover = coverImageUrl(product.imageIds);
  const second = product.imageIds[1] ? driveImageUrl(product.imageIds[1]) : null;
  const href = `/san-pham/${product.slug}`;

  return (
    <article className="grid items-center gap-8 lg:grid-cols-12 lg:gap-14">
      <Link
        href={href}
        className={clsx("group relative block lg:col-span-8", reverse && "lg:order-2")}
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-bone">
          <Image
            src={cover}
            alt={product.name}
            fill
            sizes="(max-width: 1024px) 100vw, 66vw"
            className={clsx(
              "object-cover transition-opacity duration-500",
              second && "group-hover:opacity-0",
            )}
          />
          {second ? (
            <Image
              src={second}
              alt=""
              aria-hidden
              fill
              sizes="(max-width: 1024px) 100vw, 66vw"
              className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />
          ) : null}
        </div>
      </Link>

      <div className={clsx("lg:col-span-4", reverse && "lg:order-1")}>
        <p className="eyebrow mb-4 text-mute">
          {String(index + 1).padStart(2, "0")} — {product.style}
        </p>
        <h3 className="font-display text-2xl font-medium leading-tight text-ink sm:text-3xl">
          <Link href={href} className="transition-opacity hover:opacity-60">
            {product.name}
          </Link>
        </h3>
        <p className="mt-4 text-sm leading-relaxed text-mute">{product.shortDesc}</p>
        <div className="mt-6 flex flex-wrap items-center gap-5">
          <PriceTag product={product} className="text-base text-ink" />
        </div>
        <div className="mt-5">
          <BuyButton product={product} size="sm" />
        </div>
      </div>
    </article>
  );
}
