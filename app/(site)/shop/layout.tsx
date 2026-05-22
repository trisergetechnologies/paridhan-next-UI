import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop",
  description: "Browse the Paridhan Emporium collection — sarees and festive wear.",
};

export default function ShopLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
