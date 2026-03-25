import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'Prince Barachiel Malonzo — Fullstack Developer & Project Manager',
  description:
    'Portfolio of Prince Barachiel Malonzo — Fullstack Developer and Project Manager intern at Microgenesis. BSIT student at National University - Mall of Asia specializing in Mobile and Web Applications.',
  authors: [{ name: 'Prince Barachiel Malonzo' }],
  keywords: ['fullstack developer', 'project manager', 'Next.js', 'React', 'TypeScript', 'portfolio'],
  openGraph: {
    title: 'Prince Barachiel Malonzo — Fullstack Developer & Project Manager',
    description: 'Portfolio of Prince Barachiel Malonzo — Fullstack Developer and Project Manager at Microgenesis.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f5f7ff' },
    { media: '(prefers-color-scheme: dark)', color: '#0c0f1a' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
