"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Category, SiteSettings } from "@/types";
import { Container } from "@/components/ui/Container";
import { clsx } from "@/lib/cn";

// Editorial top chrome: thin announcement marquee + a transparent-over-hero nav
// that turns solid on scroll. Desktop gets a hover mega-menu; mobile a drawer.
// The whole thing is fixed; a spacer reserves its height on non-home routes so
// the fixed bar never covers content (home lets the full-bleed hero sit under it).
export function Header({
  settings,
  categories,
}: {
  settings: SiteSettings;
  categories: Category[];
}) {
  const title = settings.siteTitle ?? "Tổ Ấm";
  const announcement =
    settings.announcement ?? "Tuyển chọn thủ công · Giao khắp Việt Nam · Đồ decor có gu";

  const pathname = usePathname();
  const isHome = pathname === "/";

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // mobile drawer
  const [megaOpen, setMegaOpen] = useState(false); // desktop mega-menu

  // Solidify the bar once the user scrolls away from the very top.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while the drawer is open. (The drawer itself closes on
  // navigation because every link inside it calls onClose.)
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Transparent (light text) only while at the top of the home hero.
  const solid = !isHome || scrolled;

  return (
    <>
      <header
        onMouseLeave={() => setMegaOpen(false)}
        className={clsx(
          "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
          solid
            ? "bg-paper/90 text-ink backdrop-blur-md"
            : "bg-transparent text-paper",
        )}
      >
        {/* Announcement marquee */}
        <div
          className={clsx(
            "h-10 overflow-hidden border-b text-[0.6875rem] uppercase tracking-[0.18em]",
            solid ? "border-line" : "border-paper/20",
          )}
        >
          <div className="flex h-full items-center whitespace-nowrap">
            <div className="animate-marquee flex shrink-0">
              <AnnouncementRun text={announcement} />
              <AnnouncementRun text={announcement} aria-hidden />
            </div>
          </div>
        </div>

        {/* Nav row */}
        <Container width="wide">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Left: menu trigger (mobile) */}
            <div className="flex flex-1 items-center md:hidden">
              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                aria-label="Mở menu"
                className="-ml-1 inline-flex items-center justify-center p-1"
              >
                <MenuIcon />
              </button>
            </div>

            {/* Left: desktop nav */}
            <nav className="hidden flex-1 items-center gap-8 md:flex">
              <button
                type="button"
                onMouseEnter={() => setMegaOpen(true)}
                onFocus={() => setMegaOpen(true)}
                onClick={() => setMegaOpen(true)}
                className="eyebrow inline-flex items-center gap-1.5 text-current transition-opacity hover:opacity-60"
                aria-expanded={megaOpen}
              >
                Danh mục
                <Chevron open={megaOpen} />
              </button>
              <Link
                href="/bo-suu-tap"
                className="eyebrow text-current transition-opacity hover:opacity-60"
              >
                Bộ sưu tập
              </Link>
            </nav>

            {/* Center: wordmark */}
            <Link
              href="/"
              className="shrink-0 font-display text-xl font-semibold uppercase tracking-[0.28em] text-current sm:text-2xl"
            >
              {title}
            </Link>

            {/* Right: search */}
            <div className="flex flex-1 items-center justify-end">
              <Link
                href="/tim-kiem"
                className="eyebrow inline-flex items-center gap-2 text-current transition-opacity hover:opacity-60"
                aria-label="Tìm kiếm"
              >
                <SearchIcon />
                <span className="hidden sm:inline">Tìm kiếm</span>
              </Link>
            </div>
          </div>
        </Container>

        {/* Desktop mega-menu */}
        <div
          onMouseLeave={() => setMegaOpen(false)}
          className={clsx(
            "hidden border-t md:block",
            solid ? "border-line" : "border-paper/20",
            megaOpen ? "opacity-100" : "pointer-events-none h-0 overflow-hidden opacity-0",
          )}
        >
          <div className={clsx(solid ? "bg-paper text-ink" : "bg-ink/95 text-paper")}>
            <Container width="wide" className="grid grid-cols-4 gap-10 py-10">
              <div className="col-span-2">
                <p className="eyebrow mb-5 text-current opacity-50">Danh mục</p>
                <ul className="grid grid-cols-2 gap-x-8 gap-y-3">
                  {categories.map((c) => (
                    <li key={c.id}>
                      <Link
                        href={`/danh-muc/${c.id}`}
                        onClick={() => setMegaOpen(false)}
                        className="text-sm text-current transition-opacity hover:opacity-50"
                      >
                        {c.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="eyebrow mb-5 text-current opacity-50">Khám phá</p>
                <ul className="space-y-3 text-sm">
                  <li>
                    <Link
                      href="/bo-suu-tap"
                      onClick={() => setMegaOpen(false)}
                      className="text-current transition-opacity hover:opacity-50"
                    >
                      Tất cả bộ sưu tập
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/tim-kiem"
                      onClick={() => setMegaOpen(false)}
                      className="text-current transition-opacity hover:opacity-50"
                    >
                      Tìm kiếm & lọc
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <p className="eyebrow mb-5 text-current opacity-50">Tổ Ấm</p>
                <p className="text-sm leading-relaxed text-current opacity-70">
                  {settings.siteTagline ?? "Tạp chí đồ trang trí nhà cửa"}
                </p>
              </div>
            </Container>
          </div>
        </div>
      </header>

      {/* Spacer keeps content clear of the fixed bar on non-home routes. */}
      {!isHome ? <div aria-hidden style={{ height: "var(--header-h)" }} /> : null}

      {/* Mobile drawer */}
      <MobileDrawer
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        title={title}
        categories={categories}
      />
    </>
  );
}

function AnnouncementRun({ text, ...rest }: { text: string } & React.HTMLAttributes<HTMLDivElement>) {
  // One copy of the marquee message, repeated a few times for width.
  const items = Array.from({ length: 4 }, (_, i) => i);
  return (
    <div className="flex items-center" {...rest}>
      {items.map((i) => (
        <span key={i} className="px-6">
          {text}
        </span>
      ))}
    </div>
  );
}

function MobileDrawer({
  open,
  onClose,
  title,
  categories,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  categories: Category[];
}) {
  return (
    <div
      className={clsx(
        "fixed inset-0 z-[60] md:hidden",
        open ? "" : "pointer-events-none",
      )}
      aria-hidden={!open}
    >
      {/* Scrim */}
      <div
        onClick={onClose}
        className={clsx(
          "absolute inset-0 bg-ink/40 transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0",
        )}
      />
      {/* Panel */}
      <div
        className={clsx(
          "absolute inset-y-0 left-0 flex w-[84%] max-w-sm flex-col bg-paper text-ink transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-line px-5">
          <span className="font-display text-lg font-semibold uppercase tracking-[0.28em]">
            {title}
          </span>
          <button type="button" onClick={onClose} aria-label="Đóng menu" className="p-1">
            <CloseIcon />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto px-5 py-6">
          <p className="eyebrow mb-4 opacity-50">Danh mục</p>
          <ul className="space-y-1">
            {categories.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/danh-muc/${c.id}`}
                  onClick={onClose}
                  className="block py-2 text-base"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
          <p className="eyebrow mb-4 mt-8 opacity-50">Khám phá</p>
          <ul className="space-y-1">
            <li>
              <Link href="/bo-suu-tap" onClick={onClose} className="block py-2 text-base">
                Bộ sưu tập
              </Link>
            </li>
            <li>
              <Link href="/tim-kiem" onClick={onClose} className="block py-2 text-base">
                Tìm kiếm & lọc
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}

function SearchIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.6" />
      <path d="m20 20-3-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="9"
      height="9"
      viewBox="0 0 10 10"
      fill="none"
      aria-hidden
      className={clsx("transition-transform", open && "rotate-180")}
    >
      <path d="M1 3l4 4 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
