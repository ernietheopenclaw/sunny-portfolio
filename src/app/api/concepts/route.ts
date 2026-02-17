import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { name, apiKey } = await req.json();

    if (!name) {
      return NextResponse.json({ error: "Concept name is required" }, { status: 400 });
    }

    const anthropicKey = apiKey || process.env.ANTHROPIC_API_KEY;
    if (!anthropicKey) {
      return NextResponse.json({ error: "API key required" }, { status: 401 });
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": anthropicKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
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
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return NextResponse.json({ error: `Anthropic API error: ${err}` }, { status: 500 });
    }

    const data = await response.json();
    const text = data.content[0].text;
    const parsed = JSON.parse(text);

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
