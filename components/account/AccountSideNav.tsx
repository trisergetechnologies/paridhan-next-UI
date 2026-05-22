"use client";

import { cn } from "@/lib/utils";
import { ACCOUNT_TABS, type AccountTabId } from "./types";

type Props = {
  activeTab: AccountTabId;
  onTabChange: (tab: AccountTabId) => void;
  panelId: string;
  baseId: string;
};

export function AccountSideNav({
  activeTab,
  onTabChange,
  panelId,
  baseId,
}: Props) {
  const tabListClass =
    "flex gap-2 overflow-x-auto pb-2 [-webkit-overflow-scrolling:touch] scrollbar-hide snap-x snap-mandatory md:flex-col md:overflow-visible md:pb-0 md:snap-none";

  const tabButtonClass = (isActive: boolean, isPlaceholder: boolean) =>
    cn(
      "shrink-0 snap-start rounded-xl px-4 py-2.5 text-left text-sm font-medium transition duration-200",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
      "md:w-full",
      isActive
        ? "bg-primary/10 text-primary shadow-sm ring-1 ring-primary/30"
        : "bg-card text-muted-foreground hover:bg-muted/70 hover:text-foreground border border-border/60 md:border-transparent md:bg-transparent",
      isPlaceholder && !isActive && "opacity-70"
    );

  return (
    <nav aria-label="Account sections" className="min-w-0 md:sticky md:top-24 md:self-start">
      <div role="tablist" className={tabListClass}>
        {ACCOUNT_TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const tabId = `${baseId}-tab-${tab.id}`;
          return (
            <button
              key={tab.id}
              id={tabId}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={panelId}
              onClick={() => onTabChange(tab.id)}
              className={tabButtonClass(isActive, Boolean(tab.placeholder))}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
