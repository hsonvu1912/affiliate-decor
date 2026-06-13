import type { Product } from "@/types";
import { ProductCard } from "@/components/product/ProductCard";

export function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <p className="py-16 text-center text-stone">Chưa có sản phẩm nào ở đây.</p>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
      {products.map((p, i) => (
        <ProductCard key={p.id} product={p} priority={i < 4} />
      ))}
    </div>
  );
}
