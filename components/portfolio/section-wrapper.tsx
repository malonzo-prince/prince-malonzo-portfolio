'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface SectionWrapperProps {
  id: string
  children: ReactNode
  className?: string
}

export function SectionWrapper({ id, children, className = '' }: SectionWrapperProps) {
  return (
    <section id={id} className={`py-24 sm:py-32 relative ${className}`}>
      {children}
    </section>
  )
}

interface SectionHeadingProps {
  eyebrow: string
  title: string
  subtitle?: string
}

export function SectionHeading({ eyebrow, title, subtitle }: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6 }}
      className="text-center mb-16"
    >
      <span className="inline-block text-xs font-mono font-medium text-primary tracking-widest uppercase mb-3">
        {eyebrow}
      </span>
      <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-balance mb-4">{title}</h2>
      {subtitle && (
        <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed text-balance">
          {subtitle}
        </p>
      )}
    </motion.div>
  )
}
