import type { WishlistProduct } from "@/context/WishlistContext";

type SnapshotInput = {
  publicId: string;
  slug: string;
  name: string;
  price: number;
  fromPrice?: number;
  toPrice?: number;
  mrp?: number | null;
  description?: string;
  defaultVariantPublicId?: string | null;
  images?: { url?: string }[];
  variantOptions?: WishlistProduct["variantOptions"];
  categories?: { name?: string; slug?: string }[];
  isFeatured?: boolean;
};

export function toWishlistSnapshot(product: SnapshotInput): WishlistProduct {
  return {
    publicId: product.publicId,
    slug: product.slug,
    name: product.name,
    price: product.price,
    fromPrice: product.fromPrice,
    toPrice: product.toPrice,
    mrp: product.mrp ?? undefined,
    description: product.description,
    defaultVariantPublicId: product.defaultVariantPublicId ?? null,
    images: product.images ?? [],
    variantOptions: product.variantOptions,
    categories: product.categories,
    isFeatured: product.isFeatured,
  };
}
