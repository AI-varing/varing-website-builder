'use client'

import React from 'react'
import { storyblokEditable } from '@storyblok/react'
import { G, CR, BG, B, GRAD_SECTION } from '@/lib/tokens'
import { useFadeUp, useStaggerReveal } from '@/lib/animations'
import { Label } from '@/lib/ui'

const TRACK_RECORD = [
  { address: '2301-2337 152 St', city: 'Surrey', price: '$8,850,000', year: '2024' },
  { address: '21480 80 Ave', city: 'Langley', price: '$7,600,000', year: '2024' },
  { address: '32017 + 32107 14th Ave', city: 'Mission', price: '$7,000,000', year: '2023' },
  { address: '3352 200 St', city: 'Langley', price: '$6,200,000', year: '2023' },
  { address: '9341 177 St', city: 'Surrey', price: '$5,950,000', year: '2023' },
  { address: '23638 Dewdney Trunk', city: 'Maple Ridge', price: '$5,250,000', year: '2022' },
  { address: '17111 + 17101 80 Ave', city: 'Surrey', price: '$12,899,000', year: '2024' },
  { address: '13691 100 Ave', city: 'Surrey', price: '$2,900,000', year: '2022' },
]

export default function TrackRecord({ blok }: { blok?: any }) {
  const sectionTitle = blok?.sectionTitle || 'Our Track Record'
  const totalVolume = blok?.totalVolume || '$4B+'
  const listings = TRACK_RECORD

  const headerFade = useFadeUp()
  const { ref: cardsRef, getItemStyle } = useStaggerReveal(0.1)

  return (
    <section
      {...(blok ? storyblokEditable(blok) : {})}
      style={{
        background: GRAD_SECTION(0.3),
        padding: '96px 0',
      }}
    >
      <div
        ref={headerFade.ref}
        style={{ ...headerFade.style, maxWidth: 1300, margin: '0 auto', padding: '0 56px', marginBottom: 48 }}
      >
        <Label>Track Record</Label>
        <h2 style={{
          fontFamily: "'BentonSans', sans-serif",
          fontSize: 'clamp(1.8rem,3.2vw,2.6rem)',
          fontWeight: 900,
          color: CR,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          marginBottom: 12,
        }}>
          {sectionTitle}
        </h2>
        <p style={{
          fontSize: 'clamp(1rem,1.6vw,1.25rem)',
          fontFamily: "'Cormorant Garamond', serif",
          color: 'rgba(240,234,224,0.45)',
          letterSpacing: '0.04em',
        }}>
          {totalVolume} in Total Transaction Volume
        </p>
      </div>

      <div
        ref={cardsRef}
        style={{
          display: 'flex',
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          gap: 16,
          padding: '0 56px',
          scrollbarWidth: 'none',
        }}
        className="track-record-scroll"
      >
        {listings.map((item, i) => (
          <div
            key={item.address}
            style={{
              minWidth: 380,
              flexShrink: 0,
              scrollSnapAlign: 'start',
              background: '#111',
              border: `1px solid ${B}`,
              overflow: 'hidden',
              transition: 'transform 0.4s cubic-bezier(.22,1,.36,1), box-shadow 0.4s cubic-bezier(.22,1,.36,1)',
              cursor: 'default',
              ...getItemStyle(i),
            }}
            className="track-record-card"
          >
            {/* Card body */}
            <div style={{ padding: 28, position: 'relative' }}>
              {/* SOLD badge */}
              <span style={{
                position: 'absolute',
                top: 16,
                right: 16,
                background: G,
                color: '#fff',
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                padding: '4px 10px',
                borderRadius: 2,
              }}>
                SOLD
              </span>
              <h3 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 20,
                fontWeight: 500,
                color: CR,
                lineHeight: 1.3,
                marginBottom: 6,
              }}>
                {item.address}
              </h3>
              <p style={{
                fontSize: 11,
                letterSpacing: '0.28em',
                textTransform: 'uppercase',
                color: 'rgba(240,234,224,0.5)',
                marginBottom: 16,
              }}>
                {item.city} &middot; {item.year}
              </p>
              <p style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 24,
                fontWeight: 500,
                color: CR,
              }}>
                {item.price}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Hide scrollbar + hover lift */}
      <style jsx>{`
        .track-record-scroll::-webkit-scrollbar {
          display: none;
        }
        .track-record-card:hover {
          transform: translateY(-4px) !important;
          box-shadow: 0 12px 40px rgba(0,0,0,0.5);
        }
      `}</style>
    </section>
  )
}
