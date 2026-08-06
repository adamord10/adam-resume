import { expect, test } from 'vitest'
import type { Entry } from '../content/types'
import {
  formatDuration,
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

test('bars near the right edge are clamped inside the timeline', () => {
  const old = entry({ slug: 'old', start: '2019-01', end: '2019-06' })
  const fresh = entry({ slug: 'fresh', start: '2026-08', end: null })
  const r = timelineRange([old, fresh], '2026-08')
  const laid = layoutLane([old, fresh], 'work', r, '2026-08')
  const f = laid.find((l) => l.entry.slug === 'fresh')!
  expect(f.width).toBeGreaterThanOrEqual(3)
  expect(f.left + f.width).toBeLessThanOrEqual(100)
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

test('yearTicks emits one tick per January inside the range', () => {
  const r = { min: monthIndex('2019-05'), max: monthIndex('2021-03') }
  expect(yearTicks(r).map((t) => t.label)).toEqual(['2020', '2021'])
})
