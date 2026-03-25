'use client'

import { motion } from 'framer-motion'
import { GitFork, Star, Users, BookOpen, GitCommit, TrendingUp } from 'lucide-react'
import { SectionWrapper, SectionHeading } from './section-wrapper'

const githubStats = [
  { label: 'Public Repos', value: '24', icon: BookOpen, description: 'Open source & personal projects' },
  { label: 'Total Stars', value: '87', icon: Star, description: 'Across all repositories' },
  { label: 'Contributions', value: '400+', icon: GitCommit, description: 'In the last 12 months' },
  { label: 'Followers', value: '38', icon: Users, description: 'Developer community' },
  { label: 'Forks', value: '31', icon: GitFork, description: 'Projects forked by others' },
  { label: 'Streak', value: '60 days', icon: TrendingUp, description: 'Current contribution streak' },
]

export function GithubStatsSection() {
  const username = 'malonzo-prince'

  return (
    <SectionWrapper id="github">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <SectionHeading
          eyebrow="GitHub"
          title="Open Source Activity"
          subtitle="Consistent contributions and a growing open-source footprint."
        />

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
          {githubStats.map((stat, i) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.45, delay: i * 0.07 }}
                className="group p-5 rounded-2xl border border-border bg-card hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-xs text-muted-foreground">{stat.label}</span>
                </div>
                <div className="text-2xl font-bold text-foreground mb-0.5">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </motion.div>
            )
          })}
        </div>

        {/* GitHub streak & contribution chart embed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid md:grid-cols-2 gap-6"
        >
          {/* Stats card */}
          <div className="rounded-2xl border border-border bg-card overflow-hidden p-4 flex flex-col items-center justify-center">
            <p className="text-xs text-muted-foreground font-mono mb-3">github stats</p>
            <img
              src={`https://github-readme-stats.vercel.app/api?username=${username}&show_icons=true&theme=transparent&hide_border=true&title_color=6366f1&icon_color=6366f1&text_color=94a3b8&rank_icon=github`}
              alt="GitHub Stats for malonzo-prince"
              className="w-full max-w-sm rounded-lg"
              loading="lazy"
            />
          </div>

        {/* Streak card */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden p-4 flex flex-col items-center justify-center">
          <p className="text-xs text-muted-foreground font-mono mb-3">contribution streak</p>
          <img
            src={`https://github-readme-streak-stats.herokuapp.com/?user=${username}&theme=transparent&hide_border=true&ring=6366f1&fire=6366f1&currStreakLabel=6366f1&sideLabels=94a3b8&dates=94a3b8&currStreakNum=e2e8f0&sideNums=e2e8f0`}
            alt="GitHub Streak for malonzo-prince"
            className="w-full max-w-sm rounded-lg"
            loading="lazy"
          />
        </div>
      </motion.div>
    </SectionWrapper>
  )
}
