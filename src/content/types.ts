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
