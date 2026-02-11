"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Props {
  slide: {
    title: string;
    subtitle: string;
    image: string;
    cta: string;
    href: string;
  };
}

export default function HeroSlide({ slide }: Props) {
  return (
    <Link
      href={slide.href}
      className="group relative block w-full overflow-hidden"
      aria-label={slide.title}
    >
      {/* HEIGHT CONTROL */}
      <div className="relative h-[520px] sm:h-[620px] lg:h-[720px]">
        {/* IMAGE */}
        <Image
          src={slide.image}
          alt={slide.title}
          fill
          priority
          sizes="100vw"
          className="
            object-cover object-center
            transition-transform duration-[1200ms] ease-out
            group-hover:scale-[1.04]
          "
        />

        {/* GRADIENT OVERLAY (PREMIUM) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

        {/* CONTENT */}
        <div className="absolute inset-0 flex items-end">
          <div
            className="
              w-full
              max-w-7xl
              mx-auto
              px-6
              pb-14
              sm:pb-20
              lg:pb-28
            "
          >
            <div className="max-w-2xl text-white space-y-5">
              <h1
                className="
                  font-serif
                  text-3xl
                  sm:text-4xl
                  lg:text-5xl
                  leading-tight
                  tracking-tight
                "
              >
                {slide.title}
              </h1>

              <p className="text-sm sm:text-base leading-relaxed text-white/90">
                {slide.subtitle}
              </p>

              {/* CTA */}
              <div className="pt-2">
                <Button
                  size="lg"
                  className="
                    bg-primary
                    text-black
                    px-10
                    hover:bg-primary/90
                    transition
                  "
                  onClick={(e) => e.stopPropagation()}
                >
                  {slide.cta}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
