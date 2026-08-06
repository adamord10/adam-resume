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
    const rawLeft = positionPercent(entry.start, range)
    const right = positionPercent(entry.end ?? nowYm, range)
    const width = Math.max(right - rawLeft, MIN_WIDTH)
    // MIN_WIDTH can push a bar past the axis end; keep it inside the range
    const left = Math.min(rawLeft, 100 - width)
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
