"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const messages = [
  "✨ Festive Sale Live – Flat 20% Off",
  "🚚 Free Shipping on Orders Above ₹999",
  "🆕 New Banarasi Collection Just Arrived",
  "🎁 Extra 5% Off on Your First Order",
];

export default function AnnouncementBar() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);

      setTimeout(() => {
        setIndex((prev) => (prev + 1) % messages.length);
        setVisible(true);
      }, 300);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-primary text-black">
      <div className="container mx-auto px-4">
        <div className="h-9 sm:h-10 flex items-center justify-center overflow-hidden">
          <span
            className={cn(
              "text-xs sm:text-sm font-medium tracking-wide transition-all duration-300",
              visible
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-2"
            )}
          >
            {messages[index]}
          </span>
        </div>
      </div>
    </div>
  );
}
