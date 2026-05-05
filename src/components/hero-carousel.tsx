"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

export type HeroSlideDTO = {
  id: string;
  title: string;
  subtitle: string | null;
  imageUrl: string;
  ctaText: string | null;
  ctaHref: string | null;
};

export function HeroCarousel({ slides }: { slides: HeroSlideDTO[] }) {
  const safeSlides = useMemo(() => slides.filter((s) => Boolean(s.imageUrl)), [slides]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (safeSlides.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % safeSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [safeSlides.length]);

  if (safeSlides.length === 0) return null;

  const activeSlide = safeSlides[index];

  return (
    <div className="absolute inset-0">
      {safeSlides.map((slide, i) => (
        <div
          key={slide.id}
          className={[
            "absolute inset-0 transition-opacity duration-1000",
            i === index ? "opacity-45" : "opacity-0",
          ].join(" ")}
        >
          <Image
            src={slide.imageUrl}
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
            priority={i === 0}
          />
        </div>
      ))}

      <div className="absolute inset-0 bg-gradient-to-r from-bg/95 via-bg/78 to-bg/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/55 to-transparent" />

      <div className="absolute bottom-6 left-0 right-0 mx-auto hidden max-w-6xl items-end justify-between gap-6 px-4 sm:flex sm:px-6">
        <div className="flex items-center gap-2">
          {safeSlides.map((slide, i) => (
            <button
              key={slide.id}
              type="button"
              aria-label={`Show slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className={[
                "h-1.5 rounded-full transition-all",
                i === index ? "w-10 bg-gold" : "w-4 bg-cream/35 hover:bg-cream/60",
              ].join(" ")}
            />
          ))}
        </div>
        <div className="max-w-xl text-right">
          <p className="font-display text-2xl text-cream">{activeSlide?.title}</p>
          {activeSlide?.subtitle && <p className="mt-2 text-sm text-muted">{activeSlide.subtitle}</p>}
          {activeSlide?.ctaText && activeSlide?.ctaHref && (
            <Link href={activeSlide.ctaHref} className="mt-4 inline-flex text-sm font-medium text-gold hover:text-cream">
              {activeSlide.ctaText}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
