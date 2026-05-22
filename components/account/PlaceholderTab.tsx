"use client";

import { EmptyState } from "@/components/ui/EmptyState";
import { HelpCircle, LifeBuoy } from "lucide-react";
import type { AccountTabId } from "./types";

type Props = {
  tab: Extract<AccountTabId, "help" | "support">;
};

const COPY: Record<Props["tab"], { title: string; description: string; icon: typeof HelpCircle }> = {
  help: {
    title: "Help is on the way",
    description:
      "FAQs and quick answers will live here soon. For now, visit Contact if you need assistance.",
    icon: HelpCircle,
  },
  support: {
    title: "Support coming soon",
    description:
      "Dedicated support options will be available here. We are building a smoother way to reach our team.",
    icon: LifeBuoy,
  },
};

export function PlaceholderTab({ tab }: Props) {
  const { title, description, icon } = COPY[tab];
  return (
    <div className="min-w-0">
      <EmptyState title={title} description={description} icon={icon} />
    </div>
  );
}
