"use client";

import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { ArrowLeft, ExternalLink, Github, Edit3, Trash2, Save, X } from "lucide-react";
import { mockProjects } from "@/data/mock";
import ImageGallery from "@/components/ImageGallery";

function markdownToHtml(md: string): string {
  return md
    .replace(/^### (.+)$/gm, '<h3 style="font-size:1.15rem;font-weight:700;margin:1.5rem 0 0.5rem;color:var(--text)">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 style="font-size:1.35rem;font-weight:700;margin:2rem 0 0.75rem;color:var(--text)">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 style="font-size:1.75rem;font-weight:800;margin:0 0 1rem;color:var(--text)">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`([^`]+)`/g, '<code style="background:var(--border);padding:0.15rem 0.4rem;border-radius:4px;font-size:0.85em;font-family:var(--font-mono)">$1</code>')
    .replace(/^- (.+)$/gm, '<li style="margin-left:1.5rem;list-style:disc;margin-bottom:0.25rem">$1</li>')
    .replace(/^\d+\. (.+)$/gm, '<li style="margin-left:1.5rem;list-style:decimal;margin-bottom:0.25rem">$1</li>')
    .replace(/\n\n/g, '</p><p style="margin-bottom:1rem;line-height:1.8">')
    .replace(/^/, '<p style="margin-bottom:1rem;line-height:1.8">')
    .concat("</p>");
}

export default function ProjectDetail() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();

  const baseProject = mockProjects.find((p) => p.id === params.id);

  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");

  // Load any saved edits from localStorage
  useEffect(() => {
    if (!baseProject) return;
    const saved = localStorage.getItem(`project-edit-${baseProject.id}`);
    if (saved) {
      const data = JSON.parse(saved);
      setTitle(data.title ?? baseProject.title);
      setDescription(data.description ?? baseProject.description);
      setContent(data.content ?? baseProject.content ?? "");
    } else {
      setTitle(baseProject.title);
      setDescription(baseProject.description);
      setContent(baseProject.content ?? "");
    }
  }, [baseProject]);

  if (!baseProject) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg)" }}>
        <p style={{ color: "var(--text-muted)" }}>Project not found.</p>
      </div>
    );
  }

  const handleSave = () => {
    localStorage.setItem(`project-edit-${baseProject.id}`, JSON.stringify({ title, description, content }));
    setEditing(false);
  };

  const handleCancel = () => {
    const saved = localStorage.getItem(`project-edit-${baseProject.id}`);
    if (saved) {
      const data = JSON.parse(saved);
      setTitle(data.title ?? baseProject.title);
      setDescription(data.description ?? baseProject.description);
      setContent(data.content ?? baseProject.content ?? "");
    } else {
      setTitle(baseProject.title);
      setDescription(baseProject.description);
      setContent(baseProject.content ?? "");
    }
    setEditing(false);
  };

  const handleDelete = () => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    const hidden = JSON.parse(localStorage.getItem("hidden-projects") || "[]") as string[];
    hidden.push(baseProject.id);
    localStorage.setItem("hidden-projects", JSON.stringify(hidden));
    localStorage.removeItem(`project-edit-${baseProject.id}`);
    router.push("/#projects");
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

        {editing ? (
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-4xl font-bold mb-4 w-full bg-transparent focus:outline-none"
            style={{ color: "var(--text)", borderBottom: "1px solid var(--border)" }}
          />
        ) : (
          <h1 className="text-4xl font-bold mb-4" style={{ color: "var(--text)" }}>
            {title}
          </h1>
        )}

        {editing ? (
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="text-sm mb-6 w-full bg-transparent focus:outline-none resize-y p-2 rounded-lg"
            style={{ color: "var(--accent-mid)", border: "1px solid var(--border)" }}
          />
        ) : (
          <p className="text-sm mb-6" style={{ color: "var(--accent-mid)" }}>
            {description}
          </p>
        )}

        <div className="flex flex-wrap gap-2 mb-6">
          {baseProject.tech.map((t) => (
            <span
              key={t}
              className="text-xs px-2 py-0.5 rounded-full"
              style={{
                background: "rgba(2,132,199,0.1)",
                color: "var(--accent-mid)",
                border: "1px solid rgba(2,132,199,0.2)",
              }}
            >
              {t}
            </span>
          ))}
        </div>

        <div className="flex gap-3 mb-4">
          {baseProject.link && (
            <a
              href={baseProject.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg transition-colors"
              style={{ color: "var(--accent-mid)", border: "1px solid rgba(2,132,199,0.3)" }}
            >
              <ExternalLink className="w-3.5 h-3.5" /> Live Site
            </a>
          )}
          {baseProject.github && (
            <a
              href={baseProject.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg transition-colors"
              style={{ color: "var(--accent-mid)", border: "1px solid rgba(2,132,199,0.3)" }}
            >
              <Github className="w-3.5 h-3.5" /> Source Code
            </a>
          )}
        </div>

        {session && !editing && (
          <div className="flex gap-2 mb-8">
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-1 text-xs px-3 py-1 rounded-lg transition-colors cursor-pointer"
              style={{ color: "var(--accent-mid)", border: "1px solid var(--border)" }}
            >
              <Edit3 className="w-3 h-3" /> Edit
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center gap-1 text-xs px-3 py-1 rounded-lg transition-colors cursor-pointer"
              style={{ color: "#ff6464", border: "1px solid rgba(255,100,100,0.3)" }}
            >
              <Trash2 className="w-3 h-3" /> Delete
            </button>
          </div>
        )}

        {editing && (
          <div className="flex gap-2 mb-8">
            <button
              onClick={handleSave}
              className="flex items-center gap-1 text-xs px-3 py-1 rounded-lg cursor-pointer"
              style={{ background: "var(--accent)", color: "#fff" }}
            >
              <Save className="w-3 h-3" /> Save
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center gap-1 text-xs px-3 py-1 rounded-lg cursor-pointer"
              style={{ color: "var(--text-muted)", border: "1px solid var(--border)" }}
            >
              <X className="w-3 h-3" /> Cancel
            </button>
          </div>
        )}

        {baseProject.images && baseProject.images.length > 0 && (
          <ImageGallery images={baseProject.images} />
        )}

        {editing ? (
          <div
            className="rounded-xl p-6 mt-6"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={16}
              className="w-full bg-transparent text-sm leading-relaxed focus:outline-none resize-y font-mono"
              style={{ color: "var(--text)", lineHeight: 1.8 }}
              placeholder="Project content (supports markdown)..."
            />
          </div>
        ) : content ? (
          <div
            className="rounded-xl p-6 mt-6"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <div
              className="text-sm"
              style={{ color: "var(--text)", lineHeight: 1.8 }}
              dangerouslySetInnerHTML={{ __html: markdownToHtml(content) }}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
