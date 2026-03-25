import { Navbar } from '@/components/portfolio/navbar'
import { HeroSection } from '@/components/portfolio/hero-section'
import { AboutSection } from '@/components/portfolio/about-section'
import { SkillsSection } from '@/components/portfolio/skills-section'
import { ProjectsSection } from '@/components/portfolio/projects-section'
import { ExperienceSection } from '@/components/portfolio/experience-section'
import { ResumeSection } from '@/components/portfolio/resume-section'
import { ContactSection } from '@/components/portfolio/contact-section'
import { Footer } from '@/components/portfolio/footer'

export default function Home() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ProjectsSection />
      <ExperienceSection />
      <ResumeSection />
      <ContactSection />
      <Footer />
    </main>
  )
}
