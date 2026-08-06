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
