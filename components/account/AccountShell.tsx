"use client";

import { AccountSideNav } from "./AccountSideNav";
import type { AccountTabId } from "./types";
import type { ReactNode } from "react";

type Props = {
  activeTab: AccountTabId;
  onTabChange: (tab: AccountTabId) => void;
  panelId: string;
  baseId: string;
  children: ReactNode;
};

export function AccountShell({
  activeTab,
  onTabChange,
  panelId,
  baseId,
  children,
}: Props) {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-8 md:py-10">
      <div className="flex min-w-0 flex-col gap-6 md:grid md:grid-cols-[minmax(0,220px)_minmax(0,1fr)] md:gap-8 lg:grid-cols-[minmax(0,240px)_minmax(0,1fr)]">
        <AccountSideNav
          activeTab={activeTab}
          onTabChange={onTabChange}
          panelId={panelId}
          baseId={baseId}
        />
        <div className="min-w-0 max-w-full overflow-x-hidden">{children}</div>
      </div>
    </div>
  );
}
