'use client'

import { useEffect, useState } from 'react'
import { education } from '@/content/education'
import { entries } from '@/content/entries'
import { profile } from '@/content/profile'
import CommandPalette, { type PaletteItem } from './CommandPalette/CommandPalette'
import EntryDetail from './EntryDetail/EntryDetail'
import Logo from './Logo/Logo'
import TabRows from './TabRows/TabRows'
import Timeline from './Timeline/Timeline'
import styles from './PortfolioApp.module.css'

const paletteItems: PaletteItem[] = [
  ...entries.map((e) => ({ slug: e.slug, label: e.org, sub: `${e.role} · ${e.lane}` })),
  { slug: education.slug, label: education.school, sub: `${education.degree} · education` },
]

const isKnownSlug = (slug: string) =>
  entries.some((e) => e.slug === slug) || slug === education.slug

export default function PortfolioApp({ nowYm }: { nowYm: string }) {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null)

  useEffect(() => {
    const fromHash = () => {
      const slug = window.location.hash.slice(1)
      setSelectedSlug(isKnownSlug(slug) ? slug : null)
    }
    fromHash()
    window.addEventListener('hashchange', fromHash)
    return () => window.removeEventListener('hashchange', fromHash)
  }, [])

  const select = (slug: string) => {
    setSelectedSlug(slug)
    // pushState so Back/Forward walk through selections (hashchange syncs state)
    history.pushState(null, '', `#${slug}`)
  }

  const deselect = () => {
    setSelectedSlug(null)
    history.pushState(null, '', window.location.pathname + window.location.search)
  }

  const selected = entries.find((e) => e.slug === selectedSlug) ?? null
  const eduSelected = selectedSlug === education.slug

  return (
    <main className={styles.main}>
      <CommandPalette items={paletteItems} onSelect={select} />
      <header className={styles.hero}>
        <h1 className={styles.name}>{profile.name}</h1>
        <p className={styles.tagline}>{profile.tagline}</p>
      </header>

      <div className="desktopOnly">
        <Timeline
          entries={entries}
          education={education}
          nowYm={nowYm}
          selectedSlug={selectedSlug}
          onSelect={select}
        />
      </div>
      <div className="mobileOnly">
        <TabRows
          entries={entries}
          education={education}
          selectedSlug={selectedSlug}
          onSelect={select}
        />
      </div>

      {selected || eduSelected ? (
        <>
          <button className={styles.clearButton} onClick={deselect}>
            ✕ clear selection
          </button>
          {eduSelected ? (
            <article className={styles.eduDetail}>
              <span className={styles.eduTag}>education</span>
              <div className={styles.eduTitleRow}>
                <Logo src={education.logo} name={education.school} size={30} />
                <h2 className={styles.eduSchool}>{education.school}</h2>
              </div>
              <p className={styles.eduDegree}>{education.degree}</p>
            </article>
          ) : (
            <EntryDetail entry={selected!} nowYm={nowYm} />
          )}
        </>
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
        <span className={`${styles.kbdHint} desktopOnly`}>⌘K jump</span>
      </footer>
    </main>
  )
}
