export default function Footer() {
  return (
    <footer className="py-8 px-4 border-t border-gray-800/50 text-center">
      <p className="text-sm text-gray-500">
        © {new Date().getFullYear()} Sunny. Built with Next.js, Three.js, and ☕
      </p>
    </footer>
  );
}
