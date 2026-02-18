/**
 * Shared in-memory store for pending OAuth login sessions.
 * Both authorize and exchange routes import this module.
 * On Vercel serverless, this works when both requests hit the same instance.
 */

export interface PendingSession {
  resolveCode: (code: string) => void;
  credentialsPromise: Promise<{ access: string; refresh: string; expires: number }>;
  createdAt: number;
}

// Global singleton — survives across requests in the same serverless instance
const globalStore = globalThis as typeof globalThis & {
  __oauthPendingLogins?: Map<string, PendingSession>;
};

if (!globalStore.__oauthPendingLogins) {
  globalStore.__oauthPendingLogins = new Map();
}

export const pendingLogins: Map<string, PendingSession> = globalStore.__oauthPendingLogins;

export function cleanupSessions() {
  const now = Date.now();
  for (const [id, session] of pendingLogins) {
    if (now - session.createdAt > 10 * 60 * 1000) {
      pendingLogins.delete(id);
    }
  }
}
