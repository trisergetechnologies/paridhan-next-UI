export type HeroSlideItem = {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  cta: string;
  href: string;
  eyebrow?: string;
};

export type PublicHeroResponse = {
  success: boolean;
  message?: string;
  data: {
    limit: number;
    totalFeatured?: number;
    slides: HeroSlideItem[];
  } | null;
};

/** Path under the resolved public API base (includes `/api/v1`). */
export const PUBLIC_HERO_PATH = "/public/hero";

function isHeroSlide(x: unknown): x is HeroSlideItem {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  return (
    typeof o.id === "string" &&
    typeof o.title === "string" &&
    typeof o.subtitle === "string" &&
    typeof o.image === "string" &&
    typeof o.cta === "string" &&
    typeof o.href === "string"
  );
}

/** Returns validated slides; empty if payload is missing or invalid. */
export function parseHeroSlides(body: unknown): HeroSlideItem[] {
  if (!body || typeof body !== "object") return [];
  const data = (body as PublicHeroResponse).data;
  if (!data || !Array.isArray(data.slides)) return [];
  return data.slides.filter(isHeroSlide);
}
