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
