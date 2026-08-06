# Portfolio Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the two-lane timeline resume site from `docs/superpowers/specs/2026-08-06-portfolio-website-design.md` with clearly-fake placeholder content.

**Architecture:** Next.js App Router, fully static, no backend. Content is typed TypeScript data in `src/content/`; the only real logic (timeline date→position math) lives in `src/lib/timeline.ts` and is unit-tested with Vitest. UI is plain CSS Modules (no Tailwind) — the aesthetic is white ground + one monospace family, which needs no utility framework.

**Tech Stack:** Next.js 15, React 19, TypeScript, CSS Modules, Vitest, Playwright, `@vercel/analytics`, `next/og`.

**Deviations from spec (deliberate):** `story` is `string[]` (paragraphs), not markdown — no markdown dependency needed for v1. Placeholder media is a checked-in SVG so builds never depend on missing binaries.

**Note on fonts:** JetBrains Mono loads via `next/font/google` (self-hosted at build). If the build environment can't reach Google Fonts, temporarily replace `var(--font-mono)` usage with `ui-monospace, monospace` and drop the import — swap back before deploy.

---

### Task 1: Scaffold the Next.js app

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `.gitignore`
- Create: `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "adam-resume",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "test": "vitest run"
  },
  "dependencies": {
    "@vercel/analytics": "^1.5.0",
    "next": "^15.4.0",
    "react": "^19.1.0",
    "react-dom": "^19.1.0"
  },
  "devDependencies": {
    "@playwright/test": "^1.54.0",
    "@types/node": "^24.0.0",
    "@types/react": "^19.1.0",
    "typescript": "^5.8.0",
    "vitest": "^3.2.0"
  }
}
```

- [ ] **Step 2: Create `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 3: Create `next.config.ts`**

```ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {}

export default nextConfig
```

- [ ] **Step 4: Create `.gitignore`**

```
node_modules/
.next/
out/
*.tsbuildinfo
test-results/
playwright-report/
```

- [ ] **Step 5: Create `src/app/globals.css`**

```css
:root {
  --ink: #111111;
  --gray: #666666;
  --line: #e5e5e5;
  --accent: #15803d;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  background: #ffffff;
  color: var(--ink);
}

body {
  font-family: var(--font-mono), ui-monospace, monospace;
  line-height: 1.6;
}

a {
  color: var(--accent);
}

.desktopOnly {
  display: block;
}

.mobileOnly {
  display: none;
}

@media (max-width: 700px) {
  .desktopOnly {
    display: none;
  }
  .mobileOnly {
    display: block;
  }
}
```

- [ ] **Step 6: Create `src/app/layout.tsx`**

```tsx
import type { Metadata } from 'next'
import { JetBrains_Mono } from 'next/font/google'
import './globals.css'

const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' })

export const metadata: Metadata = {
  title: 'Adam Ord',
  description: 'Evidence-backed resume',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={mono.variable}>
      <body>{children}</body>
    </html>
  )
}
```

- [ ] **Step 7: Create placeholder `src/app/page.tsx`** (replaced in Task 7)

```tsx
export default function Home() {
  return <main>coming soon</main>
}
```

- [ ] **Step 8: Install and verify build**

Run: `npm install`
Run: `npm run build`
Expected: build succeeds, `/` listed as static (○).

- [ ] **Step 9: Commit**

```bash
git add package.json package-lock.json tsconfig.json next.config.ts .gitignore src next-env.d.ts
git commit -m "feat: scaffold Next.js app with mono/white design tokens"
```

---

### Task 2: Content model and placeholder content

**Files:**
- Create: `src/content/types.ts`, `src/content/profile.ts`
- Create: `src/content/entries/sample-co.ts`, `src/content/entries/acme-startup.ts`, `src/content/entries/first-gig.ts`, `src/content/entries/campus-club.ts`, `src/content/entries/local-nonprofit.ts`, `src/content/entries/index.ts`
- Create: `public/placeholder-project.svg`

- [ ] **Step 1: Create `src/content/types.ts`**

```ts
export type Lane = 'work' | 'impact'

export type Link = { label: string; url: string }
export type Metric = { label: string; value: string }
export type Media = { src: string; alt: string; caption?: string }
export type Quote = { text: string; name: string; title: string }

