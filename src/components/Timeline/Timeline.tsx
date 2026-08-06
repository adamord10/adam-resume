'use client'

import { useCallback, useRef } from 'react'
import type { Entry } from '@/content/types'
import { layoutLane, timelineRange, yearTicks, type LaidOutEntry } from '@/lib/timeline'
import styles from './Timeline.module.css'

const ROW_H = 44 // px per stacked row inside a lane

type Props = {
  entries: Entry[]
  nowYm: string
  selectedSlug: string | null
  onSelect: (slug: string) => void
}

export default function Timeline({ entries, nowYm, selectedSlug, onSelect }: Props) {
  const range = timelineRange(entries, nowYm)
  const work = layoutLane(entries, 'work', range, nowYm)
  const impact = layoutLane(entries, 'impact', range, nowYm)
  const ticks = yearTicks(range)
  const containerRef = useRef<HTMLDivElement>(null)

  const onKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
    const buttons = Array.from(
      containerRef.current?.querySelectorAll<HTMLButtonElement>('button') ?? []
    )
    const i = buttons.indexOf(document.activeElement as HTMLButtonElement)
    if (i === -1) return
    const next = e.key === 'ArrowRight' ? i + 1 : i - 1
    buttons[(next + buttons.length) % buttons.length]?.focus()
    e.preventDefault()
  }, [])

  const laneHeight = (lane: LaidOutEntry[]) =>
    (Math.max(0, ...lane.map((l) => l.row)) + 1) * ROW_H

  const renderBar = (l: LaidOutEntry, i: number, position: 'above' | 'below') => {
    const offset =
      position === 'above' ? { bottom: l.row * ROW_H } : { top: l.row * ROW_H }
    return (
      <button
        key={l.entry.slug}
        className={`${styles.bar} ${selectedSlug === l.entry.slug ? styles.selected : ''}`}
        style={{
          left: `${l.left}%`,
          width: `${l.width}%`,
          animationDelay: `${0.9 + i * 0.12}s`,
          ...offset,
        }}
        onClick={() => onSelect(l.entry.slug)}
        aria-pressed={selectedSlug === l.entry.slug}
      >
        <span className={styles.barOrg}>{l.entry.org}</span>
        <span className={styles.barRole}>{l.entry.summary}</span>
      </button>
    )
  }

  return (
    <div
      ref={containerRef}
      className={styles.timeline}
      onKeyDown={onKeyDown}
      aria-label="Timeline navigation"
    >
      <div className={styles.laneLabel}>work</div>
      <div className={styles.lane} style={{ height: laneHeight(work) }}>
        {work.map((l, i) => renderBar(l, i, 'above'))}
      </div>
      <div className={styles.axisWrap}>
        <div className={styles.axis} />
        {ticks.map((t) => (
          <span key={t.label} className={styles.tick} style={{ left: `${t.left}%` }}>
            {t.label}
          </span>
        ))}
      </div>
      <div className={styles.lane} style={{ height: laneHeight(impact) }}>
        {impact.map((l, i) => renderBar(l, i, 'below'))}
      </div>
      <div className={styles.laneLabel}>impact</div>
    </div>
  )
}
