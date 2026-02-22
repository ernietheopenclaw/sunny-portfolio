"use client";

import { motion } from "framer-motion";
import { ExternalLink, Github, X } from "lucide-react";
import { Project } from "@/types";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import LatexText from "@/components/LatexText";

export default function Projects({ projects, onDelete }: { projects: Project[]; onDelete?: (id: string) => void }) {
  const router = useRouter();
  const { data: session } = useSession();
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
            className="group relative rounded-xl p-6 transition-all duration-300 cursor-pointer"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
            onClick={() => project.id && router.push(`/project/${project.id}`)}
          >
            <div className="relative">
              {session && onDelete && project.id && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm(`Delete "${project.title}"?`)) onDelete(project.id);
                  }}
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-10"
                  style={{ background: "#ff4444", color: "#fff", boxShadow: "0 2px 8px rgba(255,68,68,0.4)" }}
                  title="Delete project"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
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
                  <a href={project.link} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} style={{ color: "var(--text-muted)" }}>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
                {project.github && (
                  <a href={project.github} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} style={{ color: "var(--text-muted)" }}>
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
