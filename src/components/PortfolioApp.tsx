'use client'

import { useEffect, useState } from 'react'
import { entries } from '@/content/entries'
import { profile } from '@/content/profile'
import EntryDetail from './EntryDetail/EntryDetail'
import TabRows from './TabRows/TabRows'
import Timeline from './Timeline/Timeline'
import styles from './PortfolioApp.module.css'

export default function PortfolioApp({ nowYm }: { nowYm: string }) {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null)

  useEffect(() => {
    const fromHash = () => {
      const slug = window.location.hash.slice(1)
      setSelectedSlug(entries.some((e) => e.slug === slug) ? slug : null)
    }
    fromHash()
    window.addEventListener('hashchange', fromHash)
    return () => window.removeEventListener('hashchange', fromHash)
  }, [])

  const select = (slug: string) => {
    setSelectedSlug(slug)
    history.replaceState(null, '', `#${slug}`)
  }

  const selected = entries.find((e) => e.slug === selectedSlug) ?? null

  return (
    <main className={styles.main}>
      <header className={styles.hero}>
        <h1 className={styles.name}>{profile.name}</h1>
        <p className={styles.tagline}>{profile.tagline}</p>
      </header>

      <div className="desktopOnly">
        <Timeline
          entries={entries}
          nowYm={nowYm}
          selectedSlug={selectedSlug}
          onSelect={select}
        />
      </div>
      <div className="mobileOnly">
        <TabRows entries={entries} selectedSlug={selectedSlug} onSelect={select} />
      </div>

      {selected ? (
        <EntryDetail entry={selected} />
      ) : (
        <section className={styles.about}>
          {profile.about.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          <p className={styles.hint}>↑ pick a point on the timeline</p>
        </section>
      )}

      <footer className={styles.footer}>
        <a href={`mailto:${profile.email}`}>email</a>
        <a href={profile.linkedin} target="_blank" rel="noreferrer">
          linkedin
        </a>
        <a href={profile.github} target="_blank" rel="noreferrer">
          github
        </a>
        <a href="/resume">resume</a>
      </footer>
    </main>
  )
}
