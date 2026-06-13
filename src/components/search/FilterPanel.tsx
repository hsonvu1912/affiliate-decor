import type { Category, ProductFilters, Style } from "@/types";

// A no-JS-required filter: a GET form that submits to /tim-kiem and round-trips
// through searchParams. Names match parseFilters() in lib/search.ts.
export function FilterPanel({
  categories,
  styles,
  filters,
}: {
  categories: Category[];
  styles: Style[];
  filters: ProductFilters;
}) {
  return (
    <form method="GET" action="/tim-kiem" className="space-y-6">
      <div>
        <label htmlFor="q" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-stone">
          Từ khóa
        </label>
        <input
          id="q"
          name="q"
          type="search"
          defaultValue={filters.q ?? ""}
          placeholder="Đèn mây, bình gốm…"
          className="w-full rounded-sm border border-line bg-bone px-3 py-2.5 text-sm text-ink outline-none focus:border-terracotta"
        />
      </div>

      <Field label="Danh mục">
        <Select name="danh_muc" value={filters.category} placeholder="Tất cả danh mục">
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </Select>
      </Field>

      <Field label="Phong cách">
        <Select name="phong_cach" value={filters.style} placeholder="Mọi phong cách">
          {styles.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </Select>
      </Field>

      <Field label="Khoảng giá (₫)">
        <div className="flex items-center gap-2">
          <input
            name="gia_min"
            type="number"
            inputMode="numeric"
            min={0}
            step={50000}
            defaultValue={filters.minPrice ?? ""}
            placeholder="Từ"
            className="w-full rounded-sm border border-line bg-bone px-3 py-2.5 text-sm outline-none focus:border-terracotta"
          />
          <span className="text-stone">—</span>
          <input
            name="gia_max"
            type="number"
            inputMode="numeric"
            min={0}
            step={50000}
            defaultValue={filters.maxPrice ?? ""}
            placeholder="Đến"
            className="w-full rounded-sm border border-line bg-bone px-3 py-2.5 text-sm outline-none focus:border-terracotta"
          />
        </div>
      </Field>

      <Field label="Sắp xếp">
        <Select name="sort" value={filters.sort} placeholder="Mới nhất">
          <option value="noi-bat">Nổi bật</option>
          <option value="gia-tang">Giá: thấp đến cao</option>
          <option value="gia-giam">Giá: cao đến thấp</option>
        </Select>
      </Field>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className="flex-1 rounded-full bg-terracotta px-5 py-2.5 text-sm font-medium text-bone transition-colors hover:bg-terracotta-dark"
        >
          Lọc
        </button>
        <a
          href="/tim-kiem"
          className="rounded-full border border-line px-5 py-2.5 text-sm text-charcoal hover:border-terracotta hover:text-terracotta"
        >
          Xóa lọc
        </a>
      </div>
    </form>
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

function Select({
  name,
  value,
  placeholder,
  children,
}: {
  name: string;
  value?: string;
  placeholder: string;
  children: React.ReactNode;
}) {
  return (
    <select
      name={name}
      defaultValue={value ?? ""}
      className="w-full rounded-sm border border-line bg-bone px-3 py-2.5 text-sm text-ink outline-none focus:border-terracotta"
    >
      <option value="">{placeholder}</option>
      {children}
    </select>
  );
}
