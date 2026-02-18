"use client";

import { motion } from "framer-motion";

export default function About() {
  return (
    <section id="about" className="py-24 px-4 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl font-bold mb-8" style={{ color: "var(--accent)" }}>
          About Me
        </h2>
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="w-40 h-40 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(33,131,128,0.1)", border: "1px solid var(--border-strong)" }}>
            <span className="text-4xl">👤</span>
          </div>
          <div className="space-y-4">
            <p className="text-lg leading-relaxed" style={{ color: "var(--text)" }}>
              Hi, I&apos;m <span className="font-semibold" style={{ color: "var(--accent-mid)" }}>Sunny Son</span> — a data scientist at <span className="font-semibold" style={{ color: "var(--accent-mid)" }}>Amazon</span> and NYU graduate with a passion for machine learning, NLP, and making sense of high-dimensional data.
            </p>
            <p className="leading-relaxed" style={{ color: "var(--text-muted)" }}>
              My work spans dimensionality reduction, time-series forecasting, and fine-tuning language models. I&apos;ve contributed genomic data analysis to a <span className="font-semibold">Nature Immunology</span> publication and built tools ranging from ChatGPT plugins to recommendation engines. I&apos;m also curious about quantum mechanics and the strange loops in Gödel, Escher, Bach.
            </p>
            <p className="leading-relaxed" style={{ color: "var(--text-muted)" }}>
              Outside of work, I volunteer with <span className="font-semibold">EleutherAI</span> as a research contributor and have served with organizations like Rogue Aerospace and Children&apos;s Ark Ministry. Currently reading Zero to One and Six Not-So-Easy Pieces.
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
