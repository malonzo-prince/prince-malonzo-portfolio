'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Briefcase, ExternalLink, Lock } from 'lucide-react'
import Image from 'next/image'
import { SectionWrapper, SectionHeading } from './section-wrapper'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type ProjectCategory = 'All' | 'Frontend' | 'Fullstack'

type Project = {
  title: string
  description: string
  category: Exclude<ProjectCategory, 'All'>
  role: string
  tech: string[]
  image: string
  demo: string | null
  featured: boolean
}

const projects: Project[] = [
  {
    title: 'I-Track Isuzu Pasig',
    description: 'VSMS - Vehicle Service Management System.',
    category: 'Fullstack',
    role: 'Solo Freelance Full Stack Web & Mobile App',
    tech: [
      'Next.js',
      'TypeScript',
      'Tailwind CSS',
      'React Native',
      'Firebase',
      'Node.js',
      'Express.js',
      'MongoDB',
      'Vercel',
      'Render',
    ],
    image: '/images/projects/taskflow.jpg',
    demo: 'https://www.itrackpasig.site/',
    featured: true,
  },
  {
    title: 'Tailwatch',
    description: 'PMS - Pet Management System.',
    category: 'Fullstack',
    role: 'Solo Freelance Full Stack Web',
    tech: [
      'Next.js',
      'TypeScript',
      'Tailwind CSS',
      'Node.js',
      'Express.js',
      'MongoDB',
      'Vercel',
      'Render',
    ],
    image: '/images/projects/devhire.jpg',
    demo: 'https://www.tailwatch.online/',
    featured: true,
  },
  {
    title: 'BTrConnect',
    description: 'HCM & Applicant system for Bureau of Treasury.',
    category: 'Fullstack',
    role: 'Full Stack Developer',
    tech: ['Next.js', 'TypeScript', 'Supabase', 'PostgreSQL', 'Python', 'Django', 'Tailwind CSS'],
    image: '/images/projects/shopnest.jpg',
    demo: null,
    featured: false,
  },
  {
    title: 'Microgenesis Central Hub',
    description: 'System Management for Microgenesis employees.',
    category: 'Fullstack',
    role: 'Full Stack Developer',
    tech: ['Next.js', 'TypeScript', 'Supabase', 'PostgreSQL', 'Python', 'Django', 'Tailwind CSS'],
    image: '/images/projects/authkit.jpg',
    demo: null,
    featured: false,
  },
  {
    title: 'Prolab Microgenesis',
    description: 'Renewal Care System.',
    category: 'Frontend',
    role: 'Frontend Developer',
    tech: ['HTML', 'CSS', 'JavaScript', 'PHP', 'Python', 'Django', 'Azure SQL Database'],
    image: '/images/projects/medtrack.jpg',
    demo: null,
    featured: false,
  },
  {
    title: 'OneOps Microgenesis',
    description: 'TASS Management System.',
    category: 'Fullstack',
    role: 'Project Manager / Full Stack Developer',
    tech: ['Next.js', 'TypeScript', 'Supabase', 'PostgreSQL', 'Python', 'Django', 'Tailwind CSS'],
    image: '/images/projects/portfoliogen.jpg',
    demo: null,
    featured: false,
  },
  {
    title: 'Microgenesis Asset Sync',
    description: 'Confidential internal asset synchronization system.',
    category: 'Fullstack',
    role: 'Full Stack Developer',
    tech: ['Next.js', 'TypeScript', 'Supabase', 'PostgreSQL', 'Python', 'Django', 'Tailwind CSS'],
    image: '/images/projects/realtalk.jpg',
    demo: null,
    featured: false,
  },
  {
    title: 'Internova Microgenesis',
    description: 'Intern Project Management System.',
    category: 'Fullstack',
    role: 'Project Manager / Full Stack Developer',
    tech: ['Next.js', 'TypeScript', 'Supabase', 'PostgreSQL', 'Python', 'Django', 'Tailwind CSS'],
    image: '/images/projects/datapulse.jpg',
    demo: null,
    featured: false,
  },
  {
    title: 'iBayaniHub',
    description:
      'School Capstone Project - Volunteer & Donation Management System for client Caritas Manila.',
    category: 'Fullstack',
    role: 'Project Manager / Full Stack Developer Web & Mobile App',
    tech: ['React', 'HTML', 'CSS', 'Node.js', 'Express.js', 'MongoDB', 'React Native'],
    image: '/images/projects/newsapi.jpg',
    demo: 'https://ibayanihub.site/',
    featured: false,
  },
  {
    title: 'WorkLoom',
    description: 'School Group Project - Job Finder Website.',
    category: 'Fullstack',
    role: 'Project Manager / Full Stack Developer Web',
    tech: ['React', 'HTML', 'CSS', 'Node.js', 'Express.js', 'MongoDB'],
    image: '/images/projects/landkit.jpg',
    demo: null,
    featured: false,
  },
]

