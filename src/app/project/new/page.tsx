"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { ArrowLeft, Save, X } from "lucide-react";
import { Project } from "@/types";
import ImageUploader from "@/components/ImageUploader";

export default function NewProject() {
  const router = useRouter();
  const { data: session } = useSession();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tech, setTech] = useState<string[]>([]);
  const [techInput, setTechInput] = useState("");
  const [content, setContent] = useState("");
  const [link, setLink] = useState("");
  const [github, setGithub] = useState("");
  const [images, setImages] = useState<string[]>([]);

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg)" }}>
        <p style={{ color: "var(--text-muted)" }}>Sign in to create projects.</p>
      </div>
    );
  }

  const handleSave = () => {
    if (!title.trim()) return;
    const slug = title.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const project: Project = {
      id: slug,
      title: title.trim(),
      description: description.trim(),
      content: content.trim() || undefined,
      tech,
      link: link.trim() || undefined,
      github: github.trim() || undefined,
      images: images.length > 0 ? images : undefined,
    };
    const existing = JSON.parse(localStorage.getItem("user-projects") || "[]") as Project[];
    existing.unshift(project);
    localStorage.setItem("user-projects", JSON.stringify(existing));
    router.push("/#projects");
  };

  const removeTech = (t: string) => setTech((prev) => prev.filter((x) => x !== t));
  const addTech = () => {
    const t = techInput.trim();
    if (t && !tech.includes(t)) setTech((prev) => [...prev, t]);
    setTechInput("");
  };

  return (
    <div className="min-h-screen px-4 py-20" style={{ background: "var(--bg)" }}>
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => router.push("/#projects")}
          className="flex items-center gap-2 mb-8 text-sm transition-colors cursor-pointer"
          style={{ color: "var(--text-muted)" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent-mid)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <h1 className="text-3xl font-bold mb-8" style={{ color: "var(--text)" }}>New Project</h1>

        <div className="rounded-xl p-6 space-y-5" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: "var(--text-muted)" }}>Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-3 rounded-lg text-sm focus:outline-none" style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)" }} placeholder="Project title" />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: "var(--text-muted)" }}>Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className="w-full p-3 rounded-lg text-sm focus:outline-none resize-y" style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)" }} placeholder="Short description..." />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: "var(--text-muted)" }}>Tech Tags</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tech.map((t) => (
                <span key={t} className="text-xs px-2 py-0.5 rounded-full flex items-center gap-1" style={{ background: "rgba(2,132,199,0.1)", color: "var(--accent-mid)", border: "1px solid rgba(2,132,199,0.2)" }}>
                  {t}
                  <button onClick={() => removeTech(t)} className="hover:text-red-400 cursor-pointer"><X className="w-3 h-3" /></button>
                </span>
              ))}
            </div>
            <input value={techInput} onChange={(e) => setTechInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTech(); } }} placeholder="Add tech + Enter" className="text-xs px-3 py-1.5 rounded-lg focus:outline-none" style={{ background: "var(--bg)", color: "var(--text)", border: "1px solid var(--border)" }} />
          </div>

          <ImageUploader images={images} onChange={setImages} />

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: "var(--text-muted)" }}>Content</label>
            <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={12} className="w-full p-3 rounded-lg text-sm leading-relaxed focus:outline-none resize-y font-mono" style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)", lineHeight: 1.8 }} placeholder="Write project details (markdown supported)..." />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: "var(--text-muted)" }}>Link (optional)</label>
              <input value={link} onChange={(e) => setLink(e.target.value)} className="w-full p-3 rounded-lg text-sm focus:outline-none" style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)" }} placeholder="https://..." />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: "var(--text-muted)" }}>GitHub (optional)</label>
              <input value={github} onChange={(e) => setGithub(e.target.value)} className="w-full p-3 rounded-lg text-sm focus:outline-none" style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)" }} placeholder="https://github.com/..." />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={handleSave} className="flex items-center gap-1.5 text-sm px-4 py-2 rounded-lg cursor-pointer transition-colors" style={{ background: "var(--accent)", color: "#fff" }}>
              <Save className="w-3.5 h-3.5" /> Save
            </button>
            <button onClick={() => router.push("/#projects")} className="flex items-center gap-1.5 text-sm px-4 py-2 rounded-lg cursor-pointer transition-colors" style={{ color: "var(--text-muted)", border: "1px solid var(--border)" }}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
