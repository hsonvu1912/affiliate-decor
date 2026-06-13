import Image from "next/image";
import Link from "next/link";
import type { Collection, SiteSettings } from "@/types";
import { driveImageUrl } from "@/lib/image";
import { Container } from "@/components/ui/Container";

export function Hero({
  settings,
  collection,
}: {
  settings: SiteSettings;
  collection?: Collection;
}) {
  return (
    <section className="relative overflow-hidden bg-cream">
      <Container width="wide" className="py-14 sm:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.1fr]">
          <div>
            {settings.heroEyebrow ? <p className="eyebrow mb-5">{settings.heroEyebrow}</p> : null}
            <h1 className="font-display font-semibold leading-[1.04] text-ink text-[clamp(2.5rem,5.5vw,4.75rem)]">
              {settings.heroHeadline}
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-charcoal/85">
              {settings.heroSubhead}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              {collection ? (
                <Link
                  href={`/bo-suu-tap/${collection.id}`}
                  className="inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 text-base font-medium text-bone transition-colors hover:bg-charcoal"
                >
                  Khám phá tuyển tập
                  <span aria-hidden>→</span>
                </Link>
              ) : null}
              <Link
                href="/tim-kiem"
                className="inline-flex items-center gap-2 rounded-full border border-ink/20 px-7 py-3.5 text-base font-medium text-ink transition-colors hover:border-terracotta hover:text-terracotta"
              >
                Xem tất cả sản phẩm
              </Link>
            </div>
          </div>

          {collection ? (
            <Link href={`/bo-suu-tap/${collection.id}`} className="group relative block">
              <div className="relative aspect-[5/4] overflow-hidden rounded-sm">
                <Image
                  src={driveImageUrl(collection.heroImageId)}
                  alt={collection.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-ink/0 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6 sm:p-8">
                  <p className="text-xs uppercase tracking-[0.2em] text-bone/80">Bộ sưu tập</p>
                  <p className="mt-1 font-display text-2xl font-semibold text-bone sm:text-3xl">
                    {collection.title}
                  </p>
                </div>
              </div>
            </Link>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
