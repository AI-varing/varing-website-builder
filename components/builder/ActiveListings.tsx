'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { G, GL, CR, BG, B, GB, GRAD_SECTION } from '@/lib/tokens'
import { Label, AnimatedCount } from '@/lib/ui'
import { useInView } from '@/lib/animations'

/* ─── Fade-up reveal wrapper ─── */
function Reveal({ children, delay = 0, style }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
  const [ref, inView] = useInView(0.15)
  return (
    <div ref={ref} style={{
      ...style,
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : 'translateY(40px)',
      transition: `opacity 0.9s ${delay}s cubic-bezier(.22,1,.36,1), transform 0.9s ${delay}s cubic-bezier(.22,1,.36,1)`,
    }}>
      {children}
    </div>
  )
}

/* ─── Status badge ─── */
function StatusBadge({ status, size = 'sm' }: { status: string; size?: 'sm' | 'lg' }) {
  const isActive = status === 'Active'
  const isReduced = status === 'Reduced'
  const fs = size === 'lg' ? 10 : 8
  const pad = size === 'lg' ? '6px 16px' : '4px 10px'
  return (
    <span style={{
      fontSize: fs, letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 700,
      background: isActive ? G : isReduced ? 'rgba(220,80,60,0.85)' : 'rgba(240,234,224,0.12)',
      color: isActive ? BG : isReduced ? '#fff' : CR,
      padding: pad, display: 'inline-block',
    }}>
      {status}
    </span>
  )
}

/* ─── Price formatter ─── */
function fmtPrice(price: number | null) {
  if (!price) return 'Price on Request'
  if (price >= 1_000_000) return `$${(price / 1_000_000).toFixed(price % 1_000_000 === 0 ? 0 : 1)}M`
  return `$${price.toLocaleString()}`
}

/* ═══════════════════════════════════════════════════════
   HERO CARD — Full-width cinematic card for top listing
   ═══════════════════════════════════════════════════════ */
function HeroCard({ listing: l }: { listing: any }) {
  const [hovered, setHovered] = useState(false)
  const [ref, inView] = useInView(0.1)

  return (
    <Reveal>
      <Link href={`/listings/${l.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
        <div
          ref={ref}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            position: 'relative', height: 'clamp(480px, 60vh, 680px)', overflow: 'hidden',
            cursor: 'pointer', marginBottom: 2,
          }}
        >
          {l.mainImage && (
            <Image
              src={l.mainImage} alt={l.address} fill priority
              className="listing-img"
              style={{
                objectFit: 'cover',
                filter: hovered ? 'grayscale(0%) brightness(0.7)' : 'grayscale(85%) brightness(0.45)',
                transform: hovered ? 'scale(1.04)' : 'scale(1)',
                transition: 'filter 0.8s ease, transform 1.2s cubic-bezier(.22,1,.36,1)',
              }}
              sizes="100vw"
            />
          )}
          {/* Gradient overlays */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(8,8,8,0.95) 0%, rgba(8,8,8,0.3) 40%, transparent 70%)' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(8,8,8,0.6) 0%, transparent 50%)' }} />

          {/* Featured + Status badges */}
          <div style={{ position: 'absolute', top: 28, left: 36, display: 'flex', gap: 10, alignItems: 'center' }}>
            {l.featured && (
              <span style={{
                fontSize: 9, letterSpacing: '0.28em', textTransform: 'uppercase', fontWeight: 700,
                border: `1px solid ${GB(0.6)}`, color: G, padding: '6px 18px',
                backdropFilter: 'blur(8px)', background: 'rgba(8,8,8,0.4)',
              }}>
                Featured
              </span>
            )}
            <StatusBadge status={l.status} size="lg" />
          </div>

          {/* Content */}
          <div style={{ position: 'absolute', bottom: 48, left: 48, right: 48, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', color: G, marginBottom: 14, fontWeight: 600 }}>
                {l.propertyType || 'Property'} &middot; {l.city}, BC
              </p>
              <h3 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 400, color: CR,
                lineHeight: 1.1, marginBottom: 0, letterSpacing: '-0.01em',
              }}>
                {l.address}
              </h3>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <p style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 'clamp(2.2rem, 4.5vw, 3.6rem)', fontWeight: 500, color: CR,
                lineHeight: 1, letterSpacing: '-0.02em',
              }}>
                {l.price ? `$${l.price.toLocaleString()}` : 'Price on Request'}
              </p>
              {l.lotSize && (
                <p style={{ fontSize: 11, color: 'rgba(240,234,224,0.35)', marginTop: 8, letterSpacing: '0.1em' }}>
                  {l.lotSize} Acres
                </p>
              )}
            </div>
          </div>

          {/* Bottom accent line */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, height: 3,
            width: hovered ? '100%' : '0%', background: G,
            transition: 'width 0.8s cubic-bezier(.22,1,.36,1)',
          }} />
        </div>
      </Link>
    </Reveal>
  )
}

/* ═══════════════════════════════════════════════════════
   STAGGERED GRID — Asymmetric 2-col for middle listings
   ═══════════════════════════════════════════════════════ */
function GridCard({ listing: l, tall = false, index }: { listing: any; tall?: boolean; index: number }) {
  const [hovered, setHovered] = useState(false)

  return (
    <Reveal delay={index * 0.1}>
      <Link href={`/listings/${l.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
        <div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            position: 'relative', height: tall ? 520 : 380, overflow: 'hidden',
            cursor: 'pointer', background: '#0c0c0c',
          }}
        >
          {l.mainImage && (
            <Image
              src={l.mainImage} alt={l.address} fill
              className="listing-img"
              style={{
                objectFit: 'cover',
                filter: hovered ? 'grayscale(0%) brightness(0.65)' : 'grayscale(85%) brightness(0.4)',
                transform: hovered ? 'scale(1.06)' : 'scale(1)',
                transition: 'filter 0.65s ease, transform 0.65s ease',
              }}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          )}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(8,8,8,0.92) 0%, rgba(8,8,8,0.15) 50%, transparent 70%)' }} />

          {/* Status */}
          <div style={{ position: 'absolute', top: 18, left: 20 }}>
            <StatusBadge status={l.status} />
          </div>

          {/* Content */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '28px 28px 32px' }}>
            <p style={{ fontSize: 8, letterSpacing: '0.38em', textTransform: 'uppercase', color: G, marginBottom: 10, fontWeight: 700 }}>
              {l.propertyType || 'Property'}
            </p>
            <h3 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: tall ? 24 : 20, fontWeight: 400, color: CR,
              lineHeight: 1.25, marginBottom: 6,
            }}>
              {l.address}
            </h3>
            <p style={{ fontSize: 11, color: 'rgba(240,234,224,0.35)', marginBottom: 16 }}>
              {l.city}{l.city ? ', BC' : ''}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 16, borderTop: `1px solid ${B}` }}>
              <span style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: tall ? 26 : 22, fontWeight: 500, color: CR,
              }}>
                {l.price ? `$${l.price.toLocaleString()}` : 'Price on Request'}
              </span>
              {l.lotSize && <span style={{ fontSize: 10, color: 'rgba(240,234,224,0.25)' }}>{l.lotSize} ac</span>}
            </div>
          </div>

          {/* Hover arrow */}
          <div style={{
            position: 'absolute', top: 18, right: 20,
            width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: hovered ? G : 'rgba(240,234,224,0.08)',
            color: hovered ? BG : CR,
            transition: 'all 0.4s ease',
            opacity: hovered ? 1 : 0,
            transform: hovered ? 'translateX(0)' : 'translateX(-8px)',
          }}>
            <span style={{ fontSize: 16 }}>&rarr;</span>
          </div>
        </div>
      </Link>
    </Reveal>
  )
}

