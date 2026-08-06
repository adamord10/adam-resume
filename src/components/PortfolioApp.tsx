'use client'

import { useEffect, useState } from 'react'
import { background } from '@/content/background'
import { entries } from '@/content/entries'
import { profile } from '@/content/profile'
import CommandPalette, { type PaletteItem } from './CommandPalette/CommandPalette'
import EntryDetail from './EntryDetail/EntryDetail'
import Logo from './Logo/Logo'
import TabRows from './TabRows/TabRows'
import Timeline from './Timeline/Timeline'
import styles from './PortfolioApp.module.css'

const paletteItems: PaletteItem[] = entries.map((e) => ({
  slug: e.slug,
  label: e.org,
  sub: `${e.role} · ${e.lane}`,
}))

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
    // pushState so Back/Forward walk through selections (hashchange syncs state)
    history.pushState(null, '', `#${slug}`)
  }

  const deselect = () => {
    setSelectedSlug(null)
    history.pushState(null, '', window.location.pathname + window.location.search)
  }

  const selected = entries.find((e) => e.slug === selectedSlug) ?? null

  return (
    <main className={styles.main}>
      <CommandPalette items={paletteItems} onSelect={select} />
      <header className={styles.hero}>
        <h1 className={styles.name}>{profile.name}</h1>
        <p className={styles.contactLine}>
          {profile.location} · <a href={`mailto:${profile.email}`}>{profile.email}</a> ·{' '}
          <a href={profile.phoneHref}>{profile.phone}</a>
        </p>
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
        <>
          <button className={styles.clearButton} onClick={deselect}>
            ✕ clear selection
          </button>
          <EntryDetail entry={selected} nowYm={nowYm} />
        </>
      ) : (
        <section className={styles.about}>
          <div className={styles.aboutBlock}>
            <h2 className={styles.aboutHeading}>education</h2>
            <div className={styles.eduTitleRow}>
              <Logo src={background.education.logo} name={background.education.school} size={24} />
              <strong>{background.education.school}</strong>
              <span className={styles.eduLocation}>· {background.education.location}</span>
            </div>
            <p className={styles.eduDegree}>{background.education.degree}</p>
            <ul className={styles.aboutList}>
              {background.education.bullets.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          </div>
          <div className={styles.aboutBlock}>
            <h2 className={styles.aboutHeading}>about</h2>
            <ul className={styles.aboutList}>
              {profile.about.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          </div>
          <div className={styles.aboutBlock}>
            <h2 className={styles.aboutHeading}>background</h2>
            <ul className={styles.aboutList}>
              {background.highlights.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          </div>
          <p className={styles.hint}>↑ pick a point on the timeline</p>
        </section>
      )}

      <footer className={styles.footer}>
        <p className={styles.motto}>{profile.motto}</p>
        <div className={styles.footerLinks}>
          <a href={profile.linkedin} target="_blank" rel="noreferrer">
            linkedin
          </a>
          <a href={profile.github} target="_blank" rel="noreferrer">
            github
          </a>
          <a href="/resume">resume</a>
          <span className={`${styles.kbdHint} desktopOnly`}>⌘K jump</span>
        </div>
      </footer>
    </main>
  )
}
