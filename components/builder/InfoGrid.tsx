'use client'

import React from 'react'
import { storyblokEditable, StoryblokComponent } from '@storyblok/react'
import { G, CR, B, GB } from '@/lib/tokens'

export default function InfoGrid({ blok }: { blok: any }) {
  const heading = blok?.heading
  const subheading = blok?.subheading
  const items = blok?.items || []
  const cols = parseInt(blok?.columns || '2', 10)

  return (
    <section
      {...storyblokEditable(blok)}
      style={{ padding: '80px 24px', borderTop: `1px solid ${B}` }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {(heading || subheading) && (
          <div style={{ marginBottom: 48, textAlign: 'center' }}>
            {heading && (
              <h2 style={{
                fontFamily: "'BentonSans', sans-serif",
                fontSize: 'clamp(22px, 2.4vw, 32px)',
                fontWeight: 900, letterSpacing: '0.08em', textTransform: 'uppercase',
                color: CR, marginBottom: 12,
              }}>{heading}</h2>
            )}
            {subheading && (
              <p style={{ fontSize: 14, color: 'rgba(240,234,224,0.6)', maxWidth: 620, margin: '0 auto', lineHeight: 1.7 }}>{subheading}</p>
            )}
          </div>
        )}
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(auto-fit, minmax(${cols >= 4 ? 220 : cols === 3 ? 280 : 320}px, 1fr))`,
          gap: 20,
        }}>
          {items.map((item: any) => (
            <StoryblokComponent key={item._uid} blok={item} />
          ))}
        </div>
      </div>
    </section>
  )
}
