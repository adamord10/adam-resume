'use client'

import type { Education, Entry, Lane } from '@/content/types'
import { monthIndex } from '@/lib/timeline'
import Logo from '../Logo/Logo'
import styles from './TabRows.module.css'

type Tab = { slug: string; label: string; logo?: string }

type Props = {
  entries: Entry[]
  education?: Education
  selectedSlug: string | null
  onSelect: (slug: string) => void
}

export default function TabRows({ entries, education, selectedSlug, onSelect }: Props) {
  const byLane = (lane: Lane): Tab[] =>
    entries
      .filter((e) => e.lane === lane)
      .sort((a, b) => monthIndex(b.start) - monthIndex(a.start))
      .map((e) => ({ slug: e.slug, label: e.org, logo: e.logo }))

  const workTabs: Tab[] = [
    ...(education ? [{ slug: education.slug, label: education.school, logo: education.logo }] : []),
    ...byLane('work'),
  ]

  const row = (label: string, items: Tab[]) => (
    <div className={styles.row}>
      <div className={styles.label}>{label}</div>
      <div className={styles.scroll}>
        {items.map((t) => (
          <button
            key={t.slug}
            className={`${styles.tab} ${selectedSlug === t.slug ? styles.selected : ''}`}
            onClick={() => onSelect(t.slug)}
            aria-current={selectedSlug === t.slug ? 'true' : undefined}
          >
            <Logo src={t.logo} name={t.label} size={16} />
            {t.label}
          </button>
        ))}
      </div>
    </div>
  )

  return (
    <div className={styles.tabRows}>
      {row('work', workTabs)}
      {row('impact', byLane('impact'))}
    </div>
  )
}
