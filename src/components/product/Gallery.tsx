import Image from "next/image";
import { driveImageUrl } from "@/lib/image";

// Stacked editorial gallery: every shot rendered full-width down the column,
// so the product reads like a lookbook spread. No state — a Server Component
// that also works in the static export.
export function Gallery({ imageIds, alt }: { imageIds: string[]; alt: string }) {
  const images = imageIds.length > 0 ? imageIds : [""];
  return (
    <div className="space-y-2">
      {images.map((id, i) => (
        <div key={i} className="relative aspect-[4/5] overflow-hidden bg-bone">
          <Image
            src={driveImageUrl(id)}
            alt={i === 0 ? alt : ""}
            aria-hidden={i !== 0}
            fill
            sizes="(max-width: 1024px) 100vw, 60vw"
            className="object-cover"
            priority={i === 0}
          />
        </div>
      ))}
    </div>
  );
}
