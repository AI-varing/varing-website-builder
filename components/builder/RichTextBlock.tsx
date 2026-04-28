'use client'

import React from 'react'
import { storyblokEditable, renderRichText } from '@storyblok/react'
import { G, GL, CR, BG, B, GB } from '@/lib/tokens'

export default function RichTextBlock({ blok }: { blok: any }) {
  const eyebrow = blok?.eyebrow
  const heading = blok?.heading
  const body = blok?.body
  const image = blok?.image?.filename
  const imagePosition = blok?.imagePosition || 'none'
  const ctaLabel = blok?.ctaLabel
  const ctaHref = blok?.ctaHref
  const background = blok?.background || 'dark'

  const html = body ? renderRichText(body) : ''
  const bgColor = background === 'darker' ? '#050505' : BG

  const TextSide = (
    <div>
      {eyebrow && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
          <div style={{ width: 36, height: 1, background: G }} />
          <span style={{ fontSize: 10, letterSpacing: '0.38em', textTransform: 'uppercase', color: GB(0.6), fontWeight: 500 }}>{eyebrow}</span>
        </div>
      )}
      {heading && (
        <h2 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: 'italic',
          fontWeight: 300,
          fontSize: 'clamp(28px, 3vw, 42px)',
          color: CR, lineHeight: 1.25, marginBottom: 24,
        }}>{heading}</h2>
      )}
      {html && (
        <div
          style={{ fontSize: 15, lineHeight: 1.75, color: 'rgba(240,234,224,0.78)' }}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      )}
      {ctaLabel && (
        <a href={ctaHref || '#'} style={{
          display: 'inline-block', marginTop: 28, padding: '12px 26px',
          background: G, color: BG, fontSize: 11, letterSpacing: '0.18em',
          textTransform: 'uppercase', fontWeight: 700, textDecoration: 'none',
          fontFamily: "'BentonSans', sans-serif",
        }}>{ctaLabel}</a>
      )}
    </div>
  )

  const ImageSide = image ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={image} alt={heading || ''} style={{ width: '100%', height: '100%', objectFit: 'cover', minHeight: 300 }} />
  ) : null

  const useGrid = imagePosition === 'left' || imagePosition === 'right'
  return (
    <section
      {...storyblokEditable(blok)}
      style={{ background: bgColor, padding: '80px 24px', borderTop: `1px solid ${B}` }}
    >
      <div style={{
        maxWidth: 1200, margin: '0 auto',
        display: useGrid ? 'grid' : 'block',
        gridTemplateColumns: useGrid ? '1fr 1fr' : undefined,
        gap: 64, alignItems: 'center',
      }}>
        {imagePosition === 'top' && ImageSide && <div style={{ marginBottom: 40 }}>{ImageSide}</div>}
        {imagePosition === 'left' && ImageSide}
        {TextSide}
        {imagePosition === 'right' && ImageSide}
        {imagePosition === 'bottom' && ImageSide && <div style={{ marginTop: 40 }}>{ImageSide}</div>}
      </div>
    </section>
  )
}
