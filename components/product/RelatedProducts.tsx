"use client";

import { dedupeByPublicId } from "@/lib/dedupeByPublicId";
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
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/public/products?page=1&limit=8`
        );
        const items = dedupeByPublicId(res.data?.data?.items || []);
        setRelatedProducts(
          items.filter((p: any) => String(p.publicId) !== String(product.publicId)).slice(0, 4)
        );
      } catch (error) {
        console.error("Failed to fetch related products", error);
        setRelatedProducts([]);
      }
    };

    fetchRelated();
  }, [product.publicId]);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-semibold text-foreground">
          You May Also Like
        </h2>
        <Button variant="ghost" asChild>
          <Link href="/" className="text-primary hover:text-primary/80">
            View All
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedProducts.map((relatedProduct) => (
            <Card
              key={relatedProduct.publicId}
              className="group overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              <Link href={`/product/${relatedProduct.slug}`}>
                <div className="aspect-square overflow-hidden bg-muted">
                  {relatedProduct.images?.[0]?.url ? (
                    <Image
                      src={relatedProduct.images[0].url}
                      alt={relatedProduct.name}
                      width={400}
                      height={400}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-sm text-muted-foreground">
                      Image not available
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-foreground line-clamp-1 mb-2">
                    {relatedProduct.name}
                  </h3>
                  <p className="text-lg font-semibold text-primary">
                    ₹
                    {Math.round(
                      Number(
                        (relatedProduct.fromPrice ?? relatedProduct.price) || 0
                      )
                    )}
                  </p>
                </CardContent>
              </Link>
            </Card>
          ))}
      </div>
    </div>
  );
}
