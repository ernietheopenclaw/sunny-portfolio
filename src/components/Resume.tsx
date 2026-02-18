"use client";

import { motion } from "framer-motion";
import { Download, Briefcase, GraduationCap } from "lucide-react";

const experience = [
  {
    title: "Senior Frontend Engineer",
    company: "TechCorp AI",
    period: "2023 – Present",
    description: "Building interactive AI-powered visualization tools and leading the frontend architecture for ML experiment dashboards.",
  },
  {
    title: "Full-Stack Developer",
    company: "DataViz Labs",
    period: "2021 – 2023",
    description: "Developed real-time data visualization platforms using Three.js and D3. Built APIs for processing and serving embedding data.",
  },
  {
    title: "Research Assistant",
    company: "University AI Lab",
    period: "2019 – 2021",
    description: "Researched dimensionality reduction techniques for high-dimensional data visualization. Published 2 papers on interactive ML interfaces.",
  },
];

const education = [
  {
    degree: "M.S. Computer Science",
    school: "State University",
    period: "2019 – 2021",
    focus: "Focus: Human-Computer Interaction & Machine Learning",
  },
  {
    degree: "B.S. Computer Science",
    school: "State University",
    period: "2015 – 2019",
    focus: "Minor: Mathematics",
  },
];

export default function Resume() {
  return (
    <section id="resume" className="py-24 px-4 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
      >
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-bold" style={{ color: "var(--accent)" }}>
            Resume
          </h2>
          <a
            href="/resume.pdf"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors"
            style={{ background: "rgba(33,131,128,0.1)", color: "var(--accent-mid)", border: "1px solid rgba(33,131,128,0.3)" }}
          >
            <Download className="w-4 h-4" /> Download PDF
          </a>
        </div>

        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Briefcase className="w-5 h-5" style={{ color: "var(--accent-mid)" }} />
            <h3 className="text-lg font-semibold" style={{ color: "var(--text)" }}>Experience</h3>
          </div>
          <div className="space-y-6 pl-6" style={{ borderLeft: "2px solid var(--border-strong)" }}>
            {experience.map((exp, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="absolute -left-[31px] top-1 w-3 h-3 rounded-full" style={{ background: "var(--accent)", border: "2px solid var(--bg)" }} />
                <h4 className="font-semibold" style={{ color: "var(--text)" }}>{exp.title}</h4>
                <p className="text-sm" style={{ color: "var(--accent-mid)" }}>{exp.company}</p>
                <p className="text-xs mb-2" style={{ color: "var(--text-muted)" }}>{exp.period}</p>
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>{exp.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-6">
            <GraduationCap className="w-5 h-5" style={{ color: "var(--accent-mid)" }} />
            <h3 className="text-lg font-semibold" style={{ color: "var(--text)" }}>Education</h3>
          </div>
          <div className="space-y-6 pl-6" style={{ borderLeft: "2px solid var(--border-strong)" }}>
            {education.map((edu, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="absolute -left-[31px] top-1 w-3 h-3 rounded-full" style={{ background: "var(--accent-mid)", border: "2px solid var(--bg)" }} />
                <h4 className="font-semibold" style={{ color: "var(--text)" }}>{edu.degree}</h4>
                <p className="text-sm" style={{ color: "var(--accent-mid)" }}>{edu.school}</p>
                <p className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>{edu.period}</p>
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>{edu.focus}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
