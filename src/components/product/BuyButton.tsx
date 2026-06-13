import { clsx } from "@/lib/cn";
import type { Product } from "@/types";

// In a static export (GitHub Pages demo) there is no server, so link straight
// to the affiliate URL. On a server deploy, route through /go/[id] so every
// click is tracked and the raw affiliate URL is not the crawlable href.
const STATIC = process.env.NEXT_PUBLIC_STATIC_EXPORT === "true";

// Outbound CTA — solid black rectangle, no radius. rel marks it sponsored.
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
        "inline-flex items-center justify-center gap-2 bg-ink font-medium uppercase tracking-[0.15em] text-paper transition-colors hover:bg-ink/85",
        size === "lg" ? "px-7 py-4 text-xs" : "px-5 py-3 text-[0.6875rem]",
        className,
      )}
    >
      <span>Mua ngay</span>
      {product.retailer ? <span className="opacity-60">· {product.retailer}</span> : null}
      <span aria-hidden>↗</span>
    </a>
  );
}
