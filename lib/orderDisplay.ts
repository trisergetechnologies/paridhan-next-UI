/** Aligns with `Order.orderStatus` in the backend schema */

export type OrderStatusKey =
  | "placed"
  | "confirmed"
  | "packed"
  | "shipped"
  | "delivered"
  | "cancelled";

const PIPELINE: OrderStatusKey[] = [
  "placed",
  "confirmed",
  "packed",
  "shipped",
  "delivered",
];

export function normalizeOrderStatus(raw: unknown): OrderStatusKey {
  const s = String(raw ?? "placed")
    .trim()
    .toLowerCase();
  if (
    s === "placed" ||
    s === "confirmed" ||
    s === "packed" ||
    s === "shipped" ||
    s === "delivered" ||
    s === "cancelled"
  ) {
    return s;
  }
  if (String(raw).toUpperCase() === "DELIVERED") {
    return "delivered";
  }
  return "placed";
}

export function orderStatusLabel(status: OrderStatusKey): string {
  const map: Record<OrderStatusKey, string> = {
    placed: "Order placed",
    confirmed: "Confirmed",
    packed: "Packed",
    shipped: "Shipped",
    delivered: "Delivered",
    cancelled: "Cancelled",
  };
  return map[status];
}

export function orderStatusShortLabel(status: OrderStatusKey): string {
  const map: Record<OrderStatusKey, string> = {
    placed: "Placed",
    confirmed: "Confirmed",
    packed: "Packed",
    shipped: "In transit",
    delivered: "Delivered",
    cancelled: "Cancelled",
  };
  return map[status];
}

/** Tailwind classes for badge */
export function orderStatusBadgeClass(status: OrderStatusKey): string {
  switch (status) {
    case "delivered":
      return "bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border-emerald-500/25";
    case "shipped":
      return "bg-sky-500/15 text-sky-800 dark:text-sky-300 border-sky-500/25";
    case "packed":
      return "bg-violet-500/15 text-violet-800 dark:text-violet-300 border-violet-500/25";
    case "confirmed":
      return "bg-primary/12 text-primary border-primary/25";
    case "cancelled":
      return "bg-destructive/10 text-destructive border-destructive/25";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
}

export function orderPipelineIndex(status: OrderStatusKey): number {
  if (status === "cancelled") return -1;
  const i = PIPELINE.indexOf(status);
  return i === -1 ? 0 : i;
}

export const ORDER_PIPELINE_LABELS = [
  "Placed",
  "Confirmed",
  "Packed",
  "Shipped",
  "Delivered",
] as const;

/** Detail page vertical timeline */
export const ORDER_TIMELINE_STEPS: { key: OrderStatusKey; label: string }[] = [
  { key: "placed", label: "Order placed" },
  { key: "confirmed", label: "Order confirmed" },
  { key: "packed", label: "Packed & ready" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
];

export function paymentMethodLabel(method: string | undefined): string {
  const m = String(method || "").toLowerCase();
  if (m === "cod") return "Cash on delivery";
  if (m === "online") return "Paid online";
  return method || "—";
}
