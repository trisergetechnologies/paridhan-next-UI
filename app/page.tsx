import HeroSlider from "@/components/home/HeroSlider";
import NewArrivals from "@/components/home/NewArrivals";
import ProductList from "@/components/home/ProductList";

export default function Home() {
  return (
    <>
    <HeroSlider />

      {/* NEW ARRIVALS (HORIZONTAL) */}
      <NewArrivals />

      {/* FULL PRODUCT GRID */}
      <div className="px-4 py-16 lg:px-8">
        <ProductList />
      </div>
    </>
  );
}
