import type { Metadata } from 'next'
import AdvisoryPageClient from './AdvisoryPageClient'

export const metadata: Metadata = {
  title: 'Advisory Services',
  description:
    'Advisory services from Targeted Advisors: restructuring of business affairs and debt, mergers and acquisitions, sale-leaseback opportunities, and court-ordered sale processes for receivers, trustees, lenders, and legal counsel.',
  alternates: { canonical: '/advisory' },
  openGraph: {
    title: 'Advisory Services | Targeted Advisors',
    description:
      'Restructuring, M&A, court-ordered sales, and sale-leaseback advisory for receivers, trustees, lenders, and legal counsel.',
    url: 'https://www.targetedadvisors.ca/advisory',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Advisory Services | Targeted Advisors',
    description:
      'Restructuring, M&A, court-ordered sales, and sale-leaseback advisory for receivers, trustees, lenders, and legal counsel.',
  },
}

export default function AdvisoryPage() {
  return <AdvisoryPageClient />
}
