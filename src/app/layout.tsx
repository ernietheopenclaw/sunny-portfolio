import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme";
import { ScrollProvider } from "@/lib/scroll";

export const metadata: Metadata = {
  title: "Sunny — Developer & Creative Technologist",
  description: "Interactive portfolio showcasing concepts, projects, and skills through immersive 3D visualization.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="antialiased" style={{ background: "var(--bg)", color: "var(--text)", fontFamily: "var(--font-body)" }}>
        <ThemeProvider>
          <ScrollProvider>
            {children}
          </ScrollProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
