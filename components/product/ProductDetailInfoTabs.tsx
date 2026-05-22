"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useId, useState } from "react";

type TabId = "details" | "fabric" | "shipping" | "returns" | "seller";

const TAB_DEFS: { id: TabId; label: string }[] = [
  { id: "details", label: "Product Details" },
  { id: "fabric", label: "Fabric & Care" },
  { id: "shipping", label: "Shipping" },
  { id: "returns", label: "Returns" },
  { id: "seller", label: "Seller Info" },
];

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

const TAB_CONTENT: Record<TabId, { rows: { term: string; desc: string }[] }> = {
  details: {
    rows: [
      { term: "Saree length", desc: "5.5 meters" },
      { term: "Blouse piece", desc: "Included" },
      { term: "Border type", desc: "Zari embroidered" },
      { term: "Occasion", desc: "Festive / wedding wear" },
      { term: "Pattern", desc: "Woven design" },
      { term: "Fit", desc: "Ready to drape" },
    ],
  },
  fabric: {
    rows: [
      { term: "Fabric", desc: "Premium silk blend" },
      { term: "Texture", desc: "Soft finish" },
      { term: "Wash care", desc: "Dry clean only" },
      { term: "Ironing", desc: "Low heat recommended" },
      { term: "Storage", desc: "Fold in muslin cloth" },
    ],
  },
  shipping: {
    rows: [
      { term: "Dispatch", desc: "Within 24–48 hours" },
      { term: "Estimated delivery", desc: "3–7 business days" },
      { term: "Prepaid orders", desc: "Free shipping" },
      { term: "COD", desc: "Available" },
    ],
  },
  returns: {
    rows: [
      { term: "Returns", desc: "7-day easy return" },
      { term: "Exchange", desc: "Available for damaged or incorrect items" },
      { term: "Refund", desc: "Processed within 5–7 working days" },
    ],
  },
  seller: {
    rows: [
      { term: "Sold by", desc: "Paridhan Emporium" },
      { term: "Assurance", desc: "Quality checked" },
      { term: "Trust", desc: "Trusted seller" },
      { term: "Packaging", desc: "Secure packaging" },
    ],
  },
};

export default function ProductDetailInfoTabs() {
  const baseId = useId();
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState<TabId>("details");

  const panelId = `${baseId}-panel`;
  const rows = TAB_CONTENT[active].rows;

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
      </div>
    </div>
  );
}
