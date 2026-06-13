import Image from "next/image";
import Link from "next/link";
import type { Collection } from "@/types";
import { driveImageUrl } from "@/lib/image";

export function CollectionRail({ collections }: { collections: Collection[] }) {
  if (collections.length === 0) return null;
  return (
    <div className="-mx-5 overflow-x-auto no-scrollbar px-5 sm:mx-0 sm:px-0">
      <div className="flex gap-6 sm:grid sm:grid-cols-2 lg:grid-cols-3">
        {collections.map((c) => (
          <Link
            key={c.id}
            href={`/bo-suu-tap/${c.id}`}
            className="group block w-[80vw] shrink-0 sm:w-auto"
          >
            <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-cream">
              <Image
                src={driveImageUrl(c.heroImageId)}
                alt={c.title}
                fill
                sizes="(max-width: 640px) 80vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/65 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <p className="text-[0.65rem] uppercase tracking-[0.22em] text-bone/75">
                  Tuyển tập
                </p>
                <h3 className="mt-1 font-display text-2xl font-semibold leading-tight text-bone">
                  {c.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm text-bone/80">{c.subtitle}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
