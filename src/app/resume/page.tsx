import type { Metadata } from 'next'
import { background } from '@/content/background'
import { entries } from '@/content/entries'
import { profile } from '@/content/profile'
import type { Lane } from '@/content/types'
import { formatYm, monthIndex } from '@/lib/timeline'
import PrintButton from './PrintButton'
import styles from './resume.module.css'

export const metadata: Metadata = {
  // The root layout's title template appends "— Adam Ord"
  title: 'Resume',
}

const byLane = (lane: Lane) =>
  entries
    .filter((e) => e.lane === lane)
    .sort((a, b) => monthIndex(b.start) - monthIndex(a.start))

export default function ResumePage() {
  const section = (title: string, lane: Lane) => (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      {byLane(lane).map((e) => (
        <div key={e.slug} className={styles.item}>
          <div className={styles.itemHead}>
            <strong>{e.role}</strong>
            <span className={styles.dates}>
              {formatYm(e.start)} – {formatYm(e.end)}
            </span>
          </div>
          <div className={styles.org}>
            {e.org}
            {e.location ? ` · ${e.location}` : ''}
          </div>
          {e.story.slice(0, 1).map((p, i) => (
            <p key={i} className={styles.blurb}>
              {p}
            </p>
          ))}
          {e.metrics?.length ? (
            <p className={styles.inlineMetrics}>
              {e.metrics.map((m) => `${m.label}: ${m.value}`).join(' · ')}
            </p>
          ) : null}
        </div>
      ))}
    </section>
  )

  return (
    <main className={styles.page}>
      <PrintButton />
      <header className={styles.header}>
        <h1 className={styles.name}>{profile.name}</h1>
        <p className={styles.contact}>
          {profile.email} · {profile.linkedin} · {profile.siteUrl}
        </p>
      </header>
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Education</h2>
        <div className={styles.item}>
          <div className={styles.itemHead}>
            <strong>{background.education.school}</strong>
            <span className={styles.dates}>{background.education.location}</span>
          </div>
          <div className={styles.org}>{background.education.degree}</div>
          <ul className={styles.bullets}>
            {background.education.bullets.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
        </div>
      </section>
      {section('Experience', 'work')}
      {section('Leadership & Volunteering', 'impact')}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Additional</h2>
        <ul className={styles.bullets}>
          {background.highlights.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
      </section>
    </main>
  )
}
