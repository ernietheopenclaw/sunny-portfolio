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
          <div className="w-40 h-40 rounded-2xl overflow-hidden flex-shrink-0" style={{ border: "1px solid var(--border-strong)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/headshot.jpg" alt="Sunny Son" className="w-full h-full object-cover" />
          </div>
          <div className="space-y-4">
            <p className="text-lg leading-relaxed" style={{ color: "var(--text)" }}>
              Hi, I&apos;m <span className="font-semibold" style={{ color: "var(--accent-mid)" }}>Sunny Son</span> — an MS Data Science candidate at <span className="font-semibold" style={{ color: "var(--accent-mid)" }}>NYU Center for Data Science</span> (class of 2026), former AI Engineer Intern at <span className="font-semibold" style={{ color: "var(--accent-mid)" }}>Amazon</span>, and a data scientist with 2+ years at NYU Langone Health building deep learning pipelines for biomedical research.
            </p>
            <p className="leading-relaxed" style={{ color: "var(--text-muted)" }}>
              I&apos;ve engineered enterprise-scale RAG systems serving 15,000+ tables, implemented U-Net CNNs for microscopy image segmentation, and contributed bioinformatics analysis to a <span className="font-semibold">Nature Immunology</span> publication. My work at NYU Langone helped secure over $1M in research funding through biomarker discovery. I hold a BS from NYU Stern and an MLOps Specialization from DeepLearning.AI.
            </p>
            <p className="leading-relaxed" style={{ color: "var(--text-muted)" }}>
              Outside of work, I&apos;m an <span className="font-semibold">Overwatch Top 500</span> player, a runner, photographer, archer, and a professional-grade whistler (taking requests). I also speak Mandarin and am picking up Spanish. Always down for street food adventures and boarding.
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
