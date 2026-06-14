import { clsx } from "@/lib/cn";

// Hairline rectangular chip — no radius, mono.
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
        "inline-flex items-center gap-1 border border-line px-3 py-1 text-[0.6875rem] uppercase tracking-[0.12em] text-ink",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function RetailerBadge({ retailer }: { retailer: string }) {
  if (!retailer) return null;
  return <Badge>{retailer}</Badge>;
}
