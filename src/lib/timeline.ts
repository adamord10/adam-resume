import type { Entry, Lane } from '../content/types'

export function monthIndex(ym: string): number {
  const [y, m] = ym.split('-').map(Number)
  return y * 12 + (m - 1)
}

export function currentYm(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export function formatYm(ym: string | null): string {
  if (!ym) return 'present'
  const [y, m] = ym.split('-')
  return `${MONTHS[Number(m) - 1]} ${y}`
}

export function formatDuration(start: string, end: string | null, nowYm: string): string {
  const months = monthIndex(end ?? nowYm) - monthIndex(start) + 1
  const yrs = Math.floor(months / 12)
  const mos = months % 12
  const y = yrs ? `${yrs} yr${yrs > 1 ? 's' : ''}` : ''
  const m = mos ? `${mos} mo${mos > 1 ? 's' : ''}` : ''
  return [y, m].filter(Boolean).join(' ') || '1 mo'
}

// --- Density-weighted axis -------------------------------------------------
// Each calendar year's width on the axis is proportional to how many entries
// are active in it, so busy years stretch and quiet years compress.

export type Scale = {
  minM: number
  endM: number // exclusive right edge (month index)
  y0: number
  weights: number[] // one per year from y0
  cum: number[] // cumulative raw offsets; cum[i] = offset at start of year y0+i
}

const EMPTY_YEAR_WEIGHT = 0.5

export function buildScale(entries: Entry[], nowYm: string): Scale {
  const starts = entries.map((e) => monthIndex(e.start))
  const ends = entries.map((e) => monthIndex(e.end ?? nowYm))
  const minM = Math.min(...starts)
  const endM = Math.max(...ends) + 1
  const y0 = Math.floor(minM / 12)
  const y1 = Math.floor((endM - 1) / 12)
  const weights: number[] = []
  for (let y = y0; y <= y1; y++) {
    const yStart = y * 12
    const yEnd = yStart + 11
    let count = 0
    for (let i = 0; i < entries.length; i++) {
      if (starts[i] <= yEnd && ends[i] >= yStart) count++
    }
    weights.push(Math.max(count, EMPTY_YEAR_WEIGHT))
  }
  const cum: number[] = [0]
  for (const w of weights) cum.push(cum[cum.length - 1] + w)
  return { minM, endM, y0, weights, cum }
}

function rawPos(m: number, s: Scale): number {
  const yi = Math.min(Math.max(Math.floor(m / 12) - s.y0, 0), s.weights.length - 1)
  const frac = (m - (s.y0 + yi) * 12) / 12
  return s.cum[yi] + s.weights[yi] * frac
}

export function scalePos(m: number, s: Scale): number {
  const a = rawPos(s.minM, s)
  const b = rawPos(s.endM, s)
  if (b === a) return 0
  return ((rawPos(m, s) - a) / (b - a)) * 100
}

export function scaleTicks(s: Scale): { label: string; left: number }[] {
  const ticks: { label: string; left: number }[] = []
  for (let y = s.y0; y * 12 < s.endM; y++) {
    if (y * 12 >= s.minM) ticks.push({ label: String(y), left: scalePos(y * 12, s) })
  }
  return ticks
}

// --- Lane layout: axis blocks + connector + info cards ---------------------

export type TimelineEntryLayout = {
  entry: Entry
  blockLeft: number // percent
  blockWidth: number // percent
  blockRow: number // 0 = touching the axis
  center: number // percent; connector anchor
  cardLeft: number // percent
  cardRow: number // 0 = closest to the axis
}

const MIN_BLOCK_W = 0.8
const BLOCK_ROW_GAP = 0.5
const CARD_ROW_GAP = 1.5

function placeInRow(rowEnds: number[], start: number, end: number, gap: number): number {
  let row = rowEnds.findIndex((e) => e + gap <= start)
  if (row === -1) {
    row = rowEnds.length
    rowEnds.push(end)
  } else {
    rowEnds[row] = end
  }
  return row
}

export function layoutTimelineLane(
  entries: Entry[],
  lane: Lane,
  s: Scale,
  nowYm: string,
  cardW: number
): TimelineEntryLayout[] {
  const laneEntries = entries
    .filter((e) => e.lane === lane)
    .sort((a, b) => monthIndex(a.start) - monthIndex(b.start))
  const blockEnds: number[] = []
  const cardEnds: number[] = []
  return laneEntries.map((entry) => {
    const rawLeft = scalePos(monthIndex(entry.start), s)
    const right = scalePos(monthIndex(entry.end ?? nowYm) + 1, s)
    const blockWidth = Math.max(right - rawLeft, MIN_BLOCK_W)
    const blockLeft = Math.min(rawLeft, 100 - blockWidth)
    const blockRow = placeInRow(blockEnds, blockLeft, blockLeft + blockWidth, BLOCK_ROW_GAP)
    const center = blockLeft + blockWidth / 2
    const cardLeft = Math.min(Math.max(center - cardW / 2, 0), 100 - cardW)
    const cardRow = placeInRow(cardEnds, cardLeft, cardLeft + cardW, CARD_ROW_GAP)
    return { entry, blockLeft, blockWidth, blockRow, center, cardLeft, cardRow }
  })
}
