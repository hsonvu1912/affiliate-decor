import { clsx } from "@/lib/cn";
import type { Product } from "@/types";

// In a static export (GitHub Pages demo) there is no server, so link straight
// to the affiliate URL. On a server deploy, route through /go/[id] so every
// click is tracked and the raw affiliate URL is not the crawlable href.
const STATIC = process.env.NEXT_PUBLIC_STATIC_EXPORT === "true";

// Outbound CTA. rel marks it sponsored.
export function BuyButton({
  product,
  className,
  size = "lg",
}: {
  product: Product;
  className?: string;
  size?: "lg" | "sm";
}) {
  const href = STATIC ? product.affiliateUrl : `/go/${encodeURIComponent(product.id)}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="nofollow sponsored noopener noreferrer"
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-full bg-terracotta font-medium text-bone transition-colors hover:bg-terracotta-dark",
        size === "lg" ? "px-7 py-3.5 text-base" : "px-5 py-2.5 text-sm",
        className,
      )}
    >
      Mua ngay
      {product.retailer ? <span className="opacity-80">· {product.retailer}</span> : null}
      <span aria-hidden>↗</span>
    </a>
  );
}
