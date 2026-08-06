import { Analytics } from '@vercel/analytics/next'
import type { Metadata } from 'next'
import { JetBrains_Mono } from 'next/font/google'
import { profile } from '@/content/profile'
import './globals.css'

const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' })

export const metadata: Metadata = {
  metadataBase: new URL(profile.siteUrl),
  title: {
    default: profile.name,
    template: `%s — ${profile.name}`,
  },
  description: profile.tagline,
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: profile.name,
  email: `mailto:${profile.email}`,
  url: profile.siteUrl,
  sameAs: [profile.linkedin, profile.github],
  alumniOf: 'Brigham Young University',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={mono.variable}>
      <body>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Analytics />
      </body>
    </html>
  )
}
