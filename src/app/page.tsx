"use client";

import { useState, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import { mockConcepts, mockProjects, mockSkills } from "@/data/mock";
import { getAllConcepts } from "@/lib/concepts";
import Navbar from "@/components/Navbar";
import ThemeToggle from "@/components/ThemeToggle";
import ScrollIndicator from "@/components/ScrollIndicator";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import Resume from "@/components/Resume";
import Links from "@/components/Links";
import Papers from "@/components/Papers";
import Posts from "@/components/Posts";
import Contact from "@/components/Contact";
import ConceptInput from "@/components/ConceptInput";
import Footer from "@/components/Footer";
const GalaxyVisualization = dynamic(
  () => import("@/components/GalaxyVisualization"),
  { ssr: false }
);

export default function Home() {
  const [concepts, setConcepts] = useState(mockConcepts);
  const [projects, setProjects] = useState(mockProjects);
  const [galaxyReady, setGalaxyReady] = useState(false);

  // Load user-added concepts and hidden projects from localStorage after mount
  useEffect(() => {
    setConcepts(getAllConcepts());
    const hidden = JSON.parse(localStorage.getItem("hidden-projects") || "[]") as string[];
    if (hidden.length > 0) {
      setProjects(mockProjects.filter((p) => !hidden.includes(p.id)));
    }
  }, []);

  const handleConceptAdded = useCallback(() => {
    setConcepts(getAllConcepts());
  }, []);

  const handleDeleteProject = useCallback((id: string) => {
    const hidden = JSON.parse(localStorage.getItem("hidden-projects") || "[]") as string[];
    hidden.push(id);
    localStorage.setItem("hidden-projects", JSON.stringify(hidden));
    setProjects((prev) => prev.filter((p) => p.id !== id));
  }, []);

  return (
    <main className="relative">
      <Navbar />
      <ThemeToggle />

      {/* Galaxy visualization — single viewport, scroll wheel switches modes */}
      <div className="relative">
        <GalaxyVisualization concepts={concepts} onReady={() => setGalaxyReady(true)} />
        <ScrollIndicator />
      </div>

      {/* Portfolio sections — only render after galaxy is ready */}
      {galaxyReady && (
        <div className="relative z-10" style={{ background: "var(--bg)" }}>
          <About />
          <Projects projects={projects} onDelete={handleDeleteProject} />
          <Papers />
          <Posts />
          <Skills skills={mockSkills} projects={projects} />
          <Resume />
          <Links />
          <Contact />
          <Footer />
        </div>
      )}

      {galaxyReady && <ConceptInput onConceptAdded={handleConceptAdded} />}
    </main>
  );
}
