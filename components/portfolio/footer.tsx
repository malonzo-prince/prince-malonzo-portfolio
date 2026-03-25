'use client'

import { motion } from 'framer-motion'
import { Github, Linkedin, Mail, ArrowUp } from 'lucide-react'

export function Footer() {
  const year = new Date().getFullYear()

  const socials = [
    {
      href: 'https://github.com/malonzo-prince',
      icon: Github,
      label: 'GitHub',
    },
    {
      href: 'https://www.linkedin.com/in/prince-barachiel-malonzo-614942389/',
      icon: Linkedin,
      label: 'LinkedIn',
    },
    {
      href: 'mailto:malonzo.princebarachiel31@gmail.com',
      icon: Mail,
      label: 'Email',
    },
  ]

  return (
    <footer className="relative border-t border-border bg-card/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-center md:text-left"
          >
            <p className="font-mono font-bold text-lg text-foreground">
              <span className="text-primary">P</span>B<span className="text-primary">M</span>
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Built with{' '}
              <span className="text-primary font-medium">Next.js</span> &amp;{' '}
              <span className="text-primary font-medium">Tailwind CSS</span>
            </p>
          </motion.div>

          {/* Social links */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex items-center gap-3"
          >
            {socials.map((s) => {
              const Icon = s.icon
              return (
                <a
                  key={s.label}
                  href={s.href}
                  target={s.label !== 'Email' ? '_blank' : undefined}
                  rel={s.label !== 'Email' ? 'noopener noreferrer' : undefined}
                  aria-label={s.label}
                  className="p-2 rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-primary/5 transition-all"
                >
                  <Icon className="w-4 h-4" />
                </a>
              )
            })}
          </motion.div>

          {/* Copyright + back to top */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="flex items-center gap-4"
          >
            <p className="text-xs text-muted-foreground">
              &copy; {year} Prince Barachiel Malonzo
            </p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              aria-label="Back to top"
              className="p-2 rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-primary/5 transition-all"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      </div>
    </footer>
  )
}
