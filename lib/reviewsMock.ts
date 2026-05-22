/**
 * Home-page review testimonials (mock). Swap `getHomeReviews()` for API data when available.
 * TODO: replace with real slugs / product IDs when reviews API exists.
 */
export type Review = {
  id: string;
  quote: string;
  author: string;
  rating: number;
  date?: string;
  productName: string;
  productSlug: string;
  productImage: string;
  /** Rupees (same unit as catalog `formatInr`). */
  price: number;
};

const MOCK_REVIEWS: Review[] = [
  {
    id: "1",
    quote:
      "The drape and fabric exceeded what I expected for the price. Delivery was quick and the packaging felt premium.",
    author: "Ananya M.",
    rating: 5,
    date: "Mar 2026",
    productName: "Handloom silk saree — wine",
    productSlug: "handloom-silk-wine",
    productImage: "https://picsum.photos/seed/review-prod-a/200/200",
    price: 4299,
  },
  {
    id: "2",
    quote: "Beautiful border work and true-to-site colours. Will order again for an upcoming wedding.",
    author: "Priya S.",
    rating: 5,
    date: "Feb 2026",
    productName: "Festive zari border saree",
    productSlug: "festive-zari-border",
    productImage: "https://picsum.photos/seed/review-prod-b/200/200",
    price: 5890,
  },
  {
    id: "3",
    quote: "Lightweight and comfortable for daily wear. Customer care helped me pick the right blouse length.",
    author: "Kavita R.",
    rating: 4,
    date: "Jan 2026",
    productName: "Cotton daily wear saree",
    productSlug: "cotton-daily-wear",
    productImage: "https://picsum.photos/seed/review-prod-c/200/200",
    price: 1299,
  },
  {
    id: "4",
    quote: "Ordered for my mother—she loved the soft fabric and the fall. COD was smooth.",
    author: "Rahul V.",
    rating: 5,
    date: "Dec 2025",
    productName: "Soft linen blend saree",
    productSlug: "soft-linen-blend",
    productImage: "https://picsum.photos/seed/review-prod-d/200/200",
    price: 2499,
  },
  {
    id: "5",
    quote: "Elegant drape and the colour matched the photos. Took one star off only for slight courier delay.",
    author: "Meera K.",
    rating: 4,
    date: "Nov 2025",
    productName: "Printed chiffon saree",
    productSlug: "printed-chiffon",
    productImage: "https://picsum.photos/seed/review-prod-e/200/200",
    price: 1899,
  },
  {
    id: "6",
    quote: "First purchase from Paridhan—impressed with quality checks and the return policy clarity.",
    author: "Sneha D.",
    rating: 5,
    date: "Oct 2025",
    productName: "Embroidered party wear saree",
    productSlug: "embroidered-party-wear",
    productImage: "https://picsum.photos/seed/review-prod-f/200/200",
    price: 6599,
  },
];

export function getHomeReviews(): Review[] {
  return MOCK_REVIEWS;
}
