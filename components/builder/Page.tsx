'use client'

import React from 'react'
import { storyblokEditable, StoryblokComponent } from '@storyblok/react'
import { BG, CR } from '@/lib/tokens'
import VideoShowcase from './VideoShowcase'

export default function Page({ blok }: { blok: any }) {
  const hasVideo = blok.body?.some((b: any) => b.component === 'video_showcase')

  return (
    <main
      {...storyblokEditable(blok)}
      style={{ background: BG, color: CR, minHeight: '100vh', fontFamily: "'BentonSans', sans-serif", overflowX: 'hidden' }}
    >
      {blok.body?.map((nestedBlok: any) => (
        <React.Fragment key={nestedBlok._uid}>
          <StoryblokComponent blok={nestedBlok} />
          {/* Auto-inject VideoShowcase after awards if not already in layout */}
          {!hasVideo && nestedBlok.component === 'awards' && <VideoShowcase />}
        </React.Fragment>
      ))}
    </main>
  )
}
