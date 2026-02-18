"use client";

import { useState } from "react";
import { Menu, X, Sun, Moon, LogIn, LogOut, Settings } from "lucide-react";
import { useTheme } from "@/lib/theme";
import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useScroll } from "@/lib/scroll";

const links = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Papers", href: "#papers" },
  { label: "Skills", href: "#skills" },
  { label: "Resume", href: "#resume" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { theme, toggle } = useTheme();
  const { data: session } = useSession();
  const { setMode, setPastVisualization } = useScroll();

  const handleNavClick = () => {
    setMode("timeline");
    setPastVisualization(true);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 backdrop-blur-md" style={{ background: "color-mix(in srgb, var(--bg) 80%, transparent)", borderBottom: "1px solid var(--border)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14">
        <a href="/" className="font-bold text-lg flex items-center gap-2" style={{ color: "var(--accent)" }}>
          <img src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f31e/512.gif" alt="🌞" width="28" height="28" />
          Sunny
        </a>
        <div className="hidden md:flex items-center gap-6">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={handleNavClick}
              className="text-sm transition-colors"
              style={{ color: "var(--text-muted)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent-mid)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
            >
              {l.label}
            </a>
          ))}

          {session && (
            <Link
              href="/settings"
              className="text-sm transition-colors flex items-center gap-1"
              style={{ color: "var(--text-muted)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent-mid)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
            >
              <Settings className="w-3.5 h-3.5" /> Settings
            </Link>
          )}

          <button
            onClick={toggle}
            className="p-1.5 rounded-md transition-colors"
            style={{ color: "var(--text-muted)", border: "1px solid var(--border)" }}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {session ? (
            <div className="flex items-center gap-2">
              {session.user?.image && (
                <Image src={session.user.image} alt="" width={28} height={28} className="rounded-full" />
              )}
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>{session.user?.name}</span>
              <button
                onClick={() => signOut()}
                className="p-1.5 rounded-md transition-colors cursor-pointer"
                style={{ color: "var(--text-muted)", border: "1px solid var(--border)" }}
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => signIn("google")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer"
              style={{ color: "var(--text-muted)", border: "1px solid var(--border)" }}
            >
              <LogIn className="w-3.5 h-3.5" /> Login
            </button>
          )}
        </div>
        <button className="md:hidden" style={{ color: "var(--text-muted)" }} onClick={() => setOpen(!open)}>
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>
      {open && (
        <div className="md:hidden backdrop-blur-md px-4 py-3 flex flex-col gap-3" style={{ background: "color-mix(in srgb, var(--bg) 95%, transparent)", borderTop: "1px solid var(--border)" }}>
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => { setOpen(false); handleNavClick(); }}
              className="text-sm transition-colors"
              style={{ color: "var(--text-muted)" }}
            >
              {l.label}
            </a>
          ))}
          {session && (
            <Link href="/settings" onClick={() => setOpen(false)} className="text-sm flex items-center gap-1" style={{ color: "var(--text-muted)" }}>
              <Settings className="w-3.5 h-3.5" /> Settings
            </Link>
          )}
          <button onClick={toggle} className="flex items-center gap-2 text-sm py-2 transition-colors" style={{ color: "var(--text-muted)" }}>
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            {theme === "dark" ? "Light mode" : "Dark mode"}
          </button>
          {session ? (
            <button onClick={() => signOut()} className="flex items-center gap-2 text-sm py-2" style={{ color: "var(--text-muted)" }}>
              <LogOut className="w-4 h-4" /> Sign out
            </button>
          ) : (
            <button onClick={() => signIn("google")} className="flex items-center gap-2 text-sm py-2" style={{ color: "var(--text-muted)" }}>
              <LogIn className="w-4 h-4" /> Login
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
