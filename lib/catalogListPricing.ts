/**
 * Shared list-product display helpers (public catalog / new arrivals).
 * Keeps sale price, MRP, discount %, and first image URL aligned across cards.
 */

export type CatalogListProductPricingInput = {
  price: number;
  fromPrice?: number;
  toPrice?: number;
  mrp?: number | null;
  defaultVariantPublicId?: string | null;
  variantOptions?: { publicId: string; price: number }[];
};

export function formatInr(n: number) {
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
}

export function resolveListProductPricing(product: CatalogListProductPricingInput) {
  const variantOpts = product.variantOptions ?? [];
  const defaultVid =
    product.defaultVariantPublicId ?? variantOpts[0]?.publicId ?? "";
  const defaultOption =
    variantOpts.find((v) => v.publicId === defaultVid) ?? variantOpts[0];

  const salePrice = Math.round(
    Number(
      (defaultOption != null ? defaultOption.price : undefined) ??
        product.fromPrice ??
        product.price
    ) || 0
  );

  let mrpDisplay: number | null = null;
  const numMrp = product.mrp != null ? Number(product.mrp) : NaN;
  if (!Number.isNaN(numMrp) && numMrp > salePrice) {
    mrpDisplay = numMrp;
  } else {
    const maxRange = product.toPrice != null ? Number(product.toPrice) : NaN;
    if (!Number.isNaN(maxRange) && maxRange > salePrice) {
      mrpDisplay = maxRange;
    }
  }

  let discountPct: number | null = null;
  if (mrpDisplay != null && mrpDisplay > salePrice) {
    discountPct = Math.round((1 - salePrice / mrpDisplay) * 100);
    if (discountPct <= 0) discountPct = null;
  }

  return { salePrice, mrpDisplay, discountPct };
}

export function firstImageUrlFromListProduct(
  images: { url?: string }[] | undefined | null
): string | null {
  const fromList = (images ?? [])
    .map((i) => i?.url?.trim())
    .filter((u): u is string => Boolean(u));
  return fromList[0] ?? null;
}
