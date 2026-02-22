"use client";

import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ArrowLeft, Edit3, Trash2 } from "lucide-react";
import { mockPosts } from "@/data/mock";

function markdownToHtml(md: string): string {
  return md
    .replace(/^### (.+)$/gm, '<h3 style="font-size:1.15rem;font-weight:700;margin:1.5rem 0 0.5rem;color:var(--text)">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 style="font-size:1.35rem;font-weight:700;margin:2rem 0 0.75rem;color:var(--text)">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 style="font-size:1.75rem;font-weight:800;margin:0 0 1rem;color:var(--text)">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`([^`]+)`/g, '<code style="background:var(--border);padding:0.15rem 0.4rem;border-radius:4px;font-size:0.85em">$1</code>')
    .replace(/^- (.+)$/gm, '<li style="margin-left:1.5rem;list-style:disc;margin-bottom:0.25rem">$1</li>')
    .replace(/^\d+\. (.+)$/gm, '<li style="margin-left:1.5rem;list-style:decimal;margin-bottom:0.25rem">$1</li>')
    .replace(/\n\n/g, '</p><p style="margin-bottom:1rem;line-height:1.8">')
    .replace(/^/, '<p style="margin-bottom:1rem;line-height:1.8">')
    .concat("</p>");
}

export default function PostDetail() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();

  const post = mockPosts.find((p) => p.id === params.id);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg)" }}>
        <p style={{ color: "var(--text-muted)" }}>Post not found.</p>
      </div>
    );
  }

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

        <div className="mb-2 text-xs font-mono" style={{ color: "var(--text-muted)" }}>
          {new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
        </div>

        <h1 className="text-4xl font-bold mb-4" style={{ color: "var(--text)" }}>
          {post.title}
        </h1>

        <div className="flex flex-wrap gap-2 mb-8">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 rounded-full"
              style={{
                background: "rgba(2,132,199,0.1)",
                color: "var(--accent-mid)",
                border: "1px solid rgba(2,132,199,0.2)",
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {session && (
          <div className="flex gap-2 mb-8">
            <button
              className="flex items-center gap-1 text-xs px-3 py-1 rounded-lg transition-colors cursor-pointer"
              style={{ color: "var(--accent-mid)", border: "1px solid var(--border)" }}
            >
              <Edit3 className="w-3 h-3" /> Edit
            </button>
            <button
              className="flex items-center gap-1 text-xs px-3 py-1 rounded-lg transition-colors cursor-pointer"
              style={{ color: "#ff6464", border: "1px solid rgba(255,100,100,0.3)" }}
            >
              <Trash2 className="w-3 h-3" /> Delete
            </button>
          </div>
        )}

        <div
          className="rounded-xl p-6"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <div
            className="text-sm"
            style={{ color: "var(--text)", lineHeight: 1.8 }}
            dangerouslySetInnerHTML={{ __html: markdownToHtml(post.content) }}
          />
        </div>
      </div>
    </div>
  );
}
