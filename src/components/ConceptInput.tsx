"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Sparkles, Loader2, Calendar } from "lucide-react";
import { addUserConcept } from "@/lib/concepts";
import { getEmbedding } from "@/lib/embedding-model";

export default function ConceptInput({ onConceptAdded }: { onConceptAdded?: () => void }) {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [concept, setConcept] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const isLoggedIn = !!session;

  if (!isLoggedIn) {
    return (
      <div className="fixed bottom-6 right-6 z-30">
        <button
          onClick={() => alert("Please log in to add concepts")}
          className="p-3 rounded-full backdrop-blur-sm transition-all"
          style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text-muted)" }}
          title="Log in to add concepts"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!concept.trim()) return;
    setLoading(true);
    setError("");

    try {
      // Get auth credentials from localStorage
      const authType = localStorage.getItem("auth-type") || "apikey";
      const apiKey = localStorage.getItem("anthropic-api-key") || "";
      const summaryLength = parseInt(localStorage.getItem("summary-length") || "4", 10);

      let body: Record<string, unknown> = {
        name: concept.trim(),
        authType,
        summaryLength,
      };

      if (authType === "oauth-browser") {
        const credsRaw = localStorage.getItem("anthropic-oauth-credentials");
        if (!credsRaw) {
          setError("Please sign in with Anthropic in Settings first.");
          setLoading(false);
          return;
        }
        body.oauthCredentials = JSON.parse(credsRaw);
        body.authType = "oauth";
      } else if (authType === "oauth") {
        const oauthToken = localStorage.getItem("anthropic-oauth-token") || "";
        if (!oauthToken) {
          setError("Please configure your Claude OAuth token in Settings first.");
          setLoading(false);
          return;
        }
        body.oauthToken = oauthToken;
      } else {
        if (!apiKey) {
          setError("Please configure your Anthropic API key in Settings first.");
          setLoading(false);
          return;
        }
        body.apiKey = apiKey;
      }

      const res = await fetch("/api/concepts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to generate concept");
      }

      const data = await res.json();

      // If server refreshed OAuth credentials, update localStorage
      if (data.refreshedCredentials) {
        localStorage.setItem("anthropic-oauth-credentials", JSON.stringify(data.refreshedCredentials));
      }

      // Generate real embedding client-side
      let embedding: number[] | undefined;
      try {
        const embText = `${data.name}. ${data.short_summary} ${data.long_summary}`;
        embedding = await getEmbedding(embText);
      } catch (e) {
        console.warn("Embedding generation failed, concept will use fallback position:", e);
      }

      // Build concept object and store
      const newConcept = {
        id: `user-${Date.now()}`,
        name: data.name,
        short_summary: data.short_summary,
        long_summary: data.long_summary,
        x: data.x,
        y: data.y,
        z: data.z,
        date_learned: date || new Date().toISOString().split("T")[0],
        ...(embedding ? { embedding } : data.embedding ? { embedding: data.embedding } : {}),
      };

      addUserConcept(newConcept);
      setConcept("");
      setDate("");
      setIsOpen(false);
      onConceptAdded?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-30">
      <AnimatePresence>
        {isOpen && (
          <motion.form
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            onSubmit={handleSubmit}
            className="mb-3 p-4 rounded-xl backdrop-blur-md shadow-xl w-72"
            style={{ background: "var(--surface)", border: "1px solid var(--border-strong)" }}
          >
            <label className="text-sm mb-2 block" style={{ color: "var(--text-muted)" }}>
              <Sparkles className="w-3 h-3 inline mr-1" />
              Add a concept you&apos;ve learned
            </label>
            <input
              type="text"
              value={concept}
              onChange={(e) => setConcept(e.target.value)}
              placeholder="e.g., Gradient Descent"
              autoFocus
              className="w-full px-3 py-2 rounded-lg text-sm mb-2 focus:outline-none"
              style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)" }}
            />
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "var(--text-muted)" }} />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg text-xs focus:outline-none"
                style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)" }}
              />
              <span className="text-xs whitespace-nowrap" style={{ color: "var(--text-muted)" }}>
                {date ? "" : "Today"}
              </span>
            </div>
            {error && (
              <p className="text-xs mb-2" style={{ color: "var(--error)" }}>{error}</p>
            )}
            <button
              type="submit"
              disabled={loading || !concept.trim()}
              className="w-full py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50"
              style={{ background: "var(--accent)", color: "#ffffff" }}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> Generate & Add
                </>
              )}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-3 rounded-full shadow-lg transition-all"
        style={{ background: "var(--accent)", color: "#ffffff" }}
      >
        <Plus className={`w-5 h-5 transition-transform ${isOpen ? "rotate-45" : ""}`} />
      </button>
    </div>
  );
}
