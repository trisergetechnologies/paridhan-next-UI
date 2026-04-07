"use client";

import { Button } from "@/components/ui/button";
import type { HeroSlideItem } from "@/lib/heroApi";
import { cn } from "@/lib/utils";
import { Sparkles, ShieldCheck, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Props {
  slide: HeroSlideItem;
  slideIndex: number;
  totalSlides: number;
}

export default function HeroSlide({ slide, slideIndex, totalSlides }: Props) {
  const eyebrow = slide.eyebrow ?? "Paridhan";

  return (
    <div className="group relative w-full overflow-hidden">
      <div
        className={cn(
          "relative min-h-[min(88vh,820px)] h-[520px] sm:h-[600px] lg:h-[min(88vh,820px)]",
          slidesBottomPadding(totalSlides)
        )}
      >
        <Image
          src={slide.image}
          alt={slide.title}
          fill
          priority
          sizes="100vw"
          className={cn(
            "object-cover object-center transition-transform duration-[1.4s] ease-out",
            "motion-safe:scale-[1.02] motion-safe:group-hover:scale-[1.045]"
          )}
        />

        {/* Grain + layered gradients (editorial depth) */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.12] mix-blend-overlay"
          aria-hidden
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 256 256'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/88 via-black/45 to-black/10 sm:via-black/35"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/25"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_70%_20%,oklch(0.62_0.26_27_/_0.12),transparent_55%)]"
          aria-hidden
        />

        {/* Top editorial bar */}
        {/* <div className="absolute inset-x-0 top-0 z-10 border-b border-white/10 bg-black/20 backdrop-blur-sm">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
            <Link
              href="/"
              className="font-serif text-lg font-semibold tracking-tight text-white"
            >
              P.<span className="text-primary">E.</span>
            </Link>
            <span className="hidden text-[10px] font-sans uppercase tracking-[0.35em] text-white/55 sm:inline">
              Luxury ethnic wear
            </span>
            {totalSlides > 1 ? (
              <span
                className="font-sans text-xs tabular-nums text-white/70"
                aria-hidden
              >
                {String(slideIndex).padStart(2, "0")}
                <span className="mx-1 text-white/35">/</span>
                {String(totalSlides).padStart(2, "0")}
              </span>
            ) : (
              <span className="w-8" aria-hidden />
            )}
          </div>
        </div> */}

        {/* Content */}
        <div className="absolute inset-0 z-10 flex flex-col justify-end">
          <div className="mx-auto w-full max-w-7xl px-4 pb-16 pt-24 sm:px-6 sm:pb-20 lg:px-8 lg:pb-24">
            <div className="max-w-xl rounded-2xl border border-white/10 bg-black/25 p-6 shadow-2xl backdrop-blur-md sm:p-8 lg:max-w-2xl lg:rounded-3xl lg:bg-black/30">
              <div className="mb-4 flex items-center gap-3">
                <span
                  className="h-px w-10 bg-primary sm:w-14"
                  aria-hidden
                />
                <p className="font-sans text-[10px] font-medium uppercase tracking-[0.28em] text-primary sm:text-xs">
                  {eyebrow}
                </p>
              </div>

              <h1 className="font-serif text-3xl font-semibold leading-[1.12] tracking-tight text-white sm:text-4xl lg:text-5xl xl:text-[3.25rem]">
                {slide.title}
              </h1>

              <p className="mt-4 max-w-prose text-sm leading-relaxed text-white/85 sm:text-base">
                {slide.subtitle}
              </p>

              <ul
                className="mt-6 flex flex-wrap gap-x-6 gap-y-2 font-sans text-xs text-white/70 sm:text-sm"
                aria-label="Highlights"
              >
                <li className="flex items-center gap-2">
                  <Truck className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                  Pan-India delivery
                </li>
                <li className="flex items-center gap-2">
                  <ShieldCheck
                    className="h-4 w-4 shrink-0 text-primary"
                    aria-hidden
                  />
                  Secure checkout
                </li>
                <li className="flex items-center gap-2">
                  <Sparkles
                    className="h-4 w-4 shrink-0 text-primary"
                    aria-hidden
                  />
                  Curated edits
                </li>
              </ul>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button size="lg" className="font-sans" asChild>
                  <Link href={slide.href}>{slide.cta}</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/35 bg-white/5 text-white backdrop-blur-sm hover:bg-white/15 hover:text-white"
                  asChild
                >
                  <Link href="/#new-arrivals">New arrivals</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function slidesBottomPadding(totalSlides: number) {
  if (totalSlides > 1) return "pb-14 sm:pb-16";
  return "";
}
