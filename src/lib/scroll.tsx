"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

type Mode = "galaxy" | "reduction" | "timeline";
const MODES: Mode[] = ["galaxy", "reduction", "timeline"];

interface ScrollContextType {
  scrollY: number;
  scrollProgress: number;
  mode: Mode;
  setMode: (m: Mode) => void;
  nextMode: () => void;
  prevMode: () => void;
}

const ScrollContext = createContext<ScrollContextType>({
  scrollY: 0,
  scrollProgress: 0,
  mode: "galaxy",
  setMode: () => {},
  nextMode: () => {},
  prevMode: () => {},
});

export function ScrollProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<Mode>("galaxy");

  const scrollProgress = mode === "galaxy" ? 0 : mode === "reduction" ? 0.5 : 1;

  const setMode = useCallback((m: Mode) => {
    setModeState(m);
  }, []);

  const nextMode = useCallback(() => {
    setModeState((prev) => {
      const idx = MODES.indexOf(prev);
      return idx < MODES.length - 1 ? MODES[idx + 1] : prev;
    });
  }, []);

  const prevMode = useCallback(() => {
    setModeState((prev) => {
      const idx = MODES.indexOf(prev);
      return idx > 0 ? MODES[idx - 1] : prev;
    });
  }, []);

  return (
    <ScrollContext.Provider value={{ scrollY: 0, scrollProgress, mode, setMode, nextMode, prevMode }}>
      {children}
    </ScrollContext.Provider>
  );
}

export const useScroll = () => useContext(ScrollContext);
