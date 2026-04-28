'use client'

import React from 'react'
import { storyblokEditable } from '@storyblok/react'
import { G, GL, CR, BG, B, GB } from '@/lib/tokens'

export default function CtaSection({ blok }: { blok: any }) {
  const eyebrow = blok?.eyebrow
  const heading = blok?.heading
  const subheading = blok?.subheading
  const primaryCtaLabel = blok?.primaryCtaLabel
  const primaryCtaHref = blok?.primaryCtaHref || '#'
  const secondaryCtaLabel = blok?.secondaryCtaLabel
  const secondaryCtaHref = blok?.secondaryCtaHref || '#'
  const background = blok?.background || 'dark'
  const bgImage = blok?.bgImage?.filename

  let bgStyle: React.CSSProperties = {}
  if (background === 'gold') {
    bgStyle = { background: `linear-gradient(135deg, ${GB(0.18)} 0%, ${GB(0.06)} 100%)` }
  } else if (background === 'image' && bgImage) {
    bgStyle = { background: `linear-gradient(rgba(8,8,8,0.85), rgba(8,8,8,0.92)), url(${bgImage}) center/cover` }
  } else {
    bgStyle = { background: BG }
  }

  return (
    <section
      {...storyblokEditable(blok)}
      style={{
        ...bgStyle,
        padding: '80px 24px',
        borderTop: `1px solid ${B}`,
        textAlign: 'center',
      }}
    >
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        {eyebrow && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, marginBottom: 16 }}>
            <div style={{ width: 36, height: 1, background: G }} />
            <span style={{ fontSize: 10, letterSpacing: '0.38em', textTransform: 'uppercase', color: GB(0.7), fontWeight: 500 }}>{eyebrow}</span>
            <div style={{ width: 36, height: 1, background: G }} />
          </div>
        )}
        {heading && (
          <h2 style={{
            fontFamily: "'BentonSans', sans-serif",
            fontSize: 'clamp(24px, 2.6vw, 36px)',
            fontWeight: 900, letterSpacing: '0.06em', textTransform: 'uppercase',
            color: CR, margin: '0 0 16px',
          }}>{heading}</h2>
        )}
        {subheading && (
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: 'italic',
            fontSize: 'clamp(15px, 1.6vw, 18px)',
            color: 'rgba(240,234,224,0.7)',
            margin: '0 auto 28px',
            lineHeight: 1.6,
          }}>{subheading}</p>
        )}
        {(primaryCtaLabel || secondaryCtaLabel) && (
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            {primaryCtaLabel && (
              <a href={primaryCtaHref} style={{
                background: G, color: BG, padding: '14px 32px', fontSize: 11,
                letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 700,
                textDecoration: 'none', fontFamily: "'BentonSans', sans-serif",
              }}>{primaryCtaLabel}</a>
            )}
            {secondaryCtaLabel && (
              <a href={secondaryCtaHref} style={{
                border: `1px solid ${GB(0.4)}`, color: G, padding: '14px 32px', fontSize: 11,
                letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 700,
                textDecoration: 'none', fontFamily: "'BentonSans', sans-serif",
              }}>{secondaryCtaLabel}</a>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
