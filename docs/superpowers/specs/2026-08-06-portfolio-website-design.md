# Portfolio Website — Design Spec

**Date:** 2026-08-06
**Status:** Draft — awaiting Adam's review
**Host:** Vercel (`*.vercel.app`)

## Purpose

A personal site that works as a better, evidence-backed resume. Two goals:

1. **Credibility** — every experience is backed by evidence (metrics, links, media, quotes), not just claims.
2. **Differentiation** — one visually stunning moment proves design/build/CX ability; everything else is deliberately minimal and to the point.

Primary audience: recruiters, hiring managers, and partners who skim first and dig second.

## Design decisions (agreed in brainstorming)

| Decision | Choice |
|---|---|
| Navigation | Two-lane horizontal timeline (Option C from mockups) |
| Hero moment | The timeline draws itself in on load — the hero and the nav are the same object |
| Projects | Live inside their timeline entries, not a separate section |
| Aesthetic | Clean white background, code-style monospace type, one restrained accent color |
| Evidence types | Metrics, links, media, quotes — all optional per entry |
| Stack | Next.js (App Router, SSG) + TypeScript on Vercel |

## Architecture

Static site, no backend, no CMS. Content lives in the repo as typed TypeScript data files; the site rebuilds on git push via Vercel.

```
src/
  content/
    entries/          # one file per timeline entry
      redo.ts
      campus-club.ts
      ...
    profile.ts        # name, tagline, contact links
  components/
    Timeline/         # the two-lane timeline + draw-in animation
    EntryDetail/      # detail view with evidence blocks
    ...
  app/
    page.tsx          # single main page: hero/timeline + detail area
    resume/page.tsx   # print-optimized classic one-pager
    opengraph-image.tsx
```

## Content model

```ts
type Entry = {
  slug: string
  org: string
  role: string
  start: string          // "2023-06"
  end: string | null     // null = present
  lane: 'work' | 'impact'
  summary: string        // one-line, shown in timeline node / tab
  story: string          // short narrative paragraph(s), markdown allowed
  metrics?: { label: string; value: string }[]
  links?: { label: string; url: string }[]
  media?: { src: string; alt: string; caption?: string }[]
  quotes?: { text: string; name: string; title: string }[]
  projects?: {           // projects nested under the entry they happened in
    name: string
    description: string
    links?: { label: string; url: string }[]
    media?: { src: string; alt: string }[]
  }[]
}
```

All evidence fields are optional; empty fields simply don't render. Content is
validated at build time by the TypeScript compiler — a malformed entry fails
the build, not the page.

Actual content (real jobs, orgs, dates, evidence) is provided by Adam later and
is out of scope for this spec; the placeholder entries used during development
must be clearly fake (e.g. "Sample Co") so they can't ship accidentally.

## The hero moment (timeline draw-in)

On first load: white page, name and one-line tagline appear, then the timeline
draws itself — the axis sweeps left to right (~1s), work nodes land above it
and impact nodes below it in chronological order, lane labels fade in last.
Total sequence ≈ 3–4 seconds.

- Plays on load; no replay control in v1.
- `prefers-reduced-motion: reduce` → no animation, timeline renders complete.
- After the sequence, the timeline is simply the nav — no separate hero section
  remains. The page is immediately useful.

## Navigation behavior

- **Desktop:** horizontal two-lane timeline. Nodes positioned by real date on
  the axis. Lanes labeled `work` (above) and `impact` (below) in small
  uppercase mono labels. Clicking a node opens that entry's detail view below
  the timeline (same page, URL hash updates, e.g. `/#redo`). Selected node is
  visually marked; keyboard navigation (arrow keys between nodes, Enter to
  open) is supported.
- **Mobile (< ~700px):** the timeline collapses to two labeled, horizontally
  scrollable tab rows (Option A from mockups) — `work` row on top, `impact`
  row beneath. Same detail view below. The draw-in animation is skipped on
  mobile — the tab rows render immediately.

## Entry detail view

Rendered below the timeline when a node is selected. Order:

1. Header: role, org, date range, lane tag.
2. Story: short narrative paragraphs.
3. Metrics: prominent stat row (large numbers, small labels) — first because
   numbers are the strongest credibility signal.
4. Projects: nested project cards with their own links/media.
5. Media: small image gallery.
6. Links: outbound "verify this" links (live sites, repos, press, org pages).
7. Quotes: attributed testimonials.

Sections with no data don't render. Default state (no node selected, or after
the hero finishes) shows a brief "about" blurb and a prompt to explore the
timeline.

## Visual system

- **Ground:** pure white (`#ffffff`). The site deliberately commits to a light
  theme — "clean white after the first image" is the brief.
- **Type:** one self-hosted monospace family for everything — headings, body,
  labels. Working choice: JetBrains Mono (swappable in one place). Hierarchy
  comes from size, weight, and spacing, not from mixing families.
- **Accent:** one color (working choice: a terminal green, tunable) used for
  the selected node, lane accents, links, and metric highlights. Everything
  else is ink/gray on white.
- **Density:** to the point. Short paragraphs, evidence over prose, no filler
  sections.

## V1 scope

In:

- Two-lane timeline nav + draw-in hero, mobile tab-row fallback
- Entry detail views with all evidence block types
- `/resume` print-optimized classic one-pager generated from the same entry
  data (browser print-to-PDF; no server-side PDF generation)
- Designed OG image (site-wide; per-entry OG images are a fast-follow)
- SEO: JSON-LD person schema, sitemap, meta/title/description
- Vercel Analytics
- Contact footer: email, LinkedIn, GitHub links from `profile.ts`

Out (fast-follows, not designed here):

- Cmd+K command palette
- Per-entry OG images
- Blog/writing section
- Custom domain (ships on `*.vercel.app` first)

## Error handling

Static site — the main failure surface is build time, which is the desired
place to fail:

- TypeScript validates all content; bad entries break the build.
- Missing media files break the build (imported, not string-pathed, where
  possible).
- Runtime: timeline gracefully handles overlapping dates (nodes nudge/stack),
  unknown hash slugs fall back to the default state.

## Testing

- Type-check + lint in CI (Vercel build).
- Component tests for timeline date→position math and overlap handling (the
  only real logic in the app).
- Playwright smoke test: page loads, nodes clickable, detail renders, reduced
  motion honored, `/resume` renders.
- Manual pass on mobile widths for the tab-row fallback.

## Open items (for Adam's review)

1. Real content: entries, evidence, and final tab/lane wording — to be
   provided by Adam.
2. Accent color: terminal green is the working choice; easy to change.
3. Lane labels: `work` / `impact` are working labels; confirm wording.
4. Site title/tagline copy.
