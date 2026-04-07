"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ImageOff } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

export type ProductGalleryImage = { url?: string; alt?: string };

export default function ProductImageGallery({
  images,
  productName,
  showControls = true,
}: {
  images?: ProductGalleryImage[] | null;
  productName: string;
  showControls?: boolean;
}) {
  const list = useMemo(() => {
    const raw = (images || []).filter((i) => i?.url?.trim());
    return raw.map((i) => ({
      url: i.url!.trim(),
      alt: i.alt?.trim() || productName,
    }));
  }, [images, productName]);

  const [active, setActive] = useState(0);

  useEffect(() => {
    setActive(0);
  }, [list]);

  const idx = list.length ? Math.min(active, list.length - 1) : 0;
  const current = list[idx];

  const go = useCallback(
    (delta: number) => {
      if (list.length < 2) return;
      setActive((i) => (i + delta + list.length) % list.length);
    },
    [list.length],
  );

  if (list.length === 0) {
    return (
      <div className="space-y-4">
        <div
          className="relative aspect-[3/4] w-full overflow-hidden rounded border border-border bg-muted"
          aria-label="No product image"
        >
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 px-6 text-center text-muted-foreground">
            <ImageOff className="h-14 w-14 opacity-50" strokeWidth={1.2} aria-hidden />
            <p className="text-sm">No image provided for this product</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded border border-border bg-muted">
        <Image
          src={current.url}
          alt={current.alt}
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 50vw, 100vw"
          priority
        />

        {showControls && list.length > 1 ? (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/20 bg-black/20 p-2 text-white backdrop-blur-md transition hover:bg-black/40"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/20 bg-black/20 p-2 text-white backdrop-blur-md transition hover:bg-black/40"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        ) : null}
      </div>

      {list.length > 1 ? (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {list.map((img, i) => (
            <button
              key={`${img.url}-${i}`}
              type="button"
              onClick={() => setActive(i)}
              className={cn(
                "relative h-20 w-16 shrink-0 overflow-hidden rounded border-2 transition",
                i === idx ? "border-primary ring-2 ring-primary/20" : "border-transparent opacity-70 hover:opacity-100",
              )}
            >
              <Image src={img.url} alt="" fill className="object-cover" sizes="64px" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
