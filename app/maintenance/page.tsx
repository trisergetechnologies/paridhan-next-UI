import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "We’ll be right back | Paridhan Emporium",
  description: "Paridhan Emporium is temporarily under maintenance.",
};

export default function MaintenancePage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-6 py-16 text-foreground">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -20%, oklch(0.62 0.26 27 / 0.25), transparent), radial-gradient(ellipse 60% 40% at 100% 100%, oklch(0.4732 0.1247 46.2007 / 0.12), transparent)",
        }}
      />
      <div className="relative z-10 max-w-lg text-center">
        <p className="font-serif text-sm font-medium uppercase tracking-[0.35em] text-primary">Paridhan Emporium</p>
        <h1 className="mt-6 font-serif text-4xl font-semibold leading-tight sm:text-5xl">
          We’re polishing the details
        </h1>
        <p className="mt-6 text-base leading-relaxed text-muted-foreground sm:text-lg">
          Our store is temporarily paused for maintenance. Please check back soon — we’re making your shopping
          experience even better.
        </p>
        <div className="mt-10 flex justify-center gap-2">
          <span className="size-2 animate-pulse rounded-full bg-primary/80" />
          <span className="size-2 animate-pulse rounded-full bg-primary/60 [animation-delay:150ms]" />
          <span className="size-2 animate-pulse rounded-full bg-primary/40 [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  );
}
