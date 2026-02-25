"use client";

import { useState, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import { mockConcepts, mockProjects, mockSkills, mockPosts, mockPublications } from "@/data/mock";
import { Publication, Skill } from "@/types";
import { getAllConceptsAsync, invalidateConceptsCache } from "@/lib/concepts";
import { getProjectsAsync, getPostsAsync, getPublicationsAsync, getSkillsAsync, hideInDb } from "@/lib/db";
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

  // Load all data from Supabase on mount
  const loadData = useCallback(async () => {
    const [c, p, po, pu, s] = await Promise.all([
      getAllConceptsAsync(),
      getProjectsAsync(),
      getPostsAsync(),
      getPublicationsAsync(),
      getSkillsAsync(),
    ]);
    setConcepts(c);
    setProjects(p);
    setPosts(po);
    setPublications(pu);
    setSkills(s);
  }, []);

  // Reload on mount and when returning to page
  useEffect(() => {
    loadData();
    const onVisible = () => { if (document.visibilityState === "visible") { invalidateConceptsCache(); loadData(); } };
    window.addEventListener("focus", () => { invalidateConceptsCache(); loadData(); });
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [loadData]);

  const handleConceptAdded = useCallback(() => {
    invalidateConceptsCache();
    getAllConceptsAsync().then(setConcepts);
  }, []);

  const handleConceptDeleted = useCallback((id: string) => {
    import("@/lib/concepts").then(({ hideConceptInDb }) => {
      hideConceptInDb(id).catch(() => {});
    });
    setConcepts((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const handleDeletePost = useCallback((id: string) => {
    hideInDb("posts", id).catch(() => {});
    setPosts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const handleDeletePublication = useCallback((id: string) => {
    hideInDb("publications", id).catch(() => {});
    setPublications((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const handleDeleteProject = useCallback((id: string) => {
    hideInDb("projects", id).catch(() => {});
    setProjects((prev) => prev.filter((p) => p.id !== id));
  }, []);

  return (
    <main className="relative">
      <Navbar />
      <ThemeToggle />

      {/* Galaxy visualization — single viewport, scroll wheel switches modes */}
      <div className="relative">
        <GalaxyVisualization concepts={concepts} onReady={() => setGalaxyReady(true)} onConceptDeleted={handleConceptDeleted} />
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
