"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { ArrowLeft, Save, X } from "lucide-react";
import { Post } from "@/types";

export default function NewPost() {
  const router = useRouter();
  const { data: session } = useSession();
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [content, setContent] = useState("");

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg)" }}>
        <p style={{ color: "var(--text-muted)" }}>Sign in to create posts.</p>
      </div>
    );
  }

  const handleSave = () => {
    if (!title.trim()) return;
    const slug = title.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const post: Post = {
      id: slug,
      title: title.trim(),
      excerpt: excerpt.trim(),
      content: content.trim(),
      date: new Date().toISOString().split("T")[0],
      tags,
    };
    const existing = JSON.parse(localStorage.getItem("user-posts") || "[]") as Post[];
    existing.unshift(post);
    localStorage.setItem("user-posts", JSON.stringify(existing));
    router.push("/#posts");
  };

  const removeTag = (tag: string) => setTags((prev) => prev.filter((t) => t !== tag));
  const addTag = () => {
    const t = tagInput.trim();
    if (t && !tags.includes(t)) setTags((prev) => [...prev, t]);
    setTagInput("");
  };

  return (
    <div className="min-h-screen px-4 py-20" style={{ background: "var(--bg)" }}>
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => router.push("/#posts")}
          className="flex items-center gap-2 mb-8 text-sm transition-colors cursor-pointer"
          style={{ color: "var(--text-muted)" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent-mid)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <h1 className="text-3xl font-bold mb-8" style={{ color: "var(--text)" }}>New Post</h1>

        <div className="rounded-xl p-6 space-y-5" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: "var(--text-muted)" }}>Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 rounded-lg text-sm focus:outline-none"
              style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)" }}
              placeholder="Post title"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: "var(--text-muted)" }}>Excerpt</label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={3}
              className="w-full p-3 rounded-lg text-sm focus:outline-none resize-y"
              style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)" }}
              placeholder="Short excerpt..."
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: "var(--text-muted)" }}>Tags</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-0.5 rounded-full flex items-center gap-1"
                  style={{ background: "rgba(2,132,199,0.1)", color: "var(--accent-mid)", border: "1px solid rgba(2,132,199,0.2)" }}
                >
                  {tag}
                  <button onClick={() => removeTag(tag)} className="hover:text-red-400 cursor-pointer"><X className="w-3 h-3" /></button>
                </span>
              ))}
            </div>
            <input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
              placeholder="Add tag + Enter"
              className="text-xs px-3 py-1.5 rounded-lg focus:outline-none"
              style={{ background: "var(--bg)", color: "var(--text)", border: "1px solid var(--border)" }}
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: "var(--text-muted)" }}>Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={12}
              className="w-full p-3 rounded-lg text-sm leading-relaxed focus:outline-none resize-y font-mono"
              style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)", lineHeight: 1.8 }}
              placeholder="Write your post (markdown supported)..."
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 text-sm px-4 py-2 rounded-lg cursor-pointer transition-colors"
              style={{ background: "var(--accent)", color: "#fff" }}
            >
              <Save className="w-3.5 h-3.5" /> Save
            </button>
            <button
              onClick={() => router.push("/#posts")}
              className="flex items-center gap-1.5 text-sm px-4 py-2 rounded-lg cursor-pointer transition-colors"
              style={{ color: "var(--text-muted)", border: "1px solid var(--border)" }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
