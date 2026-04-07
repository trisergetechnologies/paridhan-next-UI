import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { ToastProvider } from "@/context/ToastContext";
import { WishlistProvider } from "@/context/WishlistContext";
import type { Metadata } from "next";
import { Cormorant_Garamond, Montserrat } from "next/font/google";
import "./globals.css";

/** Body / UI: luxury sans (reference: Montserrat) */
const fontSans = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

/** Display / headings: luxury serif (reference: Cormorant Garamond) */
const fontSerif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-display",
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
    <html lang="en" className={`${fontSans.variable} ${fontSerif.variable}`}>
      <body
        className={`${fontSans.className} antialiased flex flex-col min-h-screen`}
      >
        <ToastProvider>
          <AuthProvider>
            <WishlistProvider>
              <CartProvider>
                <Header />
                <main className="grow">{children}</main>
                <Footer />
              </CartProvider>
            </WishlistProvider>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
