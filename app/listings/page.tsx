import type { Metadata } from 'next'
import Nav from '@/components/builder/Nav'
import Footer from '@/components/builder/Footer'
import ActiveListings from '@/components/builder/ActiveListings'
import { BG, CR } from '@/lib/tokens'

export const metadata: Metadata = {
  title: 'Listings',
  description:
    "Browse Targeted Advisors' active development land mandates and recent court-ordered sales across the Fraser Valley and Greater Vancouver. Includes natural-language search across the portfolio.",
  alternates: { canonical: '/listings' },
  openGraph: {
    title: 'Listings | Targeted Advisors',
    description:
      "Active development land mandates and recent court-ordered sales across the Fraser Valley and Greater Vancouver.",
    url: 'https://www.targetedadvisors.ca/listings',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Listings | Targeted Advisors',
    description:
      "Active development land mandates and recent court-ordered sales across the Fraser Valley and Greater Vancouver.",
  },
}

export default function ListingsIndexPage() {
  return (
    <main style={{ background: BG, color: CR, minHeight: '100vh', fontFamily: "'BentonSans', sans-serif" }}>
      <Nav />
      <ActiveListings />
      <Footer />
    </main>
  )
}
