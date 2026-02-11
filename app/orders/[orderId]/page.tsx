"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { getToken } from "@/lib/tokenHelper";
import axios from "axios";
import {
  CheckCircle,
  Clock,
  Download,
  HelpCircle,
  RotateCcw,
} from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

/* ---------------- COMPONENT ---------------- */

export default function OrderDetailPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const { orderId } = useParams();

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // if (!isAuthenticated) {
    //   router.replace("/");
    //   return;
    // }

    const fetchOrder = async () => {
      try {
        const token = await getToken();
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/customer/order/${orderId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setOrder(res.data.data);
      } catch (error) {
        console.error("Fetch order failed:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [isAuthenticated, orderId, router]);

  if (!isAuthenticated || loading || !order) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-14">
      {/* HEADER */}
      <section className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Order #{order.orderNumber}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Placed on{" "}
            {new Date(order.createdAt).toLocaleDateString("en-IN")}
          </p>
        </div>

        <span
          className={`inline-flex px-4 py-1.5 rounded-full text-sm font-medium ${
            order.status === "DELIVERED"
              ? "bg-green-100 text-green-700"
              : "bg-orange-100 text-orange-700"
          }`}
        >
          {order.status === "DELIVERED" ? "Delivered" : "In Progress"}
        </span>
      </section>

      {/* ACTION BAR */}
      <section className="flex flex-wrap gap-3">
        <Button size="sm" className="bg-red-500 hover:bg-black">
          <Download className="h-4 w-4 mr-2" />
          Download Invoice
        </Button>

        <Button size="sm" className="bg-red-500 hover:bg-black">
          <RotateCcw className="h-4 w-4 mr-2" />
          Reorder Items
        </Button>

        <Button size="sm" variant="ghost">
          <HelpCircle className="h-4 w-4 mr-2" />
          Need Help?
        </Button>
      </section>

      {/* TIMELINE (STATIC UI) */}
      <section className="rounded-2xl border bg-white shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-6">Order Status</h2>

        <div className="space-y-6">
          {["Order Placed", "Packed", "Shipped", "Delivered"].map(
            (label, i) => {
              const completed =
                order.status === "DELIVERED" || i < 3;

              return (
                <div key={label} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    {completed ? (
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    ) : (
                      <Clock className="h-6 w-6 text-muted-foreground" />
                    )}
                    {i !== 3 && (
                      <div className="w-px flex-1 mt-2 bg-border" />
                    )}
                  </div>

                  <div className="pb-6">
                    <p className="font-medium">{label}</p>
                  </div>
                </div>
              );
            }
          )}
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="rounded-2xl border bg-white shadow-sm p-6 space-y-6">
        <h2 className="text-lg font-semibold">Ordered Items</h2>

        {order.items.map((item: any) => (
          <div key={item.productId} className="flex gap-4 items-center">
            <div className="relative w-20 h-24 rounded-lg overflow-hidden bg-muted">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover"
              />
            </div>

            <div className="flex-1">
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-muted-foreground">
                Qty: {item.quantity}
              </p>
            </div>

            <p className="font-semibold">
              ₹{item.price.toLocaleString("en-IN")}
            </p>
          </div>
        ))}
      </section>

      {/* ADDRESS */}
      <section className="rounded-2xl border bg-white shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-3">Delivery Address</h2>
        <p className="font-medium">
          {order.shippingAddress.fullName}
        </p>
        <p className="text-sm text-muted-foreground">
          {order.shippingAddress.street},{" "}
          {order.shippingAddress.city},{" "}
          {order.shippingAddress.state} -{" "}
          {order.shippingAddress.postalCode}
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          Phone: +91 {order.shippingAddress.phone}
        </p>
      </section>

      {/* PAYMENT */}
      <section className="rounded-2xl border bg-white shadow-sm p-6 space-y-3">
        <h2 className="text-lg font-semibold">Payment Summary</h2>

        <div className="flex justify-between text-sm">
          <span>Subtotal</span>
          <span>₹{order.itemsTotal}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span>Shipping</span>
          <span>₹{order.deliveryCharge}</span>
        </div>

        <div className="border-t pt-3 flex justify-between font-semibold">
          <span>Total Paid</span>
          <span>₹{order.grandTotal}</span>
        </div>

        <p className="text-sm text-muted-foreground">
          Payment Method: {order.paymentMethod}
        </p>
      </section>
    </div>
  );
}
