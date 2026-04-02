'use client'

import React from 'react'
import { storyblokEditable } from '@storyblok/react'
import { G, CR, BG, B, GRAD_SECTION } from '@/lib/tokens'
import { useInView } from '@/lib/animations'
import { Label } from '@/lib/ui'
import { AWARD_YEARS } from '@/lib/data'

const DEFAULT_AWARDS = [
  { title: '#1 Agent in BC & Canada', sub: 'Sales Volume \u00b7 Homelife International' },
]

export default function Awards({ blok }: { blok?: any }) {
  const awards = blok?.awards?.length ? blok.awards : DEFAULT_AWARDS
  const yearStart = blok?.yearStart || 2014
  const yearEnd = blok?.yearEnd || 2025
  const [awardsRef, awardsInView] = useInView(0.08)
  const years = AWARD_YEARS
  const consecutiveYears = yearEnd - yearStart + 1

  return (
    <section style={{ background: GRAD_SECTION(0.25), borderTop: `1px solid ${B}`, borderBottom: `1px solid ${B}`, position: 'relative', overflow: 'hidden' }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="https://www.varinggroup.com/wp-content/uploads/bg-meet-joe-recognition.jpg" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%', opacity: 0.05, filter: 'grayscale(100%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', fontSize: 'clamp(10rem,22vw,22rem)', fontFamily: "'BentonSans', sans-serif", fontWeight: 900, color: 'rgba(240,234,224,0.015)', letterSpacing: '-0.06em', lineHeight: 1, pointerEvents: 'none', userSelect: 'none', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>AWARDS</div>

      <div ref={awardsRef} style={{ maxWidth: 1100, margin: '0 auto', padding: '96px 56px', position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <h2 style={{ fontFamily: "'BentonSans', sans-serif", fontSize: 'clamp(2rem, 3.5vw, 3rem)', fontWeight: 900, color: CR, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 20 }}>
          Awards & Recognition
        </h2>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 20, marginBottom: 48, marginTop: 8 }}>
          <span style={{ fontSize: 12, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(240,234,224,0.5)' }}>Recognized By</span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logos/homelife-international.png" alt="Homelife International"
            style={{ height: 52, width: 'auto', filter: 'brightness(0) invert(1)', opacity: 0.7, objectFit: 'contain' }}
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
          />
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: '1fr', gap: 2, maxWidth: 600, margin: '0 auto',
          opacity: awardsInView ? 1 : 0, transform: awardsInView ? 'translateY(0)' : 'translateY(24px)',
          transition: 'opacity 0.7s ease, transform 0.7s ease',
        }}>
          {awards.map((award: any, i: number) => (
            <div key={i} style={{ background: '#0e0e0e', borderTop: `2px solid ${i === 0 ? G : B}`, padding: '56px 48px' }}>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke={G} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 24, opacity: 0.75, filter: 'drop-shadow(0 0 8px rgba(198,122,60,0.3))' }}>
                <path d="M16 22v6M10 28h12"/>
                <path d="M8 4H4v6c0 3.3 2.7 6 6 6"/>
                <path d="M24 4h4v6c0 3.3-2.7 6-6 6"/>
                <path d="M8 4h16v10a8 8 0 01-16 0V4z"/>
              </svg>
              <p style={{ fontFamily: "'BentonSans', sans-serif", fontSize: 'clamp(1.4rem,2.5vw,2.2rem)', fontWeight: 900, color: CR, letterSpacing: '0.06em', textTransform: 'uppercase', lineHeight: 1.15, marginBottom: 16 }}>{award.title}</p>
              <p style={{ fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(240,234,224,0.5)', marginBottom: 32 }}>{award.sub}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center' }}>
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', color: G }}>{yearStart}</span>
                <div style={{ flex: 1, maxWidth: 80, height: 1, background: `linear-gradient(to right, ${G}, rgba(198,122,60,0.2))` }} />
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', color: G }}>{yearEnd}</span>
              </div>
              <p style={{ fontSize: 11, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'rgba(240,234,224,0.5)', marginTop: 8 }}>{consecutiveYears} Consecutive Years</p>
            </div>
          ))}
        </div>

        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', marginTop: 20,
          opacity: awardsInView ? 1 : 0, transition: 'opacity 0.7s 0.25s ease',
        }}>
          {years.map((y, i) => (
            <span key={y} style={{
              fontSize: 12, fontWeight: 700, letterSpacing: '0.1em',
              color: i === 0 ? BG : 'rgba(240,234,224,0.5)',
              background: i === 0 ? G : 'rgba(240,234,224,0.05)',
              border: `1px solid ${i === 0 ? G : 'rgba(240,234,224,0.08)'}`,
              padding: '4px 12px',
            }}>{y}</span>
          ))}
        </div>
      </div>
    </section>
  )
}
