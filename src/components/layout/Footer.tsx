import Link from "next/link";
import type { Category, SiteSettings } from "@/types";
import { Container } from "@/components/ui/Container";
import { NewsletterForm } from "@/components/layout/NewsletterForm";

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
    <footer className="border-t border-line bg-bone">
      <Container width="wide" className="py-16 sm:py-20">
        <div className="grid gap-12 md:grid-cols-4">
          <div>
            <p className="eyebrow mb-5 text-mute">Danh mục</p>
            <ul className="space-y-2.5 text-sm text-ink">
              {categories.map((c) => (
                <li key={c.id}>
                  <Link href={`/danh-muc/${c.id}`} className="transition-opacity hover:opacity-60">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow mb-5 text-mute">Khám phá</p>
            <ul className="space-y-2.5 text-sm text-ink">
              <li>
                <Link href="/bo-suu-tap" className="transition-opacity hover:opacity-60">
                  Bộ sưu tập
                </Link>
              </li>
              <li>
                <Link href="/tim-kiem" className="transition-opacity hover:opacity-60">
                  Tìm kiếm & lọc
                </Link>
              </li>
              {settings.social_instagram ? (
                <li>
                  <a
                    href={settings.social_instagram}
                    className="transition-opacity hover:opacity-60"
                    rel="noopener"
                  >
                    Instagram
                  </a>
                </li>
              ) : null}
              {settings.social_facebook ? (
                <li>
                  <a
                    href={settings.social_facebook}
                    className="transition-opacity hover:opacity-60"
                    rel="noopener"
                  >
                    Facebook
                  </a>
                </li>
              ) : null}
            </ul>
          </div>

          <div className="md:col-span-2 md:max-w-sm md:justify-self-end">
            <p className="eyebrow mb-5 text-mute">Bản tin</p>
            <p className="mb-4 text-sm leading-relaxed text-mute">
              Nhận tuyển tập decor mới mỗi tháng — không spam.
            </p>
            <NewsletterForm />
          </div>
        </div>

        {/* Oversized wordmark — JW-style signature */}
        <Link
          href="/"
          aria-label={title}
          className="mt-16 block select-none font-display text-[18vw] font-semibold uppercase leading-none tracking-[0.04em] text-ink sm:text-[14vw] lg:text-[10vw]"
        >
          {title}
        </Link>

        <div className="mt-10 flex flex-col gap-3 border-t border-line pt-6 text-[0.6875rem] uppercase tracking-[0.12em] text-mute sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {title}. Bảo lưu mọi quyền.
          </p>
          <p className="normal-case tracking-normal">{settings.footerText}</p>
        </div>
      </Container>
    </footer>
  );
}
