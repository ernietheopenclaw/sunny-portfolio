import { NextRequest, NextResponse } from "next/server";
import { pendingLogins, cleanupSessions } from "@/lib/oauth-sessions";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  cleanupSessions();

  try {
    const { code, sessionId } = await req.json();

    if (!code || !sessionId) {
      return NextResponse.json(
        { error: "Missing code or sessionId" },
        { status: 400 }
      );
    }

    const session = pendingLogins.get(sessionId);
    if (!session) {
      return NextResponse.json(
        { error: "Session expired or not found. Please start the login flow again." },
        { status: 404 }
      );
    }

    // Resolve the pending promise with the authorization code
    session.resolveCode(code);

    // Wait for pi-ai to exchange the code for tokens
    const credentials = await session.credentialsPromise;

    // Clean up the session
    pendingLogins.delete(sessionId);

    // Return credentials to the client for storage
    return NextResponse.json({
      access_token: credentials.access,
      refresh_token: credentials.refresh,
      expires_at: credentials.expires,
    });
  } catch (error) {
    console.error("OAuth exchange error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Token exchange failed" },
      { status: 500 }
    );
  }
}
