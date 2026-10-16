import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Manrope } from "next/font/google";
import { profile } from "@/content/portfolio";
import { getSiteUrl } from "@/lib/site";
import { Providers } from "@/components/providers";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "Prince Barachiel Malonzo — Full Stack Developer",
    template: "%s | Prince Malonzo",
  },
  description: profile.description,
  applicationName: "Prince Malonzo Portfolio",
  authors: [{ name: profile.name }],
  creator: profile.name,
  keywords: [
    "Prince Barachiel Malonzo",
    "Full Stack Developer",
    "Web Developer",
    "Mobile Developer",
    "Manila",
    "Philippines",
    "React",
    "Next.js",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_PH",
    url: "/",
    siteName: "Prince Malonzo",
    title: `${profile.name} — ${profile.title}`,
    description: profile.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} — ${profile.title}`,
    description: profile.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafaf7" },
    { media: "(prefers-color-scheme: dark)", color: "#101214" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${manrope.variable} ${mono.variable} antialiased`}>
        <Providers>
          <a className="skip-link" href="#main">
            Skip to content
          </a>
          {children}
        </Providers>
      </body>
    </html>
  );
}
