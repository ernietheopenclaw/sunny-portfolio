"use client";

import { motion } from "framer-motion";
import { Download, Briefcase, GraduationCap, Award, Heart } from "lucide-react";

const experience = [
  {
    title: "AI Engineer Intern",
    company: "Amazon",
    location: "Los Angeles, CA",
    period: "Jun 2025 – Aug 2025",
    bullets: [
      "Engineered an enterprise-scale RAG LLM system serving 15,000 tables across 200 schemas, reducing data discovery time by 75% with automated DDL generation using AWS S3, Knowledge Bases, Redshift, and Bedrock",
      "Pioneered version control for data infrastructure with git-style versioning and md5 hash-based difference tracking, reducing schema conflicts by 60%",
      "Built automated notification system with Slack API integration, cutting manual monitoring overhead by 90%",
    ],
  },
  {
    title: "Data Scientist",
    company: "NYU Langone Health",
    location: "New York, NY",
    period: "May 2023 – May 2025",
    bullets: [
      "Implemented deep learning CV models using U-Net CNN with transfer learning, 15% improvement in image segmentation for 2,000+ microscopy samples",
      "Designed end-to-end ML pipeline reducing computational time from 8 hours to 45 minutes",
      "Developed predictive models improving accuracy by 15% in cardiovascular research using ensemble methods and multi-modal data fusion (RNA-seq, lipidomics, proteomics, 100K records)",
      "Spearheaded data science initiatives securing over $1M in research funding through biomarker discovery",
    ],
  },
  {
    title: "Bioinformatics Intern",
    company: "NYU Langone Health",
    location: "New York, NY",
    period: "Mar 2022 – Jan 2023",
    bullets: [
      "Streamlined bioinformatics pipelines with 2,000 lines of R code for 300K+ record datasets",
      "Implemented dimensionality reduction and spatio-temporal modeling for trajectory inference (CXCL12/CXCR4/ACKR3 and CD8+ T Cells)",
      "Generated UMAP and t-SNE visualizations for immune cell clustering",
    ],
  },
];

const education = [
  {
    degree: "MS Data Science",
    school: "NYU Center for Data Science",
    period: "Expected May 2026",
    detail: "GPA: 3.63 / 4.0",
  },
  {
    degree: "BS Business",
    school: "NYU Stern School of Business",
    period: "May 2023",
    detail: "GPA: 3.73 / 4.0",
  },
];

const certifications = [
  { title: "MLOps Specialization", org: "DeepLearning.AI" },
];

const honors = [
  { title: "Winner, Recommendation System Challenge", org: "NYU DSC x Peak.AI", date: "Nov 2022" },
  { title: "Dean's List", org: "NYU", date: "2019, 2022" },
  { title: "Golden Thread Award — Best Valuation", org: "iXperience", date: "Jul 2019" },
  { title: "President's Volunteer Service Award", org: "250+ volunteer hours", date: "" },
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
                <p className="text-sm" style={{ color: "var(--accent-mid)" }}>{exp.company} · {exp.location}</p>
                <p className="text-xs mb-2" style={{ color: "var(--text-muted)" }}>{exp.period}</p>
                <ul className="space-y-1">
                  {exp.bullets.map((b, j) => (
                    <li key={j} className="text-sm flex gap-2" style={{ color: "var(--text-muted)" }}>
                      <span className="flex-shrink-0 mt-1.5 w-1 h-1 rounded-full" style={{ background: "var(--accent-mid)" }} />
                      {b}
                    </li>
                  ))}
                </ul>
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
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>{edu.detail}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Award className="w-5 h-5" style={{ color: "var(--accent-mid)" }} />
            <h3 className="text-lg font-semibold" style={{ color: "var(--text)" }}>Certifications</h3>
          </div>
          <div className="space-y-3 pl-6">
            {certifications.map((c, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                viewport={{ once: true }}
                className="flex items-baseline gap-2"
              >
                <span className="text-sm font-medium" style={{ color: "var(--text)" }}>{c.title}</span>
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>— {c.org}</span>
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
      </motion.div>
    </section>
  );
}
