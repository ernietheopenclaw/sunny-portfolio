"use client";

import { motion } from "framer-motion";
import { ExternalLink, BookOpen, X, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Publication } from "@/types";
import LatexText from "@/components/LatexText";

export default function Papers({ publications, onDelete }: { publications: Publication[]; onDelete?: (id: string) => void }) {
  const router = useRouter();
  const { data: session } = useSession();
  return (
    <section id="papers" className="py-24 px-4 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl font-bold mb-12" style={{ color: "var(--accent)" }}>
          <span className="flex items-center gap-3">
            Publications
            {session && (
              <button
                onClick={() => router.push("/publication/new")}
                className="text-xs px-2.5 py-1 rounded-full flex items-center gap-1 cursor-pointer transition-colors"
                style={{ color: "var(--accent-mid)", border: "1px solid var(--border)" }}
              >
                <Plus className="w-3.5 h-3.5" /> New Publication
              </button>
            )}
          </span>
        </h2>
        <div className="space-y-8">
          {publications.map((pub, i) => (
            <motion.div
              key={pub.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="group relative rounded-xl p-6"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
            >
              {session && onDelete && (
                <button
                  onClick={() => { if (confirm(`Delete "${pub.title}"?`)) onDelete(pub.id); }}
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-10"
                  style={{ background: "#ff4444", color: "#fff", boxShadow: "0 2px 8px rgba(255,68,68,0.4)" }}
                  title="Delete publication"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg flex-shrink-0 mt-1" style={{ background: "rgba(2,132,199,0.1)" }}>
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
                  <LatexText as="p" className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                    {pub.contribution}
                  </LatexText>
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