export type Project = {
  name: string
  description: string
  links?: Link[]
  media?: Media[]
}

export type Entry = {
  slug: string
  org: string
  role: string
  start: string // "YYYY-MM"
  end: string | null // null = present
  lane: Lane
  summary: string // one-liner shown on the timeline bar / mobile tab
  story: string[] // paragraphs
  metrics?: Metric[]
  links?: Link[]
  media?: Media[]
  quotes?: Quote[]
  projects?: Project[]
}
```

- [ ] **Step 2: Create `src/content/profile.ts`**

```ts
export const profile = {
  name: 'Adam Ord',
  tagline: 'placeholder tagline — the resume that shows its work',
  about: [
    'Placeholder about paragraph. Adam will replace this with two or three sentences about who he is and what he does.',
  ],
  email: 'adam.ord10@gmail.com',
  linkedin: 'https://www.linkedin.com/in/placeholder',
  github: 'https://github.com/adamord10',
  siteUrl: 'https://adam-resume.vercel.app',
}
```

- [ ] **Step 3: Create `public/placeholder-project.svg`**

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450"><rect width="800" height="450" fill="#f4f4f4"/><text x="400" y="225" font-family="monospace" font-size="24" fill="#666" text-anchor="middle">placeholder media</text></svg>
```

- [ ] **Step 4: Create the five placeholder entries**

`src/content/entries/sample-co.ts` — exercises every evidence type:

```ts
import type { Entry } from '../types'

export const sampleCo: Entry = {
  slug: 'sample-co',
  org: 'Sample Co',
  role: 'Placeholder Senior Role',
  start: '2023-06',
  end: null,
  lane: 'work',
  summary: 'Placeholder Senior Role',
  story: [
    'Placeholder story paragraph one. Real narrative about what Adam owned and shipped goes here.',
    'Placeholder story paragraph two, showing that multi-paragraph stories render correctly.',
  ],
  metrics: [
    { label: 'placeholder metric', value: '123%' },
    { label: 'another metric', value: '$1.2M' },
    { label: 'third metric', value: '45' },
  ],
  links: [
    { label: 'placeholder live site', url: 'https://example.com' },
    { label: 'placeholder press', url: 'https://example.com/press' },
  ],
  media: [
    { src: '/placeholder-project.svg', alt: 'Placeholder media', caption: 'placeholder caption' },
  ],
  quotes: [
    {
      text: 'Placeholder testimonial quote about working with Adam.',
      name: 'Placeholder Person',
      title: 'Placeholder Title, Sample Co',
    },
  ],
  projects: [
    {
      name: 'Placeholder Project',
      description: 'Placeholder description of a project completed during this role.',
      links: [{ label: 'placeholder repo', url: 'https://example.com/repo' }],
    },
  ],
}
```

`src/content/entries/acme-startup.ts`:

```ts
import type { Entry } from '../types'

export const acmeStartup: Entry = {
  slug: 'acme-startup',
  org: 'Acme Startup',
  role: 'Placeholder Mid Role',
  start: '2021-01',
  end: '2023-05',
  lane: 'work',
  summary: 'Placeholder Mid Role',
  story: ['Placeholder story for the Acme Startup role.'],
  metrics: [{ label: 'placeholder metric', value: '3x' }],
  links: [{ label: 'placeholder link', url: 'https://example.com' }],
}
```

`src/content/entries/first-gig.ts`:

```ts
import type { Entry } from '../types'

export const firstGig: Entry = {
  slug: 'first-gig',
  org: 'First Gig Inc',
  role: 'Placeholder Early Role',
  start: '2019-05',
  end: '2020-12',
  lane: 'work',
  summary: 'Placeholder Early Role',
  story: ['Placeholder story for the earliest role — story-only, no evidence blocks, to prove empty sections vanish.'],
}
```

`src/content/entries/campus-club.ts`:

```ts
import type { Entry } from '../types'

export const campusClub: Entry = {
  slug: 'campus-club',
  org: 'Campus Club',
  role: 'Placeholder President',
  start: '2020-08',
  end: '2022-05',
  lane: 'impact',
  summary: 'Placeholder President',
  story: ['Placeholder story for a campus involvement entry in the impact lane.'],
  metrics: [{ label: 'members grown', value: '10 → 80' }],
  quotes: [
    {
      text: 'Placeholder quote from an advisor or member.',
      name: 'Placeholder Advisor',
      title: 'Placeholder Title, Campus Club',
    },
  ],
}
```

