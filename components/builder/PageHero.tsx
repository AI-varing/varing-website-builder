'use client'

import React from 'react'
import { storyblokEditable } from '@storyblok/react'
import { G, GL, CR, BG, GB } from '@/lib/tokens'
import ConfidentialBadge from './ConfidentialBadge'

export default function PageHero({ blok }: { blok: any }) {
  const eyebrow = blok?.eyebrow || ''
  const heading = blok?.heading || ''
  const subheading = blok?.subheading || ''
  const bgImage = blok?.bgImage?.filename || blok?.bgImage || ''
  const primaryCtaLabel = blok?.primaryCtaLabel || ''
  const primaryCtaHref = blok?.primaryCtaHref || ''
  const secondaryCtaLabel = blok?.secondaryCtaLabel || ''
  const secondaryCtaHref = blok?.secondaryCtaHref || ''
  const showBadge = blok?.showConfidentialBadge
  const height = parseInt(blok?.height || '420', 10)

  return (
    <section
      {...storyblokEditable(blok)}
      style={{
        position: 'relative',
        height,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        marginTop: 72,
      }}
    >
      {bgImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={bgImage}
          alt=""
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(35%)' }}
        />
      )}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(8,8,8,0.55) 0%, rgba(8,8,8,0.88) 100%)' }} />
      <div style={{ position: 'relative', textAlign: 'center', zIndex: 1, padding: '0 24px', maxWidth: 820 }}>
        {showBadge && (
          <div style={{ marginBottom: 20 }}>
            <ConfidentialBadge blok={{ component: 'confidential_badge', label: 'Confidential & Discreet', icon: 'lock' }} />
          </div>
        )}
        {eyebrow && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18, marginBottom: 18 }}>
            <div style={{ width: 36, height: 1, background: G }} />
            <span style={{ fontSize: 10, letterSpacing: '0.38em', textTransform: 'uppercase', color: GB(0.6), fontWeight: 500 }}>{eyebrow}</span>
            <div style={{ width: 36, height: 1, background: G }} />
          </div>
        )}
        <h1 style={{
          fontFamily: "'BentonSans', sans-serif",
          fontSize: 'clamp(32px, 4.5vw, 54px)',
          fontWeight: 900,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: CR,
          margin: '0 0 16px',
        }}>
          {heading}
        </h1>
        {subheading && (
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: 'italic',
            fontSize: 'clamp(15px, 1.6vw, 19px)',
            color: 'rgba(240,234,224,0.75)',
            maxWidth: 620,
            margin: '0 auto',
            lineHeight: 1.5,
          }}>
            {subheading}
          </p>
        )}
        {(primaryCtaLabel || secondaryCtaLabel) && (
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', marginTop: 28, flexWrap: 'wrap' }}>
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
