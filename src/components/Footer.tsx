export default function Footer() {
  return (
    <footer className="py-8 px-4 text-center" style={{ borderTop: "1px solid var(--border)" }}>
      <p className="text-sm" style={{ color: "var(--text-muted)" }}>
        © {new Date().getFullYear()} Sunny. Built with Next.js, Three.js, and ☕
      </p>
    </footer>
  );
}
