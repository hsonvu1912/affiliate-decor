import { clsx } from "@/lib/cn";

export function Badge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 rounded-full border border-line bg-bone/80 px-3 py-1 text-xs font-medium tracking-wide text-charcoal",
        className,
      )}
    >
      {children}
    </span>
  );
}

const RETAILER_TONE: Record<string, string> = {
  Shopee: "text-terracotta",
  Lazada: "text-sage",
  "TikTok Shop": "text-ink",
};

export function RetailerBadge({ retailer }: { retailer: string }) {
  if (!retailer) return null;
  return (
    <Badge>
      <span className={clsx("font-semibold", RETAILER_TONE[retailer] ?? "text-charcoal")}>
        {retailer}
      </span>
    </Badge>
  );
}
