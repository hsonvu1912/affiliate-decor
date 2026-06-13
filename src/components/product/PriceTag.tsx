import { formatVnd } from "@/lib/format";
import { clsx } from "@/lib/cn";
import type { Product } from "@/types";

export function PriceTag({ product, className }: { product: Product; className?: string }) {
  const display = product.priceDisplay || formatVnd(product.price);
  return <span className={clsx("font-display text-ink", className)}>{display}</span>;
}
