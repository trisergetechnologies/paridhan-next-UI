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
import Link from "next/link";
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      console.log("Newsletter subscription:", email);
      setEmail("");
    }
  };

  const footerSections = [
    {
      title: "Shop",
      links: [
        { href: "/sarees", label: "Sarees" },
        { href: "/daily-wear", label: "Daily Wear" },
        { href: "/festive", label: "Festive Collection" },
        { href: "/new-arrivals", label: "New Arrivals" },
      ],
    },
    {
      title: "Customer Care",
      links: [
        { href: "/contact", label: "Contact Us" },
        { href: "/shipping-policy", label: "Shipping Information" },
        { href: "/returns", label: "Returns & Exchanges" },
        { href: "/faq", label: "FAQs" },
      ],
    },
    {
      title: "Company",
      links: [
        { href: "/about", label: "About Paridhan" },
        { href: "/our-story", label: "Our Story" },
      ],
    },
    {
      title: "Legal",
      links: [
        { href: "/privacy-policy", label: "Privacy Policy" },
        { href: "/terms", label: "Terms & Conditions" },
        { href: "/refund-policy", label: "Refund Policy" },
      ],
    },
  ];

  const socialLinks = [
    { href: "#", icon: Facebook, label: "Facebook" },
    { href: "#", icon: Instagram, label: "Instagram" },
    { href: "#", icon: Twitter, label: "Twitter" },
  ];

  return (
    <footer className="bg-background border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Newsletter */}
        <div className="py-14 border-b border-border">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-semibold text-foreground mb-3">
              Timeless Style, Delivered
            </h3>
            <p className="text-muted-foreground mb-6">
              Be the first to discover new collections, festive edits, and
              exclusive releases from Paridhan Emporium.
            </p>
            <form
              onSubmit={handleNewsletterSubmit}
              className="flex max-w-md mx-auto gap-2"
            >
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
                required
              />
              <Button type="submit">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>

        {/* Main Footer */}
        <div className="py-14">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">
            <div className="lg:col-span-2">
              <Link
                href="/"
                aria-label="Paridhan Emporium Home"
                className="text-2xl tracking-tight font-semibold text-foreground hover:opacity-80 transition"
              >
                Paridhan<span className="text-primary">Emporium</span>
              </Link>

              <p className="text-muted-foreground mt-4 mb-6 max-w-sm leading-relaxed">
                Paridhan Emporium curates premium, daily, and festive ethnic wear
                that celebrates Indian tradition with a refined modern sensibility.
              </p>

              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>Rohini, New Delhi, India</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-primary" />
                  <span>+91 9XXXXXXXXX</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-primary" />
                  <span>support@paridhanemporium.com</span>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                {socialLinks.map(({ href, icon: Icon, label }) => (
                  <Button
                    key={label}
                    variant="ghost"
                    size="icon"
                    asChild
                    className="h-10 w-10 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition"
                  >
                    <Link href={href} aria-label={label}>
                      <Icon className="h-4 w-4" />
                    </Link>
                  </Button>
                ))}
              </div>
            </div>

            {footerSections.map((section) => (
              <div key={section.title}>
                <h4 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">
                  {section.title}
                </h4>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <Separator className="my-8" />

        {/* Bottom Bar */}
        <div className="py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} Paridhan Emporium.</span>
            <span className="flex items-center gap-1">
              Crafted with <Heart className="h-4 w-4 text-red-500 fill-current" /> in India.
            </span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/privacy-policy" className="hover:text-foreground">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-foreground">
              Terms
            </Link>
            <Link href="/refund-policy" className="hover:text-foreground">
              Refunds
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
