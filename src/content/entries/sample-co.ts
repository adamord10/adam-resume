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
