import katex from "katex";

/**
 * Render LaTeX in a string. Supports:
 * - Display math: $$...$$ or \[...\]
 * - Inline math: $...$ or \(...\)
 *
 * Returns HTML string with rendered KaTeX spans.
 */
export function renderLatex(text: string): string {
  // Pre-process: convert \$ to fullwidth dollar to avoid breaking LaTeX delimiters
  let input = text.replace(/\\\$/g, "＄");

  // Display math: $$...$$ and \[...\]
  let result = input.replace(/\$\$([\s\S]+?)\$\$/g, (_, tex) => {
    try {
      return katex.renderToString(tex.trim(), { displayMode: true, throwOnError: false });
    } catch {
      return `<span class="katex-error">${tex}</span>`;
    }
  });

  result = result.replace(/\\\[([\s\S]+?)\\\]/g, (_, tex) => {
    try {
      return katex.renderToString(tex.trim(), { displayMode: true, throwOnError: false });
    } catch {
      return `<span class="katex-error">${tex}</span>`;
    }
  });

  // Inline math: $...$ (but not $$) and \(...\)
  // Skip currency like $1M, $100B — require non-digit start or math-like content
  result = result.replace(/(?<!\$)\$(?!\$)(?!\d[A-Za-z])([^\$]+?)(?<!\$)\$(?!\$)/g, (_, tex) => {
    const looksLikeMath = /[\\^_{}]/.test(tex) || tex.length <= 30;
    if (!looksLikeMath) return `$${tex}$`; // not math, return as-is
    try {
      return katex.renderToString(tex.trim(), { displayMode: false, throwOnError: false });
    } catch {
      return `<span class="katex-error">${tex}</span>`;
    }
  });

  result = result.replace(/\\\((.+?)\\\)/g, (_, tex) => {
    try {
      return katex.renderToString(tex.trim(), { displayMode: false, throwOnError: false });
    } catch {
      return `<span class="katex-error">${tex}</span>`;
    }
  });

  // Restore fullwidth dollar signs to normal $
  result = result.replace(/＄/g, "$");

  return result;
}
