import Image from "next/image";
import Link from "next/link";

type BentoTile = {
  href: string;
  label: string;
  imageSrc: string;
  alt: string;
  badge?: string;
  /** Tailwind grid placement for md+ */
  gridClass: string;
  /** Min height mobile / md tweaks */
  minHeightClass: string;
};

// Remote placeholders — hosts allowed in next.config.ts (picsum.photos).
const tiles: BentoTile[] = [
  {
    href: "/shop",
    label: "Daily wear",
    imageSrc: "/images/collage01.png",
    alt: "Woman in an elegant saree, curated collection highlight",
    badge: "Featured",
    gridClass: "md:col-start-1 md:row-start-1 md:row-span-2",
    minHeightClass: "min-h-[min(52vh,380px)] md:min-h-0",
  },
  {
    href: "/shop",
    label: "Bestsellers",
    imageSrc: "/images/collage02.png",
    alt: "Festive and daily sarees from our bestseller range",
    gridClass: "md:col-start-2 md:row-start-1",
    minHeightClass: "min-h-[220px] md:min-h-0",
  },
  {
    href: "/shop",
    label: "Party Spotlight",
    imageSrc: "/images/collage03.png",
    alt: "Lightweight and everyday ethnic essentials",
    gridClass: "md:col-start-2 md:row-start-2",
    minHeightClass: "min-h-[220px] md:min-h-0",
  },
  {
    href: "/shop",
    label: "Ready to wear",
    imageSrc: "/images/collage04.png",
    alt: "Ready-to-wear saree styling inspiration",
    gridClass: "md:col-start-3 md:row-start-1 md:row-span-2",
    minHeightClass: "min-h-[min(52vh,380px)] md:min-h-0",
  },
];

function BentoCard({ tile }: { tile: BentoTile }) {
  return (
    <Link
      href={tile.href}
      className={`group relative block h-full w-full overflow-hidden rounded-2xl border border-border/60 shadow-md transition-shadow duration-300 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background md:h-full ${tile.gridClass} ${tile.minHeightClass}`}
    >
      <Image
        src={tile.imageSrc}
        alt={tile.alt}
        fill
        className="object-cover transition duration-500 ease-out group-hover:scale-105 motion-reduce:group-hover:scale-100"
        sizes="(max-width: 767px) 100vw, 33vw"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/75 via-black/35 to-transparent dark:from-black/85 dark:via-black/40"
        aria-hidden
      />
      <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
        {tile.badge ? (
          <span className="mb-2 inline-block rounded-full border border-primary/50 bg-background/20 px-2.5 py-0.5 text-xs font-medium text-primary backdrop-blur-sm">
            {tile.badge}
          </span>
        ) : null}
        <p className="font-sans text-sm font-semibold uppercase tracking-wide text-primary sm:text-base">
          {tile.label}
        </p>
      </div>
    </Link>
  );
}

export default function SareeStoreBento() {
  return (
    <section className="bg-background py-14 md:py-16">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <header className="mb-8 md:mb-10">
          <h2 className="font-serif text-3xl text-foreground sm:text-4xl">The saree store</h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
            Explore curated edits, bestsellers, and everyday essentials in one place.
          </p>
        </header>

        <div className="grid min-h-0 grid-cols-1 gap-4 md:min-h-[min(70vh,520px)] md:grid-cols-3 md:grid-rows-[1fr_1fr] md:gap-6">
          {tiles.map((tile) => (
            <BentoCard key={tile.label} tile={tile} />
          ))}
        </div>
      </div>
    </section>
  );
}
