'use client'

import React from 'react'
import { storyblokEditable } from '@storyblok/react'
import { G, CR, B, GRAD_SECTION } from '@/lib/tokens'
import { useFadeUp, useFadeFromRight } from '@/lib/animations'
import { AnimatedCount, Label } from '@/lib/ui'

const DEFAULT_MANDATE_STATS = [
  { target: 100, suffix: '+', label: 'Testimonials' },
  { target: 30, suffix: '+', label: 'References' },
  { target: 20, suffix: '+', label: 'Court Ordered Files' },
]

export default function CourtOrderedMandates({ blok }: { blok?: any }) {
  const heading = blok?.heading || "BC\u2019s Most Trusted\nJudicial Sale Specialists"
  const quoteText = blok?.quoteText || '"Our mandate is to protect recovery and timelines while maintaining clear, professional communication with all parties."'
  const quoteAuthor = blok?.quoteAuthor || 'Joe Varing \u00b7 Principal'
  const quoteRole = blok?.quoteRole || 'Varing Marketing Group'
  const stats = blok?.stats?.length ? blok.stats : DEFAULT_MANDATE_STATS
  const mandFade = useFadeUp(0)
  const mandRight = useFadeFromRight(0.2)

  return (
    <section id="mandates" style={{ background: GRAD_SECTION(0.35), borderBottom: `1px solid ${B}`, position: 'relative', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: "url('/mandates-bg.jpg')",
        backgroundSize: 'cover', backgroundPosition: 'center 60%',
        opacity: 0.09, pointerEvents: 'none',
      }} />
      <div style={{ position: 'absolute', right: -20, top: '50%', transform: 'translateY(-50%)', fontSize: 'clamp(8rem,18vw,18rem)', fontFamily: "'BentonSans', sans-serif", fontWeight: 900, color: 'rgba(240,234,224,0.018)', letterSpacing: '-0.05em', lineHeight: 1, pointerEvents: 'none', userSelect: 'none', textTransform: 'uppercase' }}>
        COURT
      </div>

      <div ref={mandFade.ref} style={{ maxWidth: 1300, margin: '0 auto', padding: '96px 56px', position: 'relative', zIndex: 1, ...mandFade.style }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80 }}>
          <div>
            <Label>Court-Ordered Mandates</Label>
            <h2 style={{ fontFamily: "'BentonSans', sans-serif", fontSize: 'clamp(1.6rem,3.2vw,2.8rem)', fontWeight: 900, color: CR, lineHeight: 1.15, marginBottom: 28, textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'pre-line' }}>
              {heading}
            </h2>
            <div style={{ display: 'flex', gap: 28, marginTop: 36, flexWrap: 'wrap' }}>
              {stats.map((s: any, i: number) => (
                <div key={i} style={{ paddingRight: 28, borderRight: i < stats.length - 1 ? `1px solid ${B}` : 'none' }}>
                  <p style={{ fontFamily: "'BentonSans', sans-serif", fontSize: 24, fontWeight: 700, color: G, lineHeight: 1 }}>
                    <AnimatedCount target={s.target} suffix={s.suffix} />
                  </p>
                  <p style={{ fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(240,234,224,0.72)', marginTop: 6 }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div ref={mandRight.ref} style={mandRight.style}>
            <div style={{ borderLeft: `2px solid ${G}`, paddingLeft: 28, marginTop: 4 }}>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.1rem,1.8vw,1.55rem)', fontStyle: 'italic', fontWeight: 300, color: 'rgba(240,234,224,0.72)', lineHeight: 1.75, marginBottom: 24 }}>
                {quoteText}
              </p>
              <p style={{ fontSize: 11, letterSpacing: '0.14em', color: G, textTransform: 'uppercase', fontWeight: 700 }}>{quoteAuthor}</p>
              <p style={{ fontSize: 11, color: 'rgba(240,234,224,0.72)', marginTop: 4, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{quoteRole}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
