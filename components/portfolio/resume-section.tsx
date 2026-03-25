'use client'

import { motion } from 'framer-motion'
import { Download, FileText, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SectionWrapper, SectionHeading } from './section-wrapper'

export function ResumeSection() {
  return (
    <SectionWrapper id="resume" className="bg-brand-surface/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <SectionHeading
          eyebrow="Resume"
          title="Curriculum Vitae"
          subtitle="Download or preview my resume to learn more about my background and qualifications."
        />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl border border-border bg-card overflow-hidden"
        >
          {/* Top glow accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-60" />

          <div className="p-8 sm:p-12">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              {/* File icon */}
              <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                <FileText className="w-8 h-8 text-primary" />
              </div>

              {/* Info */}
              <div className="flex-1">
                <h3 className="text-xl font-bold text-foreground mb-1">
                  Prince Barachiel Malonzo — CV
                </h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Fullstack Developer & Project Manager · Updated March 2026
                </p>
                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5 bg-muted px-2.5 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    PDF Format
                  </span>
                  <span className="flex items-center gap-1.5 bg-muted px-2.5 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    2 Pages
                  </span>
                  <span className="flex items-center gap-1.5 bg-muted px-2.5 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                    English
                  </span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="/resume.pdf"
                  download="Prince_Barachiel_Malonzo_CV.pdf"
                  aria-label="Download resume PDF"
                >
                  <Button className="rounded-full px-6 gap-2 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 text-primary-foreground">
                    <Download className="w-4 h-4" />
                    Download
                  </Button>
                </a>
                <a
                  href="/resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Preview resume"
                >
                  <Button variant="outline" className="rounded-full px-6 gap-2 border-border hover:border-primary/40">
                    <Eye className="w-4 h-4" />
                    Preview
                  </Button>
                </a>
              </div>
            </div>

            {/* Resume preview / highlight grid */}
            <div className="mt-8 pt-8 border-t border-border grid sm:grid-cols-3 gap-6">
              {[
                {
                  label: 'Education',
                  detail: 'BSIT – Mobile & Web Apps, National University – MOA',
                },
                {
                  label: 'Experience',
                  detail: 'Intern Fullstack Dev & PM at Microgenesis (800 hrs)',
                },
                {
                  label: 'Core Skills',
                  detail: 'React, Next.js, Node.js, TypeScript, Supabase, Agile',
                },
              ].map((item) => (
                <div key={item.label}>
                  <p className="text-xs font-mono font-semibold text-primary uppercase tracking-widest mb-1">
                    {item.label}
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </SectionWrapper>
  )
}
