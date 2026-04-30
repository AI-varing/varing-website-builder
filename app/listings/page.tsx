import type { Metadata } from 'next'
import Nav from '@/components/builder/Nav'
import Footer from '@/components/builder/Footer'
import ActiveListings from '@/components/builder/ActiveListings'
import { BG, CR } from '@/lib/tokens'

export const metadata: Metadata = {
  title: 'Listings | Targeted Advisors',
  description:
    "Browse Targeted Advisors' active development land mandates and recent court-ordered sales across the Fraser Valley and Greater Vancouver. Includes natural-language search across the portfolio.",
  alternates: { canonical: 'https://www.targetedadvisors.ca/listings' },
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
