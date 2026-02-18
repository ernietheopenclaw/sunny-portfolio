"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ArrowLeft, Sparkles, Loader2, Save, Check, Key, Shield } from "lucide-react";
import { Concept } from "@/types";

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Auth type toggle
  const [authType, setAuthType] = useState<"apikey" | "oauth">("apikey");

  // API config
  const [apiKey, setApiKey] = useState("");
  const [oauthToken, setOauthToken] = useState("");
  const [credentialStatus, setCredentialStatus] = useState<"none" | "configured">("none");

  // Summary length
  const [summaryLength, setSummaryLength] = useState(4);

  // Concept generation
  const [conceptName, setConceptName] = useState("");
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState<{ short_summary: string; long_summary: string; x: number; y: number; z: number } | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const storedType = localStorage.getItem("auth-type") as "apikey" | "oauth" | null;
    if (storedType) setAuthType(storedType);

    const storedKey = localStorage.getItem("anthropic-api-key");
    const storedToken = localStorage.getItem("anthropic-oauth-token");

    if (storedKey) setApiKey(storedKey);
    if (storedToken) setOauthToken(storedToken);

    if ((storedType === "oauth" && storedToken) || (storedType !== "oauth" && storedKey)) {
      setCredentialStatus("configured");
    }

    const storedLength = localStorage.getItem("summary-length");
    if (storedLength) setSummaryLength(parseInt(storedLength, 10));
  }, []);

  const saveCredentials = () => {
    localStorage.setItem("auth-type", authType);
    if (authType === "apikey") {
      localStorage.setItem("anthropic-api-key", apiKey);
      setCredentialStatus(apiKey ? "configured" : "none");
    } else {
      localStorage.setItem("anthropic-oauth-token", oauthToken);
      setCredentialStatus(oauthToken ? "configured" : "none");
    }
  };

  const handleGenerate = async () => {
    if (!conceptName.trim()) return;
    const key = localStorage.getItem("anthropic-api-key");
    const token = localStorage.getItem("anthropic-oauth-token");
    const storedType = localStorage.getItem("auth-type") || "apikey";

    if (storedType === "oauth" && !token) {
      alert("Please configure your Claude OAuth token first.");
      return;
    }
    if (storedType === "apikey" && !key) {
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
        body: JSON.stringify({
          name: conceptName,
          authType: storedType,
          apiKey: storedType === "apikey" ? key : undefined,
          oauthToken: storedType === "oauth" ? token : undefined,
          summaryLength,
        }),
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
            <Key className="w-5 h-5" /> Authentication
          </h2>

          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs px-2 py-1 rounded-full" style={{
              background: credentialStatus === "configured" ? "rgba(33,131,128,0.15)" : "rgba(255,255,255,0.05)",
              color: credentialStatus === "configured" ? "var(--accent-mid)" : "var(--text-muted)",
            }}>
              {credentialStatus === "configured" ? "✓ Configured" : "Not configured"}
            </span>
          </div>

          {/* Auth type toggle */}
          <div className="flex rounded-lg overflow-hidden mb-4" style={{ border: "1px solid var(--border)" }}>
            <button
              onClick={() => setAuthType("apikey")}
              className="flex-1 px-4 py-2 text-sm font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
              style={{
                background: authType === "apikey" ? "var(--accent)" : "var(--bg)",
                color: authType === "apikey" ? "#fff" : "var(--text-muted)",
              }}
            >
              <Key className="w-3.5 h-3.5" /> API Key
            </button>
            <button
              onClick={() => setAuthType("oauth")}
              className="flex-1 px-4 py-2 text-sm font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
              style={{
                background: authType === "oauth" ? "var(--accent)" : "var(--bg)",
                color: authType === "oauth" ? "#fff" : "var(--text-muted)",
              }}
            >
              <Shield className="w-3.5 h-3.5" /> Claude OAuth
            </button>
          </div>

          {authType === "apikey" ? (
            <>
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
                  onClick={saveCredentials}
                  className="px-4 py-2 rounded-lg text-sm font-medium cursor-pointer"
                  style={{ background: "var(--accent)", color: "#fff" }}
                >
                  <Save className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <>
              <label className="text-sm block mb-2" style={{ color: "var(--text-muted)" }}>Claude OAuth Token</label>
              <p className="text-xs mb-3" style={{ color: "var(--text-muted)", opacity: 0.7 }}>
                Generate a token by running <code className="px-1 py-0.5 rounded text-xs" style={{ background: "var(--bg)", fontFamily: "var(--font-mono)" }}>npx @mariozechner/pi-ai login anthropic</code> in your terminal. Uses your Claude Pro/Max subscription — no API credits needed.
              </p>
              <div className="flex gap-2">
                <input
                  type="password"
                  value={oauthToken}
                  onChange={(e) => setOauthToken(e.target.value)}
                  placeholder="Paste OAuth token..."
                  className="flex-1 px-3 py-2 rounded-lg text-sm focus:outline-none"
                  style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)" }}
                />
                <button
                  onClick={saveCredentials}
                  className="px-4 py-2 rounded-lg text-sm font-medium cursor-pointer"
                  style={{ background: "var(--accent)", color: "#fff" }}
                >
                  <Save className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </section>

        {/* Summary Length */}
        <section className="p-6 rounded-xl mb-8" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: "var(--text)" }}>
            <Sparkles className="w-5 h-5" /> Summary Length
          </h2>
          <p className="text-xs mb-4" style={{ color: "var(--text-muted)" }}>
            Number of sentences for the detailed summary (default: 4)
          </p>
          <div className="flex items-center gap-4">
            <span className="text-sm font-mono w-6 text-center" style={{ color: "var(--text-muted)" }}>1</span>
            <input
              type="range"
              min={1}
              max={10}
              value={summaryLength}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                setSummaryLength(val);
                localStorage.setItem("summary-length", val.toString());
              }}
              className="flex-1 accent-[#218380]"
              style={{ accentColor: "var(--accent)" }}
            />
            <span className="text-sm font-mono w-6 text-center" style={{ color: "var(--text-muted)" }}>10</span>
          </div>
          <p className="text-center text-sm mt-2 font-semibold" style={{ color: "var(--accent-mid)" }}>
            {summaryLength} sentence{summaryLength === 1 ? "" : "s"}
          </p>
        </section>

        {/* Add Learning */}
        <section className="p-6 rounded-xl" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: "var(--text)" }}>
            <Sparkles className="w-5 h-5" /> Add New Learning
          </h2>

          {credentialStatus === "none" && (
            <p className="text-sm mb-4 p-3 rounded-lg" style={{ background: "rgba(255,200,0,0.1)", color: "var(--text-muted)" }}>
              Please configure your authentication above first.
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
