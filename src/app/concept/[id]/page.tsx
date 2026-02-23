"use client";

import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { ArrowLeft, Edit3, Save, X, Trash2 } from "lucide-react";
import { getAllConcepts, hideConcept } from "@/lib/concepts";
import { Concept } from "@/types";
import LatexText from "@/components/LatexText";
import ImageGallery from "@/components/ImageGallery";
import ImageUploader from "@/components/ImageUploader";
import { renderLatex } from "@/lib/latex";

function convertTablesToLists(md: string): string {
  // Convert markdown tables to bullet lists
  const lines = md.split('\n');
  const result: string[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    // Detect table header row (has |)
    if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
      // Parse header
      const headers = line.split('|').map(c => c.trim()).filter(Boolean);
      // Skip separator row (|---|---|)
      if (i + 1 < lines.length && /^\|[\s\-:|]+\|$/.test(lines[i + 1].trim())) {
        i += 2; // skip header + separator
        // Parse data rows
        while (i < lines.length && lines[i].trim().startsWith('|') && lines[i].trim().endsWith('|')) {
          const cells = lines[i].split('|').map(c => c.trim()).filter(Boolean);
          const parts = cells.map((cell, idx) => headers[idx] ? `**${headers[idx]}:** ${cell}` : cell).join(' — ');
          result.push(`- ${parts}`);
          i++;
        }
        continue;
      }
    }
    result.push(line);
    i++;
  }
  return result.join('\n');
}

