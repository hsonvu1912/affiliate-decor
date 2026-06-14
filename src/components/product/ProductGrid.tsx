import type { Product } from "@/types";
import { ProductCard } from "@/components/product/ProductCard";

// Tight lookbook grid: images sit close together (small column gap), with more
// vertical room for the labels. 2 / 3 / 4 columns.
export function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return <p className="py-16 text-center text-sm text-mute">Chưa có sản phẩm nào ở đây.</p>;
  }
  return (
    <div className="grid grid-cols-2 gap-x-2 gap-y-10 sm:gap-x-3 md:grid-cols-3 lg:grid-cols-4">
      {products.map((p, i) => (
        <ProductCard key={p.id} product={p} priority={i < 4} />
      ))}
    </div>
  );
}
