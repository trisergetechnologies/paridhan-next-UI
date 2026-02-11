"use client";

import ProductNotFound from "@/components/product/ProductNotFound";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/utils";
import axios from "axios";
import { Check, Minus, Plus, ShoppingCart, Star } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Product() {
  const { productId } = useParams();
  const router = useRouter();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/public/products/single/${productId}`)
      .then((res) => setProduct(res.data.data))
      .catch(() => setProduct(null));
  }, [productId]);

  if (!product) return <ProductNotFound />;

  const handleAddToCart = async () => {
    setIsAdding(true);

    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product._id,
        name: product.name,
        price: product.price,
        image: product.images?.[0]?.url || "",
        quantity: 1,
      });
    }

    setIsAdding(false);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-2 gap-12">
        <Image
          src={product.images?.[0]?.url}
          alt={product.name}
          width={600}
          height={600}
          className="rounded-xl"
        />

        <div className="space-y-6">
          <h1 className="text-4xl font-semibold">{product.name}</h1>

          <div className="flex text-primary">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-current" />
            ))}
          </div>

          <div className="text-3xl font-bold">₹{product.price}</div>

          <div className="flex items-center gap-4">
            <Button onClick={() => setQuantity(Math.max(1, quantity - 1))}>
              <Minus />
            </Button>
            {quantity}
            <Button onClick={() => setQuantity(quantity + 1)}>
              <Plus />
            </Button>
          </div>

          <Button
            size="lg"
            className={cn(justAdded && "bg-green-600")}
            onClick={handleAddToCart}
          >
            {justAdded ? (
              <>
                <Check className="mr-2" /> Added
              </>
            ) : (
              <>
                <ShoppingCart className="mr-2" /> Add to Cart
              </>
            )}
          </Button>

          <Button variant="outline" onClick={() => router.push("/cart")}>
            Buy Now
          </Button>
        </div>
      </div>
    </div>
  );
}
