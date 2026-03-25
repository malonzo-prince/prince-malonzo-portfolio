'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Github, Linkedin, Send, CheckCircle2, Loader2 } from 'lucide-react'
import { SectionWrapper, SectionHeading } from './section-wrapper'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

type FormState = 'idle' | 'loading' | 'success' | 'error'

export function ContactSection() {
  const [formState, setFormState] = useState<FormState>('idle')
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormState('loading')
    // Simulate async submission
    await new Promise((r) => setTimeout(r, 1200))
    setFormState('success')
    setForm({ name: '', email: '', message: '' })
    setTimeout(() => setFormState('idle'), 4000)
  }

  const socials = [
    {
      label: 'GitHub',
      href: 'https://github.com/malonzo-prince',
      icon: Github,
      handle: '@malonzo-prince',
    },
    {
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/in/prince-barachiel-malonzo-614942389/',
      icon: Linkedin,
      handle: 'Prince Barachiel Malonzo',
    },
    {
      label: 'Email',
      href: 'mailto:malonzo.princebarachiel31@gmail.com',
      icon: Mail,
      handle: 'malonzo.princebarachiel31@gmail.com',
    },
  ]

  return (
    <SectionWrapper id="contact">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <SectionHeading
          eyebrow="Contact"
          title="Let's Work Together"
          subtitle="Have a project in mind or just want to say hi? My inbox is always open."
        />

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Left: info + socials */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="p-6 rounded-2xl border border-border bg-card">
              <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                Whether you have a business opportunity, a collaboration idea, or just want to 
                connect with a developer who ships fast and leads well — I&apos;d love to hear from you.
              </p>
            </div>

            <div className="space-y-3">
              {socials.map((social, i) => {
                const Icon = social.icon
                return (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target={social.label !== 'Email' ? '_blank' : undefined}
                    rel={social.label !== 'Email' ? 'noopener noreferrer' : undefined}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:border-primary/40 hover:bg-primary/5 transition-all duration-200 group"
                    aria-label={`${social.label}: ${social.handle}`}
                  >
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-0.5">{social.label}</p>
                      <p className="text-sm font-medium text-foreground leading-tight break-all">
                        {social.handle}
                      </p>
                    </div>
                  </motion.a>
                )
              })}
            </div>
          </motion.div>

          {/* Right: form */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {formState === 'success' ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full min-h-[380px] flex flex-col items-center justify-center text-center p-8 rounded-2xl border border-emerald-500/30 bg-emerald-500/5"
              >
                <CheckCircle2 className="w-14 h-14 text-emerald-500 mb-4" />
                <h3 className="text-xl font-bold text-foreground mb-2">Message Sent!</h3>
                <p className="text-sm text-muted-foreground">
                  Thanks for reaching out. I&apos;ll get back to you as soon as possible.
                </p>
              </motion.div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="p-6 sm:p-8 rounded-2xl border border-border bg-card space-y-5"
              >
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="name" className="text-xs font-medium text-muted-foreground">
                      Name
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      required
                      disabled={formState === 'loading'}
                      className="bg-background border-border focus:border-primary/60 rounded-xl"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="email" className="text-xs font-medium text-muted-foreground">
                      Email
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      required
                      disabled={formState === 'loading'}
                      className="bg-background border-border focus:border-primary/60 rounded-xl"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="message" className="text-xs font-medium text-muted-foreground">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell me about your project or what you'd like to discuss..."
                    required
                    rows={6}
                    disabled={formState === 'loading'}
                    className="bg-background border-border focus:border-primary/60 rounded-xl resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={formState === 'loading'}
                  className="w-full rounded-xl h-11 gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20"
                >
                  {formState === 'loading' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </SectionWrapper>
  )
}
