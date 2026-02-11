"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const policies = [
  {
    title: "Privacy Policy",
    description:
      "Learn how Paridhan Emporium collects, uses, and protects your personal information.",
    href: "/policy/privacy-policy",
  },
  {
    title: "Exchange Policy",
    description:
      "Understand our exchange guidelines for a smooth and transparent experience.",
    href: "/policy/exchange-policy",
  },
  {
    title: "Terms & Conditions",
    description:
      "Review the rules, responsibilities, and conditions governing our platform.",
    href: "/policy/terms-conditions",
  },
  {
    title: "Cancellation & Refund Policy",
    description:
      "Know how cancellations and refunds are handled at Paridhan Emporium.",
    href: "/policy/cancellation-refund",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.08,
      duration: 0.45,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

export default function PolicyPage() {
  return (
    <section className="relative py-24 bg-background">
      <div className="max-w-6xl mx-auto px-6">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-4">
            Policies & Legal Information
          </h1>
          <p className="max-w-2xl mx-auto text-muted-foreground text-base">
            Transparency and trust are at the heart of Paridhan Emporium.
            Please review our policies to understand how we operate.
          </p>
        </motion.div>

        {/* POLICY GRID */}
        <div className="grid gap-6 sm:grid-cols-2">
          {policies.map((policy, i) => (
            <motion.div
              key={policy.title}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <Link
                href={policy.href}
                className="
                  group block h-full
                  rounded-3xl
                  border border-black/10
                  bg-white
                  p-8
                  transition-all
                  hover:-translate-y-1
                  hover:shadow-[0_24px_60px_-24px_rgba(0,0,0,0.45)]
                "
              >
                <h2 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition">
                  {policy.title}
                </h2>

                <p className="text-sm text-muted-foreground leading-relaxed">
                  {policy.description}
                </p>

                <div className="mt-6 text-sm font-medium text-primary">
                  Read more →
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
