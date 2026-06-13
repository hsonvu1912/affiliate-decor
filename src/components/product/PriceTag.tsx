import { formatVnd } from "@/lib/format";
import { clsx } from "@/lib/cn";
import type { Product } from "@/types";

// Plain numeric price. Colour/size come from the caller so the same tag works
// in a card (small, muted) and on the product page (larger).
export function PriceTag({ product, className }: { product: Product; className?: string }) {
  const display = product.priceDisplay || formatVnd(product.price);
  return <span className={clsx("tabular-nums", className)}>{display}</span>;
}