function markdownToHtml(md: string): string {
  // Pre-process: extract code blocks to protect them
  const codeBlocks: string[] = [];
  let processed = convertTablesToLists(md).replace(/```(\w*)\n([\s\S]*?)```/g, (_m, lang, code) => {
    const idx = codeBlocks.length;
    codeBlocks.push(`<pre style="background:var(--bg);padding:1rem;border-radius:8px;overflow-x:auto;margin:1rem 0;border:1px solid var(--border)"><code style="font-size:0.85em;font-family:var(--font-mono);color:var(--text-muted)">${code}</code></pre>`);
    return `\n%%CODEBLOCK_${idx}%%\n`;
  });

  // Remove horizontal rules (--- or ___ or ***)
  processed = processed.replace(/^[\s]*[-_*]{3,}[\s]*$/gm, '');

  // Process line by line to properly wrap lists (supports nested bullets)
  const lines = processed.split('\n');
  const output: string[] = [];
  type ListType = 'ul' | 'ol';
  const listStack: ListType[] = [];

  function closeListsTo(depth: number) {
    while (listStack.length > depth) {
      const t = listStack.pop();
      output.push(t === 'ol' ? '</ol>' : '</ul>');
    }
  }

  for (const line of lines) {
    // Match bullets at any indent: "- ", "  - ", "    - " etc.
    const ulMatch = line.match(/^(\s*)[-•]\s+(.+)$/);
    const olMatch = line.match(/^(\s*)\d+\.\s+(.+)$/);

    if (ulMatch) {
      const depth = Math.floor(ulMatch[1].length / 2) + 1;
      if (depth > listStack.length) {
        // Open new nested ul
        while (listStack.length < depth) {
          output.push('<ul style="margin:0.25rem 0;padding-left:1.5rem">');
          listStack.push('ul');
        }
      } else {
        closeListsTo(depth);
      }
      output.push(`<li style="list-style:disc;margin-bottom:0.25rem">${ulMatch[2]}</li>`);
    } else if (olMatch) {
      const depth = Math.floor(olMatch[1].length / 2) + 1;
      if (depth > listStack.length) {
        while (listStack.length < depth) {
          output.push('<ol style="margin:0.25rem 0;padding-left:1.5rem">');
          listStack.push('ol');
        }
      } else {
        closeListsTo(depth);
      }
      output.push(`<li style="list-style:decimal;margin-bottom:0.25rem">${olMatch[2]}</li>`);
    } else {
      closeListsTo(0);
      output.push(line);
    }
  }
  closeListsTo(0);

  let html = output.join('\n')
    .replace(/^### (.+)$/gm, '<h3 style="font-size:1.15rem;font-weight:700;margin:1.5rem 0 0.5rem;color:var(--text)">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 style="font-size:1.35rem;font-weight:700;margin:2rem 0 0.75rem;color:var(--accent-mid)">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 style="font-size:1.75rem;font-weight:800;margin:0 0 1rem;color:var(--text)">$1</h1>')
    .replace(/`([^`]+)`/g, '<code style="background:var(--border);padding:0.15rem 0.4rem;border-radius:4px;font-size:0.85em;font-family:var(--font-mono)">$1</code>')
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/\n\n/g, '</p><p style="margin-bottom:1rem;line-height:1.8">')
    .replace(/^/, '<p style="margin-bottom:1rem;line-height:1.8">')
    .concat("</p>");

  // Restore code blocks
  html = html.replace(/%%CODEBLOCK_(\d+)%%/g, (_m, idx) => codeBlocks[parseInt(idx)]);

  html = renderLatex(html);
  return html;
}

export default function ConceptDetail() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [concept, setConcept] = useState<Concept | null>(null);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editShortSummary, setEditShortSummary] = useState("");
  const [editLongSummary, setEditLongSummary] = useState("");
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    const id = params.id as string;
    const allConcepts = getAllConcepts();
    const found = allConcepts.find((c) => c.id === id);
    if (found) {
      // Migrate old key if exists
      const oldKey = localStorage.getItem(`concept-summary-${id}`);
      const savedRaw = localStorage.getItem(`concept-edit-${id}`);
      let saved: { name?: string; short_summary?: string; long_summary?: string } | null = null;
      if (savedRaw) {
        saved = JSON.parse(savedRaw);
      } else if (oldKey) {
        saved = { long_summary: oldKey };
        localStorage.setItem(`concept-edit-${id}`, JSON.stringify(saved));
        localStorage.removeItem(`concept-summary-${id}`);
      }
      const name = saved?.name || found.name;
      const short_summary = saved?.short_summary || found.short_summary;
      const long_summary = saved?.long_summary || found.long_summary;
      const imgs = (saved as Record<string, unknown>)?.images as string[] ?? found.images ?? [];
      setConcept({ ...found, name, short_summary, long_summary, images: imgs });
      setEditName(name);
      setEditShortSummary(short_summary);
      setEditLongSummary(long_summary);
      setImages(imgs);
    }
  }, [params.id]);

  const handleSave = () => {
    if (!concept) return;
    localStorage.setItem(`concept-edit-${concept.id}`, JSON.stringify({ name: editName, short_summary: editShortSummary, long_summary: editLongSummary, images }));
    setConcept({ ...concept, name: editName, short_summary: editShortSummary, long_summary: editLongSummary, images });
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

        {editing ? (
          <input
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            className="text-4xl font-bold mb-2 w-full bg-transparent focus:outline-none"
            style={{ color: "var(--text)", borderBottom: "1px solid var(--border)" }}
          />
        ) : (
          <h1 className="text-4xl font-bold mb-2" style={{ color: "var(--text)" }}>
            {concept.name}
          </h1>
        )}

        {editing ? (
          <textarea
            value={editShortSummary}
            onChange={(e) => setEditShortSummary(e.target.value)}
            rows={2}
            className="text-sm mb-8 w-full bg-transparent focus:outline-none resize-y p-2 rounded-lg"
            style={{ color: "var(--accent-mid)", border: "1px solid var(--border)" }}
          />
        ) : (
          <LatexText as="p" className="text-sm mb-8" style={{ color: "var(--accent-mid)" }}>
            {concept.short_summary}
          </LatexText>
        )}

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
                  onClick={() => { setEditing(false); setEditName(concept.name); setEditShortSummary(concept.short_summary); setEditLongSummary(concept.long_summary); }}
                  className="flex items-center gap-1 text-xs px-3 py-1 rounded-lg cursor-pointer"
                  style={{ color: "var(--text-muted)", border: "1px solid var(--border)" }}
                >
                  <X className="w-3 h-3" /> Cancel
                </button>
              </div>
            )}
          </div>

          {editing ? (
            <>
              <textarea
                value={editLongSummary}
                onChange={(e) => setEditLongSummary(e.target.value)}
                rows={8}
                className="w-full p-4 rounded-lg text-sm leading-relaxed focus:outline-none resize-y"
                style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)" }}
              />
              <ImageUploader images={images} onChange={setImages} />
            </>
          ) : (
            <>
              <div
                className="text-sm leading-relaxed"
                style={{ color: "var(--text)", lineHeight: 1.8 }}
                dangerouslySetInnerHTML={{ __html: markdownToHtml(concept.long_summary.replace(/^##?\s*Overview\s*\n+/i, "")) }}
              />
              {concept.images && concept.images.length > 0 && (
                <ImageGallery images={concept.images} />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
