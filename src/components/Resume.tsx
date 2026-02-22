"use client";

import { motion } from "framer-motion";
import { Download, Briefcase, GraduationCap, Award, Heart } from "lucide-react";

const experience = [
  {
    title: "Machine Learning Engineer",
    company: "Globalink AI Inc",
    location: "Remote (Calabasas, CA)",
    period: "Feb 2026 – Present",
    bullets: [
      "Designing an agentic BI decision engine combining ML models, LLMs, and Knowledge Graphs to generate actionable e-commerce merchant recommendations, reasoning across competing objectives including growth, margin optimization, and inventory risk",
      "Architecting inference pipeline integrating Knowledge Graph constraint modeling with LLM-driven reasoning to produce explainable, constraint-aware decisions on pricing, ad allocation, and SKU management",
      "Developing an evaluation framework measuring decision quality through merchant outcome metrics, A/B-tested recommendation lift, and consistency audits, leveraging few-shot learning and Bayesian updating for reliable decisions from limited operational data",
    ],
  },
  {
    title: "AI Engineer Intern",
    company: "Amazon",
    location: "Los Angeles, CA",
    period: "Jun 2025 – Aug 2025",
    bullets: [
      "Engineered an enterprise-scale RAG LLM system serving 15,000 tables across 200 schemas, reducing data discovery time by 75% with automated DDL generation and intelligent table/column comments using AWS S3, Knowledge Bases, Redshift, and Bedrock",
      "Pioneered version control for data infrastructure by implementing git-style versioning with md5 hash-based difference tracking, enabling rollback capabilities and reducing schema conflicts by 60%",
      "Built an automated notification system with Slack API integration, cutting manual monitoring overhead by 90% and providing real-time updates on daily table schema modifications",
    ],
  },
  {
    title: "Data Scientist",
    company: "NYU Langone Health",
    location: "New York, NY",
    period: "May 2023 – May 2025",
    bullets: [
      "Implemented deep learning computer vision models using U-Net convolutional neural network architectures with transfer learning, achieving 15% improvement in image segmentation accuracy for medical imaging analysis of over 2,000 microscopy samples",
      "Designed an end-to-end machine learning pipeline for biomedical data preprocessing, reducing processing time from 8 hours to 45 minutes while maintaining over 90% data quality through feature engineering and data augmentation techniques",
      "Conducted pathway analysis to identify key biological pathways involved in glucose and lipid uptake, transport, and oxidation, offering insights for targeted therapeutic interventions and contributing to advancements in cardiovascular research",
      "Streamlined bioinformatics pipelines by composing 2,000 lines of R code, facilitating comprehensive analysis of datasets with over 300,000 records, improving processing from 10 hours to 8.5 hours and ensuring reproducibility and reusability",
      "Implemented dimensionality reduction and spacio-temporal modeling to bridge theoretical gaps with trajectory inference, elucidating the impact of CXCL12's interaction with CXCR4, ACKR3 receptors in maintaining CD8+ T Cell presence within tumors",
    ],
  },
];

const education = [
  {
    degree: "MS Data Science",
    school: "New York University Center for Data Science",
    period: "May 2026",
    detail: "GPA: 3.63 / 4.0",
  },
  {
    degree: "BS Business",
    school: "New York University Leonard N. Stern School of Business",
    period: "May 2023",
    detail: "GPA: 3.73 / 4.0",
  },
];

const certifications = [
  { title: "Machine Learning Engineering for Production (MLOps) Specialization", org: "DeepLearning.AI", url: "https://www.coursera.org/account/accomplishments/specialization/certificate/5MY8NWK6CAJH" },
];

const interests = [
  "Running", "Photography", "Overwatch (Top 500)", "Smash Bros.", "Boarding",
  "Weight Training", "Calisthenics", "Travel", "Street Food", "Archery",
  "Counter Strike", "Whistling (Taking Requests)",
];

const languages = [
  { lang: "Mandarin", level: "Proficient" },
  { lang: "Spanish", level: "Elementary" },
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
            style={{ background: "rgba(2,132,199,0.1)", color: "var(--accent-mid)", border: "1px solid rgba(2,132,199,0.3)" }}
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
                {c.url ? (
                  <a href={c.url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium transition-colors" style={{ color: "var(--text)" }} onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent-mid)")} onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text)")}>{c.title}</a>
                ) : (
                  <span className="text-sm font-medium" style={{ color: "var(--text)" }}>{c.title}</span>
                )}
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>— {c.org}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Languages & Interests */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Heart className="w-5 h-5" style={{ color: "var(--accent-mid)" }} />
            <h3 className="text-lg font-semibold" style={{ color: "var(--text)" }}>Languages & Interests</h3>
          </div>
          <div className="pl-6 space-y-4">
            <div>
              <p className="text-sm font-medium mb-2" style={{ color: "var(--text)" }}>Languages</p>
              <div className="flex gap-3">
                {languages.map((l) => (
                  <span key={l.lang} className="text-sm" style={{ color: "var(--text-muted)" }}>
                    {l.lang} <span className="text-xs opacity-70">({l.level})</span>
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium mb-2" style={{ color: "var(--text)" }}>Interests</p>
              <div className="flex flex-wrap gap-1.5">
                {interests.map((interest) => (
                  <span
                    key={interest}
                    className="text-[11px] px-2 py-0.5 rounded-full"
                    style={{ background: "rgba(2,132,199,0.05)", color: "var(--text-muted)", border: "1px solid var(--border)" }}
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
