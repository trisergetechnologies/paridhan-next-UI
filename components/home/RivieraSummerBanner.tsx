import rivieraSummerBanner from "@/public/images/riviera-summer.png";
import Image from "next/image";
import Link from "next/link";

export default function RivieraSummerBanner() {
  return (
    <section className="w-full overflow-x-hidden">
      <Link
        href="/shop"
        className="focus-visible:ring-primary focus-visible:ring-offset-background block w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        aria-label="Shop Riviera summer collection"
      >
        <div className="px-4 py-3 lg:px-0 lg:py-0">
          <div className="overflow-hidden rounded-md bg-muted lg:rounded-none lg:bg-transparent">
            <Image
              src={rivieraSummerBanner}
              alt=""
              width={1920}
              height={600}
              className="h-auto w-full max-w-full"
              sizes="(max-width: 1023px) calc(100vw - 2rem), 100vw"
              priority={false}
            />
          </div>
        </div>
      </Link>
    </section>
  );
}