`src/content/entries/local-nonprofit.ts`:

```ts
import type { Entry } from '../types'

export const localNonprofit: Entry = {
  slug: 'local-nonprofit',
  org: 'Local Nonprofit',
  role: 'Placeholder Volunteer Lead',
  start: '2022-06',
  end: null,
  lane: 'impact',
  summary: 'Placeholder Volunteer Lead',
  story: ['Placeholder story for an ongoing volunteer entry.'],
  links: [{ label: 'placeholder org site', url: 'https://example.com' }],
}
```

- [ ] **Step 5: Create `src/content/entries/index.ts`**

```ts
import type { Entry } from '../types'
import { acmeStartup } from './acme-startup'
import { campusClub } from './campus-club'
import { firstGig } from './first-gig'
import { localNonprofit } from './local-nonprofit'
import { sampleCo } from './sample-co'

export const entries: Entry[] = [sampleCo, acmeStartup, firstGig, campusClub, localNonprofit]
```

- [ ] **Step 6: Verify types compile**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 7: Commit**

```bash
git add src/content public/placeholder-project.svg
git commit -m "feat: add content model and placeholder entries"
```

---

### Task 3: Timeline layout math (TDD)

**Files:**
- Create: `src/lib/timeline.test.ts`
- Create: `src/lib/timeline.ts`

Note: `src/lib` uses **relative** imports (`../content/types`) so Vitest runs zero-config without alias setup.

- [ ] **Step 1: Write the failing tests — `src/lib/timeline.test.ts`**

```ts
import { expect, test } from 'vitest'
import type { Entry } from '../content/types'
import {
  formatYm,
  layoutLane,
  monthIndex,
  positionPercent,
  timelineRange,
  yearTicks,
} from './timeline'

const entry = (over: Partial<Entry>): Entry => ({
  slug: 'x',
  org: 'X',
  role: 'R',
  start: '2020-01',
  end: '2020-12',
  lane: 'work',
  summary: 's',
  story: [],
  ...over,
})

test('monthIndex converts YYYY-MM to a month count', () => {
  expect(monthIndex('2020-01')).toBe(2020 * 12)
  expect(monthIndex('2020-12')).toBe(2020 * 12 + 11)
})

test('timelineRange spans earliest start to latest end, using now for open entries', () => {
  const r = timelineRange(
    [entry({ start: '2019-05', end: '2020-01' }), entry({ start: '2021-02', end: null })],
    '2026-08'
  )
  expect(r.min).toBe(monthIndex('2019-05'))
  expect(r.max).toBe(monthIndex('2026-08'))
})

test('positionPercent maps range ends to 0 and 100', () => {
  const r = { min: monthIndex('2020-01'), max: monthIndex('2021-01') }
  expect(positionPercent('2020-01', r)).toBe(0)
  expect(positionPercent('2021-01', r)).toBe(100)
  expect(positionPercent('2020-07', r)).toBe(50)
})

test('layoutLane keeps non-overlapping entries in row 0 and bumps overlaps', () => {
  const a = entry({ slug: 'a', start: '2019-01', end: '2019-12' })
  const b = entry({ slug: 'b', start: '2020-06', end: '2021-06' })
  const c = entry({ slug: 'c', start: '2020-09', end: '2022-01' })
  const r = timelineRange([a, b, c], '2026-08')
  const laid = layoutLane([a, b, c], 'work', r, '2026-08')
  const rows = Object.fromEntries(laid.map((l) => [l.entry.slug, l.row]))
  expect(rows.a).toBe(0)
  expect(rows.b).toBe(0)
  expect(rows.c).toBe(1)
})

test('layoutLane only lays out the requested lane', () => {
  const items = [entry({ slug: 'w', lane: 'work' }), entry({ slug: 'i', lane: 'impact' })]
  const r = timelineRange(items, '2026-08')
  const laid = layoutLane(items, 'impact', r, '2026-08')
  expect(laid.map((l) => l.entry.slug)).toEqual(['i'])
})

test('short entries get a minimum clickable width', () => {
  const a = entry({ slug: 'a', start: '2020-01', end: '2020-01' })
  const r = { min: monthIndex('2015-01'), max: monthIndex('2026-01') }
  const [laid] = layoutLane([a], 'work', r, '2026-08')
  expect(laid.width).toBeGreaterThanOrEqual(3)
})

test('formatYm renders human dates and present', () => {
  expect(formatYm('2023-06')).toBe('Jun 2023')
  expect(formatYm(null)).toBe('present')
})

test('yearTicks emits one tick per January inside the range', () => {
  const r = { min: monthIndex('2019-05'), max: monthIndex('2021-03') }
  expect(yearTicks(r).map((t) => t.label)).toEqual(['2020', '2021'])
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test`
Expected: FAIL — cannot resolve `./timeline`.

