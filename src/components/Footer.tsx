"use client";

import { useEffect, useState } from "react";

export default function Footer() {
  const [visitors, setVisitors] = useState<number | null>(null);

  useEffect(() => {
    fetch("https://api.countapi.xyz/hit/sunny-portfolio-five.vercel.app/visits")
      .then((r) => r.json())
      .then((data) => setVisitors(data.value))
      .catch(() => setVisitors(null));
  }, []);

  return (
    <footer className="py-8 px-4 text-center space-y-2" style={{ borderTop: "1px solid var(--border)" }}>
      <p className="text-sm" style={{ color: "var(--text-muted)" }}>
        © {new Date().getFullYear()} Sunny Son. Built with Next.js, Three.js, and ☕
      </p>
      {visitors !== null && (
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          👁 {visitors.toLocaleString()} visitors
        </p>
      )}
    </footer>
  );
}