/* ═══════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════ */
export default function ActiveListings({ blok }: { blok?: any }) {
  const sectionTitle = blok?.sectionTitle || 'Featured Court-Ordered'
  const maxListings = blok?.maxListings || 9
  const [listings, setListings] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/listings')
      .then(r => r.json())
      .then(data => setListings(data?.slice(0, maxListings) || []))
      .catch(() => {})
  }, [maxListings])

  if (!listings.length) return null

  const hero = listings[0]
  const gridListings = listings.slice(1, 5)

  // Total portfolio value
  const totalValue = listings.reduce((sum: number, l: any) => sum + (l.price || 0), 0)

  return (
    <section id="listings">
      {/* ─── Section Header ─── */}
      <div style={{ padding: '96px 56px 52px', background: GRAD_SECTION(0.25) }}>
        <div style={{ maxWidth: 1300, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <Label>Portfolio</Label>
              <h2 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 'clamp(1.8rem, 3.2vw, 2.6rem)', fontWeight: 400, color: CR,
                letterSpacing: '0.02em', marginBottom: 8,
              }}>
                {sectionTitle}
              </h2>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, color: 'rgba(240,234,224,0.35)', fontWeight: 300, fontStyle: 'italic' }}>
                Mandates across the Fraser Valley &amp; Metro Vancouver
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 36, fontWeight: 500, color: CR, lineHeight: 1,
              }}>
                $<AnimatedCount target={Math.round(totalValue / 1_000_000)} suffix="M+" />
              </p>
              <p style={{ fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(240,234,224,0.25)', marginTop: 8 }}>
                {listings.length} Active Mandates
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ─── #1: Hero Card ─── */}
      <div style={{ padding: '0 56px', background: BG }}>
        <div style={{ maxWidth: 1300, margin: '0 auto' }}>
          <HeroCard listing={hero} />
        </div>
      </div>

      {/* ─── #1: Staggered Grid ─── */}
      {gridListings.length > 0 && (
        <div style={{ padding: '2px 56px 0', background: BG }}>
          <div style={{ maxWidth: 1300, margin: '0 auto' }}>
            {/* Row 1: wide left + narrow right */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 2, marginBottom: 2 }}>
              {gridListings[0] && <GridCard listing={gridListings[0]} tall index={0} />}
              {gridListings[1] && <GridCard listing={gridListings[1]} tall={false} index={1} />}
            </div>
            {/* Row 2: narrow left + wide right */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 2 }}>
              {gridListings[2] && <GridCard listing={gridListings[2]} tall={false} index={2} />}
              {gridListings[3] && <GridCard listing={gridListings[3]} tall index={3} />}
            </div>
          </div>
        </div>
      )}

      {/* ─── Bottom CTA ─── */}
      <div style={{
        padding: '72px 56px', background: BG, textAlign: 'center',
        borderTop: `1px solid ${B}`,
      }}>
        <Reveal>
          <p style={{ fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: GB(0.4), marginBottom: 16 }}>
            Have a court-ordered mandate?
          </p>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(1.4rem, 2.5vw, 2rem)', fontWeight: 400, color: CR, marginBottom: 32,
          }}>
            We handle the entire judicial sale process.
          </p>
          <Link href="/#contact" style={{
            display: 'inline-block', padding: '16px 48px',
            background: G, color: BG, fontSize: 11, letterSpacing: '0.24em',
            textTransform: 'uppercase', fontWeight: 700, textDecoration: 'none',
            fontFamily: "'BentonSans', sans-serif",
            transition: 'background 0.3s ease',
          }}>
            Contact Our Team
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
