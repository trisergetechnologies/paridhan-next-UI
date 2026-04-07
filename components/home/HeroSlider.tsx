"use client";

import {
  parseHeroSlides,
  PUBLIC_HERO_PATH,
  type HeroSlideItem,
} from "@/lib/heroApi";
import { cn } from "@/lib/utils";
import axios from "axios";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import HeroSlide from "./HeroSlide";

export type { HeroSlideItem };

const FALLBACK_SLIDES: HeroSlideItem[] = [
  {
    id: "fallback-1",
    eyebrow: "Festive edit",
    title: "Silk, light, and ceremony",
    subtitle:
      "Jewel tones, fluid drapes, and finishes made for photographs and memory—so the outfit feels as good as the moment.",
    image:
      "https://images.unsplash.com/photo-1595777460563-701a668526cc?auto=format&fit=crop&w=1920&q=80",
    cta: "Shop featured",
    href: "/",
  },
  {
    id: "fallback-2",
    eyebrow: "New silhouettes",
    title: "Contemporary classics",
    subtitle:
      "Tailoring meets texture—pieces that move with you from daytime gatherings to after-dark celebrations.",
    image:
      "https://images.unsplash.com/photo-1612423284934-2850a4ea6c60?auto=format&fit=crop&w=1920&q=80",
    cta: "Explore collection",
    href: "/",
  },
  {
    id: "fallback-3",
    eyebrow: "Craft & care",
    title: "Fabrics you can feel",
    subtitle:
      "Handpicked textiles and honest detail—packaging and polish that match the care inside every fold.",
    image:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1920&q=80",
    cta: "Discover more",
    href: "/",
  },
];

export default function HeroSlider() {
  const [index, setIndex] = useState(0);
  const [slides, setSlides] = useState<HeroSlideItem[]>(FALLBACK_SLIDES);
  const [paused, setPaused] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "";
    if (!base) return;

    const loadSlides = async () => {
      try {
        const res = await axios.get(`${base}${PUBLIC_HERO_PATH}`);
        const parsed = parseHeroSlides(res.data);
        if (parsed.length) {
          setSlides(parsed);
          setIndex(0);
        }
      } catch {
        setSlides(FALLBACK_SLIDES);
        setIndex(0);
      }
    };
    loadSlides();
  }, []);

  const go = useCallback(
    (dir: -1 | 1) => {
      setIndex((prev) => {
        const len = slides.length || 1;
        return (prev + dir + len) % len;
      });
    },
    [slides.length]
  );

  useEffect(() => {
    if (!slides.length || paused) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [slides, paused]);

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
          <HeroSlide
            slide={current}
            slideIndex={index + 1}
            totalSlides={slides.length}
          />
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
                      : "w-1.5 bg-white/35 hover:bg-white/60"
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
