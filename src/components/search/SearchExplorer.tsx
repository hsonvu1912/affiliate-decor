"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Category, ProductFilters, Style } from "@/types";
import { filterProducts, parseFilters } from "@/lib/search";
import { ProductGrid } from "@/components/product/ProductGrid";
import { clsx } from "@/lib/cn";
import type { Product } from "@/types";

// Client-side search + filter. Reads the current filters from the URL so the
// page works as a static export (no server) and on a live server alike;
// applying filters pushes new searchParams (next router handles basePath).
// Layout follows JW: a thin top bar with a collapsible "Tinh chỉnh" panel,
// results in a lookbook grid.
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

  const results = useMemo(() => filterProducts(products, current), [products, current]);

  // Local form state, seeded from the URL.
  const [q, setQ] = useState(current.q ?? "");
  const [category, setCategory] = useState(current.category ?? "");
  const [style, setStyle] = useState(current.style ?? "");
  const [minPrice, setMinPrice] = useState(current.minPrice?.toString() ?? "");
  const [maxPrice, setMaxPrice] = useState(current.maxPrice?.toString() ?? "");
  const [sort, setSort] = useState(current.sort ?? "");
  const [refineOpen, setRefineOpen] = useState(true);

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

  const field =
    "w-full border border-line bg-paper px-3 py-2.5 text-sm text-ink outline-none transition-colors focus:border-ink";

  return (
    <form onSubmit={apply} className="mt-10">
      {/* Top bar: count + refine toggle */}
      <div className="flex items-center justify-between border-y border-line py-3">
        <p className="text-[0.6875rem] uppercase tracking-[0.14em] text-mute">
          {results.length} kết quả{current.q ? ` cho “${current.q}”` : ""}
        </p>
        <button
          type="button"
          onClick={() => setRefineOpen((v) => !v)}
          className="eyebrow inline-flex items-center gap-2 text-ink transition-opacity hover:opacity-60"
          aria-expanded={refineOpen}
        >
          Tinh chỉnh
          <span aria-hidden className={clsx("transition-transform", refineOpen && "rotate-45")}>
            +
          </span>
        </button>
      </div>

      {/* Refine panel */}
      {refineOpen ? (
        <div className="grid gap-5 border-b border-line py-6 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Từ khóa">
            <input
              id="q"
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Đèn mây, bình gốm…"
              className={field}
            />
          </Field>

          <Field label="Danh mục">
            <select value={category} onChange={(e) => setCategory(e.target.value)} className={field}>
              <option value="">Tất cả danh mục</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Phong cách">
            <select value={style} onChange={(e) => setStyle(e.target.value)} className={field}>
              <option value="">Mọi phong cách</option>
              {styles.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Sắp xếp">
            <select value={sort} onChange={(e) => setSort(e.target.value)} className={field}>
              <option value="">Mới nhất</option>
              <option value="noi-bat">Nổi bật</option>
              <option value="gia-tang">Giá: thấp đến cao</option>
              <option value="gia-giam">Giá: cao đến thấp</option>
            </select>
          </Field>

          <Field label="Giá tối thiểu (₫)">
            <input
              type="number"
              inputMode="numeric"
              min={0}
              step={50000}
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="Từ"
              className={field}
            />
          </Field>

          <Field label="Giá tối đa (₫)">
            <input
              type="number"
              inputMode="numeric"
              min={0}
              step={50000}
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="Đến"
              className={field}
            />
          </Field>

          <div className="flex items-end gap-3 sm:col-span-2">
            <button
              type="submit"
              className="bg-ink px-6 py-2.5 text-[0.6875rem] font-medium uppercase tracking-[0.15em] text-paper transition-colors hover:bg-ink/85"
            >
              Lọc
            </button>
            <button
              type="button"
              onClick={reset}
              className="border border-line px-6 py-2.5 text-[0.6875rem] font-medium uppercase tracking-[0.15em] text-ink transition-colors hover:border-ink"
            >
              Xóa lọc
            </button>
          </div>
        </div>
      ) : null}

      {/* Results */}
      <div className="mt-10">
        {results.length > 0 ? (
          <ProductGrid products={results} />
        ) : (
          <div className="border border-line py-24 text-center">
            <p className="font-display text-xl font-medium text-ink">Không tìm thấy sản phẩm</p>
            <p className="mt-2 text-sm text-mute">Thử nới rộng bộ lọc hoặc đổi từ khóa.</p>
          </div>
        )}
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-[0.6875rem] uppercase tracking-[0.14em] text-mute">{label}</p>
      {children}
    </div>
  );
}
