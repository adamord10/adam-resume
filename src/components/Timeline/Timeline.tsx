'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { Entry } from '@/content/types'
import { formatYm, layoutLane, timelineRange, yearTicks, type LaidOutEntry } from '@/lib/timeline'
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
  const containerRef = useRef<HTMLElement>(null)

  // Once the draw-in has played, freeze it so display:none/block toggles
  // (crossing the mobile breakpoint) don't blank and replay the timeline.
  const [drawn, setDrawn] = useState(false)
  useEffect(() => {
    const lastDelayMs = (0.9 + entries.length * 0.12 + 0.45) * 1000
    const t = setTimeout(() => setDrawn(true), lastDelayMs + 200)
    return () => clearTimeout(t)
  }, [entries.length])

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
        aria-current={selectedSlug === l.entry.slug ? 'true' : undefined}
      >
        <span className={styles.barOrg}>{l.entry.org}</span>
        <span className={styles.barRole}>{l.entry.summary}</span>
        <span className="srOnly">
          {formatYm(l.entry.start)} – {formatYm(l.entry.end)}
        </span>
      </button>
    )
  }

  return (
    <nav
      ref={containerRef}
      className={`${styles.timeline} ${drawn ? styles.drawn : ''}`}
      onKeyDown={onKeyDown}
      aria-label="Career timeline"
    >
      <div className={styles.laneLabel} aria-hidden="true">
        work
      </div>
      <div
        className={styles.lane}
        style={{ height: laneHeight(work) }}
        role="group"
        aria-label="work"
      >
        {work.map((l, i) => renderBar(l, i, 'above'))}
      </div>
      <div className={styles.axisWrap} aria-hidden="true">
        <div className={styles.axis} />
        {ticks.map((t) => (
          <span key={t.label} className={styles.tick} style={{ left: `${t.left}%` }}>
            {t.label}
          </span>
        ))}
      </div>
      <div
        className={styles.lane}
        style={{ height: laneHeight(impact) }}
        role="group"
        aria-label="impact"
      >
        {impact.map((l, i) => renderBar(l, i, 'below'))}
      </div>
      <div className={styles.laneLabel} aria-hidden="true">
        impact
      </div>
    </nav>
  )
}
