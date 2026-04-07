"use client";

import { motion } from "framer-motion";
import { Variants } from "framer-motion";

const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1], // ✔ correct
    },
  },
};

export default function PrivacyPolicyPage() {
  return (
    <section className="bg-background">
      {/* ================= HERO ================= */}
      <div className="relative overflow-hidden border-b">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="font-serif text-4xl md:text-5xl text-foreground"
          >
            Privacy Policy
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.1 }}
            className="mt-4 max-w-2xl text-muted-foreground leading-relaxed"
          >
            Your privacy is fundamental to the way Paridhan Emporium operates.
            This policy outlines how we respectfully collect, use, and safeguard
            your personal information.
          </motion.p>

          <div className="mt-6 h-1 w-20 bg-primary rounded-full" />
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="max-w-4xl mx-auto px-6 py-20 space-y-16">
        {/* SECTION */}
        <motion.section
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-4"
        >
          <h2 className="font-serif text-2xl text-foreground">
            Information We Collect
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            We collect only the information necessary to deliver a seamless and
            secure shopping experience. This may include:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>Your name, contact number, email, and delivery address</li>
            <li>Order history and product preferences</li>
            <li>Payment-related details processed securely via trusted gateways</li>
          </ul>
        </motion.section>

        {/* SECTION */}
        <motion.section
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-4"
        >
          <h2 className="font-serif text-2xl text-foreground">
            How We Use Your Information
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Your information helps us operate efficiently and serve you better.
            We use it to:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>Process and fulfill orders</li>
            <li>Communicate order updates and support requests</li>
            <li>Improve our collections, services, and user experience</li>
          </ul>
        </motion.section>

        {/* SECTION */}
        <motion.section
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-4"
        >
          <h2 className="font-serif text-2xl text-foreground">
            Data Protection & Security
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            We follow industry-standard security practices to protect your data.
            All transactions are encrypted and handled through verified payment
            partners.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Paridhan Emporium does{" "}
            <span className="text-foreground font-medium">not</span> sell, rent,
            or trade your personal information. Data is shared only when required
            for logistics, payment processing, or legal obligations.
          </p>
        </motion.section>

        {/* SECTION */}
        <motion.section
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-4"
        >
          <h2 className="font-serif text-2xl text-foreground">
            Your Consent
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            By accessing or using our website, you agree to the collection and
            use of your information as outlined in this Privacy Policy.
          </p>
        </motion.section>

        {/* FOOTNOTE */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="pt-8 border-t text-sm text-muted-foreground"
        >
          This policy may be updated periodically to reflect operational,
          legal, or regulatory changes. Please review it occasionally.
        </motion.div>
      </div>
    </section>
  );
}
