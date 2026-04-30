import type { Metadata } from 'next'
import AiPageClient from './AiPageClient'

export const metadata: Metadata = {
  title: 'ATLAS — Property Intelligence AI',
  description:
    'ATLAS is the proprietary property intelligence AI from Targeted Advisors — instant valuations, zoning lookups, ALR and creek detection, market intelligence, and lead capture across the Lower Mainland and Fraser Valley.',
  alternates: { canonical: '/ai' },
  openGraph: {
    title: 'ATLAS — Property Intelligence AI | Targeted Advisors',
    description:
      'Instant valuations, zoning lookups, ALR and creek detection, and market intelligence powered by ATLAS, the proprietary property intelligence platform from Targeted Advisors.',
    url: 'https://www.targetedadvisors.ca/ai',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ATLAS — Property Intelligence AI | Targeted Advisors',
    description:
      'Instant valuations, zoning lookups, ALR and creek detection, and market intelligence powered by ATLAS.',
  },
}

export default function AiPage() {
  return <AiPageClient />
}
