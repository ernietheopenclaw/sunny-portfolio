"use client";

import { motion } from "framer-motion";
import { ExternalLink, BookOpen } from "lucide-react";

const publications = [
  {
    title: "Cardiac lipid droplets differ under pathological and physiological conditions",
    journal: "Journal of Lipid Research",
    date: "2025",
    url: "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=tGaMcikAAAAJ&citation_for_view=tGaMcikAAAAJ:d1gkVwhDpl0C",
    authors: "NH Son, S Son, M Verano, ZX Liu, W Younis, M Komack, KV Ruggles, et al.",
    contribution:
      "Contributed to data analysis and computational methods for characterizing lipid droplet composition differences between pathological and physiological cardiac conditions.",
  },
  {
    title: "T cell egress via lymphatic vessels is tuned by antigen encounter and limits tumor control",
    journal: "Nature Immunology",
    date: "2023",
    url: "https://www.nature.com/articles/s41590-023-01443-y",
    authors: "MM Steele, A Jaiswal, I Delclaux, ID Dryg, D Murugan, J Femel, S Son, et al.",
    contribution:
      "Pipelined and analyzed genomic data, performing dimensionality reduction and subsetting to organize cell populations. Applied various semi-supervised and unsupervised methods to determine the optimal format for inferring the pseudotime trajectory of cell-fate in relation to gene expression.",
  },
];

export default function Papers() {
  return (
    <section id="papers" className="py-24 px-4 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl font-bold mb-12" style={{ color: "var(--accent)" }}>
          Publications
        </h2>
        <div className="space-y-8">
          {publications.map((pub, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="rounded-xl p-6"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
            >
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg flex-shrink-0 mt-1" style={{ background: "rgba(33,131,128,0.1)" }}>
                  <BookOpen className="w-5 h-5" style={{ color: "var(--accent-mid)" }} />
                </div>
                <div className="space-y-3">
                  <a
                    href={pub.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg font-semibold leading-snug inline-flex items-start gap-2 transition-colors"
                    style={{ color: "var(--text)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent-mid)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text)")}
                  >
                    {pub.title}
                    <ExternalLink className="w-4 h-4 flex-shrink-0 mt-1" />
                  </a>
                  <p className="text-sm font-medium" style={{ color: "var(--accent-mid)" }}>
                    {pub.journal} · {pub.date}
                  </p>
                  {pub.authors && (
                    <p className="text-xs" style={{ color: "var(--text-muted)", opacity: 0.7 }}>
                      {pub.authors}
                    </p>
                  )}
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                    {pub.contribution}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <a
            href="https://scholar.google.com/citations?user=tGaMcikAAAAJ"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm transition-colors"
            style={{ color: "var(--text-muted)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent-mid)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
          >
            View Google Scholar Profile <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </motion.div>
    </section>
  );
}
