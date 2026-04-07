import HeroSlider from "@/components/home/HeroSlider";
import NewArrivals from "@/components/home/NewArrivals";
import ProductList from "@/components/home/ProductList";
import { Suspense } from "react";

function ProductListFallback() {
  return (
    <div className="mx-auto flex max-w-7xl justify-center py-16">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" aria-hidden />
    </div>
  );
}

export default function Home() {
  return (
    <>
      <HeroSlider />
      <NewArrivals />
      <div className="px-4 py-16 lg:px-8">
        <Suspense fallback={<ProductListFallback />}>
          <ProductList />
        </Suspense>
      </div>
    </>
  );
}