- [ ] **Step 3: Implement `src/lib/timeline.ts`**

```ts
import type { Entry, Lane } from '../content/types'

export type Range = { min: number; max: number }

export type LaidOutEntry = {
  entry: Entry
  left: number // percent
  width: number // percent
  row: number // 0 = closest to the axis
}

const MIN_WIDTH = 3 // percent — keeps one-month entries clickable
const ROW_GAP = 1 // percent of horizontal clearance required to share a row

export function monthIndex(ym: string): number {
  const [y, m] = ym.split('-').map(Number)
  return y * 12 + (m - 1)
}

export function currentYm(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

export function timelineRange(entries: Entry[], nowYm: string): Range {
  const starts = entries.map((e) => monthIndex(e.start))
  const ends = entries.map((e) => monthIndex(e.end ?? nowYm))
  return { min: Math.min(...starts), max: Math.max(...ends) }
}

export function positionPercent(ym: string, range: Range): number {
  if (range.max === range.min) return 0
  return ((monthIndex(ym) - range.min) / (range.max - range.min)) * 100
}

export function layoutLane(entries: Entry[], lane: Lane, range: Range, nowYm: string): LaidOutEntry[] {
  const laneEntries = entries
    .filter((e) => e.lane === lane)
    .sort((a, b) => monthIndex(a.start) - monthIndex(b.start))
  const rowEnds: number[] = [] // rightmost occupied percent per row
  return laneEntries.map((entry) => {
    const left = positionPercent(entry.start, range)
    const right = positionPercent(entry.end ?? nowYm, range)
    const width = Math.max(right - left, MIN_WIDTH)
    let row = rowEnds.findIndex((end) => end + ROW_GAP <= left)
    if (row === -1) {
      row = rowEnds.length
      rowEnds.push(left + width)
    } else {
      rowEnds[row] = left + width
    }
    return { entry, left, width, row }
  })
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export function formatYm(ym: string | null): string {
  if (!ym) return 'present'
  const [y, m] = ym.split('-')
  return `${MONTHS[Number(m) - 1]} ${y}`
}

export function yearTicks(range: Range): { label: string; left: number }[] {
  const ticks: { label: string; left: number }[] = []
  for (let y = Math.ceil(range.min / 12); y * 12 <= range.max; y++) {
    ticks.push({ label: String(y), left: positionPercent(`${y}-01`, range) })
  }
  return ticks
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test`
Expected: all 8 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib
git commit -m "feat: add timeline layout math with tests"
```

---

### Task 4: Desktop timeline component with draw-in animation

**Files:**
- Create: `src/components/Timeline/Timeline.tsx`
- Create: `src/components/Timeline/Timeline.module.css`

- [ ] **Step 1: Create `src/components/Timeline/Timeline.tsx`**

```tsx
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
```

- [ ] **Step 2: Create `src/components/Timeline/Timeline.module.css`**

```css
.timeline {
  padding: 1.5rem 0 2.5rem;
}

.laneLabel {
  font-size: 0.7rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--gray);
  margin: 0.5rem 0;
}

.lane {
  position: relative;
}

.bar {
  position: absolute;
  height: 38px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 0.5rem;
  overflow: hidden;
  border: 1px solid var(--line);
  border-left: 3px solid var(--gray);
  background: #fff;
  font-family: inherit;
  font-size: 0.72rem;
  text-align: left;
  cursor: pointer;
  animation: barIn 0.45s ease both;
}

