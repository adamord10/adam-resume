import { expect, test } from 'vitest'
import type { Entry } from '../content/types'
import {
  buildScale,
  formatDuration,
  formatYm,
  layoutTimelineLane,
  monthIndex,
  scalePos,
  scaleTicks,
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

test('scalePos maps the range ends to 0 and 100', () => {
  const s = buildScale([entry({ start: '2020-01', end: '2020-12' })], '2026-08')
  expect(scalePos(monthIndex('2020-01'), s)).toBe(0)
  expect(scalePos(monthIndex('2020-12') + 1, s)).toBe(100)
})

test('years with more event starts take proportionally more axis width', () => {
  const items = [
    entry({ slug: 'a', start: '2020-01', end: '2020-12' }),
    entry({ slug: 'b', start: '2021-01', end: '2021-12' }),
    entry({ slug: 'c', start: '2021-01', end: '2021-12' }),
  ]
  const s = buildScale(items, '2026-08')
  // 1 start in 2020 vs 2 starts in 2021 → the 2021 boundary sits at one third
  expect(scalePos(monthIndex('2021-01'), s)).toBeCloseTo(100 / 3)
})

test('pass-through years collapse to almost nothing', () => {
  const items = [
    entry({ slug: 'long', start: '2020-01', end: '2022-12' }),
    entry({ slug: 'next', start: '2023-01', end: '2023-12' }),
  ]
  const s = buildScale(items, '2026-08')
  // 2021 and 2022 have no starts — together they get a sliver of the axis
  const width2021to2023 =
    scalePos(monthIndex('2023-01'), s) - scalePos(monthIndex('2021-01'), s)
  expect(width2021to2023).toBeLessThan(15)
})

test('scaleTicks skips labels for pass-through years', () => {
  const items = [
    entry({ slug: 'long', start: '2020-01', end: '2022-12' }),
    entry({ slug: 'next', start: '2023-01', end: '2023-12' }),
  ]
  const s = buildScale(items, '2026-08')
  expect(scaleTicks(s).map((t) => t.label)).toEqual(['2020', '2023'])
})

test('overlapping entries stack block rows but cards slide sideways in one row', () => {
  const a = entry({ slug: 'a', start: '2026-01', end: '2026-05' })
  const b = entry({ slug: 'b', start: '2026-04', end: '2026-05' })
  const s = buildScale([a, b], '2026-08')
  const laid = layoutTimelineLane([a, b], 'work', s, '2026-08', 40)
  const bySlug = Object.fromEntries(laid.map((l) => [l.entry.slug, l]))
  expect(bySlug.a.blockRow).toBe(0)
  expect(bySlug.b.blockRow).toBe(1)
  // cards fit side by side instead of stacking
  expect(bySlug.a.cardRow).toBe(0)
  expect(bySlug.b.cardRow).toBe(0)
  expect(bySlug.b.cardLeft - bySlug.a.cardLeft).toBeGreaterThanOrEqual(40)
})

test('cards stack once, and only when a single row cannot fit them', () => {
  const items = [
    entry({ slug: 'a', start: '2026-01', end: '2026-05' }),
    entry({ slug: 'b', start: '2026-02', end: '2026-05' }),
    entry({ slug: 'c', start: '2026-03', end: '2026-05' }),
  ]
  const s = buildScale(items, '2026-08')
  const laid = layoutTimelineLane(items, 'work', s, '2026-08', 40)
  const rows = laid.map((l) => l.cardRow)
  expect(Math.max(...rows)).toBe(1)
  expect(Math.min(...rows)).toBe(0)
})

test('non-overlapping cards share row 0', () => {
  const a = entry({ slug: 'a', start: '2020-01', end: '2020-12' })
  const b = entry({ slug: 'b', start: '2024-01', end: '2024-12' })
  const s = buildScale([a, b], '2026-08')
  const laid = layoutTimelineLane([a, b], 'work', s, '2026-08', 24)
  expect(laid.every((l) => l.cardRow === 0)).toBe(true)
})

test('blocks and cards clamp inside the container', () => {
  const old = entry({ slug: 'o', start: '2020-01', end: '2020-06' })
  const fresh = entry({ slug: 'a', start: '2026-08', end: null })
  const s = buildScale([old, fresh], '2026-08')
  const laid = layoutTimelineLane([old, fresh], 'work', s, '2026-08', 24)
  const f = laid.find((l) => l.entry.slug === 'a')!
  expect(f.blockLeft + f.blockWidth).toBeLessThanOrEqual(100)
  expect(f.cardLeft).toBeGreaterThanOrEqual(0)
  expect(f.cardLeft + 24).toBeLessThanOrEqual(100)
})

test('layoutTimelineLane only lays out the requested lane', () => {
  const items = [entry({ slug: 'w', lane: 'work' }), entry({ slug: 'i', lane: 'impact' })]
  const s = buildScale(items, '2026-08')
  const laid = layoutTimelineLane(items, 'impact', s, '2026-08', 24)
  expect(laid.map((l) => l.entry.slug)).toEqual(['i'])
})

test('formatYm renders human dates and present', () => {
  expect(formatYm('2023-06')).toBe('Jun 2023')
  expect(formatYm(null)).toBe('present')
})

test('formatDuration renders LinkedIn-style month/year spans', () => {
  expect(formatDuration('2026-06', '2026-08', '2026-08')).toBe('3 mos')
  expect(formatDuration('2026-04', '2026-05', '2026-08')).toBe('2 mos')
  expect(formatDuration('2023-01', '2024-12', '2026-08')).toBe('2 yrs')
  expect(formatDuration('2025-01', '2025-12', '2026-08')).toBe('1 yr')
  expect(formatDuration('2023-01', null, '2024-03')).toBe('1 yr 3 mos')
  expect(formatDuration('2026-08', '2026-08', '2026-08')).toBe('1 mo')
})
