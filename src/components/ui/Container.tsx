import { clsx } from "@/lib/cn";

export function Container({
  children,
  className,
  width = "default",
}: {
  children: React.ReactNode;
  className?: string;
  width?: "default" | "wide" | "narrow";
}) {
  const max =
    width === "wide" ? "max-w-7xl" : width === "narrow" ? "max-w-3xl" : "max-w-6xl";
  return <div className={clsx("mx-auto w-full px-5 sm:px-8", max, className)}>{children}</div>;
}
