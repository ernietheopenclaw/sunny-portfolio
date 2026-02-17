"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface ScrollContextType {
  scrollY: number;
  scrollProgress: number; // 0-1 over first 3 viewport heights
  mode: "galaxy" | "reduction" | "timeline";
}

const ScrollContext = createContext<ScrollContextType>({
  scrollY: 0,
  scrollProgress: 0,
  mode: "galaxy",
});

export function ScrollProvider({ children }: { children: ReactNode }) {
  const [scrollY, setScrollY] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mode, setMode] = useState<"galaxy" | "reduction" | "timeline">("galaxy");

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const vh = window.innerHeight;
      const progress = Math.min(y / (vh * 3), 1);
      setScrollY(y);
      setScrollProgress(progress);

      if (progress < 0.33) setMode("galaxy");
      else if (progress < 0.66) setMode("reduction");
      else setMode("timeline");
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <ScrollContext.Provider value={{ scrollY, scrollProgress, mode }}>
      {children}
    </ScrollContext.Provider>
  );
}

export const useScroll = () => useContext(ScrollContext);
