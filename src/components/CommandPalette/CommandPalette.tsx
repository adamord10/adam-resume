'use client'

import { useEffect, useRef, useState } from 'react'
import type { Entry } from '@/content/types'
import styles from './CommandPalette.module.css'

type Props = {
  entries: Entry[]
  onSelect: (slug: string) => void
}

export default function CommandPalette({ entries, onSelect }: Props) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const items = entries.map((e) => ({
    slug: e.slug,
    label: e.org,
    sub: `${e.role} · ${e.lane}`,
  }))

  const filtered = items.filter((i) =>
    `${i.label} ${i.sub}`.toLowerCase().includes(query.toLowerCase())
  )

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((o) => !o)
        setQuery('')
        setActive(0)
      } else if (e.key === 'Escape') {
        setOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  if (!open) return null

  const choose = (slug: string) => {
    onSelect(slug)
    setOpen(false)
  }

  const onInputKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      setActive((a) => Math.min(a + 1, filtered.length - 1))
      e.preventDefault()
    } else if (e.key === 'ArrowUp') {
      setActive((a) => Math.max(a - 1, 0))
      e.preventDefault()
    } else if (e.key === 'Enter' && filtered[active]) {
      choose(filtered[active].slug)
    }
  }

  return (
    <div className={styles.overlay} onClick={() => setOpen(false)}>
      <div
        className={styles.palette}
        role="dialog"
        aria-modal="true"
        aria-label="Jump to entry"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          ref={inputRef}
          className={styles.input}
          placeholder="jump to…"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setActive(0)
          }}
          onKeyDown={onInputKey}
        />
        <ul className={styles.list} role="listbox">
          {filtered.map((i, idx) => (
            <li key={i.slug} role="option" aria-selected={idx === active}>
              <button
                className={`${styles.item} ${idx === active ? styles.active : ''}`}
                onClick={() => choose(i.slug)}
                onMouseEnter={() => setActive(idx)}
              >
                <span>{i.label}</span>
                <span className={styles.itemSub}>{i.sub}</span>
              </button>
            </li>
          ))}
          {!filtered.length ? <li className={styles.empty}>no matches</li> : null}
        </ul>
      </div>
    </div>
  )
}
