"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Category, ProductFilters, Style } from "@/types";
import { filterProducts, parseFilters } from "@/lib/search";
import { ProductCard } from "@/components/product/ProductCard";
import type { Product } from "@/types";

// Client-side search + filter. Reads the current filters from the URL so the
// page works as a static export (no server) and on a live server alike;
// applying filters pushes new searchParams (next router handles basePath).
export function SearchExplorer({
  products,
  categories,
  styles,
}: {
  products: Product[];
  categories: Category[];
  styles: Style[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const current = useMemo<ProductFilters>(() => {
    const obj: Record<string, string> = {};
    searchParams.forEach((v, k) => {
      obj[k] = v;
    });
    return parseFilters(obj);
  }, [searchParams]);

  const results = useMemo(
    () => filterProducts(products, current),
    [products, current],
  );

  // Local form state, seeded from the URL.
  const [q, setQ] = useState(current.q ?? "");
  const [category, setCategory] = useState(current.category ?? "");
  const [style, setStyle] = useState(current.style ?? "");
  const [minPrice, setMinPrice] = useState(current.minPrice?.toString() ?? "");
  const [maxPrice, setMaxPrice] = useState(current.maxPrice?.toString() ?? "");
  const [sort, setSort] = useState(current.sort ?? "");

  function apply(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (category) params.set("danh_muc", category);
    if (style) params.set("phong_cach", style);
    if (minPrice) params.set("gia_min", minPrice);
    if (maxPrice) params.set("gia_max", maxPrice);
    if (sort) params.set("sort", sort);
    const qs = params.toString();
    router.push(qs ? `/tim-kiem?${qs}` : "/tim-kiem");
  }

  function reset() {
    setQ("");
    setCategory("");
    setStyle("");
    setMinPrice("");
    setMaxPrice("");
    setSort("");
    router.push("/tim-kiem");
  }

  return (
    <div className="mt-10 grid gap-10 lg:grid-cols-[260px_1fr]">
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <form onSubmit={apply} className="space-y-6">
          <div>
            <label htmlFor="q" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-stone">
              Từ khóa
            </label>
            <input
              id="q"
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Đèn mây, bình gốm…"
              className="w-full rounded-sm border border-line bg-bone px-3 py-2.5 text-sm text-ink outline-none focus:border-terracotta"
            />
          </div>

          <Field label="Danh mục">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-sm border border-line bg-bone px-3 py-2.5 text-sm text-ink outline-none focus:border-terracotta"
            >
              <option value="">Tất cả danh mục</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Phong cách">
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="w-full rounded-sm border border-line bg-bone px-3 py-2.5 text-sm text-ink outline-none focus:border-terracotta"
            >
              <option value="">Mọi phong cách</option>
              {styles.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Khoảng giá (₫)">
            <div className="flex items-center gap-2">
              <input
                type="number"
                inputMode="numeric"
                min={0}
                step={50000}
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="Từ"
                className="w-full rounded-sm border border-line bg-bone px-3 py-2.5 text-sm outline-none focus:border-terracotta"
              />
              <span className="text-stone">—</span>
              <input
                type="number"
                inputMode="numeric"
                min={0}
                step={50000}
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="Đến"
                className="w-full rounded-sm border border-line bg-bone px-3 py-2.5 text-sm outline-none focus:border-terracotta"
              />
            </div>
          </Field>

          <Field label="Sắp xếp">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full rounded-sm border border-line bg-bone px-3 py-2.5 text-sm text-ink outline-none focus:border-terracotta"
            >
              <option value="">Mới nhất</option>
              <option value="noi-bat">Nổi bật</option>
              <option value="gia-tang">Giá: thấp đến cao</option>
              <option value="gia-giam">Giá: cao đến thấp</option>
            </select>
          </Field>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 rounded-full bg-terracotta px-5 py-2.5 text-sm font-medium text-bone transition-colors hover:bg-terracotta-dark"
            >
              Lọc
            </button>
            <button
              type="button"
              onClick={reset}
              className="rounded-full border border-line px-5 py-2.5 text-sm text-charcoal hover:border-terracotta hover:text-terracotta"
            >
              Xóa lọc
            </button>
          </div>
        </form>
      </aside>

      <div>
        <p className="mb-6 text-sm text-stone">
          {results.length} kết quả{current.q ? ` cho “${current.q}”` : ""}
        </p>
        {results.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-5 gap-y-10 xl:grid-cols-3">
            {results.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="rounded-sm border border-line bg-cream/50 py-20 text-center">
            <p className="font-display text-2xl text-ink">Không tìm thấy sản phẩm</p>
            <p className="mt-2 text-stone">Thử nới rộng bộ lọc hoặc đổi từ khóa.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-stone">{label}</p>
      {children}
    </div>
  );
}
