import { clsx } from "@/lib/cn";

export function Section({
  children,
  className,
  tone = "bone",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "bone" | "cream" | "ink";
}) {
  const bg =
    tone === "cream" ? "bg-cream" : tone === "ink" ? "bg-ink text-bone" : "bg-bone";
  return <section className={clsx("py-16 sm:py-24", bg, className)}>{children}</section>;
}

export function SectionHeader({
  eyebrow,
  title,
  intro,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={clsx("mb-10 max-w-2xl", align === "center" && "mx-auto text-center")}>
      {eyebrow ? <p className="eyebrow mb-3">{eyebrow}</p> : null}
      <h2 className="text-3xl sm:text-4xl text-ink">{title}</h2>
      {intro ? <p className="mt-4 text-charcoal/80 leading-relaxed">{intro}</p> : null}
    </div>
  );
}
