'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, Github } from 'lucide-react'
import Image from 'next/image'
import { SectionWrapper, SectionHeading } from './section-wrapper'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type ProjectCategory = 'All' | 'Frontend' | 'Backend' | 'Fullstack'

const projects = [
  {
    title: 'TaskFlow — Agile PM Platform',
    description:
      'A full-featured project management system with Kanban boards, sprint planning, team assignment, and burndown charts. Built for Agile/Scrum teams.',
    category: 'Fullstack',
    tech: ['Next.js', 'TypeScript', 'Supabase', 'Tailwind CSS', 'Framer Motion'],
    image: '/images/projects/taskflow.jpg',
    github: 'https://github.com/malonzo-prince',
    demo: 'https://github.com/malonzo-prince',
    featured: true,
  },
  {
    title: 'DevHire — Intern Management System',
    description:
      'Internal system for managing interns, tracking hours, assigning tasks, and generating reports. Deployed at Microgenesis to manage 16 interns.',
    category: 'Fullstack',
    tech: ['React', 'Node.js', 'Express.js', 'MongoDB', 'JWT Auth'],
    image: '/images/projects/devhire.jpg',
    github: 'https://github.com/malonzo-prince',
    demo: 'https://github.com/malonzo-prince',
    featured: true,
  },
  {
    title: 'ShopNest — E-Commerce Platform',
    description:
      'Multi-vendor e-commerce platform with product listings, cart, checkout, and admin dashboard. Supports real-time inventory updates.',
    category: 'Fullstack',
    tech: ['Next.js', 'NeonDB', 'Stripe', 'Tailwind CSS', 'TypeScript'],
    image: '/images/projects/shopnest.jpg',
    github: 'https://github.com/malonzo-prince',
    demo: 'https://github.com/malonzo-prince',
    featured: false,
  },
  {
    title: 'AuthKit — Authentication Microservice',
    description:
      'Secure REST API for authentication with JWT, refresh tokens, role-based access control, and rate limiting. Deployed on Railway.',
    category: 'Backend',
    tech: ['Node.js', 'Express.js', 'MongoDB', 'Redis', 'Docker'],
    image: '/images/projects/authkit.jpg',
    github: 'https://github.com/malonzo-prince',
    demo: 'https://github.com/malonzo-prince',
    featured: false,
  },
  {
    title: 'MedTrack — Patient Records System',
    description:
      'Web app for clinics to manage patient records, appointment scheduling, and prescriptions with role-based dashboards for doctors and staff.',
    category: 'Fullstack',
    tech: ['React', 'Django', 'PostgreSQL', 'Tailwind CSS', 'Python'],
    image: '/images/projects/medtrack.jpg',
    github: 'https://github.com/malonzo-prince',
    demo: 'https://github.com/malonzo-prince',
    featured: false,
  },
  {
    title: 'PortfolioGen — Dynamic Portfolio Builder',
    description:
      'Drag-and-drop portfolio builder allowing developers to create and publish personal portfolio sites without writing code.',
    category: 'Frontend',
    tech: ['Next.js', 'TypeScript', 'Firebase', 'Framer Motion', 'Tailwind CSS'],
    image: '/images/projects/portfoliogen.jpg',
    github: 'https://github.com/malonzo-prince',
    demo: 'https://github.com/malonzo-prince',
    featured: false,
  },
  {
    title: 'RealTalk — Real-Time Chat App',
    description:
      'Messaging platform with rooms, direct messages, file sharing, and read receipts. Uses WebSockets for sub-100ms message delivery.',
    category: 'Fullstack',
    tech: ['Next.js', 'Socket.io', 'Node.js', 'MongoDB', 'TypeScript'],
    image: '/images/projects/realtalk.jpg',
    github: 'https://github.com/malonzo-prince',
    demo: 'https://github.com/malonzo-prince',
    featured: false,
  },
  {
    title: 'DataPulse — Analytics Dashboard',
    description:
      'Real-time business analytics dashboard with interactive charts, KPI cards, data filtering, and CSV export functionality.',
    category: 'Frontend',
    tech: ['React', 'TypeScript', 'Recharts', 'Tailwind CSS', 'SWR'],
    image: '/images/projects/datapulse.jpg',
    github: 'https://github.com/malonzo-prince',
    demo: 'https://github.com/malonzo-prince',
    featured: false,
  },
  {
    title: 'NewsAPI Aggregator',
    description:
      'Serverless backend that aggregates news from multiple RSS and REST sources, normalizes data, and exposes a unified GraphQL API.',
    category: 'Backend',
    tech: ['Node.js', 'GraphQL', 'Redis', 'Vercel Functions', 'TypeScript'],
    image: '/images/projects/newsapi.jpg',
    github: 'https://github.com/malonzo-prince',
    demo: 'https://github.com/malonzo-prince',
    featured: false,
  },
  {
    title: 'LandKit — Marketing Landing Page Kit',
    description:
      'Component library of premium landing page sections with animations, dark mode, and easy theme customization for Next.js projects.',
    category: 'Frontend',
    tech: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Radix UI'],
    image: '/images/projects/landkit.jpg',
    github: 'https://github.com/malonzo-prince',
    demo: 'https://github.com/malonzo-prince',
    featured: false,
  },
]

