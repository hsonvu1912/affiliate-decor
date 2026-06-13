import Link from "next/link";
import type { Category, SiteSettings } from "@/types";
import { Container } from "@/components/ui/Container";

export function Footer({
  settings,
  categories,
}: {
  settings: SiteSettings;
  categories: Category[];
}) {
  const title = settings.siteTitle ?? "Tổ Ấm";
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-line bg-cream">
      <Container width="wide" className="py-14">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
          <div className="max-w-sm">
            <p className="font-display text-2xl font-semibold text-ink">{title}</p>
            <p className="mt-1 text-sm text-stone">{settings.siteTagline}</p>
            <p className="mt-5 text-xs leading-relaxed text-stone">{settings.footerText}</p>
          </div>

          <div>
            <p className="eyebrow mb-4">Danh mục</p>
            <ul className="space-y-2 text-sm text-charcoal">
              {categories.map((c) => (
                <li key={c.id}>
                  <Link href={`/danh-muc/${c.id}`} className="hover:text-terracotta">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow mb-4">Khám phá</p>
            <ul className="space-y-2 text-sm text-charcoal">
              <li>
                <Link href="/bo-suu-tap" className="hover:text-terracotta">
                  Bộ sưu tập
                </Link>
              </li>
              <li>
                <Link href="/tim-kiem" className="hover:text-terracotta">
                  Tìm kiếm
                </Link>
              </li>
              {settings.social_instagram ? (
                <li>
                  <a href={settings.social_instagram} className="hover:text-terracotta" rel="noopener">
                    Instagram
                  </a>
                </li>
              ) : null}
              {settings.social_facebook ? (
                <li>
                  <a href={settings.social_facebook} className="hover:text-terracotta" rel="noopener">
                    Facebook
                  </a>
                </li>
              ) : null}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-line pt-6 text-xs text-stone">
          © {year} {title}. Bảo lưu mọi quyền.
        </div>
      </Container>
    </footer>
  );
}
