"use client";

import { motion } from "framer-motion";
import { mockPosts } from "@/data/mock";
import Link from "next/link";

export default function Posts() {
  return (
    <section id="posts" className="py-24 px-4 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl font-bold mb-2" style={{ color: "var(--accent)" }}>
          Posts
        </h2>
        <p className="text-sm mb-12" style={{ color: "var(--text-muted)" }}>
          Thoughts, tutorials, and deep dives
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mockPosts.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="rounded-xl p-6 flex flex-col"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
            >
              <p className="text-xs font-mono mb-2" style={{ color: "var(--text-muted)" }}>
                {new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              </p>
              <Link
                href={`/post/${post.id}`}
                className="text-lg font-semibold mb-2 transition-colors leading-snug"
                style={{ color: "var(--text)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent-mid)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text)")}
              >
                {post.title}
              </Link>
              <p
                className="text-sm leading-relaxed mb-4 flex-1"
                style={{
                  color: "var(--text-muted)",
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {post.excerpt}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{
                      background: "rgba(33,131,128,0.1)",
                      color: "var(--accent-mid)",
                      border: "1px solid rgba(33,131,128,0.2)",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <Link
                href={`/post/${post.id}`}
                className="text-sm font-medium transition-colors"
                style={{ color: "var(--accent-mid)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--accent-mid)")}
              >
                Read more →
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
