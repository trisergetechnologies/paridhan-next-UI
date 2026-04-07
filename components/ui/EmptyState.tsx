import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { PackageOpen } from "lucide-react";
import type { ReactNode } from "react";

type Props = {
  title: string;
  description?: string;
  icon?: LucideIcon;
  className?: string;
  children?: ReactNode;
};

export function EmptyState({ title, description, icon: Icon = PackageOpen, className, children }: Props) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 bg-muted/25 px-6 py-12 text-center sm:py-16",
        className,
      )}
    >
      <Icon className="mb-4 h-11 w-11 text-muted-foreground/70" strokeWidth={1.2} aria-hidden />
      <h3 className="font-serif text-lg font-semibold tracking-tight text-foreground sm:text-xl">{title}</h3>
      {description ? (
        <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">{description}</p>
      ) : null}
      {children ? <div className="mt-6">{children}</div> : null}
    </div>
  );
}
