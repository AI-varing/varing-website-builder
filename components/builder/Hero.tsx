'use client'

import React, { useEffect, useRef, useState } from 'react'
import { storyblokEditable } from '@storyblok/react'
import { G, CR, BG, B } from '@/lib/tokens'
import { useTypewriter } from '@/lib/animations'
import { AnimatedCount } from '@/lib/ui'

const DEFAULT_STATS = [
  { target: 19, prefix: '', suffix: '+', label: 'YEARS IN BUSINESS' },
  { target: 4, prefix: '$', suffix: 'B+', label: 'TOTAL VOLUME SOLD' },
  { target: 600, prefix: '', suffix: '+', label: 'TRANSACTIONS CLOSED' },
  { target: 12, prefix: '', suffix: '+', label: 'COURT FILES / 12 MOS' },
]

export default function Hero({ blok }: { blok?: any }) {
  const tagline = blok?.tagline || 'WE SELL DIRT.\u2122'
  const typewriterText = blok?.typewriterText || 'PROPERTY  |  DEVELOPMENT  |  COURT-ORDERED MANDATES'
  const heading = blok?.heading || "BC\u2019s Specialists in Court\u2011Ordered & Development Land"
  const subheading = blok?.subheading || 'Court-ordered mandates, land assemblies & investment properties across the Lower Mainland and Fraser Valley.'
  const primaryCtaLabel = blok?.primaryCtaLabel || 'VIEW LISTINGS'
  const primaryCtaHref = blok?.primaryCtaHref || '#listings'
  const secondaryCtaLabel = blok?.secondaryCtaLabel || 'COURT-ORDERED SALES'
  const secondaryCtaHref = blok?.secondaryCtaHref || '#mandates'
  const videoUrl = blok?.videoUrl || '/about-reel.mp4'
  const stats = blok?.stats?.length ? blok.stats : DEFAULT_STATS
  const [scrollY, setScrollY] = useState(0)
  useEffect(() => {
    const fn = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.history.scrollRestoration = 'manual'
      window.scrollTo(0, 0)
    }
  }, [])

  const heroVideoRef = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    const v = heroVideoRef.current
    if (!v) return
    const fn = () => { if (v.currentTime >= 15) v.currentTime = 0 }
    v.addEventListener('timeupdate', fn)
    return () => v.removeEventListener('timeupdate', fn)
  }, [])

  const typedTag = useTypewriter(typewriterText, 38)

  return (
    <section style={{
      position: 'relative', height: '100vh',
      display: 'grid', gridTemplateColumns: '1fr 1fr', overflow: 'hidden',
    }}>
      {/* LEFT */}
      <div style={{
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '120px 64px 160px 64px', position: 'relative', zIndex: 10, background: BG,
      }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `radial-gradient(circle, rgba(41,82,163,0.12) 1px, transparent 1px)`, backgroundSize: '44px 44px', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p className="fade-up-1" style={{ fontSize: 10, letterSpacing: '0.42em', textTransform: 'uppercase', color: G, marginBottom: 28, fontWeight: 700, fontFamily: "'BentonSans', sans-serif", minHeight: '1.2em' }}>
            {typedTag}<span style={{ animation: 'blink 1s step-end infinite', opacity: typedTag.length < typewriterText.length ? 1 : 0, transition: 'opacity 0.3s 0.5s' }}>|</span>
          </p>
          <h1 style={{
            fontFamily: "'BentonSans', sans-serif", fontSize: 'clamp(1.8rem, 3.2vw, 3.2rem)',
            fontWeight: 700, lineHeight: 1.1, color: CR, marginBottom: 26,
            textTransform: 'uppercase', letterSpacing: '0.03em',
          }}>
            {heading.split(' ').map((word: string, i: number) => (
              <span key={i} style={{ display: 'inline-block', marginRight: '0.28em', opacity: 0, animation: `fadeUpWord 0.55s cubic-bezier(.22,1,.36,1) ${0.35 + i * 0.07}s forwards` }}>
                {word}
              </span>
            ))}
          </h1>
          <p className="fade-up-3" style={{ fontSize: 13, lineHeight: 1.95, color: 'rgba(240,234,224,0.48)', maxWidth: 480, marginBottom: 48, fontFamily: "'BentonSans', sans-serif" }}>{subheading}</p>
          <div className="fade-up-4" style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <a href={primaryCtaHref} className="btn-gold" style={{ background: G, color: BG, padding: '14px 40px', fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', textDecoration: 'none', fontWeight: 700, transition: 'background 0.2s' }}>
              {primaryCtaLabel}
            </a>
            <a href={secondaryCtaHref} className="btn-border" style={{ border: `1px solid rgba(240,234,224,0.25)`, color: 'rgba(240,234,224,0.7)', padding: '14px 40px', fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', textDecoration: 'none', transition: 'all 0.2s' }}>
              {secondaryCtaLabel}
            </a>
          </div>
        </div>
      </div>

      {/* RIGHT — video */}
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <video ref={heroVideoRef} autoPlay muted playsInline
          style={{ position: 'absolute', inset: 0, width: '100%', height: '115%', objectFit: 'cover', objectPosition: '50% 35%', transform: `translateY(${scrollY * 0.25}px)`, willChange: 'transform' }}>
          <source src={videoUrl} type="video/mp4" />
        </video>
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to right, ${BG} 0%, transparent 18%)` }} />
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to bottom, ${BG} 0%, transparent 12%, transparent 88%, ${BG} 100%)` }} />
      </div>

      {/* Stats Bar */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(8,8,8,0.92)', backdropFilter: 'blur(20px)', borderTop: `1px solid ${B}`, display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', zIndex: 20 }}>
        {stats.map((s: any, i: number) => (
          <div key={i} style={{ padding: '22px 0', textAlign: 'center', borderRight: i < 3 ? `1px solid ${B}` : 'none' }}>
            <p style={{ fontFamily: "'BentonSans', sans-serif", fontSize: 28, fontWeight: 700, color: CR, lineHeight: 1 }}>
              <AnimatedCount target={s.target} prefix={s.prefix} suffix={s.suffix} />
            </p>
            <p style={{ fontSize: 8, letterSpacing: '0.32em', color: 'rgba(240,234,224,0.28)', marginTop: 8 }}>{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
