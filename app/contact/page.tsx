import type { Metadata } from 'next'
import ContactPageClient from './ContactPageClient'

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Contact Targeted Advisors for confidential briefings on court-ordered mandates, development land, and advisory engagements across the Lower Mainland and Fraser Valley.',
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contact | Targeted Advisors',
    description:
      'Reach the Targeted Advisors team for confidential briefings on court-ordered mandates, development land, and advisory engagements.',
    url: 'https://www.targetedadvisors.ca/contact',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact | Targeted Advisors',
    description:
      'Reach the Targeted Advisors team for confidential briefings on court-ordered mandates, development land, and advisory engagements.',
  },
}

export default function ContactPage() {
  return <ContactPageClient />
}
