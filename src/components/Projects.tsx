"use client";

import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";
import { Project } from "@/types";
import LatexText from "@/components/LatexText";

export default function Projects({ projects }: { projects: Project[] }) {
  return (
    <section id="projects" className="py-24 px-4 max-w-6xl mx-auto">
      <motion.h2
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
        className="text-3xl font-bold mb-12"
        style={{ color: "var(--accent)" }}
      >
        Projects
      </motion.h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, i) => (
          <motion.div
            key={project.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            viewport={{ once: true }}
            className="group relative rounded-xl p-6 transition-all duration-300"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
          >
            <div className="relative">
              <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--text)" }}>{project.title}</h3>
              <LatexText as="p" className="text-sm mb-4 leading-relaxed" style={{ color: "var(--text-muted)" }}>{project.description}</LatexText>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tech.map((t) => (
                  <span
                    key={t}
                    className="text-[10px] px-2 py-0.5 rounded-full"
                    style={{ background: "rgba(2,132,199,0.1)", color: "var(--accent-mid)", border: "1px solid rgba(2,132,199,0.2)" }}
                  >
                    {t}
                  </span>
                ))}
              </div>
              <div className="flex gap-3">
                {project.link && (
                  <a href={project.link} target="_blank" rel="noopener noreferrer" style={{ color: "var(--text-muted)" }}>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
                {project.github && (
                  <a href={project.github} target="_blank" rel="noopener noreferrer" style={{ color: "var(--text-muted)" }}>
                    <Github className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
