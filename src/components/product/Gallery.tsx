"use client";

import { useState } from "react";
import Image from "next/image";
import { driveImageUrl } from "@/lib/image";
import { clsx } from "@/lib/cn";

export function Gallery({ imageIds, alt }: { imageIds: string[]; alt: string }) {
  const images = imageIds.length > 0 ? imageIds : [""];
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-cream">
        <Image
          src={driveImageUrl(images[active])}
          alt={alt}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
          priority
        />
      </div>
      {images.length > 1 ? (
        <div className="mt-4 flex gap-3">
          {images.map((id, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Ảnh ${i + 1}`}
              className={clsx(
                "relative h-20 w-16 overflow-hidden rounded-sm border-2 transition-colors",
                i === active ? "border-terracotta" : "border-transparent hover:border-line",
              )}
            >
              <Image src={driveImageUrl(id)} alt="" fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
