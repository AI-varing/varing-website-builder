'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { storyblokEditable } from '@storyblok/react'
import { G, GL, CR, B, GRAD_SECTION } from '@/lib/tokens'
import { useFadeUp } from '@/lib/animations'
import { Label } from '@/lib/ui'
import { FALLBACK_T } from '@/lib/data'

export default function TestimonialsCarousel({ blok }: { blok?: any }) {
  const sectionTitle = blok?.sectionTitle || 'What Our Clients Say'
  const autoRotateInterval = blok?.autoRotateInterval || 6000
  const [testimonials, setTestimonials] = useState<any[]>([])
  useEffect(() => {
    fetch('/api/testimonials')
      .then(r => r.json())
      .then(data => { if (data?.length > 0) setTestimonials(data) })
      .catch(() => {})
  }, [])

  const allT = testimonials.length > 0 ? testimonials : FALLBACK_T
  const [tIdx, setTIdx] = useState(0)
  const [tExiting, setTExiting] = useState(false)
  const [tProgressKey, setTProgressKey] = useState(0)

  const tGoTo = useCallback((next: number) => {
    setTExiting(true)
    setTimeout(() => {
      setTIdx(next)
      setTExiting(false)
      setTProgressKey(k => k + 1)
    }, 370)
  }, [])

  useEffect(() => {
    const id = setTimeout(() => tGoTo((tIdx + 1) % allT.length), autoRotateInterval)
    return () => clearTimeout(id)
  }, [tIdx, tGoTo, allT.length, autoRotateInterval])

  const tFade = useFadeUp(0)
  const t = allT[tIdx]

  return (
    <section id="testimonials" style={{ padding: '96px 56px 80px', background: GRAD_SECTION(0.3), borderTop: `1px solid ${B}`, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', fontSize: 'clamp(8rem,18vw,18rem)', fontFamily: "'BentonSans', sans-serif", fontWeight: 900, color: 'rgba(240,234,224,0.014)', letterSpacing: '-0.05em', lineHeight: 1, pointerEvents: 'none', userSelect: 'none', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>CLIENTS</div>

      <div ref={tFade.ref} style={{ maxWidth: 900, margin: '0 auto', position: 'relative', zIndex: 1, ...tFade.style }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <Label>Client Stories</Label>
          <h2 style={{ fontFamily: "'BentonSans', sans-serif", fontSize: 'clamp(1.8rem,3.2vw,2.6rem)', fontWeight: 700, color: CR, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {sectionTitle}
          </h2>
        </div>

        <div style={{
          opacity: tExiting ? 0 : 1,
          transform: tExiting ? 'scale(0.97)' : 'scale(1)',
          transition: tExiting
            ? 'opacity 0.4s ease, transform 0.4s ease'
            : 'opacity 0.65s 0.06s cubic-bezier(.22,1,.36,1), transform 0.65s 0.06s cubic-bezier(.22,1,.36,1)',
        }}>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(1.45rem, 2.6vw, 2.3rem)',
            fontStyle: 'italic', fontWeight: 300, lineHeight: 1.7,
            color: 'rgba(240,234,224,0.82)', textAlign: 'center',
            marginBottom: 48, letterSpacing: '0.01em',
          }}>
            &ldquo;{t.quote}&rdquo;
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
            {t.logo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={t.logo} alt={t.company || t.name}
                style={{ height: 64, width: 'auto', maxWidth: 180, objectFit: 'contain', opacity: 0.85, flexShrink: 0 }}
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
              />
            )}
            <div style={{ width: 1, height: 36, background: B, flexShrink: 0 }} />
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: CR, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>{t.name}</p>
              {t.role && <p style={{ fontSize: 11, color: GL, letterSpacing: '0.05em', marginBottom: 1 }}>{t.role}</p>}
              {t.company && <p style={{ fontSize: 11, color: 'rgba(240,234,224,0.38)', letterSpacing: '0.04em' }}>{t.company}</p>}
            </div>
          </div>
        </div>

        <div style={{ marginTop: 52, height: 1, background: 'rgba(240,234,224,0.08)', position: 'relative', overflow: 'hidden' }}>
          <div key={tProgressKey} className="t-progress" style={{ position: 'absolute', inset: 0, background: G, transformOrigin: 'left' }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 28, alignItems: 'center' }}>
          <button onClick={() => tGoTo((tIdx - 1 + allT.length) % allT.length)} style={{ background: 'none', border: 'none', color: 'rgba(240,234,224,0.3)', cursor: 'pointer', fontSize: 18, padding: '0 12px', transition: 'color 0.2s', fontFamily: "'BentonSans', sans-serif" }} onMouseEnter={e => (e.currentTarget.style.color = CR)} onMouseLeave={e => (e.currentTarget.style.color = 'rgba(240,234,224,0.3)')}>&#8249;</button>
          {allT.map((_: any, i: number) => (
            <button key={i} onClick={() => tGoTo(i)} style={{
              width: i === tIdx ? 20 : 6, height: 6,
              borderRadius: i === tIdx ? 3 : '50%',
              background: i === tIdx ? G : 'rgba(240,234,224,0.18)',
              border: 'none', cursor: 'pointer', padding: 0,
              transition: 'width 0.3s ease, background 0.3s ease',
            }} />
          ))}
          <button onClick={() => tGoTo((tIdx + 1) % allT.length)} style={{ background: 'none', border: 'none', color: 'rgba(240,234,224,0.3)', cursor: 'pointer', fontSize: 18, padding: '0 12px', transition: 'color 0.2s', fontFamily: "'BentonSans', sans-serif" }} onMouseEnter={e => (e.currentTarget.style.color = CR)} onMouseLeave={e => (e.currentTarget.style.color = 'rgba(240,234,224,0.3)')}>&#8250;</button>
        </div>

        <p style={{ textAlign: 'center', marginTop: 16, fontSize: 9, letterSpacing: '0.28em', color: 'rgba(240,234,224,0.2)', textTransform: 'uppercase' }}>
          {String(tIdx + 1).padStart(2, '0')} / {String(allT.length).padStart(2, '0')}
        </p>
      </div>
    </section>
  )
}
