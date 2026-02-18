"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

type Mode = "galaxy" | "reduction" | "timeline";
const MODES: Mode[] = ["galaxy", "reduction", "timeline"];

interface ScrollContextType {
  scrollY: number;
  scrollProgress: number;
  mode: Mode;
  setMode: (m: Mode) => void;
  nextMode: () => boolean; // returns true if mode changed, false if already at end
  prevMode: () => boolean; // returns true if mode changed, false if already at start
  pastVisualization: boolean;
  setPastVisualization: (v: boolean) => void;
}

const ScrollContext = createContext<ScrollContextType>({
  scrollY: 0,
  scrollProgress: 0,
  mode: "galaxy",
  setMode: () => {},
  nextMode: () => false,
  prevMode: () => false,
  pastVisualization: false,
  setPastVisualization: () => {},
});

export function ScrollProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<Mode>("galaxy");
  const [pastVisualization, setPastVisualization] = useState(false);

  const scrollProgress = mode === "galaxy" ? 0 : mode === "reduction" ? 0.5 : 1;

  const setMode = useCallback((m: Mode) => {
    setModeState(m);
  }, []);

  const nextMode = useCallback((): boolean => {
    let changed = false;
    setModeState((prev) => {
      const idx = MODES.indexOf(prev);
      if (idx < MODES.length - 1) {
        changed = true;
        return MODES[idx + 1];
      }
      return prev;
    });
    return changed;
  }, []);

  const prevMode = useCallback((): boolean => {
    let changed = false;
    setModeState((prev) => {
      const idx = MODES.indexOf(prev);
      if (idx > 0) {
        changed = true;
        return MODES[idx - 1];
      }
      return prev;
    });
    return changed;
  }, []);

  return (
    <ScrollContext.Provider value={{ scrollY: 0, scrollProgress, mode, setMode, nextMode, prevMode, pastVisualization, setPastVisualization }}>
      {children}
    </ScrollContext.Provider>
  );
}

export const useScroll = () => useContext(ScrollContext);
