'use client'

import { motion } from 'framer-motion'
import { Building2, CheckCircle2, ArrowUpRight } from 'lucide-react'
import { SectionWrapper, SectionHeading } from './section-wrapper'

const achievements = [
  'Architected and shipped fullstack web systems using Next.js, React, Node.js, and Supabase',
  'Led and managed a team of 16 interns across design, frontend, and backend tracks',
  'Facilitated daily standups, sprint planning, and retrospectives using Agile/Scrum methodology',
  'Reviewed and merged pull requests, maintaining code quality standards across the team',
  'Collaborated directly with senior engineers and stakeholders on feature delivery',
  'Delivered multiple internal tools, reducing manual processes by an estimated 40%',
  'Mentored junior interns on best practices in TypeScript, REST APIs, and Git workflows',
  'Coordinated cross-functional collaboration between design, QA, and development teams',
]

const timeline = [
  {
    period: 'Dec 2025 – May 2026',
    role: 'Intern Fullstack Developer & Project Manager',
    company: 'Microgenesis',
    type: 'Internship · 800 hrs',
    current: true,
  },
  {
    period: '2025',
    role: 'Project Manager & Fullstack Developer',
    company: 'Capstone Project',
    type: 'Academic Project',
    current: false,
  },
  {
    period: '2022 – Present',
    role: 'BSIT Student — Mobile & Web Applications',
    company: 'National University – Mall of Asia',
    type: 'Education',
    current: true,
  },
]

export function ExperienceSection() {
  return (
    <SectionWrapper id="experience" className="bg-brand-surface/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <SectionHeading
          eyebrow="Experience"
          title="Where I've Worked"
          subtitle="Hands-on industry experience building and shipping real-world systems."
        />

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Timeline */}
          <div className="space-y-6">
            {timeline.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative pl-8"
              >
                {/* Timeline line */}
                {i < timeline.length - 1 && (
                  <div className="absolute left-[11px] top-8 bottom-0 w-px bg-border" />
                )}

                {/* Dot */}
                <div
                  className={`absolute left-0 top-1.5 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    item.current
                      ? 'border-primary bg-primary/10'
                      : 'border-border bg-card'
                  }`}
                >
                  {item.current && (
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  )}
                </div>

                <div className="p-5 rounded-2xl border border-border bg-card hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <h3 className="font-bold text-foreground leading-snug">{item.role}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Building2 className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                        <span className="text-sm font-semibold text-primary">{item.company}</span>
                      </div>
                    </div>
                    {item.current && (
                      <span className="flex-shrink-0 text-[10px] font-mono font-semibold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        Active
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-muted-foreground font-mono">{item.period}</span>
                    <span className="text-muted-foreground/40">·</span>
                    <span className="text-xs text-muted-foreground">{item.type}</span>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Microgenesis highlight card */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="mt-2 p-5 rounded-2xl border border-primary/30 bg-primary/5"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground">Microgenesis</p>
                  <p className="text-xs text-muted-foreground">IT Solutions Company</p>
                </div>
                <a
                  href="#"
                  className="ml-auto text-primary hover:text-primary/80 transition-colors"
                  aria-label="Learn more about Microgenesis"
                >
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Microgenesis is an IT solutions company where I lead a team of 16 interns as both a 
                fullstack developer and project manager — bridging technical execution with strategic 
                delivery.
              </p>
            </motion.div>
          </div>

          {/* Achievements */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <h3 className="font-bold text-foreground mb-6 text-lg">Key Achievements</h3>
            <ul className="space-y-3">
              {achievements.map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: 12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.05 * i }}
                  className="flex items-start gap-3 group"
                >
                  <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                  <span className="text-sm text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors">
                    {item}
                  </span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </SectionWrapper>
  )
}
