import Link from "next/link";

// Colour is inherited (currentColor + opacity) so the same breadcrumb reads on
// both light pages and dark hero sections without a variant prop.
export function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-[0.6875rem] uppercase tracking-[0.14em]">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-2">
            {item.href ? (
              <Link href={item.href} className="opacity-55 transition-opacity hover:opacity-100">
                {item.label}
              </Link>
            ) : (
              <span>{item.label}</span>
            )}
            {i < items.length - 1 ? (
              <span aria-hidden className="opacity-40">
                /
              </span>
            ) : null}
          </li>
        ))}
      </ol>
    </nav>
  );
}
