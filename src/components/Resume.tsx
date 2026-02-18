"use client";

import { motion } from "framer-motion";
import { Download, Briefcase, GraduationCap, Award, Heart } from "lucide-react";

const experience = [
  {
    title: "Data Scientist",
    company: "Amazon",
    period: "Present",
    description: "Working on machine learning and data science initiatives at scale.",
  },
  {
    title: "Human Microbiome Research Intern",
    company: "NYU Langone Health",
    period: "2022",
    description: "Pipelined and analyzed genomic data for immunology research. Applied dimensionality reduction and unsupervised methods to infer pseudotime trajectories of cell-fate, contributing to a Nature Immunology publication.",
  },
];

const education = [
  {
    degree: "B.S. Data Science",
    school: "New York University",
    period: "2019 – 2023",
    focus: "Focus: Machine Learning, NLP, Probabilistic Time Series Analysis",
  },
];

const honors = [
  { title: "Winner, Recommendation System Challenge", org: "NYU DSC x Peak.AI", date: "Nov 2022" },
  { title: "Dean's List", org: "NYU", date: "2019, 2022" },
  { title: "Golden Thread Award — Best Valuation", org: "iXperience", date: "Jul 2019" },
  { title: "President's Volunteer Service Award", org: "250+ volunteer hours", date: "" },
];

const volunteering = [
  { role: "Research Contributor", org: "EleutherAI", description: "Contributing to open-source AI research." },
  { role: "Volunteer", org: "Rogue Aerospace", description: "" },
  { role: "Volunteer", org: "Children's Ark Ministry", description: "" },
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

        {/* Experience */}
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

        {/* Education */}
        <div className="mb-12">
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

        {/* Honors & Awards */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Award className="w-5 h-5" style={{ color: "var(--accent-mid)" }} />
            <h3 className="text-lg font-semibold" style={{ color: "var(--text)" }}>Honors & Awards</h3>
          </div>
          <div className="space-y-3 pl-6">
            {honors.map((h, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                viewport={{ once: true }}
                className="flex items-baseline gap-2"
              >
                <span className="text-sm font-medium" style={{ color: "var(--text)" }}>{h.title}</span>
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>— {h.org}{h.date ? `, ${h.date}` : ""}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Volunteering */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <Heart className="w-5 h-5" style={{ color: "var(--accent-mid)" }} />
            <h3 className="text-lg font-semibold" style={{ color: "var(--text)" }}>Volunteering</h3>
          </div>
          <div className="space-y-3 pl-6">
            {volunteering.map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                viewport={{ once: true }}
                className="flex items-baseline gap-2"
              >
                <span className="text-sm font-medium" style={{ color: "var(--text)" }}>{v.role}</span>
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>— {v.org}</span>
                {v.description && <span className="text-xs" style={{ color: "var(--text-muted)" }}>· {v.description}</span>}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
