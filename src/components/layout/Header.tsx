import Link from "next/link";
import type { Category, SiteSettings } from "@/types";
import { Container } from "@/components/ui/Container";

export function Header({
  settings,
  categories,
}: {
  settings: SiteSettings;
  categories: Category[];
}) {
  const title = settings.siteTitle ?? "Tổ Ấm";
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bone/85 backdrop-blur-md">
      <Container width="wide">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link href="/" className="shrink-0">
            <span className="font-display text-2xl font-semibold tracking-tight text-ink">
              {title}
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-7 text-sm text-charcoal">
            {categories.slice(0, 5).map((c) => (
              <Link
                key={c.id}
                href={`/danh-muc/${c.id}`}
                className="hover:text-terracotta transition-colors"
              >
                {c.name}
              </Link>
            ))}
            <Link href="/bo-suu-tap" className="hover:text-terracotta transition-colors">
              Bộ sưu tập
            </Link>
          </nav>

          <Link
            href="/tim-kiem"
            className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm text-charcoal hover:border-terracotta hover:text-terracotta transition-colors"
          >
            <SearchIcon />
            <span className="hidden sm:inline">Tìm kiếm</span>
          </Link>
        </div>

        {/* Mobile category strip */}
        <div className="md:hidden -mx-5 overflow-x-auto no-scrollbar border-t border-line">
          <div className="flex gap-5 px-5 py-3 text-sm text-charcoal whitespace-nowrap">
            {categories.map((c) => (
              <Link key={c.id} href={`/danh-muc/${c.id}`} className="hover:text-terracotta">
                {c.name}
              </Link>
            ))}
            <Link href="/bo-suu-tap" className="hover:text-terracotta">
              Bộ sưu tập
            </Link>
          </div>
        </div>
      </Container>
    </header>
  );
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="m20 20-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
