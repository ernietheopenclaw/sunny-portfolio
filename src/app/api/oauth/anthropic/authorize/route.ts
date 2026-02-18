import { NextResponse } from "next/server";
import { loginAnthropic } from "@mariozechner/pi-ai";
import crypto from "crypto";
import { pendingLogins, cleanupSessions } from "@/lib/oauth-sessions";

export const maxDuration = 60; // Allow up to 60s for this route

export async function GET() {
  cleanupSessions();

  const sessionId = crypto.randomUUID();
  let authUrl = "";

  // Create a promise that will be resolved when the user provides the code
  let resolveCode!: (code: string) => void;
  const codePromise = new Promise<string>((resolve) => {
    resolveCode = resolve;
  });

  // Start the login flow — this will block on codePromise internally
  const credentialsPromise = loginAnthropic(
    (url: string) => {
      authUrl = url;
    },
    async () => await codePromise
  );

  // Wait for the auth URL to be generated (near-instant)
  await new Promise<void>((resolve) => {
    const check = () => {
      if (authUrl) resolve();
      else setTimeout(check, 10);
    };
    check();
  });

  // Store the pending session so the exchange endpoint can resolve it
  pendingLogins.set(sessionId, {
    resolveCode,
    credentialsPromise,
    createdAt: Date.now(),
  });

  return NextResponse.json({ sessionId, authUrl });
}
