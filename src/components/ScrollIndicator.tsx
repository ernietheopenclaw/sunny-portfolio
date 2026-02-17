"use client";

import { motion } from "framer-motion";
import { useScroll } from "@/lib/scroll";
import { ChevronDown } from "lucide-react";

export default function ScrollIndicator() {
  const { scrollProgress } = useScroll();

  if (scrollProgress > 0.1) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed bottom-24 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
    >
      <p className="text-xs text-gray-500">Scroll to explore</p>
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        <ChevronDown className="w-5 h-5 text-cyan-400/60" />
      </motion.div>
    </motion.div>
  );
}
