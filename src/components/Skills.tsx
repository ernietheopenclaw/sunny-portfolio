"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Github, X } from "lucide-react";
import { Skill, Project } from "@/types";

// Map skill names to project tech tags (exact case-insensitive matching)
function exactMatch(a: string, b: string): boolean {
  return a.toLowerCase().trim() === b.toLowerCase().trim();
}

function getProjectsForSkill(skillName: string, projects: Project[]): Project[] {
  // Split compound skills like "NumPy / Pandas / SciPy" or "W&B / MLflow"
  const skillParts = skillName.split(/\s*\/\s*/).map((s) => s.trim());
  return projects.filter((p) =>
    p.tech.some((t) => skillParts.some((part) => exactMatch(t, part)))
  );
}

export default function Skills({ skills, projects }: { skills: Skill[]; projects: Project[] }) {
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const categories = [...new Set(skills.map((s) => s.category))];

  const matchedProjects = selectedSkill ? getProjectsForSkill(selectedSkill, projects) : [];

  return (
    <section id="skills" className="py-24 px-4 max-w-4xl mx-auto">
      <motion.h2
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
        className="text-3xl font-bold mb-4"
        style={{ color: "var(--accent)" }}
      >
        Skills
      </motion.h2>
      <p className="text-sm mb-12" style={{ color: "var(--text-muted)" }}>
        Click a skill to see where I&apos;ve used it.
      </p>

      <div className="space-y-8">
        {categories.map((cat, catIdx) => (
          <motion.div
            key={cat}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: catIdx * 0.08 }}
            viewport={{ once: true }}
          >
            <h3
              className="text-xs font-semibold uppercase tracking-wider mb-3"
              style={{ color: "var(--text-muted)" }}
            >
              {cat}
            </h3>
            <div className="flex flex-wrap gap-2">
              {skills
                .filter((s) => s.category === cat)
                .map((skill) => {
                  const isSelected = selectedSkill === skill.name;
                  const hasProjects = getProjectsForSkill(skill.name, projects).length > 0;
                  return (
                    <button
                      key={skill.name}
                      onClick={() => setSelectedSkill(isSelected ? null : skill.name)}
                      className="px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer"
                      style={{
                        background: isSelected
                          ? "var(--accent)"
                          : "rgba(2,132,199,0.08)",
                        color: isSelected ? "#fff" : "var(--text)",
                        border: isSelected
                          ? "1px solid var(--accent)"
                          : hasProjects
                          ? "1px solid rgba(2,132,199,0.25)"
                          : "1px solid var(--border)",
                        transform: isSelected ? "scale(1.05)" : "scale(1)",
                      }}
                    >
                      {skill.name}
                      {hasProjects && !isSelected && (
                        <span
                          className="ml-1.5 text-[9px] opacity-50"
                        >
                          ●
                        </span>
                      )}
                    </button>
                  );
                })}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Linked Projects Panel */}
      <AnimatePresence>
        {selectedSkill && (
          <motion.div
            initial={{ opacity: 0, y: 20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: 10, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-10 overflow-hidden"
          >
            <div
              className="p-6 rounded-xl"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold" style={{ color: "var(--text)" }}>
                  Projects using{" "}
                  <span style={{ color: "var(--accent-mid)" }}>{selectedSkill}</span>
                </h3>
                <button
                  onClick={() => setSelectedSkill(null)}
                  className="p-1 rounded-md transition-colors cursor-pointer"
                  style={{ color: "var(--text-muted)" }}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {matchedProjects.length === 0 ? (
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  No linked projects yet — this skill was developed through coursework and research.
                </p>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {matchedProjects.map((project) => (
                    <div
                      key={project.title}
                      className="p-4 rounded-lg transition-colors"
                      style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
                    >
                      <h4 className="text-sm font-medium mb-1" style={{ color: "var(--text)" }}>
                        {project.title}
                      </h4>
                      <p
                        className="text-xs mb-3 line-clamp-2"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {project.tech.map((t) => (
                          <span
                            key={t}
                            className="text-[9px] px-1.5 py-0.5 rounded-full"
                            style={{
                              ...(() => {
                                const parts = selectedSkill.split(/\s*\/\s*/).map((s) => s.trim());
                                const isMatch = parts.some((p) => exactMatch(t, p));
                                return {
                                  background: isMatch ? "rgba(2,132,199,0.2)" : "rgba(255,255,255,0.05)",
                                  color: isMatch ? "var(--accent-mid)" : "var(--text-muted)",
                                  border: "1px solid rgba(2,132,199,0.15)",
                                };
                              })(),
                            }}
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        {project.link && (
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] flex items-center gap-1"
                            style={{ color: "var(--accent-mid)" }}
                          >
                            <ExternalLink className="w-3 h-3" /> Live
                          </a>
                        )}
                        {project.github && (
                          <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] flex items-center gap-1"
                            style={{ color: "var(--accent-mid)" }}
                          >
                            <Github className="w-3 h-3" /> Code
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
