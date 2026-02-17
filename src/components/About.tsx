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
        <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
          About Me
        </h2>
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Photo placeholder */}
          <div className="w-40 h-40 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 flex items-center justify-center flex-shrink-0">
            <span className="text-4xl">👤</span>
          </div>
          <div className="space-y-4 text-gray-300 dark:text-gray-300">
            <p className="text-lg leading-relaxed">
              Hi, I&apos;m <span className="text-cyan-400 font-semibold">Sunny</span> — a developer, researcher, and creative technologist passionate about the intersection of AI, visualization, and human learning.
            </p>
            <p className="leading-relaxed text-gray-400">
              I build tools that make complex ideas tangible. From interactive 3D visualizations of neural network architectures to AI-powered learning roadmaps, I love turning abstract concepts into experiences you can see, touch, and explore.
            </p>
            <p className="leading-relaxed text-gray-400">
              When I&apos;m not coding, you&apos;ll find me reading research papers, experimenting with generative art, or building something weird and wonderful with the latest APIs.
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
