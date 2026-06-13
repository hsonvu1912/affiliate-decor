import { clsx } from "@/lib/cn";
import type { Product } from "@/types";

// Outbound CTA. Always routes through /go/[id] so every click is tracked and
// the raw affiliate URL is not the crawlable href. rel marks it sponsored.
export function BuyButton({
  product,
  className,
  size = "lg",
}: {
  product: Product;
  className?: string;
  size?: "lg" | "sm";
}) {
  return (
    <a
      href={`/go/${encodeURIComponent(product.id)}`}
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
