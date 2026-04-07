"use client";

import { EmptyState } from "@/components/ui/EmptyState";
import { dedupeByPublicId } from "@/lib/dedupeByPublicId";
import { getBrowserApiBase } from "@/lib/publicApiBase";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Product } from "@/types/product";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface RelatedProductsProps {
  product: Product;
}

export default function RelatedProducts({ product }: RelatedProductsProps) {
  const [relatedProducts, setRelatedProducts] = useState<
    { publicId: string; slug: string; name: string; images?: { url: string }[]; fromPrice?: number; price: number }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchRelated = async () => {
      setLoading(true);
      setError(false);
      try {
        const res = await axios.get(`${getBrowserApiBase()}/public/products?page=1&limit=8`);
        const items = dedupeByPublicId(res.data?.data?.items || []) as {
          publicId: string;
          slug: string;
          name: string;
          images?: { url: string }[];
          fromPrice?: number;
          price: number;
        }[];
        setRelatedProducts(
          items.filter((p) => String(p.publicId) !== String(product.publicId)).slice(0, 4),
        );
      } catch {
        setRelatedProducts([]);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    void fetchRelated();
  }, [product.publicId]);

  if (loading) {
    return (
      <div className="mt-16">
        <div className="mb-8 h-8 w-48 animate-pulse rounded-md bg-muted" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="aspect-[3/4] animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  if (error || relatedProducts.length === 0) {
    return (
      <div className="mt-16">
        <h2 className="mb-4 font-serif text-xl font-semibold text-foreground sm:text-2xl">You may also like</h2>
        <EmptyState
          title={error ? "Couldn’t load suggestions" : "No other products yet"}
          description={
            error
              ? "Try again later, or browse the full catalog from the shop."
              : "More listings will appear here as the catalog grows."
          }
        />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h2 className="font-serif text-xl font-semibold text-foreground sm:text-2xl">You may also like</h2>
        <Button variant="ghost" asChild>
          <Link href="/" className="text-primary hover:text-primary/80">
            View all
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {relatedProducts.map((relatedProduct) => (
          <Card key={relatedProduct.publicId} className="group overflow-hidden transition-all duration-300 hover:shadow-lg">
            <Link href={`/product/${relatedProduct.slug}`}>
              <div className="aspect-square overflow-hidden bg-muted">
                {relatedProduct.images?.[0]?.url ? (
                  <Image
                    src={relatedProduct.images[0].url}
                    alt={relatedProduct.name}
                    width={400}
                    height={400}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
                    No image
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="mb-2 line-clamp-1 font-semibold text-foreground">{relatedProduct.name}</h3>
                <p className="text-lg font-semibold text-primary">
                  ₹{Math.round(Number((relatedProduct.fromPrice ?? relatedProduct.price) || 0))}
                </p>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
