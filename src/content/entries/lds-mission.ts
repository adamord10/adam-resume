import type { Entry } from '../types'

export const ldsMission: Entry = {
  slug: 'lds-mission',
  org: 'The Church of Jesus Christ of Latter-day Saints',
  role: 'Volunteer Representative',
  start: '2023-01',
  end: '2024-12',
  lane: 'impact',
  location: 'Argentina Buenos Aires East Mission',
  logo: '/logos/church.png',
  summary: 'Volunteer Representative',
  story: [],
  media: [
    { src: '/media/church1.png', alt: 'With friends in Argentina', small: true },
    { src: '/media/church2.png', alt: 'Holding El Libro de Mormón above Buenos Aires', small: true },
    { src: '/media/church3.png', alt: 'At the temple in Buenos Aires', small: true },
  ],
  sections: [
    {
      items: [
        { text: 'Lived in Argentina for two years' },
        { text: 'Helped others to recognize and overcome challenges through service and scripture study' },
        {
          text: 'Trained new missionaries in language (Spanish), teaching, public speaking, studying, and organizational skills',
        },
        { text: 'Oversaw performance and well-being of other missionaries, gave weekly formal trainings' },
        { text: 'Grew deep roots in kindness, integrity, hard work, and obedience' },
      ],
    },
  ],
}
