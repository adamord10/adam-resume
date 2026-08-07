import type { Entry } from '../types'

export const nexu: Entry = {
  slug: 'nexu',
  org: 'NEXU',
  role: 'Software Engineer Intern',
  start: '2026-04',
  end: '2026-05',
  lane: 'work',
  employment: 'Full-time',
  location: 'Mexico City, Mexico · On-site',
  logo: '/logos/nexu.png',
  summary: 'Software Engineer Intern',
  story: [
    'Built and deployed an end-to-end document-processing platform using open source OCR and LLM models to convert large, unstructured PDFs into validated, normalized, and model-ready datasets. Reduced manual validation costs by approximately 95% while achieving up to 100% fidelity on certain document types, enabling direct integration into actuarial loan models.',
  ],
  note: "This work is proprietary to NEXU and processes sensitive financial documents (bank statements), so screenshots and source can't be shared.",
  media: [
    {
      src: '/media/nexu1.jpg',
      alt: 'The NEXU office overlooking Mexico City at dusk',
      caption: 'the office, Mexico City',
      short: true,
    },
  ],
  metrics: [
    { label: 'manual validation cost reduction', value: '~95%' },
    { label: 'fidelity on certain document types', value: 'up to 100%' },
  ],
}
