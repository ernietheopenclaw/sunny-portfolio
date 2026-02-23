import { NextRequest, NextResponse } from "next/server";
import { getModel, complete } from "@mariozechner/pi-ai";
import { refreshAnthropicToken } from "@mariozechner/pi-ai";

export async function POST(req: NextRequest) {
  try {
    const { name, apiKey, oauthToken, oauthCredentials, authType, summaryLength = 4, modelId = "claude-sonnet-4-6" } = await req.json();

    if (!name) {
      return NextResponse.json({ error: "Concept name is required" }, { status: 400 });
    }

    let credential: string;
    let refreshedCredentials: { access_token: string; refresh_token: string; expires_at: number } | null = null;

    if (authType === "oauth" && oauthCredentials) {
      // Full OAuth with auto-refresh
      const { access_token, refresh_token, expires_at } = oauthCredentials;

      if (Date.now() >= expires_at && refresh_token) {
        // Token expired — refresh it
        try {
          const newCreds = await refreshAnthropicToken(refresh_token);
          credential = newCreds.access;
          refreshedCredentials = {
            access_token: newCreds.access,
            refresh_token: newCreds.refresh,
            expires_at: newCreds.expires,
          };
        } catch {
          return NextResponse.json({ error: "OAuth token expired and refresh failed. Please log in again." }, { status: 401 });
        }
      } else {
        credential = access_token;
      }
    } else if (authType === "oauth" && oauthToken) {
      // Legacy: plain OAuth token paste
      credential = oauthToken;
    } else {
      credential = apiKey || process.env.ANTHROPIC_API_KEY || "";
    }

    if (!credential) {
      return NextResponse.json({ error: "API key or OAuth token required" }, { status: 401 });
    }

    const model = getModel("anthropic", modelId);

    const response = await complete(model, {
      messages: [
        {
          role: "user",
          timestamp: Date.now(),
          content: `Generate a JSON object for the concept "${name}" with these fields:
- "short_summary": A concise 1-sentence summary (under 120 chars)
- "long_summary": The MOST in-depth, thorough markdown breakdown of the concept possible. Include ALL of the following sections:
  ## Overview
  What it is, historical context (who invented/discovered it, when, why), and why it matters today. Provide a clear, accessible definition followed by deeper context.
  
  ## Mathematical Foundation
  Formal definitions, key equations using LaTeX ($...$ for inline, $$...$$ for block), derivations where applicable. If the concept isn't inherently mathematical, describe any formal models, logical frameworks, or quantitative aspects that underpin it.
  
  ## Key Concepts & Principles
  Detailed breakdown of every major component, sub-concept, and principle. Use nested bullet points to show hierarchy. Bold key terms on first use. Explain how each piece fits into the whole.
  
  ## How It Works
  Step-by-step explanation of the mechanism, algorithm, or process. Include concrete examples with actual numbers or scenarios. Walk through at least one worked example end-to-end. Use numbered steps for sequential processes.
  
  ## Implementation Details
  Pseudocode or real code snippets (in Python or the most relevant language) demonstrating the concept. Mention common libraries, frameworks, and tools used in practice. Include complexity analysis (time/space) where relevant.
  
  ## Advantages & Limitations
  Honest pros and cons in a structured format. Discuss tradeoffs, edge cases, failure modes, and when NOT to use this approach. Compare briefly with alternatives.
  
  ## Real-World Applications
  Specific, detailed use cases — not just bullet points. For each application, explain the problem it solves, how this concept is applied, and what results it achieves. Include industry examples.
  
  ## Common Misconceptions
  Things people frequently get wrong about this concept. For each misconception, state the wrong belief and then the correct understanding.
  
  ## Related Topics
  Connections to other concepts with brief explanations of HOW they relate (not just names). Indicate whether each is a prerequisite, extension, alternative, or application.
  
  ## Further Reading
  Suggested topics to learn next, ordered from most to least relevant. For each, briefly explain what you'd gain from studying it.
  
  The breakdown should be extremely thorough (${summaryLength * 150}-${summaryLength * 250} words), richly structured with markdown headers (##), nested bullet points, bold terms, code blocks, and LaTeX equations. IMPORTANT: Do NOT use markdown tables — use bullet points or dashes instead for any comparisons or structured data. Write it as comprehensive educational content suitable for a portfolio/knowledge base — think textbook-quality reference material.
- "x": A float between -3 and 3 (semantic x-coordinate for visualization)
- "y": A float between -3 and 3 (semantic y-coordinate)
- "z": A float between -2 and 2 (semantic z-coordinate)
Position similar concepts near each other in the coordinate space (e.g., ML concepts near each other, web dev concepts near each other).

Respond with ONLY the JSON object, no markdown wrapping. The long_summary field value should be a markdown string.`,
        },
      ],
    }, {
      apiKey: credential,
    });

    const text = response.content.find(b => b.type === "text");
    if (!text || text.type !== "text") {
      return NextResponse.json({ error: "No text response from model" }, { status: 500 });
    }

    const parsed = JSON.parse(text.text);

    const result: Record<string, unknown> = {
      name,
      short_summary: parsed.short_summary,
      long_summary: parsed.long_summary,
      x: parsed.x,
      y: parsed.y,
      z: parsed.z,
      date_learned: new Date().toISOString().split("T")[0],
    };

    // If credentials were refreshed, include them so the client can update storage
    if (refreshedCredentials) {
      result.refreshedCredentials = refreshedCredentials;
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Concept generation error:", error);
    return NextResponse.json({ error: "Failed to generate concept" }, { status: 500 });
  }
}
