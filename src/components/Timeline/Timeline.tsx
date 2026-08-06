'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { Entry } from '@/content/types'
import {
  buildScale,
  formatYm,
  layoutTimelineLane,
  scaleTicks,
  type TimelineEntryLayout,
} from '@/lib/timeline'
import Logo from '../Logo/Logo'
import styles from './Timeline.module.css'

const BLOCK_H = 7 // px height of an axis span block
const BLOCK_GAP = 3 // px between stacked block rows
const CONN_GAP = 14 // px of clear connector between blocks and the first card row
const CARD_H = 74 // px card height
const CARD_ROW_H = 86 // px per stacked card row
const CARD_W = 21 // percent card width

type Props = {
  entries: Entry[]
  nowYm: string
  selectedSlug: string | null
  onSelect: (slug: string) => void
}

export default function Timeline({ entries, nowYm, selectedSlug, onSelect }: Props) {
  const scale = buildScale(entries, nowYm)
  const work = layoutTimelineLane(entries, 'work', scale, nowYm, CARD_W)
  const impact = layoutTimelineLane(entries, 'impact', scale, nowYm, CARD_W)
  const ticks = scaleTicks(scale)
  const containerRef = useRef<HTMLElement>(null)

  // Once the draw-in has played, freeze it so display:none/block toggles
  // (crossing the mobile breakpoint) don't blank and replay the timeline.
  const [drawn, setDrawn] = useState(false)
  useEffect(() => {
    const lastDelayMs = (1.25 + entries.length * 0.12 + 0.45) * 1000
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

  const renderLane = (lane: TimelineEntryLayout[], side: 'above' | 'below') => {
    const blockRows = Math.max(0, ...lane.map((l) => l.blockRow)) + 1
    const cardRows = Math.max(0, ...lane.map((l) => l.cardRow)) + 1
    const blocksH = blockRows * (BLOCK_H + BLOCK_GAP)
    const height = blocksH + CONN_GAP + cardRows * CARD_ROW_H
    const off = (v: number) => (side === 'above' ? { bottom: v } : { top: v })

    return (
      <div
        className={styles.lane}
        style={{ height }}
        role="group"
        aria-label={side === 'above' ? 'work' : 'impact'}
      >
        {lane.map((l, i) => {
          const isSelected = selectedSlug === l.entry.slug
          const dates =
            l.entry.dateLabel ?? `${formatYm(l.entry.start)} – ${formatYm(l.entry.end)}`
          const cardOffset = blocksH + CONN_GAP + l.cardRow * CARD_ROW_H
          return (
            <div key={l.entry.slug}>
              <span
                className={`${styles.connector} ${
                  side === 'above' ? styles.connUp : styles.connDown
                }`}
                style={{
                  left: `${l.center}%`,
                  height: cardOffset + CARD_H / 2,
                  animationDelay: `${1.1 + i * 0.12}s`,
                  ...off(0),
                }}
                aria-hidden="true"
              />
              <span
                className={`${styles.block} ${isSelected ? styles.blockSelected : ''}`}
                style={{
                  left: `${l.blockLeft}%`,
                  width: `${l.blockWidth}%`,
                  animationDelay: `${0.9 + i * 0.12}s`,
                  ...off(l.blockRow * (BLOCK_H + BLOCK_GAP)),
                }}
                onClick={() => onSelect(l.entry.slug)}
                aria-hidden="true"
              />
              <button
                className={`${styles.card} ${isSelected ? styles.selected : ''}`}
                style={{
                  left: `${l.cardLeft}%`,
                  width: `${CARD_W}%`,
                  animationDelay: `${1.25 + i * 0.12}s`,
                  ...off(cardOffset),
                }}
                onClick={() => onSelect(l.entry.slug)}
                aria-current={isSelected ? 'true' : undefined}
              >
                <Logo src={l.entry.logo} name={l.entry.org} size={20} />
                <span className={styles.cardText}>
                  <span className={styles.cardOrg}>{l.entry.org}</span>
                  <span className={styles.cardRole}>{l.entry.role}</span>
                  <span className={styles.cardMeta}>{dates}</span>
                  {l.entry.location ? (
                    <span className={styles.cardMeta}>{l.entry.location}</span>
                  ) : null}
                </span>
              </button>
            </div>
          )
        })}
      </div>
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
      {renderLane(work, 'above')}
      <div className={styles.axisWrap} aria-hidden="true">
        <div className={styles.axis} />
        {ticks.map((t) => (
          <span key={t.label} className={styles.tick} style={{ left: `${t.left}%` }}>
            {t.label}
          </span>
        ))}
      </div>
      {renderLane(impact, 'below')}
      <div className={styles.laneLabel} aria-hidden="true">
        impact
      </div>
    </nav>
  )
}
