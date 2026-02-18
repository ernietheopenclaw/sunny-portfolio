"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Sparkles, Loader2 } from "lucide-react";

export default function ConceptInput() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [concept, setConcept] = useState("");
  const [loading, setLoading] = useState(false);
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
    setTimeout(() => {
      setLoading(false);
      setConcept("");
      setIsOpen(false);
    }, 1500);
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
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50"
              style={{ background: "var(--accent)", color: "#ffffff" }}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
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