const FILTERS: ProjectCategory[] = ['All', 'Fullstack', 'Frontend']
const ITEMS_PER_PAGE = 6

const categoryColor: Record<Exclude<ProjectCategory, 'All'>, string> = {
  Fullstack: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
  Frontend: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
}

export function ProjectsSection() {
  const [filter, setFilter] = useState<ProjectCategory>('All')
  const [currentPage, setCurrentPage] = useState(1)

  const filtered =
    filter === 'All' ? projects : projects.filter((project) => project.category === filter)

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
          subtitle="A selection of freelance, enterprise, and academic systems across web and mobile."
        />

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="flex justify-center gap-2 mb-10 flex-wrap"
        >
          {FILTERS.map((projectFilter) => (
            <button
              key={projectFilter}
              onClick={() => setFilter(projectFilter)}
              className={cn(
                'px-5 py-2 text-sm font-medium rounded-full border transition-all duration-200',
                filter === projectFilter
                  ? 'bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20'
                  : 'border-border text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-muted'
              )}
            >
              {projectFilter}
            </button>
          ))}
        </motion.div>

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
                <div className="relative w-full h-44 overflow-hidden bg-muted">
                  <Image
                    src={project.image}
                    alt={`${project.title} preview`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-background/0 group-hover:bg-background/10 transition-colors duration-300" />
                  {project.featured && (
                    <span className="absolute top-3 right-3 text-[10px] font-mono font-semibold text-primary bg-background/80 backdrop-blur-sm px-2 py-0.5 rounded-full border border-primary/30">
                      Featured
                    </span>
                  )}
                </div>

                <div className="flex flex-col flex-1 p-6">
                  <span
                    className={`inline-flex self-start text-[11px] font-mono font-medium px-2.5 py-0.5 rounded-full border mb-3 ${categoryColor[project.category]}`}
                  >
                    {project.category}
                  </span>

                  <h3 className="font-bold text-foreground mb-2 leading-snug">{project.title}</h3>

                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                    {project.description}
                  </p>

                  <div className="flex items-start gap-2 text-xs text-muted-foreground mb-4">
                    <Briefcase className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
                    <span>{project.role}</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-5 flex-1 content-start">
                    {project.tech.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 text-[11px] font-mono rounded bg-muted text-muted-foreground border border-border"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {project.demo ? (
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Live site for ${project.title}`}
                      className="self-start"
                    >
                      <Button size="sm" className="rounded-full h-8 px-4 text-xs gap-1.5 bg-primary/10 text-primary hover:bg-primary/20 border-0">
                        <ExternalLink className="w-3.5 h-3.5" />
                        Live Site
                      </Button>
                    </a>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      disabled
                      className="self-start rounded-full h-8 px-4 text-xs gap-1.5 border-border"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      Confidential
                    </Button>
                  )}
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
      </div>
    </SectionWrapper>
  )
}
