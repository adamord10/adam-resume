'use client'

import type { Entry, Lane } from '@/content/types'
import { monthIndex } from '@/lib/timeline'
import Logo from '../Logo/Logo'
import styles from './TabRows.module.css'

type Props = {
  entries: Entry[]
  selectedSlug: string | null
  onSelect: (slug: string) => void
}

export default function TabRows({ entries, selectedSlug, onSelect }: Props) {
  const byLane = (lane: Lane) =>
    entries
      .filter((e) => e.lane === lane)
      .sort((a, b) => monthIndex(b.start) - monthIndex(a.start))

  const row = (label: string, items: Entry[]) => (
    <div className={styles.row}>
      <div className={styles.label}>{label}</div>
      <div className={styles.scroll}>
        {items.map((e) => (
          <button
            key={e.slug}
            className={`${styles.tab} ${selectedSlug === e.slug ? styles.selected : ''}`}
            onClick={() => onSelect(e.slug)}
            aria-current={selectedSlug === e.slug ? 'true' : undefined}
          >
            <Logo src={e.logo} name={e.org} size={16} />
            {e.org}
          </button>
        ))}
      </div>
    </div>
  )

  return (
    <div className={styles.tabRows}>
      {row('work', byLane('work'))}
      {row('impact', byLane('impact'))}
    </div>
  )
}
