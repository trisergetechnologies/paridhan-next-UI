"use client";

import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export default function AboutPage() {
  return (
    <div className="relative overflow-hidden">
      {/* HERO SECTION */}
      <section className="relative py-24 bg-gradient-to-b from-neutral-950 to-neutral-900 text-white">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ duration: 0.6 }}
            className="font-serif text-4xl sm:text-5xl lg:text-6xl tracking-tight"
          >
            The Soul of Indian Elegance
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mt-6 text-sm sm:text-base text-neutral-300 max-w-2xl mx-auto leading-relaxed"
          >
            Paridhan Emporium is a celebration of timeless craftsmanship, rich
            weaves, and the grace that defines Indian ethnic wear.
          </motion.p>
        </div>
      </section>

      {/* BRAND STORY */}
      <section className="relative py-20 bg-white overflow-hidden">
        {/* Decorative background accent */}
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-red-600/5 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-black/5 blur-3xl" />

        <div className="relative max-w-6xl mx-auto px-6 lg:px-8">
          {/* Section Header */}
          <div className="max-w-3xl mb-14">
            <span className="inline-block text-xs tracking-widest uppercase text-red-600 font-semibold mb-3">
              Our Story
            </span>

            <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-black leading-tight">
              Rooted in Tradition,
              <span className="block text-red-600">
                Refined for the Modern Woman
              </span>
            </h2>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Left Column */}
            <div className="space-y-6 text-black/80 leading-relaxed">
              <p className="text-base">
                Paridhan Emporium was born from a deep admiration for India’s
                timeless textile heritage — a world where every weave tells a
                story, and every saree carries generations of artistry.
              </p>

              <p className="text-base">
                What began as a passion for authentic craftsmanship soon
                transformed into a vision: to curate sarees that preserve
                cultural richness while embracing contemporary elegance.
              </p>

              <p className="text-base">
                From grand festive drapes to graceful everyday essentials, each
                piece at Paridhan Emporium is thoughtfully selected to celebrate
                femininity, confidence, and individuality.
              </p>
            </div>

            {/* Right Column */}
            <div className="space-y-6 text-black/80 leading-relaxed">
              <p className="text-base">
                We work closely with skilled artisans, trusted manufacturers,
                and heritage weavers across India — ensuring every saree
                reflects quality, authenticity, and attention to detail.
              </p>

              <p className="text-base">
                Our collections are not driven by trends alone, but by a
                commitment to timeless style, comfort, and ethical sourcing.
              </p>

              <p className="text-base font-medium text-black">
                At Paridhan Emporium, we don’t just sell sarees —
                <span className="text-red-600"> we help you wear a story.</span>
              </p>
            </div>
          </div>

          {/* Divider Quote */}
          <div className="mt-16 pt-10 border-t border-black/10">
            <p className="text-center text-sm sm:text-base italic text-black/70 max-w-3xl mx-auto">
              “Every drape is a dialogue between heritage and modern elegance —
              crafted to make you feel confident, graceful, and truly yourself.”
            </p>
          </div>
        </div>
      </section>

      {/* CRAFT & QUALITY */}
      <section className="py-6 bg-neutral-50">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="font-serif text-3xl font-semibold text-foreground"
          >
            Crafted with Purpose
          </motion.h2>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-muted-foreground max-w-3xl mx-auto leading-relaxed"
          >
            From luxurious silks to breathable daily wear fabrics, every piece
            undergoes careful selection. We partner with skilled artisans and
            trusted manufacturers to ensure quality, comfort, and authenticity.
          </motion.p>

          <div className="mt-14 grid sm:grid-cols-3 gap-8">
            {[
              {
                title: "Authentic Fabrics",
                desc: "Premium silks, cottons, and blends chosen for longevity.",
              },
              {
                title: "Artisan Craft",
                desc: "Traditional techniques blended with modern finishing.",
              },
              {
                title: "Refined Detailing",
                desc: "Attention to borders, motifs, and textures.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: 0.1 * i }}
                className="rounded-2xl bg-white p-6 shadow-sm hover:shadow-md transition"
              >
                <h3 className="font-medium text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY PARIDHAN */}
      <section className="relative py-20 bg-white overflow-hidden">
        {/* Subtle background accents */}
        <div className="absolute -top-40 right-0 w-96 h-96 bg-red-600/5 blur-3xl rounded-full" />
        <div className="absolute -bottom-40 left-0 w-96 h-96 bg-black/5 blur-3xl rounded-full" />

        <div className="relative max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-14 items-center">
          {/* LEFT CONTENT */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-6"
          >
            <span className="inline-block text-xs tracking-widest uppercase text-red-600 font-semibold">
              Why Choose Us
            </span>

            <h2 className="font-serif text-3xl sm:text-4xl text-black leading-tight">
              A Thoughtful Blend of
              <span className="block text-red-600">
                Heritage, Quality & Trust
              </span>
            </h2>

            <p className="text-black/70 leading-relaxed max-w-lg">
              Paridhan Emporium stands for more than fashion. We curate sarees
              that respect tradition, celebrate craftsmanship, and seamlessly
              fit into modern lifestyles.
            </p>

            <ul className="space-y-4 pt-2">
              <li className="flex gap-3">
                <span className="text-red-600 font-semibold">•</span>
                <span className="text-black/80">
                  Carefully curated premium saree collections
                </span>
              </li>

              <li className="flex gap-3">
                <span className="text-red-600 font-semibold">•</span>
                <span className="text-black/80">
                  Designs suited for daily elegance, festive charm, and grand
                  occasions
                </span>
              </li>

              <li className="flex gap-3">
                <span className="text-red-600 font-semibold">•</span>
                <span className="text-black/80">
                  Seamless online experience with consistent quality assurance
                </span>
              </li>

              <li className="flex gap-3">
                <span className="text-red-600 font-semibold">•</span>
                <span className="text-black/80">
                  A refined balance of traditional artistry and modern taste
                </span>
              </li>
            </ul>
          </motion.div>

          {/* RIGHT VISUAL BLOCK */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="
        relative
        rounded-3xl
        h-72 sm:h-80 lg:h-[420px]
        bg-gradient-to-br from-black via-neutral-900 to-black
        overflow-hidden
      "
          >
            {/* Overlay texture / placeholder */}
            <div className="absolute inset-0 bg-red-600/10 mix-blend-overlay" />

            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-white/80 text-sm tracking-wide text-center px-6">
                Crafted for women who value elegance, authenticity, and timeless
                style
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CLOSING NOTE */}
      <section className="py-24 bg-neutral-950 text-white">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-3xl mx-auto px-6 text-center"
        >
          <h2 className="font-serif text-3xl mb-6">
            Wear Tradition. Own Your Elegance.
          </h2>
          <p className="text-neutral-300 leading-relaxed">
            At Paridhan Emporium, we invite you to experience sarees that feel
            personal, timeless, and truly yours.
          </p>
        </motion.div>
      </section>
    </div>
  );
}
