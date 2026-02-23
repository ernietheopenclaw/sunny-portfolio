import { NextRequest, NextResponse } from "next/server";

const CLIENT_ID = "9d1c250a-e61b-44d9-88ed-5944d1962f5e";
const TOKEN_URL = "https://console.anthropic.com/v1/oauth/token";
const REDIRECT_URI = "https://console.anthropic.com/oauth/code/callback";

export async function POST(req: NextRequest) {
  try {
    const { code, codeVerifier } = await req.json();

    if (!code || !codeVerifier) {
      return NextResponse.json(
        { error: "Missing code or codeVerifier" },
        { status: 400 }
      );
    }

    // The pasted code format is "code#state"
    const splits = code.split("#");
    const authCode = splits[0];
    const state = splits[1];

    const tokenResponse = await fetch(TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        grant_type: "authorization_code",
        client_id: CLIENT_ID,
        code: authCode,
        state: state,
        redirect_uri: REDIRECT_URI,
        code_verifier: codeVerifier,
      }),
    });

    if (!tokenResponse.ok) {
      const error = await tokenResponse.text();
      return NextResponse.json(
        { error: `Token exchange failed: ${error}` },
        { status: tokenResponse.status }
      );
    }

    const tokenData = await tokenResponse.json();
    const expiresAt = Date.now() + tokenData.expires_in * 1000 - 5 * 60 * 1000;

    return NextResponse.json({
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      expires_at: expiresAt,
    });
  } catch (error) {
    console.error("OAuth exchange error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Token exchange failed" },
      { status: 500 }
    );
  }
}
