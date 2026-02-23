import { NextResponse } from "next/server";
import crypto from "crypto";

const CLIENT_ID = "9d1c250a-e61b-44d9-88ed-5944d1962f5e";
const AUTHORIZE_URL = "https://claude.ai/oauth/authorize";
const REDIRECT_URI = "https://console.anthropic.com/oauth/code/callback";
const SCOPES = "org:create_api_key user:profile user:inference";

function base64urlEncode(buffer: Buffer): string {
  return buffer.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

export async function GET() {
  // Generate PKCE pair
  const verifierBytes = crypto.randomBytes(32);
  const codeVerifier = base64urlEncode(verifierBytes);
  const challengeHash = crypto.createHash("sha256").update(codeVerifier).digest();
  const codeChallenge = base64urlEncode(challengeHash);

  const authParams = new URLSearchParams({
    code: "true",
    client_id: CLIENT_ID,
    response_type: "code",
    redirect_uri: REDIRECT_URI,
    scope: SCOPES,
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
    state: codeVerifier,
  });

  const authUrl = `${AUTHORIZE_URL}?${authParams.toString()}`;

  // Return codeVerifier to client — no server-side state needed
  return NextResponse.json({ authUrl, codeVerifier });
}
