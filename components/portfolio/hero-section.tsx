'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Github, Linkedin, Mail, Download, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

const TYPING_PHRASES = [
  'Fullstack Developer',
  'Project Manager',
  'React & Next.js Engineer',
  'Team Lead & Mentor',
]

function TypingAnimation() {
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const current = TYPING_PHRASES[phraseIndex]
    let timeout: ReturnType<typeof setTimeout>

    if (!isDeleting && displayed.length < current.length) {
      timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 80)
    } else if (!isDeleting && displayed.length === current.length) {
      timeout = setTimeout(() => setIsDeleting(true), 1800)
    } else if (isDeleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length - 1)), 45)
    } else if (isDeleting && displayed.length === 0) {
      setIsDeleting(false)
      setPhraseIndex((i) => (i + 1) % TYPING_PHRASES.length)
    }
    return () => clearTimeout(timeout)
  }, [displayed, isDeleting, phraseIndex])

  return (
    <span className="text-primary font-mono">
      {displayed}
      <span className="cursor-blink text-primary">|</span>
    </span>
  )
}

function HeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden>
      <div className="absolute inset-0 dot-grid opacity-40" />
      <motion.div
        className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-primary/10 blur-3xl"
        animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -bottom-48 -right-24 w-[400px] h-[400px] rounded-full bg-accent/10 blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />
    </div>
  )
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

export function HeroSection() {
  const handleNav = (href: string) => {
    const el = document.querySelector(href)
    el?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 overflow-hidden pt-20 md:pt-24"
    >
      <HeroBackground />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-4xl w-full text-center flex flex-col gap-6"
      >
        <motion.div variants={itemVariants} className="flex justify-center">
          <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full border-2 border-primary/40 overflow-hidden ring-4 ring-background flex-shrink-0">
            <Image
              src="/images/profile.jpg"
              alt="Prince Barachiel Malonzo"
              fill
              sizes="(max-width: 640px) 112px, 144px"
              className="object-cover"
              priority
            />
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="flex justify-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium font-mono border border-primary/30 bg-primary/10 text-primary">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Available for opportunities
          </span>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-foreground text-balance leading-tight"
        >
          Prince Barachiel
          <br />
          <span className="text-primary">Malonzo</span>
        </motion.h1>

        <motion.div
          variants={itemVariants}
          className="text-xl sm:text-2xl lg:text-3xl font-medium text-muted-foreground h-10 flex items-center justify-center"
        >
          <TypingAnimation />
        </motion.div>

        <motion.p
          variants={itemVariants}
          className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed text-balance"
        >
          Building production-grade fullstack systems and leading teams at{' '}
          <span className="text-foreground font-semibold">Microgenesis</span>. BSIT student
          at National University - Mall of Asia, specializing in Mobile and Web Applications.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          <Button
            size="lg"
            className="rounded-full px-7 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:shadow-primary/30 hover:-translate-y-0.5"
            onClick={() => handleNav('#projects')}
          >
            View Projects
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="rounded-full px-7 border-border hover:bg-muted hover:border-primary/40 transition-all hover:-translate-y-0.5"
            onClick={() => handleNav('#resume')}
          >
            <Download className="w-4 h-4 mr-2" />
            Download Resume
          </Button>
          <Button
            size="lg"
            variant="ghost"
            className="rounded-full px-7 hover:bg-muted transition-all hover:-translate-y-0.5"
            onClick={() => handleNav('#contact')}
          >
            Contact Me
          </Button>
        </motion.div>

        <motion.div variants={itemVariants} className="flex items-center justify-center gap-4">
          <a
            href="https://github.com/malonzo-prince"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub profile"
            className="p-2.5 rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-primary/5 transition-all hover:-translate-y-0.5"
          >
            <Github className="w-5 h-5" />
          </a>
          <a
            href="https://www.linkedin.com/in/prince-barachiel-malonzo-614942389/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn profile"
            className="p-2.5 rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-primary/5 transition-all hover:-translate-y-0.5"
          >
            <Linkedin className="w-5 h-5" />
          </a>
          <a
            href="mailto:malonzo.princebarachiel31@gmail.com"
            aria-label="Email"
            className="p-2.5 rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-primary/5 transition-all hover:-translate-y-0.5"
          >
            <Mail className="w-5 h-5" />
          </a>
        </motion.div>
      </motion.div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        onClick={() => handleNav('#about')}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-muted-foreground hover:text-primary transition-colors focus-visible:outline-none"
        aria-label="Scroll to about section"
      >
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.6, repeat: Infinity }}>
          <ChevronDown className="w-6 h-6" />
        </motion.div>
      </motion.button>
    </section>
  )
}
