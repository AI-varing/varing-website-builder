import type { Metadata } from 'next'
import AboutPageClient from './AboutPageClient'

export const metadata: Metadata = {
  title: 'About Us',
  description:
    "About Targeted Advisors. Joe leads the firm with 19+ years of experience and over $4B in transaction volume across the Fraser Valley's competitive development land market — court-ordered sales, land assemblies, and institutional mandates.",
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About Us | Targeted Advisors',
    description:
      "Joe leads Targeted Advisors with 19+ years of experience and over $4B in transaction volume — 600+ development and investment sites sold across the Fraser Valley.",
    url: 'https://www.targetedadvisors.ca/about',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Us | Targeted Advisors',
    description:
      "Joe leads Targeted Advisors with 19+ years of experience and over $4B in transaction volume — 600+ development and investment sites sold across the Fraser Valley.",
  },
}

export default function AboutPage() {
  return <AboutPageClient />
}
