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
          <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            Resume
          </h2>
          <a
            href="/resume.pdf"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 transition-colors text-sm"
          >
            <Download className="w-4 h-4" /> Download PDF
          </a>
        </div>

        {/* Experience */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Briefcase className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-semibold text-white">Experience</h3>
          </div>
          <div className="space-y-6 border-l-2 border-gray-800 pl-6">
            {experience.map((exp, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-cyan-500 border-2 border-gray-950" />
                <h4 className="font-semibold text-white">{exp.title}</h4>
                <p className="text-sm text-cyan-400">{exp.company}</p>
                <p className="text-xs text-gray-500 mb-2">{exp.period}</p>
                <p className="text-sm text-gray-400">{exp.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Education */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <GraduationCap className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-semibold text-white">Education</h3>
          </div>
          <div className="space-y-6 border-l-2 border-gray-800 pl-6">
            {education.map((edu, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-purple-500 border-2 border-gray-950" />
                <h4 className="font-semibold text-white">{edu.degree}</h4>
                <p className="text-sm text-purple-400">{edu.school}</p>
                <p className="text-xs text-gray-500 mb-1">{edu.period}</p>
                <p className="text-sm text-gray-400">{edu.focus}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
