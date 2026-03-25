'use client'

import { motion } from 'framer-motion'
import { Users, Code2, BookOpen, MapPin, Calendar } from 'lucide-react'
import { SectionWrapper } from './section-wrapper'

const stats = [
  { label: 'Interns Led', value: '16+', icon: Users },
  { label: 'Projects Built', value: '10+', icon: Code2 },
  { label: 'Hours Internship', value: '800', icon: Calendar },
  { label: 'Stack Expertise', value: '15+', icon: BookOpen },
]

export function AboutSection() {
  return (
    <SectionWrapper id="about">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-xs font-mono font-medium text-primary tracking-widest uppercase mb-3">
            About Me
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-balance">
            Developer. Leader. Builder.
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-5"
          >
            <p className="text-muted-foreground leading-relaxed text-base sm:text-lg">
              I&apos;m <span className="text-foreground font-semibold">Prince Barachiel Malonzo</span>, 
              a fullstack developer and project manager currently interning at{' '}
              <span className="text-primary font-semibold">Microgenesis</span>. I design, build, and
              ship end-to-end web systems — from pixel-perfect frontends to robust backend APIs and 
              database architectures.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Beyond writing code, I lead a team of{' '}
              <span className="text-foreground font-semibold">16 interns</span>, coordinating 
              deliverables, running Agile ceremonies, and ensuring every project meets quality and 
              timeline standards. This dual responsibility has sharpened both my technical depth and 
              leadership instincts.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Pursuing my BSIT degree at{' '}
              <span className="text-foreground font-semibold">National University – Mall of Asia</span>{' '}
              with a specialization in Mobile and Web Applications. I treat every sprint as an 
              opportunity to ship something better than the last.
            </p>

            {/* Details chips */}
            <div className="flex flex-wrap gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-muted px-3 py-1.5 rounded-full">
                <MapPin className="w-3 h-3 text-primary" />
                National University – MOA, Philippines
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-muted px-3 py-1.5 rounded-full">
                <Calendar className="w-3 h-3 text-primary" />
                Intern @ Microgenesis · Dec 2025 – May 2026
              </span>
            </div>
          </motion.div>

          {/* Stats grid */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 gap-4"
          >
            {stats.map((stat, i) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.1 * i }}
                  className="group relative p-6 rounded-2xl border border-border bg-card hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                  {/* subtle glow on hover */}
                  <div className="absolute inset-0 rounded-2xl bg-primary/0 group-hover:bg-primary/[0.03] transition-colors pointer-events-none" />
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </div>
    </SectionWrapper>
  )
}
