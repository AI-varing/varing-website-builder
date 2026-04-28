'use client'

import React from 'react'
import { storyblokEditable, StoryblokComponent } from '@storyblok/react'
import { G, CR, B, GB } from '@/lib/tokens'

export default function ServicesSection({ blok }: { blok: any }) {
  const eyebrow = blok?.eyebrow
  const heading = blok?.heading
  const subheading = blok?.subheading
  const cards = blok?.cards || []

  return (
    <section
      {...storyblokEditable(blok)}
      style={{ padding: '96px 24px', borderTop: `1px solid ${B}` }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ marginBottom: 56, textAlign: 'center' }}>
          {eyebrow && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, marginBottom: 18 }}>
              <div style={{ width: 36, height: 1, background: G }} />
              <span style={{ fontSize: 10, letterSpacing: '0.38em', textTransform: 'uppercase', color: GB(0.6), fontWeight: 500 }}>{eyebrow}</span>
              <div style={{ width: 36, height: 1, background: G }} />
            </div>
          )}
          {heading && (
            <h2 style={{
              fontFamily: "'BentonSans', sans-serif",
              fontSize: 'clamp(26px, 3vw, 40px)',
              fontWeight: 900, letterSpacing: '0.06em', textTransform: 'uppercase',
              color: CR, marginBottom: 12,
            }}>{heading}</h2>
          )}
          {subheading && (
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 'clamp(16px, 1.6vw, 20px)', color: 'rgba(240,234,224,0.65)', maxWidth: 620, margin: '0 auto', lineHeight: 1.5 }}>{subheading}</p>
          )}
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 20,
        }}>
          {cards.map((c: any) => (
            <StoryblokComponent key={c._uid} blok={c} />
          ))}
        </div>
      </div>
    </section>
  )
}
