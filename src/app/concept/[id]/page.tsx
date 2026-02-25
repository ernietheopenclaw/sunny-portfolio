"use client";

import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { ArrowLeft, Edit3, Save, X, Trash2, Sparkles, Loader2 } from "lucide-react";
import { getAllConceptsAsync, saveConceptToDb, hideConceptInDb, invalidateConceptsCache } from "@/lib/concepts";
import { Concept } from "@/types";
import LatexText from "@/components/LatexText";
import ImageGallery from "@/components/ImageGallery";
import ImageUploader from "@/components/ImageUploader";
import { renderLatex } from "@/lib/latex";
import { parseLocalDate } from "@/lib/date";

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
  // Match code fences: ```lang (with optional space/newline variations)
  let processed = convertTablesToLists(md).replace(/```(\w*)\s*\n([\s\S]*?)```/g, (_m, lang, code) => {
    const idx = codeBlocks.length;
    // HTML-escape the code content to prevent tags from being interpreted
    const escaped = code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    codeBlocks.push(`<pre style="background:var(--bg);padding:1rem;border-radius:8px;overflow-x:auto;margin:1rem 0;border:1px solid var(--border)"><code style="font-size:0.85em;font-family:var(--font-mono);color:var(--text-muted)">${escaped}</code></pre>`);
    return `\n%%CODEBLOCK_${idx}%%\n`;
  });
  // Also handle inline code before LaTeX extraction (protect backtick content)
  const inlineCodeBlocks: string[] = [];
  processed = processed.replace(/`([^`]+)`/g, (_m, code) => {
    const idx = inlineCodeBlocks.length;
    const escaped = code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    inlineCodeBlocks.push(`<code style="background:var(--border);padding:0.15rem 0.4rem;border-radius:4px;font-size:0.85em;font-family:var(--font-mono)">${escaped}</code>`);
    return `%%INLINECODE_${idx}%%`;
  });

  // Pre-process: convert \$ (escaped dollar for currency) to plain dollar sign
  // This prevents \$ from interfering with LaTeX $ delimiters
  processed = processed.replace(/\\\$/g, "＄");

  // Extract LaTeX blocks BEFORE markdown processing to protect * _ etc inside math
  const latexBlocks: string[] = [];
  // Block LaTeX: $$...$$ and \[...\]
  processed = processed.replace(/\$\$([\s\S]*?)\$\$/g, (_m, tex) => {
    const idx = latexBlocks.length;
    latexBlocks.push(`$$${tex}$$`);
    return `%%LATEX_${idx}%%`;
  });
  processed = processed.replace(/\\\[([\s\S]*?)\\\]/g, (_m, tex) => {
    const idx = latexBlocks.length;
    latexBlocks.push(`\\[${tex}\\]`);
    return `%%LATEX_${idx}%%`;
  });
  // Inline LaTeX: $...$ and \(...\)
  // Must NOT start with digit+letter (avoid $1M, $100B etc currency)
  // Content must look like math: contain \, ^, _, {, }, or be short (≤30 chars, likely a variable)
  processed = processed.replace(/\$(?!\d[A-Za-z])([^\$\n]+?)\$/g, (_m, tex) => {
    const looksLikeMath = /[\\^_{}]/.test(tex) || tex.length <= 30;
    if (!looksLikeMath) return _m; // leave as-is, not LaTeX
    const idx = latexBlocks.length;
    latexBlocks.push(`$${tex}$`);
    return `%%LATEX_${idx}%%`;
  });
  processed = processed.replace(/\\\((.+?)\\\)/g, (_m, tex) => {
    const idx = latexBlocks.length;
    latexBlocks.push(`\\(${tex}\\)`);
    return `%%LATEX_${idx}%%`;
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
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/\n\n/g, '</p><p style="margin-bottom:1rem;line-height:1.8">')
    .replace(/^/, '<p style="margin-bottom:1rem;line-height:1.8">')
    .concat("</p>");

  // Restore code blocks and inline code
  html = html.replace(/%%CODEBLOCK_(\d+)%%/g, (_m, idx) => codeBlocks[parseInt(idx)]);
  html = html.replace(/%%INLINECODE_(\d+)%%/g, (_m, idx) => inlineCodeBlocks[parseInt(idx)]);

  // Restore LaTeX blocks (before renderLatex processes them)
  html = html.replace(/%%LATEX_(\d+)%%/g, (_m, idx) => latexBlocks[parseInt(idx)]);

  html = renderLatex(html);
  // Restore fullwidth dollar signs to normal $
  html = html.replace(/＄/g, "$");
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
  const [editDate, setEditDate] = useState("");
  const [generatingSummary, setGeneratingSummary] = useState(false);
  const [generatingOverview, setGeneratingOverview] = useState(false);

  const generateField = async (field: "short_summary" | "long_summary") => {
    const name = editName || concept?.name;
    if (!name) return;
    const setter = field === "short_summary" ? setGeneratingSummary : setGeneratingOverview;
    setter(true);
    try {
      const authType = localStorage.getItem("auth-type") || "apikey";
      const modelId = localStorage.getItem("concept-model") || "claude-sonnet-4-6";
      const summaryLength = parseInt(localStorage.getItem("summary-length") || "4", 10);
      // Note: settings are still read from localStorage for auth credentials (API keys, OAuth tokens)
      // since those are sensitive and shouldn't be stored in the DB
      const body: Record<string, unknown> = { name, authType, summaryLength, modelId };
      if (authType === "oauth-browser") {
        const creds = localStorage.getItem("anthropic-oauth-credentials");
        if (!creds) { alert("Please sign in with Anthropic first in Settings."); return; }
        body.oauthCredentials = JSON.parse(creds);
        body.authType = "oauth";
      } else if (authType === "oauth") {
        const token = localStorage.getItem("anthropic-oauth-token");
        if (!token) { alert("Please configure your OAuth token in Settings."); return; }
        body.oauthToken = token;
      } else {
        const key = localStorage.getItem("anthropic-api-key");
        if (!key) { alert("Please configure your API key in Settings."); return; }
        body.apiKey = key;
      }
      const res = await fetch("/api/concepts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (!res.ok) { const err = await res.json(); alert(err.error || "Generation failed"); return; }
      const data = await res.json();
      if (data.refreshedCredentials) localStorage.setItem("anthropic-oauth-credentials", JSON.stringify(data.refreshedCredentials));
      if (field === "short_summary") setEditShortSummary(data.short_summary);
      else setEditLongSummary(data.long_summary);
    } catch (e) { alert("Failed to generate: " + (e instanceof Error ? e.message : String(e))); } finally { setter(false); }
  };

  useEffect(() => {
    const id = params.id as string;
    getAllConceptsAsync().then((allConcepts) => {
      const found = allConcepts.find((c) => c.id === id);
      if (found) {
        setConcept(found);
        setEditName(found.name);
        setEditShortSummary(found.short_summary);
        setEditLongSummary(found.long_summary);
        setImages(found.images ?? []);
        setEditDate(found.date_learned);
      }
    });
  }, [params.id]);

  const handleSave = async () => {
    if (!concept) return;
    const updates = { id: concept.id, name: editName, short_summary: editShortSummary, long_summary: editLongSummary, images, date_learned: editDate };
    setConcept({ ...concept, ...updates });
    setEditing(false);
    try {
      await saveConceptToDb(updates);
    } catch {
      // silently fail, data is still shown from local state
    }
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

        <div className="mb-2 text-xs font-mono flex items-center gap-2" style={{ color: "var(--text-muted)" }}>
          {editing ? (
            <>
              Added{" "}
              <input
                type="date"
                value={editDate}
                onChange={(e) => setEditDate(e.target.value)}
                className="px-2 py-0.5 rounded text-xs font-mono focus:outline-none"
                style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)" }}
              />
            </>
          ) : (
            <>Added {parseLocalDate(concept.date_learned).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</>
          )}
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
          <div className="flex gap-2 mb-8 items-start">
            <textarea
              value={editShortSummary}
              onChange={(e) => setEditShortSummary(e.target.value)}
              rows={2}
              className="text-sm flex-1 bg-transparent focus:outline-none resize-y p-2 rounded-lg"
              style={{ color: "var(--accent-mid)", border: "1px solid var(--border)" }}
            />
            <button
              onClick={() => generateField("short_summary")}
              disabled={generatingSummary}
              className="flex items-center gap-1 text-xs px-3 py-1 rounded-lg cursor-pointer disabled:opacity-50 shrink-0 mt-1"
              style={{ color: "var(--accent-mid)", border: "1px solid var(--border)" }}
              title="Auto-generate summary"
            >
              {generatingSummary ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
              Generate
            </button>
          </div>
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
                  onClick={async () => {
                    if (!confirm(`Delete "${concept.name}"? This cannot be undone.`)) return;
                    try {
                      const res = await fetch("/api/db/concepts", {
                        method: "DELETE",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ id: concept.id }),
                      });
                      if (!res.ok) throw new Error("Failed");
                    } catch (e) {
                      alert("Failed to delete concept. Are you logged in?");
                      return;
                    }
                    invalidateConceptsCache();
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
                  onClick={() => generateField("long_summary")}
                  disabled={generatingOverview}
                  className="flex items-center gap-1 text-xs px-3 py-1 rounded-lg cursor-pointer disabled:opacity-50"
                  style={{ color: "var(--accent-mid)", border: "1px solid var(--border)" }}
                >
                  {generatingOverview ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                  Generate
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-1 text-xs px-3 py-1 rounded-lg cursor-pointer"
                  style={{ background: "var(--accent)", color: "#fff" }}
                >
                  <Save className="w-3 h-3" /> Save
                </button>
                <button
                  onClick={() => { setEditing(false); setEditName(concept.name); setEditShortSummary(concept.short_summary); setEditLongSummary(concept.long_summary); setEditDate(concept.date_learned); }}
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
