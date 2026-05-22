import type { LucideIcon } from "lucide-react";
import {
  Banknote,
  CreditCard,
  Gem,
  Headphones,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react";

const TRUST_ITEMS: { label: string; Icon: LucideIcon }[] = [
  { label: "Free Shipping", Icon: Truck },
  { label: "Easy Returns", Icon: RotateCcw },
  { label: "Secure Checkout", Icon: ShieldCheck },
  { label: "Premium Quality", Icon: Sparkles },
  { label: "COD Available", Icon: Banknote },
  { label: "Handpicked Collection", Icon: Gem },
  { label: "24/7 Support", Icon: Headphones },
  { label: "Trusted Payments", Icon: CreditCard },
];

/** Width matches row `gap-*` so the loop seam matches spacing between items. */
function MarqueeInterItemSpacer() {
  return <div className="w-6 shrink-0 sm:w-8 lg:w-10" aria-hidden />;
}

function MarqueeItem({ label, Icon }: { label: string; Icon: LucideIcon }) {
  return (
    <div className="flex w-[7.25rem] shrink-0 flex-col items-center gap-1.5 sm:w-[8.5rem]">
      <Icon className="size-5 shrink-0 text-primary/90 sm:size-6" strokeWidth={2} aria-hidden />
      <span className="max-w-[7.25rem] text-center text-xs leading-snug text-muted-foreground sm:max-w-[8.5rem] sm:text-sm">
        {label}
      </span>
    </div>
  );
}

function MarqueeRow({ id }: { id: string }) {
  return (
    <div className="flex shrink-0 items-start gap-6 sm:gap-8 lg:gap-10">
      {TRUST_ITEMS.map(({ label, Icon }) => (
        <MarqueeItem key={`${id}-${label}`} label={label} Icon={Icon} />
      ))}
    </div>
  );
}

export default function TrustMarquee() {
  return (
    <section aria-label="Store benefits" className="mt-2 w-full overflow-x-hidden sm:mt-2.5">
      <ul className="sr-only">
        {TRUST_ITEMS.map(({ label }) => (
          <li key={label}>{label}</li>
        ))}
      </ul>

      <div className="motion-reduce:hidden border-y border-border bg-muted/30 py-3">
        <div className="overflow-hidden" aria-hidden>
          <div className="animate-trust-marquee flex w-max will-change-transform">
            <MarqueeRow id="m1" />
            <MarqueeInterItemSpacer />
            <MarqueeRow id="m2" />
            <MarqueeInterItemSpacer />
          </div>
        </div>
      </div>

      <div className="hidden motion-reduce:flex flex-wrap justify-center gap-x-6 gap-y-4 border-y border-border bg-muted/30 px-4 py-5 sm:gap-x-8 sm:gap-y-5 lg:gap-x-10">
        {TRUST_ITEMS.map(({ label, Icon }) => (
          <MarqueeItem key={`static-${label}`} label={label} Icon={Icon} />
        ))}
      </div>
    </section>
  );
}
