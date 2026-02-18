"use client";

import dynamic from "next/dynamic";
import { mockConcepts, mockProjects, mockSkills } from "@/data/mock";
import Navbar from "@/components/Navbar";
import ThemeToggle from "@/components/ThemeToggle";
import ScrollIndicator from "@/components/ScrollIndicator";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import Resume from "@/components/Resume";
import Links from "@/components/Links";
import Papers from "@/components/Papers";
import Contact from "@/components/Contact";
import ConceptInput from "@/components/ConceptInput";
import Footer from "@/components/Footer";
const GalaxyVisualization = dynamic(
  () => import("@/components/GalaxyVisualization"),
  { ssr: false }
);

export default function Home() {
  return (
    <main className="relative">
      <Navbar />
      <ThemeToggle />

      {/* Galaxy visualization — single viewport, scroll wheel switches modes */}
      <div className="relative">
        <GalaxyVisualization concepts={mockConcepts} />
        <ScrollIndicator />
      </div>

      {/* Portfolio sections */}
      <div className="relative z-10" style={{ background: "var(--bg)" }}>
        <About />
        <Projects projects={mockProjects} />
        <Papers />
        <Skills skills={mockSkills} />
        <Resume />
        <Links />
        <Contact />
        <Footer />
      </div>

      <ConceptInput />
    </main>
  );
}
