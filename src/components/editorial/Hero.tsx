import Image from "next/image";
import Link from "next/link";
import type { Collection, SiteSettings } from "@/types";
import { driveImageUrl } from "@/lib/image";
import { Container } from "@/components/ui/Container";

// Full-bleed campaign hero. Image carries the page; type is minimal and sits
// bottom-left in white over a soft gradient. The fixed header overlays the top.
export function Hero({
  settings,
  collection,
}: {
  settings: SiteSettings;
  collection?: Collection;
}) {
  const href = collection ? `/bo-suu-tap/${collection.id}` : "/tim-kiem";
  const imageId = collection?.heroImageId;

  return (
    <section className="relative h-[100svh] min-h-[560px] w-full overflow-hidden bg-ink text-paper">
      <Image
        src={driveImageUrl(imageId)}
        alt={collection?.title ?? settings.heroHeadline ?? "Tổ Ấm"}
        fill
        sizes="100vw"
        priority
        className="object-cover"
      />
      {/* Legibility gradient — heavier at the bottom where the type lives. */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-ink/25" />

      <Container width="wide" className="absolute inset-x-0 bottom-0">
        <div className="max-w-3xl pb-14 sm:pb-20">
          {settings.heroEyebrow ? (
            <p className="eyebrow mb-5 text-paper">{settings.heroEyebrow}</p>
          ) : null}
          <h1 className="font-display text-[clamp(2rem,5vw,4rem)] font-medium leading-[1.05] tracking-tight text-paper">
            {settings.heroHeadline}
          </h1>
          <Link
            href={href}
            className="group mt-8 inline-flex items-center gap-3 border-b border-paper/60 pb-1 text-xs font-medium uppercase tracking-[0.18em] text-paper transition-colors hover:border-paper"
          >
            {collection ? "Khám phá tuyển tập" : "Xem tất cả sản phẩm"}
            <span aria-hidden className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </Container>
    </section>
  );
}
