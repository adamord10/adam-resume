import type { Entry } from '../types'

export const redo: Entry = {
  slug: 'redo',
  org: 'Redo',
  role: 'Account Executive Intern',
  start: '2026-06',
  end: '2026-08',
  lane: 'work',
  employment: 'Full-time',
  location: 'London, England, United Kingdom',
  logo: '/logos/redo.png',
  summary: 'Account Executive Intern',
  story: [
    "Helped launch Redo's UK and EU go-to-market efforts as the company's first sales representative in Europe. Experimented with new sales motions, generated enterprise pipeline, and gained firsthand experience in an AI-native sales organization leveraging agentic workflows to automate prospecting, research, and account operations.",
  ],
  note: "Due to long sales cycles, closed-revenue figures aren't available — I left before the largest deals I sourced would have finished closing.",
  media: [
    {
      src: '/media/redo-accounts.png',
      alt: 'Largest accounts set at Redo',
      caption: 'biggest accounts I set',
    },
  ],
  sections: [
    {
      heading: 'success stories',
      items: [
        {
          title: 'Mountain Warehouse',
          text: "Reception was gatekeeping hard and I couldn't see a way through — so I asked to take a seat on the couch around the corner, then asked the next person who walked by to show me to the person I was there for.",
        },
        {
          title: 'Wolf & Badger',
          text: "Heard the AC went out in their building and their head of ops had moved to a London WeWork — tracked them down there.",
        },
        {
          title: 'Astrid & Miyu',
          text: 'Reception has to buzz you through the elevator — walked past, found a different elevator in the basement, and someone scanned me up to their office.',
        },
        {
          title: 'JD Sports Canada',
          text: 'Showed up with a giant box of cookies and insisted it was all for the one decision-maker I was trying to meet.',
        },
      ],
    },
  ],
}
