'use client'

import { storyblokEditable, StoryblokComponent } from '@storyblok/react'
import { BG, CR } from '@/lib/tokens'

export default function Page({ blok }: { blok: any }) {
  return (
    <main
      {...storyblokEditable(blok)}
      style={{ background: BG, color: CR, minHeight: '100vh', fontFamily: "'BentonSans', sans-serif", overflowX: 'hidden' }}
    >
      {blok.body?.map((nestedBlok: any) => (
        <StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} />
      ))}
    </main>
  )
}
