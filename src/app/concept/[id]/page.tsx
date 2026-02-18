"use client";

import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { ArrowLeft, Edit3, Save, X, Trash2 } from "lucide-react";
import { getAllConcepts, hideConcept } from "@/lib/concepts";
import { Concept } from "@/types";
import LatexText from "@/components/LatexText";

export default function ConceptDetail() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [concept, setConcept] = useState<Concept | null>(null);
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    const id = params.id as string;
    const allConcepts = getAllConcepts();
    const found = allConcepts.find((c) => c.id === id);
    if (found) {
      // Check for custom long_summary in localStorage
      const customSummary = localStorage.getItem(`concept-summary-${id}`);
      setConcept({ ...found, long_summary: customSummary || found.long_summary });
      setEditText(customSummary || found.long_summary);
    }
  }, [params.id]);

  const handleSave = () => {
    if (!concept) return;
    localStorage.setItem(`concept-summary-${concept.id}`, editText);
    setConcept({ ...concept, long_summary: editText });
    setEditing(false);
  };

  if (!concept) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg)" }}>
        <p style={{ color: "var(--text-muted)" }}>Concept not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-20" style={{ background: "var(--bg)" }}>
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 mb-8 text-sm transition-colors cursor-pointer"
          style={{ color: "var(--text-muted)" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent-mid)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="mb-2 text-xs font-mono" style={{ color: "var(--text-muted)" }}>
          Added {new Date(concept.date_learned).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
        </div>

        <h1 className="text-4xl font-bold mb-2" style={{ color: "var(--text)" }}>
          {concept.name}
        </h1>

        <LatexText as="p" className="text-sm mb-8" style={{ color: "var(--accent-mid)" }}>
          {concept.short_summary}
        </LatexText>

        <div className="p-6 rounded-xl" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
              Overview
            </h2>
            {session && !editing && (
              <div className="flex gap-2">
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-1 text-xs px-3 py-1 rounded-lg transition-colors cursor-pointer"
                  style={{ color: "var(--accent-mid)", border: "1px solid var(--border)" }}
                >
                  <Edit3 className="w-3 h-3" /> Edit
                </button>
                <button
                  onClick={() => {
                    if (!confirm(`Delete "${concept.name}"? This cannot be undone.`)) return;
                    hideConcept(concept.id);
                    router.push("/");
                  }}
                  className="flex items-center gap-1 text-xs px-3 py-1 rounded-lg transition-colors cursor-pointer"
                  style={{ color: "#ff6464", border: "1px solid rgba(255,100,100,0.3)" }}
                >
                  <Trash2 className="w-3 h-3" /> Delete
                </button>
              </div>
            )}
            {editing && (
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-1 text-xs px-3 py-1 rounded-lg cursor-pointer"
                  style={{ background: "var(--accent)", color: "#fff" }}
                >
                  <Save className="w-3 h-3" /> Save
                </button>
                <button
                  onClick={() => { setEditing(false); setEditText(concept.long_summary); }}
                  className="flex items-center gap-1 text-xs px-3 py-1 rounded-lg cursor-pointer"
                  style={{ color: "var(--text-muted)", border: "1px solid var(--border)" }}
                >
                  <X className="w-3 h-3" /> Cancel
                </button>
              </div>
            )}
          </div>

          {editing ? (
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              rows={8}
              className="w-full p-4 rounded-lg text-sm leading-relaxed focus:outline-none resize-y"
              style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)" }}
            />
          ) : (
            <LatexText as="div" className="text-sm leading-relaxed" style={{ color: "var(--text)", lineHeight: 1.8 }}>
              {concept.long_summary}
            </LatexText>
          )}
        </div>
      </div>
    </div>
  );
}
