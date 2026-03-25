'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { SectionWrapper, SectionHeading } from './section-wrapper'

const skillGroups = [
  {
    category: 'Frontend',
    color: 'from-blue-500/20 to-indigo-500/20',
    border: 'border-blue-500/20',
    dot: 'bg-blue-500',
    skills: [
      'React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Vue.js', 'HTML & CSS',
    ],
  },
  {
    category: 'Backend',
    color: 'from-emerald-500/20 to-teal-500/20',
    border: 'border-emerald-500/20',
    dot: 'bg-emerald-500',
    skills: [
      'Node.js', 'Express.js', 'Python', 'Django', 'PHP',
    ],
  },
  {
    category: 'Database',
    color: 'from-violet-500/20 to-purple-500/20',
    border: 'border-violet-500/20',
    dot: 'bg-violet-500',
    skills: [
      'Supabase', 'MongoDB', 'NeonDB', 'Firebase', 'MySQL',
    ],
  },
  {
    category: 'Tools',
    color: 'from-orange-500/20 to-amber-500/20',
    border: 'border-orange-500/20',
    dot: 'bg-orange-500',
    skills: [
      'Git & GitHub', 'Figma', 'VS Code', 'Postman',
    ],
  },
  {
    category: 'Project Management',
    color: 'from-rose-500/20 to-pink-500/20',
    border: 'border-rose-500/20',
    dot: 'bg-rose-500',
    skills: [
      'Agile', 'Scrum', 'Team Leadership', 'Task Delegation',
    ],
  },
]

export function SkillsSection() {
  const [activeGroup, setActiveGroup] = useState<string | null>(null)

  return (
    <SectionWrapper id="skills" className="bg-brand-surface/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <SectionHeading
          eyebrow="Skills"
          title="Technical Proficiency"
          subtitle="A broad stack built from real projects — not just tutorials."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillGroups.map((group, gi) => (
            <motion.div
              key={group.category}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: gi * 0.08 }}
              onMouseEnter={() => setActiveGroup(group.category)}
              onMouseLeave={() => setActiveGroup(null)}
              className={`relative p-6 rounded-2xl border bg-card transition-all duration-300 ${
                activeGroup === group.category
                  ? 'border-primary/40 shadow-lg shadow-primary/5'
                  : 'border-border hover:border-border/80'
              }`}
            >
              {/* Card header */}
              <div className="flex items-center gap-3 mb-5">
                <span className={`w-2.5 h-2.5 rounded-full ${group.dot}`} />
                <h3 className="font-semibold text-foreground">{group.category}</h3>
              </div>

              {/* Skill pills */}
              <div className="flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 text-sm font-medium rounded-full border border-border bg-muted text-foreground hover:border-primary/40 hover:bg-primary/5 hover:text-primary transition-all cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* Background gradient glow */}
              <div
                className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${group.color} opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none`}
              />
            </motion.div>
          ))}
        </div>

        {/* Tech tag cloud */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 flex flex-wrap justify-center gap-2"
        >
          {[
            'React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Node.js',
            'Express', 'Python', 'Django', 'PHP', 'Supabase', 'MongoDB',
            'NeonDB', 'Firebase', 'MySQL', 'Git', 'Figma', 'Agile', 'Scrum',
          ].map((tag) => (
            <span
              key={tag}
              className="px-3 py-1.5 text-xs font-mono font-medium rounded-full border border-border text-muted-foreground hover:border-primary/40 hover:text-primary hover:bg-primary/5 transition-all cursor-default"
            >
              {tag}
            </span>
          ))}
        </motion.div>
      </div>
    </SectionWrapper>
  )
}

