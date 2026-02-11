import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Paridhan Emporium | Premium, Daily & Festive Ethnic Wear",
  description:
    "Shop premium, daily, and festive ethnic wear at Paridhan Emporium. Discover elegant sarees crafted for everyday comfort, celebrations, and timeless Indian style.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className}  antialiased flex flex-col min-h-screen`}
      >
        <AuthProvider>
        <CartProvider>
           
          {/* <AnnouncementBar /> */}
          <Header />
          {/* <HeroSlider /> */}
          <main className="grow">{children}</main>
          <Footer />
        </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
