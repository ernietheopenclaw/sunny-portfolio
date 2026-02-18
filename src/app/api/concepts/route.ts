import { NextRequest, NextResponse } from "next/server";
import { getModel, complete } from "@mariozechner/pi-ai";
import { refreshAnthropicToken } from "@mariozechner/pi-ai";

export async function POST(req: NextRequest) {
  try {
    const { name, apiKey, oauthToken, oauthCredentials, authType, summaryLength = 4 } = await req.json();

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

    const model = getModel("anthropic", "claude-sonnet-4-20250514");

    const response = await complete(model, {
      messages: [
        {
          role: "user",
          timestamp: Date.now(),
          content: `Generate a JSON object for the concept "${name}" with these fields:
- "short_summary": A concise 1-sentence summary (under 120 chars)
- "long_summary": A detailed explanation that is exactly ${summaryLength} sentence${summaryLength === 1 ? "" : "s"} long
- "x": A float between -3 and 3 (semantic x-coordinate for visualization)
- "y": A float between -3 and 3 (semantic y-coordinate)
- "z": A float between -2 and 2 (semantic z-coordinate)
- "embedding": An array of exactly 32 floats between -1 and 1, representing a semantic fingerprint of this concept. Each dimension should encode a different semantic axis (e.g., theoretical vs applied, math-heavy vs intuitive, ML vs web-dev vs systems, foundational vs advanced). Similar concepts (e.g., "Bayes Rule" and "Neural Networks") MUST have similar embedding vectors (high cosine similarity). Dissimilar concepts (e.g., "Bayes Rule" and "CSS Grid") should have very different vectors.

Position similar concepts near each other in the coordinate space (e.g., ML concepts near each other, web dev concepts near each other).

Respond with ONLY the JSON object, no markdown.`,
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

    // Include LLM-generated semantic embedding if present
    if (parsed.embedding && Array.isArray(parsed.embedding)) {
      result.embedding = parsed.embedding;
    }

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