const FILTERS: ProjectCategory[] = ['All', 'Frontend', 'Backend', 'Fullstack']
const ITEMS_PER_PAGE = 6

const categoryColor: Record<string, string> = {
  Fullstack: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
  Frontend: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
  Backend: 'text-violet-500 bg-violet-500/10 border-violet-500/20',
}

export function ProjectsSection() {
  const [filter, setFilter] = useState<ProjectCategory>('All')
  const [currentPage, setCurrentPage] = useState(1)

  const filtered =
    filter === 'All' ? projects : projects.filter((p) => p.category === filter)

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE))
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedProjects = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  useEffect(() => {
    setCurrentPage(1)
  }, [filter])

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <SectionWrapper id="projects">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <SectionHeading
          eyebrow="Projects"
          title="Things I've Built"
          subtitle="A curated selection of fullstack systems, APIs, and frontend experiences."
        />

        {/* Filter tabs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="flex justify-center gap-2 mb-10 flex-wrap"
        >
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                'px-5 py-2 text-sm font-medium rounded-full border transition-all duration-200',
                filter === f
                  ? 'bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20'
                  : 'border-border text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-muted'
              )}
            >
              {f}
            </button>
          ))}
        </motion.div>

        {/* Projects grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {paginatedProjects.map((project, i) => (
              <motion.article
                key={`${project.title}-${currentPage}`}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
                className="group relative flex flex-col rounded-2xl border border-border bg-card hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 overflow-hidden"
              >
                {/* Project image */}
                <div className="relative w-full h-44 overflow-hidden bg-muted">
                  <Image
                    src={project.image}
                    alt={`${project.title} preview`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-background/0 group-hover:bg-background/10 transition-colors duration-300" />
                  {/* Featured badge */}
                  {project.featured && (
                    <span className="absolute top-3 right-3 text-[10px] font-mono font-semibold text-primary bg-background/80 backdrop-blur-sm px-2 py-0.5 rounded-full border border-primary/30">
                      Featured
                    </span>
                  )}
                </div>

                {/* Card body */}
                <div className="flex flex-col flex-1 p-6">
                {/* Category badge */}
                <span
                  className={`inline-flex self-start text-[11px] font-mono font-medium px-2.5 py-0.5 rounded-full border mb-3 ${categoryColor[project.category]}`}
                >
                  {project.category}
                </span>

                {/* Title */}
                <h3 className="font-bold text-foreground mb-2 leading-snug">{project.title}</h3>

                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-4">
                  {project.description}
                </p>

                {/* Tech stack */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 text-[11px] font-mono rounded bg-muted text-muted-foreground border border-border"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* Links */}
                <div className="flex items-center gap-2">
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`GitHub for ${project.title}`}
                  >
                    <Button variant="outline" size="sm" className="rounded-full h-8 px-4 text-xs gap-1.5 border-border hover:border-primary/40">
                      <Github className="w-3.5 h-3.5" />
                      Code
                    </Button>
                  </a>
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Live demo for ${project.title}`}
                  >
                    <Button size="sm" className="rounded-full h-8 px-4 text-xs gap-1.5 bg-primary/10 text-primary hover:bg-primary/20 border-0">
                      <ExternalLink className="w-3.5 h-3.5" />
                      Demo
                    </Button>
                  </a>
                </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>

        {totalPages > 1 && (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
            >
              Previous
            </Button>

            {pageNumbers.map((page) => (
              <Button
                key={page}
                size="sm"
                variant={currentPage === page ? 'default' : 'outline'}
                className="h-8 min-w-8 rounded-full px-3"
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}

            <Button
              variant="outline"
              size="sm"
              className="rounded-full"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
            >
              Next
            </Button>
          </div>
        )}

        {/* GitHub CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center mt-12"
        >
          <a
            href="https://github.com/malonzo-prince"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" className="rounded-full px-7 border-border hover:border-primary/40 gap-2">
              <Github className="w-4 h-4" />
              View all on GitHub
            </Button>
          </a>
        </motion.div>
      </div>
    </SectionWrapper>
  )
}
