"use client";

import Link from "next/link";

export default function AuthError() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--bg)" }}>
      <div className="max-w-md w-full p-8 rounded-2xl text-center" style={{ background: "var(--surface)", border: "1px solid var(--border-strong)" }}>
        <h1 className="text-2xl font-bold mb-4" style={{ color: "var(--text)" }}>Access Denied</h1>
        <p className="mb-6" style={{ color: "var(--text-muted)" }}>
          Only authorized accounts can sign in. If you believe this is an error, please contact the site owner.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-2 rounded-lg text-sm font-medium"
          style={{ background: "var(--accent)", color: "#ffffff" }}
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
