import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme";
import { ScrollProvider } from "@/lib/scroll";

const inter = Inter({ subsets: ["latin"] });

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
      <body className={`${inter.className} bg-gray-950 text-white antialiased`}>
        <ThemeProvider>
          <ScrollProvider>
            {children}
          </ScrollProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
