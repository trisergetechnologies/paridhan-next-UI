"use client";

import { useAuth } from "@/context/AuthContext";
import { getToken } from "@/lib/tokenHelper";
import { cn } from "@/lib/utils";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

/* ---------------- TYPES ---------------- */

type Order = {
  _id: string;
  orderNumber: string;
  createdAt: string;
  grandTotal: number;
  status?: string;
  items: {
    name: string;
    image: string;
  }[];
};

/* ---------------- COMPONENT ---------------- */

export default function OrdersPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // if (!isAuthenticated) {
    //   router.replace("/");
    //   return;
    // }

    const fetchOrders = async () => {
      try {
        const token = await getToken();
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/customer/order`,
          {
            headers: { Authorization: `Bearer ${token}` },
            params: { page: 1, limit: 10 },
          }
        );

        setOrders(res.data.data.items);
      } catch (error) {
        console.error("Fetch orders failed:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated, router]);

  if (!isAuthenticated || loading) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-8">
      <h1 className="text-2xl font-semibold">My Orders</h1>

      {orders.length === 0 ? (
        <div className="rounded-xl border bg-white p-10 text-center">
          <p className="text-muted-foreground">
            You haven’t placed any orders yet.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const preview = order.items[0];

            return (
              <button
                key={order._id}
                onClick={() => router.push(`/orders/${order._id}`)}
                className="
                  w-full
                  text-left
                  rounded-2xl
                  border
                  bg-white
                  p-4 sm:p-5
                  transition
                  hover:shadow-md
                  hover:border-primary/40
                "
              >
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-5">
                  {/* IMAGE */}
                  <div className="relative w-20 h-24 rounded-lg overflow-hidden bg-muted shrink-0">
                    <Image
                      src={preview?.image || "/placeholder.png"}
                      alt={preview?.name || "Product"}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* INFO */}
                  <div className="flex-1 space-y-1">
                    <p className="font-medium line-clamp-2">
                      {preview?.name}
                    </p>

                    <p className="text-sm text-muted-foreground">
                      Order ID: {order.orderNumber}
                    </p>

                    <p className="text-sm text-muted-foreground">
                      Ordered on{" "}
                      {new Date(order.createdAt).toLocaleDateString("en-IN")}
                    </p>
                  </div>

                  {/* STATUS + TOTAL */}
                  <div className="flex sm:flex-col sm:items-end sm:text-right justify-between gap-2">
                    <span
                      className={cn(
                        "inline-block text-xs font-medium px-3 py-1 rounded-full",
                        order.status === "DELIVERED"
                          ? "bg-green-100 text-green-700"
                          : "bg-orange-100 text-orange-700"
                      )}
                    >
                      {order.status === "DELIVERED"
                        ? "Delivered"
                        : "In Progress"}
                    </span>

                    <p className="font-semibold">
                      ₹{order.grandTotal.toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
