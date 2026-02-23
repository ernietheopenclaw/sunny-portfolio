import katex from "katex";

/**
 * Render LaTeX in a string. Supports:
 * - Display math: $$...$$ or \[...\]
 * - Inline math: $...$ or \(...\)
 *
 * Returns HTML string with rendered KaTeX spans.
 */
function fixTexDollars(tex: string): string {
  // Replace \$ with \text{\$} so KaTeX can render currency inside math
  return tex.replace(/\\\$/g, "\\text{\\$}");
}

export function renderLatex(text: string): string {
  // Display math: $$...$$ and \[...\]
  let result = text.replace(/\$\$([\s\S]+?)\$\$/g, (_, tex) => {
    try {
      return katex.renderToString(fixTexDollars(tex.trim()), { displayMode: true, throwOnError: false });
    } catch {
      return `<span class="katex-error">${tex}</span>`;
    }
  });

  result = result.replace(/\\\[([\s\S]+?)\\\]/g, (_, tex) => {
    try {
      return katex.renderToString(fixTexDollars(tex.trim()), { displayMode: true, throwOnError: false });
    } catch {
      return `<span class="katex-error">${tex}</span>`;
    }
  });

  // Inline math: $...$ (but not $$) and \(...\)
  // Skip currency like $1M, $100B — require non-digit start or math-like content
  // Allow \$ (escaped dollar) inside the match
  result = result.replace(/(?<!\$)\$(?!\$)(?!\d[A-Za-z])((?:[^$]|\\\$)+?)(?<!\$)\$(?!\$)/g, (_, tex) => {
    const looksLikeMath = /[\\^_{}]/.test(tex) || tex.length <= 30;
    if (!looksLikeMath) return `$${tex}$`; // not math, return as-is
    try {
      return katex.renderToString(fixTexDollars(tex.trim()), { displayMode: false, throwOnError: false });
    } catch {
      return `<span class="katex-error">${tex}</span>`;
    }
  });

  result = result.replace(/\\\((.+?)\\\)/g, (_, tex) => {
    try {
      return katex.renderToString(fixTexDollars(tex.trim()), { displayMode: false, throwOnError: false });
    } catch {
      return `<span class="katex-error">${tex}</span>`;
    }
  });

  return result;
}
