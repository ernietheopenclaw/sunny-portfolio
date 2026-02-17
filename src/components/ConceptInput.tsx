"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Sparkles, Loader2 } from "lucide-react";

export default function ConceptInput() {
  const [isOpen, setIsOpen] = useState(false);
  const [concept, setConcept] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLoggedIn] = useState(false); // Will be connected to auth

  if (!isLoggedIn) {
    return (
      <div className="fixed bottom-6 right-6 z-30">
        <button
          onClick={() => alert("Please log in to add concepts")}
          className="p-3 rounded-full bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 text-gray-500 hover:text-cyan-400 hover:border-cyan-500/50 transition-all"
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
    // In production: call API to generate summaries via Claude
    // Then store in Supabase
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
            className="mb-3 p-4 rounded-xl bg-gray-900/95 backdrop-blur-md border border-gray-700 shadow-xl w-72"
          >
            <label className="text-sm text-gray-400 mb-2 block">
              <Sparkles className="w-3 h-3 inline mr-1" />
              Add a concept you&apos;ve learned
            </label>
            <input
              type="text"
              value={concept}
              onChange={(e) => setConcept(e.target.value)}
              placeholder="e.g., Gradient Descent"
              autoFocus
              className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 text-sm focus:border-cyan-500/50 focus:outline-none mb-2"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 text-white text-sm font-medium hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
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
        className="p-3 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg hover:shadow-cyan-500/25 transition-all"
      >
        <Plus className={`w-5 h-5 transition-transform ${isOpen ? "rotate-45" : ""}`} />
      </button>
    </div>
  );
}