.bar:hover {
  border-color: var(--ink);
}

.bar:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

.selected {
  border-left-color: var(--accent);
  border-color: var(--accent);
}

.barOrg {
  font-weight: 700;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.barRole {
  color: var(--gray);
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.axisWrap {
  position: relative;
  margin: 10px 0 22px;
}

.axis {
  height: 2px;
  background: var(--ink);
  transform-origin: left;
  animation: axisIn 0.9s ease both;
}

.tick {
  position: absolute;
  top: 6px;
  transform: translateX(-50%);
  font-size: 0.65rem;
  color: var(--gray);
  animation: barIn 0.45s ease both;
  animation-delay: 0.7s;
}

@keyframes axisIn {
  from {
    transform: scaleX(0);
  }
  to {
    transform: scaleX(1);
  }
}

@keyframes barIn {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .axis,
  .bar,
  .tick {
    animation: none;
  }
}
```

- [ ] **Step 3: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/Timeline
git commit -m "feat: add two-lane timeline component with draw-in animation"
```

---

### Task 5: Mobile tab rows

**Files:**
- Create: `src/components/TabRows/TabRows.tsx`
- Create: `src/components/TabRows/TabRows.module.css`

- [ ] **Step 1: Create `src/components/TabRows/TabRows.tsx`**

```tsx
'use client'

import type { Entry, Lane } from '@/content/types'
import { monthIndex } from '@/lib/timeline'
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
            aria-pressed={selectedSlug === e.slug}
          >
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
```

- [ ] **Step 2: Create `src/components/TabRows/TabRows.module.css`**

```css
.tabRows {
  padding: 1rem 0;
}

.row {
  margin-bottom: 0.75rem;
}

.label {
  font-size: 0.7rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--gray);
  margin-bottom: 0.35rem;
}

.scroll {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  padding-bottom: 0.25rem;
}

.tab {
  flex: 0 0 auto;
  padding: 0.45rem 0.75rem;
  border: 1px solid var(--line);
  background: #fff;
  font-family: inherit;
  font-size: 0.78rem;
  cursor: pointer;
  white-space: nowrap;
}

.selected {
  border-color: var(--accent);
  color: var(--accent);
}
```

- [ ] **Step 3: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/TabRows
git commit -m "feat: add mobile tab-row navigation"
```

---

### Task 6: Entry detail view

**Files:**
- Create: `src/components/EntryDetail/EntryDetail.tsx`
- Create: `src/components/EntryDetail/EntryDetail.module.css`

- [ ] **Step 1: Create `src/components/EntryDetail/EntryDetail.tsx`**

```tsx
import type { Entry } from '@/content/types'
import { formatYm } from '@/lib/timeline'
import styles from './EntryDetail.module.css'

export default function EntryDetail({ entry }: { entry: Entry }) {
  return (
    <article className={styles.detail}>
      <header className={styles.header}>
        <span className={styles.laneTag}>{entry.lane}</span>
        <h2 className={styles.role}>{entry.role}</h2>
        <p className={styles.meta}>
          {entry.org} · {formatYm(entry.start)} – {formatYm(entry.end)}
        </p>
      </header>

      {entry.story.map((p, i) => (
        <p key={i} className={styles.story}>
          {p}
        </p>
      ))}

      {entry.metrics?.length ? (
        <dl className={styles.metrics}>
          {entry.metrics.map((m) => (
            <div key={m.label} className={styles.metric}>
              <dt className={styles.metricLabel}>{m.label}</dt>
              <dd className={styles.metricValue}>{m.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}

      {entry.projects?.length ? (
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>projects</h3>
          {entry.projects.map((p) => (
            <div key={p.name} className={styles.project}>
              <strong>{p.name}</strong>
              <p>{p.description}</p>
              {p.links?.map((l) => (
                <a key={l.url} href={l.url} target="_blank" rel="noreferrer">
                  {l.label} ↗
                </a>
              ))}
            </div>
          ))}
        </section>
      ) : null}

      {entry.media?.length ? (
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>media</h3>
          <div className={styles.gallery}>
            {entry.media.map((m) => (
              <figure key={m.src}>
                <img src={m.src} alt={m.alt} className={styles.mediaImg} />
                {m.caption ? <figcaption className={styles.caption}>{m.caption}</figcaption> : null}
              </figure>
            ))}
          </div>
        </section>
      ) : null}

      {entry.links?.length ? (
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>links</h3>
          <ul className={styles.links}>
            {entry.links.map((l) => (
              <li key={l.url}>
                <a href={l.url} target="_blank" rel="noreferrer">
                  {l.label} ↗
                </a>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {entry.quotes?.length ? (
        <section className={styles.section}>
          {entry.quotes.map((q) => (
            <blockquote key={q.name} className={styles.quote}>
              <p>“{q.text}”</p>
              <footer>
                — {q.name}, {q.title}
              </footer>
            </blockquote>
          ))}
        </section>
      ) : null}
    </article>
  )
}
```

- [ ] **Step 2: Create `src/components/EntryDetail/EntryDetail.module.css`**

```css
.detail {
  border-top: 1px solid var(--line);
  padding-top: 1.5rem;
  max-width: 44rem;
}

.header {
  margin-bottom: 1rem;
}

.laneTag {
  font-size: 0.65rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--accent);
}

.role {
  font-size: 1.3rem;
  margin: 0.15rem 0;
}

.meta {
  color: var(--gray);
  font-size: 0.85rem;
}

.story {
  margin-bottom: 0.85rem;
  font-size: 0.9rem;
}

.metrics {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  margin: 1.25rem 0;
}

.metric {
  display: flex;
  flex-direction: column-reverse; /* value renders above its label */
}

.metricValue {
  font-size: 1.6rem;
  font-weight: 700;
}

.metricLabel {
  font-size: 0.7rem;
  color: var(--gray);
  text-transform: uppercase;
  letter-spacing: 0.12em;
}

.section {
  margin: 1.25rem 0;
}

.sectionTitle {
  font-size: 0.7rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--gray);
  margin-bottom: 0.5rem;
}

.project {
  margin-bottom: 0.75rem;
  font-size: 0.9rem;
}

.gallery {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.mediaImg {
  max-width: 320px;
  width: 100%;
  border: 1px solid var(--line);
}

.caption {
  font-size: 0.7rem;
  color: var(--gray);
  margin-top: 0.25rem;
}

.links {
  list-style: none;
  font-size: 0.9rem;
}

.quote {
  border-left: 3px solid var(--accent);
  padding-left: 1rem;
  font-size: 0.9rem;
  color: var(--gray);
}
```

- [ ] **Step 3: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/EntryDetail
git commit -m "feat: add entry detail view with evidence blocks"
```

---

### Task 7: App wiring — selection, hash routing, default state, footer

**Files:**
- Create: `src/components/PortfolioApp.tsx`, `src/components/PortfolioApp.module.css`
- Modify: `src/app/page.tsx` (replace entirely)

- [ ] **Step 1: Create `src/components/PortfolioApp.tsx`**

```tsx
'use client'

import { useEffect, useState } from 'react'
import { entries } from '@/content/entries'
import { profile } from '@/content/profile'
import EntryDetail from './EntryDetail/EntryDetail'
import TabRows from './TabRows/TabRows'
import Timeline from './Timeline/Timeline'
import styles from './PortfolioApp.module.css'

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
    history.replaceState(null, '', `#${slug}`)
  }

  const selected = entries.find((e) => e.slug === selectedSlug) ?? null

  return (
    <main className={styles.main}>
      <header className={styles.hero}>
        <h1 className={styles.name}>{profile.name}</h1>
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
        <EntryDetail entry={selected} />
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
      </footer>
    </main>
  )
}
```

- [ ] **Step 2: Create `src/components/PortfolioApp.module.css`**

```css
.main {
  max-width: 60rem;
  margin: 0 auto;
  padding: 3rem 1.25rem 2rem;
}

.hero {
  margin-bottom: 1rem;
}

.name {
  font-size: 1.6rem;
  letter-spacing: -0.01em;
}

.tagline {
  color: var(--gray);
  font-size: 0.9rem;
}

.about {
  border-top: 1px solid var(--line);
  padding-top: 1.5rem;
  max-width: 44rem;
  font-size: 0.9rem;
}

.hint {
  margin-top: 1rem;
  color: var(--gray);
  font-size: 0.8rem;
}

.footer {
  margin-top: 3rem;
  padding-top: 1rem;
  border-top: 1px solid var(--line);
  display: flex;
  gap: 1.5rem;
  font-size: 0.8rem;
}
```

- [ ] **Step 3: Replace `src/app/page.tsx`**

```tsx
import PortfolioApp from '@/components/PortfolioApp'
import { currentYm } from '@/lib/timeline'

export default function Home() {
  return <PortfolioApp nowYm={currentYm()} />
}
```

- [ ] **Step 4: Verify build and eyeball it**

Run: `npm run build`
Expected: build succeeds.
Then run `npm run dev` briefly and fetch `http://localhost:3000` (curl or browser) — page contains "Adam Ord" and timeline bar labels ("Sample Co").

- [ ] **Step 5: Commit**

```bash
git add src/components/PortfolioApp.tsx src/components/PortfolioApp.module.css src/app/page.tsx
git commit -m "feat: wire timeline, detail view, hash routing, and footer"
```

---

### Task 8: `/resume` print route

**Files:**
- Create: `src/app/resume/page.tsx`, `src/app/resume/resume.module.css`, `src/app/resume/PrintButton.tsx`

- [ ] **Step 1: Create `src/app/resume/PrintButton.tsx`**

```tsx
'use client'

import styles from './resume.module.css'

export default function PrintButton() {
  return (
    <button className={styles.printButton} onClick={() => window.print()}>
      print / save as pdf
    </button>
  )
}
```

- [ ] **Step 2: Create `src/app/resume/page.tsx`**

```tsx
import type { Metadata } from 'next'
import { entries } from '@/content/entries'
import { profile } from '@/content/profile'
import type { Lane } from '@/content/types'
import { formatYm, monthIndex } from '@/lib/timeline'
import PrintButton from './PrintButton'
import styles from './resume.module.css'

export const metadata: Metadata = {
  title: `Resume — ${profile.name}`,
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
          <div className={styles.org}>{e.org}</div>
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
      {section('Experience', 'work')}
      {section('Leadership & Volunteering', 'impact')}
    </main>
  )
}
```

- [ ] **Step 3: Create `src/app/resume/resume.module.css`**

```css
.page {
  max-width: 46rem;
  margin: 0 auto;
  padding: 2.5rem 1.25rem;
  font-size: 0.85rem;
}

.printButton {
  border: 1px solid var(--line);
  background: #fff;
  font-family: inherit;
  font-size: 0.75rem;
  padding: 0.4rem 0.7rem;
  cursor: pointer;
  margin-bottom: 1.5rem;
}

.header {
  margin-bottom: 1.5rem;
}

.name {
  font-size: 1.4rem;
}

.contact {
  color: var(--gray);
  font-size: 0.78rem;
}

.section {
  margin-bottom: 1.5rem;
}

.sectionTitle {
  font-size: 0.75rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  border-bottom: 1px solid var(--ink);
  padding-bottom: 0.25rem;
  margin-bottom: 0.75rem;
}

.item {
  margin-bottom: 0.9rem;
}

.itemHead {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.dates {
  color: var(--gray);
  white-space: nowrap;
}

.org {
  color: var(--gray);
}

.blurb {
  margin-top: 0.2rem;
}

.inlineMetrics {
  margin-top: 0.2rem;
  color: var(--gray);
  font-size: 0.78rem;
}

@media print {
  .printButton {
    display: none;
  }
  .page {
    padding: 0;
    font-size: 10.5pt;
  }
}
```

- [ ] **Step 4: Verify build**

Run: `npm run build`
Expected: build succeeds, `/resume` listed as static.

- [ ] **Step 5: Commit**

```bash
git add src/app/resume
git commit -m "feat: add print-optimized /resume route"
```

---

### Task 9: SEO, OG image, analytics

**Files:**
- Modify: `src/app/layout.tsx` (replace entirely)
- Create: `src/app/sitemap.ts`, `src/app/opengraph-image.tsx`

- [ ] **Step 1: Replace `src/app/layout.tsx`**

```tsx
import { Analytics } from '@vercel/analytics/next'
import type { Metadata } from 'next'
import { JetBrains_Mono } from 'next/font/google'
import { profile } from '@/content/profile'
import './globals.css'

const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' })

export const metadata: Metadata = {
  metadataBase: new URL(profile.siteUrl),
  title: {
    default: profile.name,
    template: `%s — ${profile.name}`,
  },
  description: profile.tagline,
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: profile.name,
  email: `mailto:${profile.email}`,
  url: profile.siteUrl,
  sameAs: [profile.linkedin, profile.github],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={mono.variable}>
      <body>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Analytics />
      </body>
    </html>
  )
}
```

- [ ] **Step 2: Create `src/app/sitemap.ts`**

```ts
import type { MetadataRoute } from 'next'
import { profile } from '@/content/profile'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: profile.siteUrl },
    { url: `${profile.siteUrl}/resume` },
  ]
}
```

- [ ] **Step 3: Create `src/app/opengraph-image.tsx`**

```tsx
import { ImageResponse } from 'next/og'
import { profile } from '@/content/profile'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const bars = [
  { top: 290, left: 80, width: 360, accent: true },
  { top: 290, left: 480, width: 300, accent: false },
  { top: 430, left: 200, width: 260, accent: false },
  { top: 430, left: 500, width: 420, accent: false },
]

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          padding: 80,
          fontFamily: 'monospace',
          position: 'relative',
        }}
      >
        <div style={{ fontSize: 64, color: '#111111', display: 'flex' }}>{profile.name}</div>
        <div style={{ fontSize: 28, color: '#666666', marginTop: 12, display: 'flex' }}>
          {profile.tagline}
        </div>
        <div
          style={{
            position: 'absolute',
            top: 380,
            left: 80,
            right: 80,
            height: 4,
            background: '#111111',
            display: 'flex',
          }}
        />
        {bars.map((b, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: b.top,
              left: b.left,
              width: b.width,
              height: 52,
              border: '2px solid #111111',
              background: b.accent ? '#15803d' : '#ffffff',
              display: 'flex',
            }}
          />
        ))}
      </div>
    ),
    size
  )
}
```

- [ ] **Step 4: Verify build**

Run: `npm run build`
Expected: build succeeds; `/sitemap.xml` and `/opengraph-image` appear in the route list.

- [ ] **Step 5: Commit**

```bash
git add src/app/layout.tsx src/app/sitemap.ts src/app/opengraph-image.tsx
git commit -m "feat: add SEO metadata, JSON-LD, sitemap, OG image, analytics"
```

---

### Task 10: Playwright smoke test

**Files:**
- Create: `playwright.config.ts`, `e2e/smoke.spec.ts`

- [ ] **Step 1: Create `playwright.config.ts`**

```ts
import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: 'e2e',
  use: { baseURL: 'http://localhost:3000' },
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
    timeout: 120000,
  },
})
```

- [ ] **Step 2: Create `e2e/smoke.spec.ts`**

```ts
import { expect, test } from '@playwright/test'

test('timeline loads and opens an entry', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Adam Ord' })).toBeVisible()
  await page.getByRole('button', { name: /Sample Co/ }).first().click()
  await expect(
    page.getByRole('heading', { name: 'Placeholder Senior Role' })
  ).toBeVisible()
  await expect(page).toHaveURL(/#sample-co/)
})

test('unknown hash falls back to the about state', async ({ page }) => {
  await page.goto('/#does-not-exist')
  await expect(page.getByText('pick a point on the timeline')).toBeVisible()
})

test('resume page renders', async ({ page }) => {
  await page.goto('/resume')
  await expect(page.getByRole('heading', { name: 'Adam Ord' })).toBeVisible()
  await expect(page.getByText('Experience')).toBeVisible()
})
```

- [ ] **Step 3: Run the smoke tests**

Run: `npx playwright test`
Expected: 3 tests PASS. (Chromium is pre-installed at `/opt/pw-browsers`; do NOT run `playwright install`.)

- [ ] **Step 4: Run the full check suite one last time**

Run: `npm test && npm run build`
Expected: unit tests pass, build succeeds.

- [ ] **Step 5: Commit**

```bash
git add playwright.config.ts e2e
git commit -m "test: add Playwright smoke tests"
```
