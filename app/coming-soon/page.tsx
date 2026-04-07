import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Coming soon | Paridhan Emporium",
  description: "Paridhan Emporium is opening soon.",
};

export default function ComingSoonPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-6 py-16 text-foreground">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(circle at 20% 30%, oklch(0.7686 0.1647 70.0804 / 0.2), transparent 45%), radial-gradient(circle at 80% 70%, oklch(0.62 0.26 27 / 0.15), transparent 40%)",
        }}
      />
      <div className="relative z-10 max-w-xl text-center">
        <p className="font-serif text-sm font-medium uppercase tracking-[0.35em] text-primary">Paridhan Emporium</p>
        <h1 className="mt-6 font-serif text-4xl font-semibold leading-tight sm:text-6xl">
          Something beautiful is on the way
        </h1>
        <p className="mt-8 text-base leading-relaxed text-muted-foreground sm:text-lg">
          We’re curating our collections and onboarding our sellers. The boutique will open here soon — thank you for
          your patience.
        </p>
        <div
          className="mx-auto mt-12 h-px max-w-xs bg-gradient-to-r from-transparent via-border to-transparent"
          aria-hidden
        />
        <p className="mt-8 text-sm text-muted-foreground">Follow us for launch updates.</p>
      </div>
    </div>
  );
}
