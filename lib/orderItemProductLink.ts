export type OrderLineProductLinkInput = {
  productId?: string | null;
  productSlug?: string | null;
  productPublicId?: string | null;
  quantity?: number;
};

export function getOrderItemProductHref(
  item: OrderLineProductLinkInput
): string | null {
  if ((item.quantity ?? 0) < 1) return null;

  const segment =
    item.productSlug?.trim() ||
    item.productPublicId?.trim() ||
    (item.productId != null ? String(item.productId).trim() : "");

  return segment ? `/product/${encodeURIComponent(segment)}` : null;
}
