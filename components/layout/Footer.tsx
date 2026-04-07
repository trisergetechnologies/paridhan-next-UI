"use client";

import {
  ArrowRight,
  Facebook,
  Heart,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Twitter,
} from "lucide-react";
import { getBrowserApiBase } from "@/lib/publicApiBase";
import axios from "axios";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";

type CategoryItem = { _id: string; name: string; slug: string };

export default function Footer() {
  const [email, setEmail] = useState("");
  const [categories, setCategories] = useState<CategoryItem[]>([]);

  useEffect(() => {
    const base = getBrowserApiBase();
    if (!base) return;
    axios
      .get(`${base}/public/categories`)
      .then((res) => {
        const items = res.data?.data?.items;
        if (Array.isArray(items)) setCategories(items);
      })
      .catch(() => setCategories([]));
  }, []);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setEmail("");
    }
  };

  const contactLines = useMemo(() => {
    const addr = process.env.NEXT_PUBLIC_CONTACT_ADDRESS?.split("|").map((s) => s.trim()).filter(Boolean) ?? [];
    const phone = process.env.NEXT_PUBLIC_CONTACT_PHONE?.trim();
    const mail = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim();
    return { addr, phone, mail };
  }, []);

  const socialLinks = [
    { href: process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK || "#", icon: Facebook, label: "Facebook" },
    { href: process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM || "#", icon: Instagram, label: "Instagram" },
    { href: process.env.NEXT_PUBLIC_SOCIAL_TWITTER || "#", icon: Twitter, label: "Twitter" },
  ];

  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-border py-14">
          <div className="mx-auto max-w-2xl text-center">
            <h3 className="mb-3 text-2xl font-semibold text-foreground">Stay in the loop</h3>
            <p className="mb-6 text-muted-foreground">
              News and launches from Paridhan Emporium. Leave your email if you&apos;d like to hear from us.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="mx-auto flex max-w-md gap-2">
              <Input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" aria-label="Subscribe">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>

        <div className="py-14">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-6">
            <div className="lg:col-span-2">
              <Link
                href="/"
                aria-label="Paridhan Emporium Home"
                className="font-serif text-2xl font-semibold tracking-tight text-foreground transition hover:opacity-80"
              >
                Paridhan<span className="text-primary">Emporium</span>
              </Link>

              <p className="mb-6 mt-4 max-w-sm leading-relaxed text-muted-foreground">
                Premium and everyday ethnic wear, curated for you.
              </p>

              <div className="space-y-3 text-sm text-muted-foreground">
                {contactLines.addr.length > 0 ? (
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>
                      {contactLines.addr.map((line) => (
                        <span key={line} className="block">
                          {line}
                        </span>
                      ))}
                    </span>
                  </div>
                ) : null}
                {contactLines.phone ? (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 shrink-0 text-primary" />
                    <a href={`tel:${contactLines.phone.replace(/\s/g, "")}`} className="hover:text-foreground">
                      {contactLines.phone}
                    </a>
                  </div>
                ) : null}
                {contactLines.mail ? (
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 shrink-0 text-primary" />
                    <a href={`mailto:${contactLines.mail}`} className="hover:text-foreground">
                      {contactLines.mail}
                    </a>
                  </div>
                ) : null}
                {!contactLines.addr.length && !contactLines.phone && !contactLines.mail ? (
                  <p className="text-sm text-muted-foreground">Contact details can be configured for your deployment.</p>
                ) : null}
              </div>

              <div className="mt-6 flex gap-3">
                {socialLinks.map(({ href, icon: Icon, label }) => (
                  <Button
                    key={label}
                    variant="ghost"
                    size="icon"
                    asChild
                    className="h-10 w-10 rounded-full bg-muted transition hover:bg-primary hover:text-primary-foreground"
                  >
                    <Link href={href || "#"} aria-label={label}>
                      <Icon className="h-4 w-4" />
                    </Link>
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">Shop</h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/" className="text-sm text-muted-foreground transition hover:text-foreground">
                    All products
                  </Link>
                </li>
                {categories.map((c) => (
                  <li key={c._id}>
                    <Link
                      href={`/?category=${c._id}`}
                      className="text-sm text-muted-foreground transition hover:text-foreground"
                    >
                      {c.name}
                    </Link>
                  </li>
                ))}
                {categories.length === 0 ? (
                  <li className="text-sm text-muted-foreground">Categories appear when added in the admin catalog.</li>
                ) : null}
              </ul>
            </div>

            <div>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">Customer care</h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/contact" className="text-sm text-muted-foreground transition hover:text-foreground">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/policy" className="text-sm text-muted-foreground transition hover:text-foreground">
                    Policies
                  </Link>
                </li>
                <li>
                  <Link
                    href="/policy/exchange-policy"
                    className="text-sm text-muted-foreground transition hover:text-foreground"
                  >
                    Exchange policy
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">Company</h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/about" className="text-sm text-muted-foreground transition hover:text-foreground">
                    About
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">Legal</h4>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/policy/privacy-policy"
                    className="text-sm text-muted-foreground transition hover:text-foreground"
                  >
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/policy/terms-conditions"
                    className="text-sm text-muted-foreground transition hover:text-foreground"
                  >
                    Terms
                  </Link>
                </li>
                <li>
                  <Link
                    href="/policy/cancellation-refund"
                    className="text-sm text-muted-foreground transition hover:text-foreground"
                  >
                    Refunds
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col items-center justify-between gap-4 py-6 text-sm text-muted-foreground md:flex-row">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} Paridhan Emporium.</span>
            <span className="flex items-center gap-1">
              Crafted with <Heart className="h-4 w-4 fill-current text-red-500" /> in India.
            </span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/policy/privacy-policy" className="hover:text-foreground">
              Privacy
            </Link>
            <Link href="/policy/terms-conditions" className="hover:text-foreground">
              Terms
            </Link>
            <Link href="/policy/cancellation-refund" className="hover:text-foreground">
              Refunds
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
