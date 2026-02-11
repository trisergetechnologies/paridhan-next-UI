"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { getToken } from "@/lib/tokenHelper";
import { cn } from "@/lib/utils";
import axios from "axios";
import {
  Check,
  Eye,
  Heart,
  ShoppingCart,
  Star,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface Product {
  id: string;
  image: string;
  name: string;
  price: number;
}

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const [isLiked, setIsLiked] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsAdding(true);
    await new Promise((r) => setTimeout(r, 300));

    addToCart({
      id: product.id as any,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    });

    setIsAdding(false);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  const handleToggleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) return;

    try {
      const token = await getToken();
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/wishlist/add`,
        { productId: product.id },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setIsLiked(true);
    } catch (error) {
      console.error("Wishlist error:", error);
    }
  };

  return (
    <Card className="group relative overflow-hidden bg-card border-border transition-all duration-300 lg:hover:shadow-xl lg:hover:-translate-y-1">
      {/* WISHLIST */}
      <button
        onClick={handleToggleLike}
        className={cn(
          "absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 backdrop-blur",
          "opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition",
          isLiked && "text-red-600"
        )}
      >
        <Heart className={cn("h-4 w-4", isLiked && "fill-current")} />
      </button>

      {/* IMAGE */}
      <Link href={`/product/${product.id}`} className="block relative">
        <div className="aspect-[3/4] bg-muted overflow-hidden">
          {!imageError ? (
            <Image
              src={product.image}
              alt={product.name}
              width={400}
              height={500}
              className="w-full h-full object-cover transition-transform duration-500 lg:group-hover:scale-105"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-sm text-muted-foreground">
              Image not available
            </div>
          )}
        </div>

        {/* QUICK VIEW */}
        <div className="pointer-events-none absolute inset-0 hidden lg:flex items-center justify-center bg-black/30 opacity-0 transition-opacity duration-300 lg:group-hover:opacity-100">
          <Button size="sm" className="pointer-events-auto">
            <Eye className="h-4 w-4 mr-2" />
            Quick View
          </Button>
        </div>
      </Link>

      {/* CONTENT */}
      <CardContent className="p-4 space-y-3">
        <Link href={`/product/${product.id}`}>
          <h3 className="font-medium text-foreground line-clamp-2 hover:text-primary transition">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center justify-between">
          <div className="flex text-amber-500">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-current" />
            ))}
          </div>
          <div className="text-lg font-semibold">
            ₹{product.price.toLocaleString("en-IN")}
          </div>
        </div>

        <div className="flex gap-2">
          <Link
            href={`/product/${product.id}`}
            className="flex-1 text-sm text-center py-2 border border-primary/30 text-primary rounded-md hover:bg-primary hover:text-white transition"
          >
            Shop Now
          </Link>

          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className={cn(
              "p-2 rounded-md border transition",
              justAdded
                ? "bg-green-600 text-white"
                : "border-primary/30 text-primary hover:bg-primary hover:text-white"
            )}
          >
            {isAdding ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : justAdded ? (
              <Check className="h-4 w-4" />
            ) : (
              <ShoppingCart className="h-4 w-4" />
            )}
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
