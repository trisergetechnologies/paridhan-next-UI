"use client";

import { EmptyState } from "@/components/ui/EmptyState";
import {
  parseHeroSlides,
  PUBLIC_HERO_PATH,
  type HeroSlideItem,
} from "@/lib/heroApi";
import { getBrowserApiBase } from "@/lib/publicApiBase";
import { cn } from "@/lib/utils";
import axios from "axios";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, ImageIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import HeroSlide from "./HeroSlide";

export type { HeroSlideItem };

export default function HeroSlider() {
  const [index, setIndex] = useState(0);
  const [slides, setSlides] = useState<HeroSlideItem[]>([]);
  const [loadState, setLoadState] = useState<"loading" | "ready" | "error">("loading");
  const [paused, setPaused] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const loadSlides = async () => {
      const base = getBrowserApiBase();
      if (!base) {
        setSlides([]);
        setLoadState("error");
        return;
      }
      setLoadState("loading");
      try {
        const res = await axios.get(`${base}${PUBLIC_HERO_PATH}`);
        const parsed = parseHeroSlides(res.data);
        setSlides(parsed);
        setIndex(0);
        setLoadState("ready");
      } catch {
        setSlides([]);
        setLoadState("error");
      }
    };
    void loadSlides();
  }, []);

  const go = useCallback(
    (dir: -1 | 1) => {
      setIndex((prev) => {
        const len = slides.length || 1;
        return (prev + dir + len) % len;
      });
    },
    [slides.length],
  );

  useEffect(() => {
    if (!slides.length || paused) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [slides, paused]);

  if (loadState === "loading") {
    return (
      <section className="relative min-h-[min(70vh,520px)] w-full animate-pulse bg-gradient-to-b from-muted to-background" aria-hidden>
        <div className="absolute inset-0 bg-muted/50" />
      </section>
    );
  }

  if (loadState === "error" || slides.length === 0) {
    return (
      <section className="relative border-b border-border bg-gradient-to-b from-muted/40 to-background">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:py-20">
          <EmptyState
            icon={ImageIcon}
            title="Featured collections aren’t available yet"
            description={
              loadState === "error"
                ? "We couldn’t load the hero carousel. Please refresh the page, or try again in a moment."
                : "When products are marked as featured in the catalog, they will appear here automatically."
            }
          />
        </div>
      </section>
    );
  }

  const current = slides[index];

  return (
    <section
      className="relative bg-black text-white"
      aria-roledescription="carousel"
      aria-label="Featured collections"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={current.id}
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={reduceMotion ? undefined : { opacity: 1 }}
          exit={reduceMotion ? undefined : { opacity: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <HeroSlide slide={current} slideIndex={index + 1} totalSlides={slides.length} />
        </motion.div>
      </AnimatePresence>

      {slides.length > 1 ? (
        <>
          <button
            type="button"
            onClick={() => go(-1)}
            className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/15 bg-black/35 p-2.5 text-white shadow-lg backdrop-blur-md transition hover:bg-black/55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary lg:left-6"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5" strokeWidth={1.5} />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            className="absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/15 bg-black/35 p-2.5 text-white shadow-lg backdrop-blur-md transition hover:bg-black/55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary lg:right-6"
            aria-label="Next slide"
          >
            <ChevronRight className="h-5 w-5" strokeWidth={1.5} />
          </button>

          <div className="pointer-events-none absolute inset-x-0 bottom-5 z-20 flex justify-center px-4">
            <div
              className="pointer-events-auto flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-2 backdrop-blur-md"
              role="tablist"
              aria-label="Slide indicators"
            >
              {slides.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`Slide ${i + 1} of ${slides.length}`}
                  onClick={() => setIndex(i)}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-500 ease-out",
                    i === index
                      ? "w-9 bg-primary shadow-[0_0_12px_oklch(0.62_0.26_27_/_0.45)]"
                      : "w-1.5 bg-white/35 hover:bg-white/60",
                  )}
                />
              ))}
            </div>
          </div>
        </>
      ) : null}
    </section>
  );
}
