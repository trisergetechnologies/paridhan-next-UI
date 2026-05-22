/**
 * Editorial grid (md:2 / lg:3): premium testimonial cards; no carousel — server-friendly layout.
 */
import { Card, CardContent } from "@/components/ui/card";
import { formatInr } from "@/lib/catalogListPricing";
import { getHomeReviews } from "@/lib/reviewsMock";
import { cn } from "@/lib/utils";
import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

function StarRating({ rating }: { rating: number }) {
  const clamped = Math.max(0, Math.min(5, Math.round(rating)));
  return (
    <div className="flex gap-0.5" role="img" aria-label={`${clamped} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={cn(
            "size-4 shrink-0",
            i <= clamped ? "fill-primary text-primary" : "fill-transparent text-primary/35"
          )}
          strokeWidth={1.5}
          aria-hidden
        />
      ))}
    </div>
  );
}

export default function CustomerReviews() {
  const reviews = getHomeReviews();

  return (
    <section
      aria-labelledby="customer-reviews-heading"
      className="border-t border-border bg-muted/30 py-16 md:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <header className="mb-8 md:mb-10">
          <h2 id="customer-reviews-heading" className="font-serif text-3xl text-foreground sm:text-4xl">
            What shoppers say
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
            Real feedback from customers on pieces they loved—fabric, fit, and service.
          </p>
        </header>

        <div className="grid auto-rows-fr gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <Card
              key={review.id}
              className="flex h-full min-h-[280px] flex-col rounded-2xl border-border/60 bg-card text-card-foreground shadow-md transition-shadow duration-300 hover:shadow-lg"
            >
              <CardContent className="flex flex-1 flex-col gap-4 p-5 sm:p-6">
                <p className="text-primary/35 font-serif text-3xl leading-none" aria-hidden>
                  &ldquo;
                </p>
                <blockquote className="line-clamp-4 text-sm leading-relaxed text-foreground sm:text-base">
                  {review.quote}
                </blockquote>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium text-foreground">{review.author}</span>
                  <span className="rounded-full border border-primary/30 px-2 py-0.5 text-xs font-medium text-primary">
                    Verified buyer
                  </span>
                </div>
                {review.date ? (
                  <p className="text-xs text-muted-foreground">{review.date}</p>
                ) : null}

                <StarRating rating={review.rating} />

                <div className="mt-auto border-t border-border pt-4">
                  <Link
                    href={`/product/${review.productSlug}`}
                    aria-label={`View product: ${review.productName}`}
                    className="group/prod -m-1 flex gap-3 rounded-lg p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
                  >
                    <div className="relative size-14 shrink-0 overflow-hidden rounded-md border border-border/60 bg-muted">
                      <Image
                        src={review.productImage}
                        alt={`${review.productName} thumbnail`}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-sm font-medium text-foreground group-hover/prod:text-primary">
                        {review.productName}
                      </p>
                      <p className="mt-0.5 text-sm font-semibold text-primary">{formatInr(review.price)}</p>
                    </div>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
