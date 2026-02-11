"use client";

import AuthModal from "@/components/auth/AuthModal";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { ChevronDown, Menu, ShoppingCart, User, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";

export default function Header() {
  const { cart } = useCart();
  const { user, isAuthenticated, logout } = useAuth();

  console.log("isAuthenticated", isAuthenticated);

  const router = useRouter();
  const pathname = usePathname();

  const cartCount =
    cart?.reduce((total, item) => total + item.quantity, 0) || 0;

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [authOpen, setAuthOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [policyOpen, setPolicyOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement | null>(null);
  const policyRef = useRef<HTMLDivElement | null>(null);

  /* ---------------- SCROLL EFFECT ---------------- */
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
    setProfileOpen(false);
    setPolicyOpen(false);
  }, [pathname]);

  /* ---------------- CLOSE DROPDOWNS ---------------- */
  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setProfileOpen(false);
      }
      if (
        policyRef.current &&
        !policyRef.current.contains(e.target as Node)
      ) {
        setPolicyOpen(false);
      }
    };

    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setProfileOpen(false);
        setPolicyOpen(false);
        setAuthOpen(false);
      }
    };

    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", esc);

    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", esc);
    };
  }, []);

  const toggleMobileMenu = useCallback(
    () => setIsMobileOpen((p) => !p),
    []
  );

  const isActive = (path: string) => pathname === path;

  /* ---------------- DROPDOWN ANIMATION ---------------- */
  const dropdownVariants: Variants = {
    hidden: { opacity: 0, y: -8, scale: 0.96 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] },
    },
    exit: { opacity: 0, y: -6, scale: 0.96, transition: { duration: 0.15 } },
  };

  return (
    <>
      {/* ================= HEADER ================= */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-xl border-b shadow-lg"
            : "bg-white/80 backdrop-blur-md border-b shadow-sm"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="relative flex items-center justify-between md:grid md:grid-cols-3">
            {/* LOGO */}
            <Link href="/" className="text-2xl font-semibold tracking-tight">
              P.<span className="text-primary">E.</span>
            </Link>

            {/* ================= DESKTOP NAV ================= */}
            <nav className="hidden md:flex justify-center gap-2">
              {[
                ["/", "Shop"],
                ["/about", "About Us"],
                ["/contact", "Contact"],
              ].map(([href, label]) => (
                <Link
                  key={href}
                  href={href}
                  className={`px-4 py-2 text-sm font-medium ${
                    isActive(href) ? "text-gray-900" : "text-gray-700"
                  }`}
                >
                  {label}
                </Link>
              ))}

              {/* POLICY */}
              <div ref={policyRef} className="relative flex items-center">
                <Link
                  href="/policy"
                  className={`px-4 py-2 text-sm font-medium ${
                    isActive("/policy") ? "text-gray-900" : "text-gray-700"
                  }`}
                >
                  Policy
                </Link>

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setPolicyOpen((p) => !p);
                  }}
                  className="p-1 rounded-md hover:bg-gray-100"
                >
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      policyOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {policyOpen && (
                    <motion.div
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="absolute top-full left-0 mt-2 w-64 rounded-2xl bg-white border shadow-xl z-50"
                    >
                      {[
                        ["Privacy Policy", "/policy/privacy-policy"],
                        ["Exchange Policy", "/policy/exchange-policy"],
                        ["Terms & Conditions", "/policy/terms-conditions"],
                        [
                          "Cancellation & Refund Policy",
                          "/policy/cancellation-refund",
                        ],
                      ].map(([label, href]) => (
                        <Link
                          key={href}
                          href={href}
                          onClick={() => setPolicyOpen(false)}
                          className="block px-5 py-3 text-sm hover:bg-black hover:text-white transition"
                        >
                          {label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </nav>

            {/* ================= ACTIONS ================= */}
            <div className="flex items-center gap-3 justify-end">
              {/* CART */}
              <Link
                href="/cart"
                className="relative p-2 rounded-full hover:bg-gray-100"
              >
                <ShoppingCart className="h-5 w-5 text-primary" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-black text-xs font-bold rounded-full h-5 px-1 flex items-center justify-center">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </Link>

              {/* PROFILE (DESKTOP) */}
              {isAuthenticated && user && (
                <div ref={profileRef} className="relative hidden md:block">
                  <button
                    onClick={() => setProfileOpen((p) => !p)}
                    className="p-2 rounded-full hover:bg-gray-100"
                  >
                    <User className="h-5 w-5 text-gray-700" />
                  </button>

                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        variants={dropdownVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="absolute right-0 mt-3 w-52 rounded-2xl bg-white border shadow-xl z-50 overflow-hidden"
                      >
                        <button
                          onClick={() => router.push("/account")}
                          className="w-full px-4 py-3 text-sm text-left hover:bg-black hover:text-white"
                        >
                          Profile
                        </button>
                        <button
                          onClick={() => router.push("/orders")}
                          className="w-full px-4 py-3 text-sm text-left hover:bg-black hover:text-white"
                        >
                          My Orders
                        </button>
                        <div className="border-t" />
                        <button
                          onClick={() => {
                            logout();
                            router.push("/");
                          }}
                          className="w-full px-4 py-3 text-sm text-left text-red-600 hover:bg-red-50"
                        >
                          Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* AUTH (DESKTOP LOGGED OUT) */}
              {!isAuthenticated && (
                <div className="hidden md:flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setAuthMode("signin");
                      setAuthOpen(true);
                    }}
                  >
                    Sign In
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      setAuthMode("signup");
                      setAuthOpen(true);
                    }}
                  >
                    Sign Up
                  </Button>
                </div>
              )}

              {/* MOBILE MENU */}
              <button
                onClick={toggleMobileMenu}
                className="md:hidden p-2 rounded-full hover:bg-gray-100"
              >
                {isMobileOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ================= MOBILE MENU ================= */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="md:hidden fixed inset-x-0 top-72px z-30 bg-white border-t shadow-xl"
          >
            <nav className="px-4 py-6 space-y-2">
              {[
                ["/", "Shop"],
                ["/about", "About Us"],
                ["/policy", "Policy"],
                ["/contact", "Contact"],
              ].map(([href, label]) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setIsMobileOpen(false)}
                  className="block px-4 py-3 rounded-lg text-sm font-medium hover:bg-gray-100"
                >
                  {label}
                </Link>
              ))}

              {isAuthenticated ? (
                <div className="pt-4 mt-4 border-t space-y-2">
                  <button
                    onClick={() => {
                      setIsMobileOpen(false);
                      router.push("/orders");
                    }}
                    className="w-full text-left px-4 py-3 rounded-lg text-sm hover:bg-gray-100"
                  >
                    My Orders
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileOpen(false);
                      router.push("/");
                    }}
                    className="w-full text-left px-4 py-3 rounded-lg text-sm text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="pt-4 mt-4 border-t space-y-2">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setAuthMode("signin");
                      setAuthOpen(true);
                      setIsMobileOpen(false);
                    }}
                  >
                    Sign In
                  </Button>
                  <Button
                    className="w-full"
                    onClick={() => {
                      setAuthMode("signup");
                      setAuthOpen(true);
                      setIsMobileOpen(false);
                    }}
                  >
                    Sign Up
                  </Button>
                </div>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= AUTH MODAL ================= */}
      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        mode={authMode}
        onModeChange={setAuthMode}
      />
    </>
  );
}
