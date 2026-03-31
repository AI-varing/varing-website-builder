'use client'

import React from 'react'
import { useParallax } from '@/lib/animations'
import { storyblokEditable } from '@storyblok/react'
import { G, CR, BG, B, GB, GRAD_SECTION } from '@/lib/tokens'

const DEFAULT_IMAGES = [
  'https://www.varinggroup.com/wp-content/uploads/willoughby_BG-bw.jpg',
  'https://www.varinggroup.com/wp-content/uploads/SRY-AR_2146_L-76APR2018-WMLCOS-_COS9635.jpg',
  'https://www.varinggroup.com/wp-content/uploads/bg-meet-joe-soil.jpg',
  'https://www.varinggroup.com/wp-content/uploads/bg-meet-joe-recognition.jpg',
]

const OVERLAYS: Record<string, string> = {
  navy: 'linear-gradient(180deg, rgba(42,21,8,0.25) 0%, rgba(8,8,8,0.5) 100%)',
  dark: 'linear-gradient(180deg, rgba(8,8,8,0.3) 0%, rgba(8,8,8,0.6) 100%)',
  none: 'none',
}

const QUOTES = [
  'EVERY PIECE OF LAND HAS UNTAPPED POTENTIAL',
  'HOUSE OF LAND',
  'WHERE VISION MEETS GROUND',
  'CONNECTING LANDOWNERS WITH THE MOST REPUTABLE BUYERS',
  'PROVEN TRACK RECORD. UNMATCHED RESULTS.',
  'GROUNDED IN RESEARCH. DRIVEN BY RESULTS.',
]

let _photoDividerCount = 0

const FOCUS_CITIES = ['SURREY', 'LANGLEY', 'DELTA', 'MAPLE RIDGE', 'ABBOTSFORD', 'MISSION', 'CHILLIWACK']

export default function PhotoDivider({ blok }: { blok?: any }) {
  // Capture index on first render so each instance gets a unique quote/image
  const indexRef = React.useRef(_photoDividerCount++)
  const idx = indexRef.current

  const variant = blok?.variant || 'photo'
  const src = blok?.src || DEFAULT_IMAGES[idx % DEFAULT_IMAGES.length]
  const height = blok?.height || '50vh'
  const overlay = blok?.overlay || 'navy'
  const calloutText = blok?.calloutText || 'OVER 20 SUCCESSFUL COURT ORDERED FILES HANDLED'
  const quote = blok?.quote || QUOTES[idx % QUOTES.length]
  const parallaxRef = useParallax(0.15)

  /* ─── Variant: Areas of Focus ─── */
  if (variant === 'areas') {
    return (
      <div
        className="photo-divider"
        {...(blok ? storyblokEditable(blok) : {})}
        style={{ position: 'relative', overflow: 'hidden', height: '80vh', minHeight: 520 }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={parallaxRef as React.Ref<HTMLImageElement>}
          src={blok?.src || 'https://www.varinggroup.com/wp-content/uploads/SRY-AR_2146_L-76APR2018-WMLCOS-_COS9635.jpg'}
          alt=""
          style={{ position: 'absolute', width: '100%', height: '130%', top: '-15%', objectFit: 'cover' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(8,8,8,0.55) 0%, rgba(8,8,8,0.4) 40%, rgba(8,8,8,0.65) 100%)', pointerEvents: 'none' }} />

        <div style={{
          position: 'relative', zIndex: 1,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          height: '100%', padding: '0 56px', textAlign: 'center',
        }}>
          <p style={{
            fontFamily: "'BentonSans', sans-serif",
            fontSize: 'clamp(1.2rem, 2.5vw, 2rem)',
            fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase',
            color: CR, marginBottom: 48,
          }}>
            Our Areas of Focus
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12, maxWidth: 800, marginBottom: 48 }}>
            {FOCUS_CITIES.map(city => (
              <span key={city} style={{
                fontFamily: "'BentonSans', sans-serif",
                fontSize: 14, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase',
                color: CR,
                padding: '14px 32px',
                background: 'rgba(240,234,224,0.1)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(240,234,224,0.18)',
              }}>
                {city}
              </span>
            ))}
          </div>

          <a href="#contact" style={{
            fontFamily: "'BentonSans', sans-serif",
            fontSize: 11, fontWeight: 700, letterSpacing: '0.24em', textTransform: 'uppercase',
            color: CR, background: 'rgba(8,8,8,0.7)',
            border: '1px solid rgba(240,234,224,0.25)',
            padding: '16px 44px', textDecoration: 'none',
            backdropFilter: 'blur(8px)',
            transition: 'background 0.3s ease, border-color 0.3s ease',
          }}>
            Insight on Your Area
          </a>
        </div>
      </div>
    )
  }

  /* ─── Variant: Bold Callout Band ─── */
  if (variant === 'callout') {
    return (
      <div
        className="photo-divider"
        {...(blok ? storyblokEditable(blok) : {})}
        style={{
          position: 'relative', overflow: 'hidden',
          background: G, padding: '36px 56px', textAlign: 'center',
        }}
      >
        <p style={{
          fontFamily: "'BentonSans', sans-serif",
          fontSize: 'clamp(0.9rem, 1.8vw, 1.3rem)',
          fontWeight: 900, letterSpacing: '0.22em', textTransform: 'uppercase',
          color: '#fff', lineHeight: 1.5,
        }}>
          {calloutText}
        </p>
      </div>
    )
  }

  /* ─── Default: Photo divider with parallax + quote overlay ─── */
  return (
    <div
      className="photo-divider"
      {...(blok ? storyblokEditable(blok) : {})}
      style={{ position: 'relative', overflow: 'hidden', height }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={parallaxRef as React.Ref<HTMLImageElement>}
        src={src}
        alt=""
        style={{ position: 'absolute', width: '100%', height: '130%', top: '-15%', objectFit: 'cover' }}
      />
      {overlay !== 'none' && (
        <div style={{ position: 'absolute', inset: 0, background: OVERLAYS[overlay] || OVERLAYS.navy, pointerEvents: 'none' }} />
      )}
      {/* Semi-transparent dark overlay for quote legibility */}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(8,8,8,0.5)', pointerEvents: 'none' }} />
      {/* Centered quote overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 2, pointerEvents: 'none',
      }}>
        <p style={{
          fontFamily: "'BentonSans', sans-serif",
          fontSize: 'clamp(1.5rem, 3.5vw, 3rem)',
          fontWeight: 700,
          textTransform: 'uppercase',
          color: CR,
          letterSpacing: '0.18em',
          textAlign: 'center',
          lineHeight: 1.3,
          maxWidth: 900,
          padding: '0 40px',
          textShadow: '0 2px 16px rgba(0,0,0,0.6)',
        }}>
          {quote}
        </p>
      </div>
    </div>
  )
}
