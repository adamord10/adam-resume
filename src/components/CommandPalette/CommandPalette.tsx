'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './CommandPalette.module.css'

export type PaletteItem = { slug: string; label: string; sub: string }

type Props = {
  items: PaletteItem[]
  onSelect: (slug: string) => void
}

export default function CommandPalette({ items, onSelect }: Props) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const triggerRef = useRef<HTMLElement | null>(null)

  const filtered = items.filter((i) =>
    `${i.label} ${i.sub}`.toLowerCase().includes(query.toLowerCase())
  )

  const close = () => {
    setOpen(false)
    triggerRef.current?.focus()
    triggerRef.current = null
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        if (open) {
          close()
        } else {
          triggerRef.current = document.activeElement as HTMLElement | null
          setQuery('')
          setActive(0)
          setOpen(true)
        }
      } else if (e.key === 'Escape' && open) {
        close()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // close is stable per open state; re-register on open change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  if (!open) return null

  const choose = (slug: string) => {
    close()
    onSelect(slug)
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
    } else if (e.key === 'Tab') {
      // the input is the dialog's only focusable element; keep focus inside
      e.preventDefault()
    }
  }

  return (
    <div className={styles.overlay} onClick={close}>
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
          role="combobox"
          aria-expanded="true"
          aria-controls="palette-listbox"
          aria-activedescendant={
            filtered[active] ? `palette-option-${filtered[active].slug}` : undefined
          }
          aria-autocomplete="list"
          aria-label="Jump to entry"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setActive(0)
          }}
          onKeyDown={onInputKey}
        />
        <ul id="palette-listbox" className={styles.list} role="listbox" aria-label="Entries">
          {filtered.map((i, idx) => (
            <li
              key={i.slug}
              id={`palette-option-${i.slug}`}
              role="option"
              aria-selected={idx === active}
              className={`${styles.item} ${idx === active ? styles.active : ''}`}
              onClick={() => choose(i.slug)}
              onMouseEnter={() => setActive(idx)}
            >
              <span>{i.label}</span>
              <span className={styles.itemSub}>{i.sub}</span>
            </li>
          ))}
        </ul>
        {!filtered.length ? <div className={styles.empty}>no matches</div> : null}
      </div>
    </div>
  )
}
