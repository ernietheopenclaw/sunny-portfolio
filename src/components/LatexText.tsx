"use client";

import { useMemo } from "react";
import { renderLatex } from "@/lib/latex";

interface LatexTextProps {
  children: string;
  className?: string;
  style?: React.CSSProperties;
  as?: keyof React.JSX.IntrinsicElements;
}

/**
 * Renders text with LaTeX math expressions.
 * Supports $...$ (inline), $$...$$ (display), \(...\) and \[...\].
 */
export default function LatexText({ children, className, style, as: Tag = "span" }: LatexTextProps) {
  const html = useMemo(() => renderLatex(children), [children]);

  // If no LaTeX was found, render plain text (no dangerouslySetInnerHTML)
  if (html === children) {
    return <Tag className={className} style={style}>{children}</Tag>;
  }

  return <Tag className={className} style={style} dangerouslySetInnerHTML={{ __html: html }} />;
}
