"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { Publication } from "@/types";

export default function NewPublication() {
  const router = useRouter();
  const { data: session } = useSession();
  const [title, setTitle] = useState("");
  const [journal, setJournal] = useState("");
  const [date, setDate] = useState("");
  const [url, setUrl] = useState("");
  const [authors, setAuthors] = useState("");
  const [contribution, setContribution] = useState("");

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg)" }}>
        <p style={{ color: "var(--text-muted)" }}>Sign in to create publications.</p>
      </div>
    );
  }

  const handleSave = () => {
    if (!title.trim()) return;
    const slug = title.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);
    const pub: Publication = {
      id: slug,
      title: title.trim(),
      journal: journal.trim(),
      date: date.trim(),
      url: url.trim(),
      authors: authors.trim(),
      contribution: contribution.trim(),
    };
    const existing = JSON.parse(localStorage.getItem("user-publications") || "[]") as Publication[];
    existing.unshift(pub);
    localStorage.setItem("user-publications", JSON.stringify(existing));
    router.push("/#papers");
  };

  return (
    <div className="min-h-screen px-4 py-20" style={{ background: "var(--bg)" }}>
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => router.push("/#papers")}
          className="flex items-center gap-2 mb-8 text-sm transition-colors cursor-pointer"
          style={{ color: "var(--text-muted)" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent-mid)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <h1 className="text-3xl font-bold mb-8" style={{ color: "var(--text)" }}>New Publication</h1>

        <div className="rounded-xl p-6 space-y-5" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: "var(--text-muted)" }}>Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-3 rounded-lg text-sm focus:outline-none" style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)" }} placeholder="Publication title" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: "var(--text-muted)" }}>Journal</label>
              <input value={journal} onChange={(e) => setJournal(e.target.value)} className="w-full p-3 rounded-lg text-sm focus:outline-none" style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)" }} placeholder="Journal name" />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: "var(--text-muted)" }}>Year</label>
              <input value={date} onChange={(e) => setDate(e.target.value)} className="w-full p-3 rounded-lg text-sm focus:outline-none" style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)" }} placeholder="2025" />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: "var(--text-muted)" }}>URL</label>
            <input value={url} onChange={(e) => setUrl(e.target.value)} className="w-full p-3 rounded-lg text-sm focus:outline-none" style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)" }} placeholder="https://..." />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: "var(--text-muted)" }}>Authors</label>
            <input value={authors} onChange={(e) => setAuthors(e.target.value)} className="w-full p-3 rounded-lg text-sm focus:outline-none" style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)" }} placeholder="Author 1, Author 2, et al." />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: "var(--text-muted)" }}>Contribution</label>
            <textarea value={contribution} onChange={(e) => setContribution(e.target.value)} rows={5} className="w-full p-3 rounded-lg text-sm leading-relaxed focus:outline-none resize-y" style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)" }} placeholder="Describe your contribution..." />
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={handleSave} className="flex items-center gap-1.5 text-sm px-4 py-2 rounded-lg cursor-pointer transition-colors" style={{ background: "var(--accent)", color: "#fff" }}>
              <Save className="w-3.5 h-3.5" /> Save
            </button>
            <button onClick={() => router.push("/#papers")} className="flex items-center gap-1.5 text-sm px-4 py-2 rounded-lg cursor-pointer transition-colors" style={{ color: "var(--text-muted)", border: "1px solid var(--border)" }}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
