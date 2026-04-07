const SEP = "::v::";

/** Stable cart line id: product publicId, or product + variant when applicable */
export function cartLineId(
  productId: string,
  variantPublicId?: string | null
): string {
  const pid = String(productId);
  const vid = variantPublicId?.trim();
  return vid ? `${pid}${SEP}${vid}` : pid;
}

export function parseCartLineId(lineId: string): {
  productId: string;
  variantPublicId: string;
} {
  const idx = lineId.indexOf(SEP);
  if (idx === -1) {
    return { productId: lineId, variantPublicId: "" };
  }
  return {
    productId: lineId.slice(0, idx),
    variantPublicId: lineId.slice(idx + SEP.length),
  };
}
