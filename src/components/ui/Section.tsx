import { clsx } from "@/lib/cn";

export function Section({
  children,
  className,
  tone = "paper",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "paper" | "bone" | "ink";
}) {
  const bg = tone === "bone" ? "bg-bone" : tone === "ink" ? "bg-ink text-paper" : "bg-paper";
  return <section className={clsx("py-20 sm:py-28", bg, className)}>{children}</section>;
}

// Quiet editorial section heading — eyebrow + restrained title + muted intro.
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
    <div className={clsx("mb-12 max-w-2xl", align === "center" && "mx-auto text-center")}>
      {eyebrow ? <p className="eyebrow mb-4 text-mute">{eyebrow}</p> : null}
      <h2 className="font-display text-2xl font-medium leading-tight text-ink sm:text-3xl">
        {title}
      </h2>
      {intro ? <p className="mt-4 text-sm leading-relaxed text-mute">{intro}</p> : null}
    </div>
  );
}
