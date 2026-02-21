import type { Metadata } from "next";
import "katex/dist/katex.min.css";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme";
import { ScrollProvider } from "@/lib/scroll";
import SessionWrapper from "@/components/SessionWrapper";

export const metadata: Metadata = {
  title: "Sunny — AI/ML Engineer",
  description: "Interactive portfolio showcasing concepts, projects, and skills through immersive 3D visualization.",
  icons: {
    icon: { url: "/favicon.svg", type: "image/svg+xml" },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="antialiased" style={{ background: "var(--bg)", color: "var(--text)", fontFamily: "var(--font-body)" }}>
        <SessionWrapper>
          <ThemeProvider>
            <ScrollProvider>
              {children}
            </ScrollProvider>
          </ThemeProvider>
        </SessionWrapper>
      </body>
    </html>
  );
}
