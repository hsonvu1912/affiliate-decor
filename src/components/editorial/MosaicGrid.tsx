import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types";
import { coverImageUrl, driveImageUrl } from "@/lib/image";
import { formatVnd } from "@/lib/format";

// Dense, edge-to-edge "justified gallery" home grid in the JW Anderson manner:
// every row is the same height, tile widths vary by aspect ratio, ~6px gaps,
// white background. A few blank cells add breathing room and a thin promo band
// splits the flow. Pure CSS flex — stays a Server Component.

// Aspect ratios (width / height): wide / square / tall, cycled for rhythm.
const ASPECTS = [1.25, 0.8, 1.0, 0.8, 1.25, 1.0, 0.8, 1.0, 1.25, 0.8];
// Blank "whitespace" cells injected at these positions within the tile stream.
const BLANK_AT = new Set([5, 13, 24, 31]);

interface Tile {
  kind: "image" | "blank";
  product?: Product;
  src?: string;
  aspect: number;
  key: string;
}

function buildTiles(products: Product[], target: number): Tile[] {
  // Expand each product into one tile per image (cover + optional second shot).
  const base: { product: Product; src: string }[] = [];
  for (const p of products) {
    base.push({ product: p, src: coverImageUrl(p.imageIds) });
    if (p.imageIds[1]) base.push({ product: p, src: driveImageUrl(p.imageIds[1]) });
  }
  if (base.length === 0) return [];

  const tiles: Tile[] = [];
  for (let i = 0; i < target; i++) {
    if (BLANK_AT.has(i)) {
      tiles.push({ kind: "blank", aspect: ASPECTS[i % ASPECTS.length], key: `blank-${i}` });
      continue;
    }
    const item = base[i % base.length];
    tiles.push({
      kind: "image",
      product: item.product,
      src: item.src,
      aspect: ASPECTS[i % ASPECTS.length],
      key: `${item.product.id}-${i}`,
    });
  }
  return tiles;
}

function Row({ tiles, priority = false }: { tiles: Tile[]; priority?: boolean }) {
  return (
    <div
      className="flex flex-wrap gap-1.5"
      style={{ ["--row-h" as string]: "clamp(150px, 16vw, 250px)" }}
    >
      {tiles.map((t, i) =>
        t.kind === "blank" ? (
          <div
            key={t.key}
            aria-hidden
            className="hidden bg-paper sm:block"
            style={{ height: "var(--row-h)", flexGrow: t.aspect, flexBasis: `calc(${t.aspect} * var(--row-h))` }}
          />
        ) : (
          <Link
            key={t.key}
            href={`/san-pham/${t.product!.slug}`}
            className="group relative block overflow-hidden bg-bone"
            style={{ height: "var(--row-h)", flexGrow: t.aspect, flexBasis: `calc(${t.aspect} * var(--row-h))` }}
          >
            <Image
              src={t.src!}
              alt={t.product!.name}
              fill
              sizes="(max-width: 640px) 50vw, 22vw"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              priority={priority && i < 4}
            />
            {/* Hover label */}
            <div className="absolute inset-x-0 bottom-0 flex items-end bg-gradient-to-t from-ink/60 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div className="min-w-0">
                <p className="truncate text-xs text-paper">{t.product!.name}</p>
                <p className="text-xs text-paper/70">
                  {t.product!.priceDisplay || formatVnd(t.product!.price)}
                </p>
              </div>
            </div>
          </Link>
        ),
      )}
    </div>
  );
}

export function MosaicGrid({
  products,
  promo,
}: {
  products: Product[];
  promo?: { label?: string; text: string; href?: string };
}) {
  const tiles = buildTiles(products, 36);
  if (tiles.length === 0) {
    return <p className="py-20 text-center text-sm text-mute">Chưa có sản phẩm nào.</p>;
  }

  // Split the flow so the promo band sits a couple of rows down.
  const split = Math.min(10, tiles.length);
  const first = tiles.slice(0, split);
  const rest = tiles.slice(split);

  return (
    <div className="space-y-1.5 px-1.5">
      <Row tiles={first} priority />
      {promo ? (
        <div className="flex flex-col items-center justify-center gap-1 border-y border-line bg-bone px-6 py-10 text-center">
          {promo.label ? <p className="eyebrow text-mute">{promo.label}</p> : null}
          <p className="font-display text-lg font-medium text-ink sm:text-xl">{promo.text}</p>
          {promo.href ? (
            <Link
              href={promo.href}
              className="mt-2 border-b border-ink pb-0.5 text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-ink transition-opacity hover:opacity-60"
            >
              Khám phá
            </Link>
          ) : null}
        </div>
      ) : null}
      {rest.length > 0 ? <Row tiles={rest} /> : null}
    </div>
  );
}
