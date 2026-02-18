"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ArrowLeft, Sparkles, Loader2, Save, Check, Key } from "lucide-react";
import { Concept } from "@/types";

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // API config
  const [apiKey, setApiKey] = useState("");
  const [apiKeyStatus, setApiKeyStatus] = useState<"none" | "configured">("none");

  // Concept generation
  const [conceptName, setConceptName] = useState("");
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState<{ short_summary: string; long_summary: string; x: number; y: number; z: number } | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("anthropic-api-key");
    if (stored) {
      setApiKey(stored);
      setApiKeyStatus("configured");
    }
  }, []);

  const saveApiKey = () => {
    localStorage.setItem("anthropic-api-key", apiKey);
    setApiKeyStatus(apiKey ? "configured" : "none");
  };

  const handleGenerate = async () => {
    if (!conceptName.trim()) return;
    const key = localStorage.getItem("anthropic-api-key");
    if (!key) {
      alert("Please configure your Anthropic API key first.");
      return;
    }
    setLoading(true);
    setGenerated(null);
    setSaved(false);
    try {
      const res = await fetch("/api/concepts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: conceptName, apiKey: key }),
      });
      if (!res.ok) {
        const err = await res.json();
        alert(err.error || "Generation failed");
        return;
      }
      const data = await res.json();
      setGenerated(data);
    } catch {
      alert("Failed to generate concept.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (!generated) return;
    const concept: Concept = {
      id: Date.now().toString(),
      name: conceptName,
      short_summary: generated.short_summary,
      long_summary: generated.long_summary,
      x: generated.x,
      y: generated.y,
      z: generated.z,
      date_learned: new Date().toISOString().split("T")[0],
    };
    const existing = localStorage.getItem("sunny-concepts");
    const concepts: Concept[] = existing ? JSON.parse(existing) : [];
    concepts.push(concept);
    localStorage.setItem("sunny-concepts", JSON.stringify(concepts));
    setSaved(true);
    setConceptName("");
    setGenerated(null);
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg)" }}>
        <Loader2 className="w-6 h-6 animate-spin" style={{ color: "var(--accent-mid)" }} />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--bg)" }}>
        <div className="text-center">
          <p className="mb-4" style={{ color: "var(--text-muted)" }}>You must be logged in to access settings.</p>
          <button onClick={() => router.push("/")} className="px-4 py-2 rounded-lg text-sm" style={{ background: "var(--accent)", color: "#fff" }}>
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-20" style={{ background: "var(--bg)" }}>
      <div className="max-w-xl mx-auto">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 mb-8 text-sm transition-colors cursor-pointer"
          style={{ color: "var(--text-muted)" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent-mid)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <h1 className="text-3xl font-bold mb-8" style={{ color: "var(--text)" }}>Settings</h1>

        {/* API Configuration */}
        <section className="p-6 rounded-xl mb-8" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: "var(--text)" }}>
            <Key className="w-5 h-5" /> API Configuration
          </h2>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs px-2 py-1 rounded-full" style={{
              background: apiKeyStatus === "configured" ? "rgba(33,131,128,0.15)" : "rgba(255,255,255,0.05)",
              color: apiKeyStatus === "configured" ? "var(--accent-mid)" : "var(--text-muted)",
            }}>
              {apiKeyStatus === "configured" ? "✓ Configured" : "Not configured"}
            </span>
          </div>
          <label className="text-sm block mb-2" style={{ color: "var(--text-muted)" }}>Anthropic API Key</label>
          <div className="flex gap-2">
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-ant-..."
              className="flex-1 px-3 py-2 rounded-lg text-sm focus:outline-none"
              style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)" }}
            />
            <button
              onClick={saveApiKey}
              className="px-4 py-2 rounded-lg text-sm font-medium cursor-pointer"
              style={{ background: "var(--accent)", color: "#fff" }}
            >
              <Save className="w-4 h-4" />
            </button>
          </div>
        </section>

        {/* Add Learning */}
        <section className="p-6 rounded-xl" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: "var(--text)" }}>
            <Sparkles className="w-5 h-5" /> Add New Learning
          </h2>

          {apiKeyStatus === "none" && (
            <p className="text-sm mb-4 p-3 rounded-lg" style={{ background: "rgba(255,200,0,0.1)", color: "var(--text-muted)" }}>
              Please configure your Anthropic API key above first.
            </p>
          )}

          <label className="text-sm block mb-2" style={{ color: "var(--text-muted)" }}>Concept Name</label>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={conceptName}
              onChange={(e) => setConceptName(e.target.value)}
              placeholder="e.g., Backpropagation"
              className="flex-1 px-3 py-2 rounded-lg text-sm focus:outline-none"
              style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)" }}
            />
            <button
              onClick={handleGenerate}
              disabled={loading || !conceptName.trim()}
              className="px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 disabled:opacity-50 cursor-pointer"
              style={{ background: "var(--accent)", color: "#fff" }}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              Generate
            </button>
          </div>

          {generated && (
            <div className="p-4 rounded-lg mb-4" style={{ background: "var(--bg)", border: "1px solid var(--border)" }}>
              <h3 className="text-sm font-semibold mb-2" style={{ color: "var(--accent-mid)" }}>Preview</h3>
              <p className="text-xs mb-2" style={{ color: "var(--text-muted)" }}><strong>Short:</strong> {generated.short_summary}</p>
              <p className="text-xs mb-4" style={{ color: "var(--text-muted)" }}><strong>Detailed:</strong> {generated.long_summary}</p>
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 cursor-pointer"
                style={{ background: "var(--accent)", color: "#fff" }}
              >
                <Save className="w-4 h-4" /> Save Learning
              </button>
            </div>
          )}

          {saved && (
            <div className="flex items-center gap-2 text-sm p-3 rounded-lg" style={{ background: "rgba(33,131,128,0.1)", color: "var(--accent-mid)" }}>
              <Check className="w-4 h-4" /> Learning saved! It will appear in the visualization.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
