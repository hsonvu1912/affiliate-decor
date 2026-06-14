import Image from "next/image";
import Link from "next/link";
import type { Collection } from "@/types";
import { driveImageUrl } from "@/lib/image";

// Collections as a lookbook rail: portrait images with the label set quietly
// beneath in ink (no coloured overlays). Horizontal scroll on mobile, grid up.
export function CollectionRail({ collections }: { collections: Collection[] }) {
  if (collections.length === 0) return null;
  return (
    <div className="-mx-5 overflow-x-auto no-scrollbar px-5 sm:mx-0 sm:px-0">
      <div className="flex gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-3">
        {collections.map((c) => (
          <Link
            key={c.id}
            href={`/bo-suu-tap/${c.id}`}
            className="group block w-[78vw] shrink-0 sm:w-auto"
          >
            <div className="relative aspect-[3/4] overflow-hidden bg-bone">
              <Image
                src={driveImageUrl(c.heroImageId)}
                alt={c.title}
                fill
                sizes="(max-width: 640px) 78vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              />
            </div>
            <div className="mt-3">
              <p className="eyebrow text-mute">Tuyển tập</p>
              <h3 className="mt-1.5 font-display text-lg font-medium leading-snug text-ink transition-opacity group-hover:opacity-60">
                {c.title}
              </h3>
              {c.subtitle ? (
                <p className="mt-1 line-clamp-2 text-sm text-mute">{c.subtitle}</p>
              ) : null}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
