"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

export type ProductGalleryImage = { url?: string; alt?: string };

const PLACEHOLDER = "https://picsum.photos/seed/paridhan-placeholder/800/1000";

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
    if (raw.length === 0) {
      return [{ url: PLACEHOLDER, alt: productName }];
    }
    return raw.map((i) => ({
      url: i.url!.trim(),
      alt: i.alt?.trim() || productName,
    }));
  }, [images, productName]);

  const [active, setActive] = useState(0);

  useEffect(() => {
    setActive(0);
  }, [list]);

  const idx = Math.min(active, list.length - 1);
  const current = list[idx];

  const go = useCallback(
    (delta: number) => {
      if (list.length < 2) return;
      setActive((i) => (i + delta + list.length) % list.length);
    },
    [list.length]
  );

  return (
    <div className="space-y-4">
      <div className="relative aspect-[4/5] w-full max-w-xl mx-auto lg:mx-0 rounded-xl overflow-hidden bg-muted shadow-md group/main">
        <Image
          src={current.url}
          alt={current.alt}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
        />

        {showControls && list.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous image"
              onClick={() => go(-1)}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md opacity-90 hover:opacity-100 transition-opacity"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="Next image"
              onClick={() => go(1)}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md opacity-90 hover:opacity-100 transition-opacity"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <div
              className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 px-4"
              role="tablist"
              aria-label="Image indicators"
            >
              {list.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={idx === i}
                  aria-label={`Image ${i + 1}`}
                  onClick={() => setActive(i)}
                  className={cn(
                    "h-1.5 rounded-full transition-all",
                    idx === i
                      ? "w-8 bg-primary"
                      : "w-4 bg-primary/35 hover:bg-primary/55"
                  )}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {list.length > 1 && (
        <ul
          className="flex gap-2 overflow-x-auto pb-1 snap-x snap-mandatory"
          role="tablist"
          aria-label="Product thumbnails"
        >
          {list.map((img, i) => (
            <li key={`${img.url}-${i}`} className="snap-start shrink-0">
              <button
                type="button"
                role="tab"
                aria-selected={idx === i}
                aria-label={`Thumbnail ${i + 1}`}
                onClick={() => setActive(i)}
                className={cn(
                  "relative block h-24 w-20 overflow-hidden rounded-md ring-2 ring-transparent transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  idx === i && "ring-primary shadow-md"
                )}
              >
                <Image
                  src={img.url}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
