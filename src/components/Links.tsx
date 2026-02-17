"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, Twitter, Mail, Globe } from "lucide-react";

const socialLinks = [
  { label: "GitHub", href: "https://github.com/sunny", icon: Github },
  { label: "LinkedIn", href: "https://linkedin.com/in/sunny", icon: Linkedin },
  { label: "Twitter / X", href: "https://x.com/sunny", icon: Twitter },
  { label: "Email", href: "mailto:sunny@example.com", icon: Mail },
  { label: "Website", href: "https://sunny.dev", icon: Globe },
];

export default function Links() {
  return (
    <section id="links" className="py-16 px-4 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
        className="flex flex-wrap justify-center gap-4"
      >
        {socialLinks.map((link) => {
          const Icon = link.icon;
          return (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gray-900/50 border border-gray-800 hover:border-cyan-500/50 hover:bg-gray-900/80 transition-all text-gray-300 hover:text-cyan-400"
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm font-medium">{link.label}</span>
            </a>
          );
        })}
      </motion.div>
    </section>
  );
}
