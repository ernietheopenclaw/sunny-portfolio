import { NextRequest, NextResponse } from "next/server";
import { getModel, complete } from "@mariozechner/pi-ai";

export async function POST(req: NextRequest) {
  try {
    const { name, apiKey, oauthToken, authType } = await req.json();

    if (!name) {
      return NextResponse.json({ error: "Concept name is required" }, { status: 400 });
    }

    const credential = authType === "oauth" ? oauthToken : (apiKey || process.env.ANTHROPIC_API_KEY);
    if (!credential) {
      return NextResponse.json({ error: "API key or OAuth token required" }, { status: 401 });
    }

    const model = getModel("anthropic", "claude-sonnet-4-20250514");

    const response = await complete(model, {
      messages: [
        {
          role: "user",
          content: `Generate a JSON object for the concept "${name}" with these fields:
- "short_summary": A concise 1-sentence summary (under 120 chars)
- "long_summary": A detailed 3-4 sentence explanation
- "x": A float between -3 and 3 (semantic x-coordinate for visualization)
- "y": A float between -3 and 3 (semantic y-coordinate)
- "z": A float between -2 and 2 (semantic z-coordinate)

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

    return NextResponse.json({
      name,
      short_summary: parsed.short_summary,
      long_summary: parsed.long_summary,
      x: parsed.x,
      y: parsed.y,
      z: parsed.z,
      date_learned: new Date().toISOString().split("T")[0],
    });
  } catch (error) {
    console.error("Concept generation error:", error);
    return NextResponse.json({ error: "Failed to generate concept" }, { status: 500 });
  }
}
