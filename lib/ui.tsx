'use client'

import React, { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import { useInView } from './animations'
import { G, CR, B } from './tokens'

/* ─── Section Label ─── */
export function Label({ children }: { children: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
      <div style={{ width: 36, height: 1, background: G, flexShrink: 0 }} />
      <span style={{ fontSize: 10, letterSpacing: '0.38em', textTransform: 'uppercase', color: 'rgba(240,234,224,0.35)', fontWeight: 500 }}>{children}</span>
    </div>
  )
}

/* ─── Animated Counter ─── */
export function AnimatedCount({ target, prefix = '', suffix = '', duration = 2200 }: {
  target: number; prefix?: string; suffix?: string; duration?: number
}) {
  const [ref, inView] = useInView(0.4)
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!inView) return
    const start = performance.now()
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setVal(Math.round(eased * target))
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [inView, target, duration])
  return <span ref={ref}>{prefix}{val}{suffix}</span>
}

/* ─── Magnetic Card Wrapper ─── */
export function MagneticCard({ children, className, style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null)
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const dx = e.clientX - (r.left + r.width / 2)
    const dy = e.clientY - (r.top + r.height / 2)
    el.style.transform = `translate(${dx * 0.06}px, ${dy * 0.06}px)`
  }
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = 'translate(0,0)'
  }
  return (
    <div ref={ref} className={className} style={{ ...style, transition: 'transform 0.35s cubic-bezier(.22,1,.36,1)', willChange: 'transform' }} onMouseMove={onMove} onMouseLeave={onLeave}>
      {children}
    </div>
  )
}

/* ─── Testimonial Card ─── */
export function TestimonialCard({ t, floatDelay, urlFor }: { t: any; floatDelay: number; urlFor?: (source: any) => any }) {
  const cardRef = useRef<HTMLDivElement>(null)

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    el.style.transform = `perspective(900px) rotateY(${x * 12}deg) rotateX(${-y * 10}deg) scale(1.02)`
    el.style.transition = 'transform 0.1s ease'
  }
  const onLeave = () => {
    const el = cardRef.current
    if (!el) return
    el.style.transform = ''
    el.style.transition = 'transform 0.6s cubic-bezier(.22,1,.36,1)'
  }

  return (
    <div
      ref={cardRef}
      className="testimonial-card"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        background: '#0e0e0e',
        border: `1px solid rgba(240,234,224,0.07)`,
        padding: '40px 36px',
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
        animation: `floatCard 6s ease-in-out ${floatDelay}s infinite`,
        willChange: 'transform',
        transformStyle: 'preserve-3d',
      }}
    >
      {t.rating && (
        <div style={{ display: 'flex', gap: 4, marginBottom: 20 }}>
          {Array.from({ length: t.rating }).map((_: any, ri: number) => (
            <span key={ri} style={{ color: G, fontSize: 13 }}>&#9733;</span>
          ))}
        </div>
      )}
      <p style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: 'clamp(1.05rem, 1.5vw, 1.2rem)',
        fontStyle: 'italic', fontWeight: 300, lineHeight: 1.8,
        color: 'rgba(240,234,224,0.72)', flex: 1, marginBottom: 32,
      }}>
        &ldquo;{t.quote}&rdquo;
      </p>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 20,
        paddingTop: 24, borderTop: `1px solid rgba(240,234,224,0.08)`,
      }}>
        {t.logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={t.logo}
            alt={t.company || t.name}
            style={{ height: 48, width: 'auto', maxWidth: 110, objectFit: 'contain', filter: 'brightness(0) invert(1)', opacity: 0.7, flexShrink: 0 }}
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
          />
        ) : t.photo && urlFor ? (
          <Image
            src={urlFor(t.photo).width(80).height(80).url()}
            alt={t.name}
            width={52} height={52}
            style={{ borderRadius: '50%', objectFit: 'cover', filter: 'grayscale(100%)', flexShrink: 0 }}
          />
        ) : null}
        <div style={{ minWidth: 0 }}>
          <p style={{ fontSize: 18, fontWeight: 700, color: CR, letterSpacing: '0.06em', textTransform: 'uppercase', lineHeight: 1.2, marginBottom: 6 }}>{t.name}</p>
          {t.role && <p style={{ fontSize: 13, color: G, letterSpacing: '0.06em', marginBottom: 3, fontWeight: 500 }}>{t.role}</p>}
          {t.company && <p style={{ fontSize: 14, color: G, letterSpacing: '0.04em', opacity: 0.85, fontWeight: 600 }}>{t.company}</p>}
        </div>
      </div>
    </div>
  )
}
