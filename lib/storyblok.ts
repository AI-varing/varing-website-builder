import { apiPlugin, storyblokInit } from '@storyblok/react'
import Nav from '@/components/builder/Nav'
import Hero from '@/components/builder/Hero'
import MarqueeStrip from '@/components/builder/MarqueeStrip'
import SpecialtiesStrip from '@/components/builder/SpecialtiesStrip'
import CourtOrderedMandates from '@/components/builder/CourtOrderedMandates'
import About from '@/components/builder/About'
import Process from '@/components/builder/Process'
import ActiveListings from '@/components/builder/ActiveListings'
import TestimonialsCarousel from '@/components/builder/TestimonialsCarousel'
import Awards from '@/components/builder/Awards'
import PressLogos from '@/components/builder/PressLogos'
import Contact from '@/components/builder/Contact'
import Footer from '@/components/builder/Footer'
import PhotoDivider from '@/components/builder/PhotoDivider'
import TrackRecord from '@/components/builder/TrackRecord'
import VideoShowcase from '@/components/builder/VideoShowcase'
import Page from '@/components/builder/Page'

export const components = {
  page: Page,
  nav: Nav,
  hero: Hero,
  marquee_strip: MarqueeStrip,
  specialties_strip: SpecialtiesStrip,
  court_ordered_mandates: CourtOrderedMandates,
  about: About,
  process: Process,
  active_listings: ActiveListings,
  testimonials_carousel: TestimonialsCarousel,
  awards: Awards,
  press_logos: PressLogos,
  contact: Contact,
  footer: Footer,
  photo_divider: PhotoDivider,
  track_record: TrackRecord,
  video_showcase: VideoShowcase,
}

let initialized = false

export function initStoryblok() {
  if (initialized) return
  initialized = true

  storyblokInit({
    accessToken: process.env.NEXT_PUBLIC_STORYBLOK_TOKEN,
    use: [apiPlugin],
    components,
    bridge: true, // Enable visual editor bridge
  })
}
