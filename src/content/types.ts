export type Lane = 'work' | 'impact'

export type Link = { label: string; url: string }
export type Metric = { label: string; value: string }
export type Media = { src: string; alt: string; caption?: string; small?: boolean }
export type Quote = { text: string; name: string; title: string }

export type Project = {
  name: string
  description: string
  links?: Link[]
  media?: Media[]
}

export type ListSection = {
  heading?: string
  items: { title?: string; text?: string }[]
}

export type Entry = {
  slug: string
  org: string
  role: string
  start: string // "YYYY-MM"
  end: string | null // null = present
  dateLabel?: string // display override, e.g. "2020 – 2022" when months are fuzzy
  lane: Lane
  summary: string // one-liner shown on the timeline bar / mobile tab
  story: string[] // paragraphs
  employment?: string // e.g. "Full-time"
  location?: string
  logo?: string // path under /public; monogram fallback renders if missing
  note?: string // small disclaimer/context line
  sections?: ListSection[] // bulleted list blocks (success stories, speakers, …)
  metrics?: Metric[]
  links?: Link[]
  media?: Media[]
  quotes?: Quote[]
  projects?: Project[]
}

export type Education = {
  slug: string
  school: string
  degree: string
  logo?: string
}
