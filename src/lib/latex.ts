import katex from "katex";

/**
 * Render LaTeX in a string. Supports:
 * - Display math: $$...$$ or \[...\]
 * - Inline math: $...$ or \(...\)
 *
 * Returns HTML string with rendered KaTeX spans.
 */
export function renderLatex(text: string): string {
  // Display math: $$...$$ and \[...\]
  let result = text.replace(/\$\$([\s\S]+?)\$\$/g, (_, tex) => {
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
  result = result.replace(/(?<!\$)\$(?!\$)(.+?)(?<!\$)\$(?!\$)/g, (_, tex) => {
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

  return result;
}
