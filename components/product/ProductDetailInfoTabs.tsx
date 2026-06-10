"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useId, useMemo, useState } from "react";

type TabId = "details" | "fabric" | "shipping" | "returns" | "seller";

const TAB_DEFS: { id: TabId; label: string }[] = [
  { id: "details", label: "Product Details" },
  { id: "fabric", label: "Fabric & Care" },
  { id: "shipping", label: "Shipping" },
  { id: "returns", label: "Returns" },
  { id: "seller", label: "Seller Info" },
];

export type ProductDetailTabProps = {
  fabric?: string | null;
  color?: string | null;
  blouseIncluded?: boolean;
  length?: string | null;
  categoryName?: string | null;
  sellerName?: string | null;
};

function SpecList({ rows }: { rows: { term: string; desc: string }[] }) {
  return (
    <dl className="min-w-0 max-w-full divide-y divide-border/50">
      {rows.map(({ term, desc }, index) => (
        <div
          key={`${term}-${index}`}
          className="grid min-w-0 max-w-full grid-cols-1 gap-1 py-3 first:pt-0 last:pb-0 sm:grid-cols-[minmax(0,11rem)_minmax(0,1fr)] sm:gap-4"
        >
          <dt className="min-w-0 break-words text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {term}
          </dt>
          <dd className="min-w-0 max-w-full break-words text-sm leading-relaxed text-foreground/90 [overflow-wrap:anywhere]">
            {desc}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function buildTabContent(props: ProductDetailTabProps): Record<TabId, { rows: { term: string; desc: string }[] }> {
  const fabric = props.fabric?.trim() || "Premium saree fabric";
  const color = props.color?.trim() || "As shown in images";
  const length = props.length?.trim() || "5.5 meters";
  const blouse = props.blouseIncluded === false ? "Not included" : "Included (unstitched)";
  const occasion = props.categoryName?.trim() || "Festive / wedding wear";

  return {
    details: {
      rows: [
        { term: "Saree length", desc: length },
        { term: "Blouse piece", desc: blouse },
        { term: "Colour", desc: color },
        { term: "Occasion", desc: occasion },
        { term: "Pattern", desc: "Woven / printed design" },
        { term: "Fit", desc: "Ready to drape" },
      ],
    },
    fabric: {
      rows: [
        { term: "Fabric", desc: fabric },
        { term: "Texture", desc: "Soft, premium finish" },
        { term: "Wash care", desc: "Dry clean recommended for silk and zari" },
        { term: "Ironing", desc: "Low heat on reverse; avoid direct heat on embellishments" },
        { term: "Storage", desc: "Fold in muslin cloth; store in a cool, dry place" },
      ],
    },
    shipping: {
      rows: [
        { term: "Dispatch", desc: "Within 24–48 hours after order confirmation" },
        { term: "Estimated delivery", desc: "3–7 business days across India" },
        { term: "Prepaid orders", desc: "Free shipping on orders above ₹999" },
        { term: "Payment", desc: "Prepaid only — UPI, cards & net banking via Cashfree" },
      ],
    },
    returns: {
      rows: [
        { term: "Returns", desc: "7-day easy return for unused sarees with tags" },
        { term: "Exchange", desc: "Size/colour exchange for damaged or wrong items" },
        { term: "Refund", desc: "To original payment method within 5–7 working days" },
        {
          term: "Policy",
          desc: "See our Return, Exchange, and Cancellation policies for full details",
        },
      ],
    },
    seller: {
      rows: [
        { term: "Sold by", desc: props.sellerName?.trim() || "Paridhan Emporium seller" },
        { term: "Assurance", desc: "Quality checked before dispatch" },
        { term: "Trust", desc: "Verified seller on Paridhan Emporium" },
        { term: "Packaging", desc: "Secure packaging with tissue & box" },
      ],
    },
  };
}

export default function ProductDetailInfoTabs(props: ProductDetailTabProps) {
  const baseId = useId();
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState<TabId>("details");

  const tabContent = useMemo(() => buildTabContent(props), [props]);
  const panelId = `${baseId}-panel`;
  const rows = tabContent[active].rows;

  return (
    <div className="w-full min-w-0 max-w-full overflow-x-hidden pt-2">
      <div
        role="tablist"
        aria-label="Product information"
        className="flex min-w-0 max-w-full gap-2 overflow-x-auto pb-2 [-webkit-overflow-scrolling:touch] scrollbar-hide sm:flex-wrap sm:overflow-visible"
      >
        {TAB_DEFS.map((tab) => {
          const isActive = active === tab.id;
          const tabId = `${baseId}-tab-${tab.id}`;
          return (
            <button
              key={tab.id}
              id={tabId}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={panelId}
              onClick={() => setActive(tab.id)}
              className={cn(
                "shrink-0 snap-start rounded-full px-4 py-2 text-sm font-medium transition duration-200",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                isActive
                  ? "bg-primary/10 text-primary shadow-sm ring-1 ring-primary/30"
                  : "bg-muted/40 text-muted-foreground hover:bg-muted/70 hover:text-foreground"
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div
        id={panelId}
        role="tabpanel"
        aria-labelledby={`${baseId}-tab-${active}`}
        className="min-w-0 max-w-full overflow-x-hidden rounded-2xl border border-border/60 bg-card p-4 shadow-sm sm:p-5 md:p-6"
      >
        {reduceMotion ? (
          <SpecList rows={rows} />
        ) : (
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={active}
              className="min-w-0 max-w-full"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            >
              <SpecList rows={rows} />
            </motion.div>
          </AnimatePresence>
        )}

        {active === "returns" ? (
          <div className="mt-4 flex flex-wrap gap-3 border-t border-border/50 pt-4 text-sm">
            <Link href="/policy/return-policy" className="font-medium text-primary hover:underline">
              Return policy
            </Link>
            <Link href="/policy/exchange-policy" className="font-medium text-primary hover:underline">
              Exchange policy
            </Link>
            <Link href="/policy/cancellation-refund" className="font-medium text-primary hover:underline">
              Cancellation & refund
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  );
}
