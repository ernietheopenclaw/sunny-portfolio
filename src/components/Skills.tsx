"use client";

import { motion } from "framer-motion";
import { Skill } from "@/types";

export default function Skills({ skills }: { skills: Skill[] }) {
  const categories = [...new Set(skills.map((s) => s.category))];

  return (
    <section id="skills" className="py-24 px-4 max-w-4xl mx-auto">
      <motion.h2
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
        className="text-3xl font-bold mb-12"
        style={{ color: "var(--accent)" }}
      >
        Skills
      </motion.h2>
      <div className="space-y-10">
        {categories.map((cat) => (
          <div key={cat}>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--text-muted)" }}>
              {cat}
            </h3>
            <div className="space-y-3">
              {skills
                .filter((s) => s.category === cat)
                .map((skill, i) => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    viewport={{ once: true }}
                  >
                    <div className="flex justify-between text-sm mb-1">
                      <span style={{ color: "var(--text)" }}>{skill.name}</span>
                      <span style={{ color: "var(--text-muted)" }}>{skill.level}%</span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        transition={{ duration: 0.8, delay: i * 0.05 }}
                        viewport={{ once: true }}
                        className="h-full rounded-full"
                        style={{ background: "var(--accent)" }}
                      />
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
