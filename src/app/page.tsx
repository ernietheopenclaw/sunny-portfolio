"use client";

import { useState, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import { mockConcepts, mockProjects, mockSkills, mockPosts, mockPublications } from "@/data/mock";
import { Publication, Skill } from "@/types";
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
  const [posts, setPosts] = useState(mockPosts);
  const [publications, setPublications] = useState(mockPublications);
  const [skills, setSkills] = useState(mockSkills);
  const [galaxyReady, setGalaxyReady] = useState(false);

  // Load user-added concepts and hidden projects/posts from localStorage after mount
  useEffect(() => {
    setConcepts(getAllConcepts());

    // Projects: filter hidden, apply localStorage edits, merge user-created
    const hiddenProjects = JSON.parse(localStorage.getItem("hidden-projects") || "[]") as string[];
    const userProjects = JSON.parse(localStorage.getItem("user-projects") || "[]") as typeof mockProjects;
    const filteredProjects = (hiddenProjects.length > 0
      ? mockProjects.filter((p) => !hiddenProjects.includes(p.id))
      : [...mockProjects]
    ).map((p) => {
      const saved = localStorage.getItem(`project-edit-${p.id}`);
      if (saved) {
        const data = JSON.parse(saved);
        return { ...p, ...data, tech: data.tech ?? p.tech };
      }
      return p;
    });
    setProjects([...userProjects, ...filteredProjects]);

    // Posts
    const hiddenPosts = JSON.parse(localStorage.getItem("hidden-posts") || "[]") as string[];
    const userPosts = JSON.parse(localStorage.getItem("user-posts") || "[]") as typeof mockPosts;
    const filteredMock = hiddenPosts.length > 0 ? mockPosts.filter((p) => !hiddenPosts.includes(p.id)) : mockPosts;
    setPosts([...userPosts, ...filteredMock]);

    // Publications
    const hiddenPubs = JSON.parse(localStorage.getItem("hidden-publications") || "[]") as string[];
    const userPubs = JSON.parse(localStorage.getItem("user-publications") || "[]") as Publication[];
    const filteredPubs = hiddenPubs.length > 0
      ? mockPublications.filter((p) => !hiddenPubs.includes(p.id))
      : [...mockPublications];
    setPublications([...userPubs, ...filteredPubs]);

    // Skills
    const userSkills = JSON.parse(localStorage.getItem("user-skills") || "[]") as Skill[];
    setSkills([...mockSkills, ...userSkills]);
  }, []);

  const handleConceptAdded = useCallback(() => {
    setConcepts(getAllConcepts());
  }, []);

  const handleDeletePost = useCallback((id: string) => {
    const hidden = JSON.parse(localStorage.getItem("hidden-posts") || "[]") as string[];
    hidden.push(id);
    localStorage.setItem("hidden-posts", JSON.stringify(hidden));
    setPosts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const handleDeletePublication = useCallback((id: string) => {
    const hidden = JSON.parse(localStorage.getItem("hidden-publications") || "[]") as string[];
    hidden.push(id);
    localStorage.setItem("hidden-publications", JSON.stringify(hidden));
    setPublications((prev) => prev.filter((p) => p.id !== id));
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
          <Papers publications={publications} onDelete={handleDeletePublication} />
          <Posts posts={posts} onDelete={handleDeletePost} />
          <Skills skills={skills} projects={projects} />
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
