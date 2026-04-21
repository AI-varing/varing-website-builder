'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { storyblokEditable } from '@storyblok/react'
import { G, GL, CR, BG, B, GB, GRAD_SECTION } from '@/lib/tokens'
import { Label, AnimatedCount } from '@/lib/ui'
import { useInView } from '@/lib/animations'
import FluidGradient from './FluidGradient'

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
  const fs = size === 'lg' ? 12 : 11
  const pad = size === 'lg' ? '6px 16px' : '4px 10px'
  const bg = status === 'Active' ? 'rgba(34,160,75,0.9)'
    : status === 'Reduced' ? 'rgba(210,140,40,0.9)'
    : status === 'Sold' ? 'rgba(200,45,40,0.9)'
    : status === 'Firm' ? 'rgba(60,140,80,0.85)'
    : 'rgba(240,234,224,0.12)'
  const clr = status === 'Active' || status === 'Reduced' || status === 'Sold' || status === 'Firm' ? '#fff' : CR
  return (
    <span style={{
      fontSize: fs, letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 700,
      background: bg, color: clr,
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
                filter: 'grayscale(0%) brightness(0.7)',
                transform: 'scale(1)',
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
                fontSize: 11, letterSpacing: '0.28em', textTransform: 'uppercase', fontWeight: 700,
                border: `1px solid ${GB(0.6)}`, color: G, padding: '6px 18px',
                backdropFilter: 'blur(8px)', background: 'rgba(8,8,8,0.4)',
              }}>
                Featured
              </span>
            )}
            <StatusBadge status={l.status} size="lg" />
          </div>

          {/* Content */}
          <div className="hero-card-content" style={{ position: 'absolute', bottom: 48, left: 48, right: 48, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: 12, letterSpacing: '0.4em', textTransform: 'uppercase', color: G, marginBottom: 14, fontWeight: 600 }}>
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
                <p style={{ fontSize: 11, color: 'rgba(240,234,224,0.72)', marginTop: 8, letterSpacing: '0.1em' }}>
                  {l.lotSize} Acres
                </p>
              )}
            </div>
          </div>

          {/* Action buttons (always visible) */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            display: 'flex', gap: 1,
            zIndex: 10,
          }}>
            {['Schedule a Call', 'Book a Showing', 'Make an Offer', 'Due Diligence'].map(label => (
              <a
                key={label}
                href={label === 'Due Diligence' ? '#' : `mailto:info@targetedadvisors.ca?subject=${encodeURIComponent(`${label} — ${l.address}`)}&body=${encodeURIComponent(`Hi,\n\nI would like to ${label.toLowerCase()} for the property at ${l.address}.\n\nThank you.`)}`}
                onClick={(e) => {
                  e.stopPropagation()
                  if (label === 'Due Diligence') {
                    e.preventDefault()
                    const link = document.createElement('a')
                    link.href = '/Targeted-Advisors-NDA.pdf'
                    link.download = 'Targeted-Advisors-NDA.pdf'
                    link.click()
                    setTimeout(() => {
                      window.location.href = `mailto:info@targetedadvisors.ca?subject=${encodeURIComponent(`Due Diligence Request — ${l.address}`)}&body=${encodeURIComponent(`Hi,\n\nI am interested in accessing the due diligence documents for the property at ${l.address}.\n\nPlease find the signed NDA attached to this email.\n\nOnce reviewed, kindly send over the Schedule A and any available due diligence materials.\n\nThank you.`)}`
                    }, 500)
                  }
                }}
                style={{
                  flex: 1, padding: '14px 8px',
                  background: 'linear-gradient(135deg, rgba(198,122,60,0.2) 0%, rgba(100,50,10,0.85) 100%)',
                  backdropFilter: 'blur(8px)',
                  color: G, fontSize: 10, fontWeight: 700,
                  letterSpacing: '0.14em', textTransform: 'uppercase',
                  textAlign: 'center', textDecoration: 'none',
                  borderTop: `1px solid ${GB(0.2)}`,
                  transition: 'background 0.2s, color 0.2s',
                  fontFamily: "'BentonSans', sans-serif",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'linear-gradient(135deg, #c67a3c 0%, #8c4b14 100%)'; e.currentTarget.style.color = '#080808' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'linear-gradient(135deg, rgba(198,122,60,0.2) 0%, rgba(100,50,10,0.85) 100%)'; e.currentTarget.style.color = G }}
              >
                {label}
              </a>
            ))}
          </div>

          {/* Bottom accent line */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, height: 3,
            width: '100%', background: G,
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
            position: 'relative', height: 440, overflow: 'hidden',
            cursor: 'pointer', background: '#0c0c0c',
          }}
        >
          {l.mainImage && (
            <Image
              src={l.mainImage} alt={l.address} fill
              className="listing-img"
              style={{
                objectFit: 'cover',
                filter: 'grayscale(0%) brightness(0.65)',
                transform: 'scale(1)',
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
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '28px 28px 56px' }}>
            <p style={{ fontSize: 11, letterSpacing: '0.38em', textTransform: 'uppercase', color: G, marginBottom: 10, fontWeight: 700 }}>
              {l.propertyType || 'Property'}
            </p>
            <h3 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 20, fontWeight: 400, color: CR,
              lineHeight: 1.25, marginBottom: 6,
            }}>
              {l.address}
            </h3>
            <p style={{ fontSize: 11, color: 'rgba(240,234,224,0.72)', marginBottom: 16 }}>
              {l.city}{l.city ? ', BC' : ''}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 16, borderTop: `1px solid ${B}` }}>
              <span style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 22, fontWeight: 500, color: CR,
              }}>
                {l.price ? `$${l.price.toLocaleString()}` : 'Price on Request'}
              </span>
              {l.lotSize && <span style={{ fontSize: 12, color: 'rgba(240,234,224,0.72)' }}>{l.lotSize} ac</span>}
            </div>
          </div>

          {/* Hover arrow */}
          <div style={{
            position: 'absolute', top: 18, right: 20,
            width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: G,
            color: BG,
            opacity: 1,
          }}>
            <span style={{ fontSize: 16 }}>&rarr;</span>
          </div>

          {/* Action buttons (always visible) */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            display: 'flex', gap: 1,
            zIndex: 10,
          }}>
            {['Schedule a Call', 'Book a Showing', 'Make an Offer', 'Due Diligence'].map(label => (
              <a
                key={label}
                href={label === 'Due Diligence' ? '#' : `mailto:info@targetedadvisors.ca?subject=${encodeURIComponent(`${label} — ${l.address}`)}&body=${encodeURIComponent(`Hi,\n\nI would like to ${label.toLowerCase()} for the property at ${l.address}.\n\nThank you.`)}`}
                onClick={(e) => {
                  e.stopPropagation()
                  if (label === 'Due Diligence') {
                    e.preventDefault()
                    const link = document.createElement('a')
                    link.href = '/Targeted-Advisors-NDA.pdf'
                    link.download = 'Targeted-Advisors-NDA.pdf'
                    link.click()
                    setTimeout(() => {
                      window.location.href = `mailto:info@targetedadvisors.ca?subject=${encodeURIComponent(`Due Diligence Request — ${l.address}`)}&body=${encodeURIComponent(`Hi,\n\nI am interested in accessing the due diligence documents for the property at ${l.address}.\n\nPlease find the signed NDA attached to this email.\n\nOnce reviewed, kindly send over the Schedule A and any available due diligence materials.\n\nThank you.`)}`
                    }, 500)
                  }
                }}
                style={{
                  flex: 1, padding: '12px 8px',
                  background: 'linear-gradient(135deg, rgba(198,122,60,0.2) 0%, rgba(100,50,10,0.85) 100%)',
                  backdropFilter: 'blur(8px)',
                  color: G, fontSize: 9, fontWeight: 700,
                  letterSpacing: '0.12em', textTransform: 'uppercase',
                  textAlign: 'center', textDecoration: 'none',
                  borderTop: `1px solid ${GB(0.2)}`,
                  transition: 'background 0.2s, color 0.2s',
                  fontFamily: "'BentonSans', sans-serif",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'linear-gradient(135deg, #c67a3c 0%, #8c4b14 100%)'; e.currentTarget.style.color = '#080808' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'linear-gradient(135deg, rgba(198,122,60,0.2) 0%, rgba(100,50,10,0.85) 100%)'; e.currentTarget.style.color = G }}
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </Link>
    </Reveal>
  )
}

/* ═══════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════ */
/* ─── Skeleton placeholders ─── */
function SkeletonHeroCard() {
  return (
    <div style={{ position: 'relative', height: 'clamp(480px, 60vh, 680px)', overflow: 'hidden', background: '#0c0c0c' }}>
      <div className="skeleton" style={{ position: 'absolute', inset: 0 }} />
      <div style={{ position: 'absolute', bottom: 48, left: 48, right: 48, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <div className="skeleton" style={{ width: 120, height: 10, marginBottom: 14 }} />
          <div className="skeleton" style={{ width: 340, height: 36, marginBottom: 8 }} />
          <div className="skeleton" style={{ width: 200, height: 24 }} />
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className="skeleton" style={{ width: 160, height: 40, marginLeft: 'auto' }} />
          <div className="skeleton" style={{ width: 80, height: 12, marginTop: 8, marginLeft: 'auto' }} />
        </div>
      </div>
    </div>
  )
}

function SkeletonGridCard({ tall = false }: { tall?: boolean }) {
  return (
    <div style={{ position: 'relative', height: tall ? 520 : 380, overflow: 'hidden', background: '#0c0c0c' }}>
      <div className="skeleton" style={{ position: 'absolute', inset: 0 }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '28px 28px 32px' }}>
        <div className="skeleton" style={{ width: 80, height: 8, marginBottom: 12 }} />
        <div className="skeleton" style={{ width: '70%', height: 22, marginBottom: 8 }} />
        <div className="skeleton" style={{ width: 100, height: 12, marginBottom: 20 }} />
        <div style={{ borderTop: '1px solid rgba(240,234,224,0.08)', paddingTop: 16, display: 'flex', justifyContent: 'space-between' }}>
          <div className="skeleton" style={{ width: 120, height: 24 }} />
          <div className="skeleton" style={{ width: 50, height: 12 }} />
        </div>
      </div>
    </div>
  )
}

function ListingsSkeleton() {
  return (
    <section id="listings">
      <div style={{ padding: '96px 56px 52px' }}>
        <div style={{ maxWidth: 1300, margin: '0 auto' }}>
          <div className="skeleton" style={{ width: 80, height: 10, marginBottom: 16 }} />
          <div className="skeleton" style={{ width: 300, height: 32, marginBottom: 8 }} />
          <div className="skeleton" style={{ width: 320, height: 16 }} />
        </div>
      </div>
      <div style={{ padding: '0 56px' }}>
        <div style={{ maxWidth: 1300, margin: '0 auto' }}>
          <SkeletonHeroCard />
        </div>
      </div>
      <div style={{ padding: '2px 56px 0' }}>
        <div style={{ maxWidth: 1300, margin: '0 auto' }}>
          <div className="listings-grid-row" style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 2, marginBottom: 2 }}>
            <SkeletonGridCard tall />
            <SkeletonGridCard />
          </div>
          <div className="listings-grid-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 2, marginBottom: 2 }}>
            <SkeletonGridCard />
            <SkeletonGridCard tall />
          </div>
        </div>
      </div>
    </section>
  )
}

export default function ActiveListings({ blok }: { blok?: any }) {
  const sectionTitle = blok?.sectionTitle || 'Court Ordered Mandates'
  const maxListings = blok?.maxListings || 30
  const [listings, setListings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/listings')
      .then(r => r.json())
      .then(data => {
        setListings(data?.slice(0, maxListings) || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [maxListings])

  if (loading) return <ListingsSkeleton />
  if (!listings.length) return null

  // Group by status: Active first, then Reduced, then Sold
  const statusOrder: Record<string, number> = { Active: 0, Reduced: 1, Firm: 2, Sold: 3 }
  const sorted = [...listings].sort((a: any, b: any) => {
    const oa = statusOrder[a.status] ?? 2
    const ob = statusOrder[b.status] ?? 2
    return oa - ob
  })

  const activeListings = sorted.filter((l: any) => l.status === 'Active' || l.status === 'Reduced' || l.status === 'Firm')
  const soldListings = sorted.filter((l: any) => l.status === 'Sold')

  // Total portfolio value
  const totalValue = listings.reduce((sum: number, l: any) => sum + (l.price || 0), 0)

  function renderGroup(items: any[], label: string) {
    if (!items.length) return null
    return (
      <>
        {/* Group label */}
        <div style={{ padding: '48px 56px 20px', background: '#F5E6D3', position: 'relative', overflow: 'hidden' }}>
          <FluidGradient />
          <div style={{ maxWidth: 1300, margin: '0 auto', position: 'relative', zIndex: 1 }}>
            <Reveal>
              <p style={{
                fontSize: 16, letterSpacing: '0.35em', textTransform: 'uppercase', fontWeight: 900,
                color: label === 'Active Listings' ? 'rgba(34,130,60,0.9)' : '#CC2222',
                fontFamily: "'BentonSans', sans-serif",
                borderBottom: '1px solid rgba(42,21,8,0.12)', paddingBottom: 16,
              }}>
                {label}
              </p>
            </Reveal>
          </div>
        </div>
        {/* Consistent 3-column grid */}
        <div className="listings-grid-wrap" style={{ padding: '0 56px 0', background: '#F5E6D3', position: 'relative', overflow: 'hidden' }}>
          <FluidGradient />
          <div style={{ maxWidth: 1300, margin: '0 auto' }}>
            <div className="listings-grid-row" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 2,
            }}>
              {items.map((l: any, i: number) => (
                <GridCard key={l._id || i} listing={l} tall={false} index={i} />
              ))}
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <section id="listings" {...(blok ? storyblokEditable(blok) : {})}>
      {/* ─── Section Header ─── */}
      <div className="listings-header" style={{ padding: '96px 56px 52px', background: '#F5E6D3', position: 'relative', overflow: 'hidden' }}>
        <FluidGradient />
        <div style={{ maxWidth: 1300, margin: '0 auto' }}>
          <div className="listings-header-inner" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                <div style={{ width: 36, height: 1, background: '#8B4513', flexShrink: 0 }} />
                <span style={{ fontSize: 10, letterSpacing: '0.38em', textTransform: 'uppercase', color: '#8B4513', fontWeight: 600 }}>Portfolio</span>
              </div>
              <h2 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 'clamp(1.8rem, 3.2vw, 2.6rem)', fontWeight: 400, color: '#2A1508',
                letterSpacing: '0.02em', marginBottom: 8,
              }}>
                {sectionTitle}
              </h2>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, color: 'rgba(42,21,8,0.6)', fontWeight: 300 }}>
                Court ordered mandates across the Fraser Valley &amp; Metro Vancouver
              </p>
            </div>
            <div style={{ textAlign: 'right', position: 'relative', zIndex: 1 }}>
              <p style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 36, fontWeight: 500, color: '#2A1508', lineHeight: 1,
              }}>
                $<AnimatedCount target={Math.round(totalValue / 1_000_000)} suffix="M+" />
              </p>
              <p style={{ fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(42,21,8,0.55)', marginTop: 8 }}>
                {listings.length} Mandates &middot; {activeListings.length} Active
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Active / Reduced listings ─── */}
      {renderGroup(activeListings, 'Active Listings')}

      {/* ─── Sold listings ─── */}
      {renderGroup(soldListings, 'Court Ordered Sales')}

      {/* ─── Bottom CTA ─── */}
      <div className="listings-bottom-cta" style={{
        padding: '72px 56px', background: '#F5E6D3', textAlign: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        <FluidGradient />
        <Reveal>
          <p style={{ fontSize: 12, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#8B4513', marginBottom: 16, fontFamily: "'BentonSans', sans-serif", fontWeight: 700, position: 'relative', zIndex: 1 }}>
            HAVE A COURT-ORDERED MANDATE?
          </p>
          <p style={{
            fontFamily: "'BentonSans', sans-serif",
            fontSize: 'clamp(1.4rem, 2.5vw, 2rem)', fontWeight: 900, color: '#2A1508', marginBottom: 32,
            textTransform: 'uppercase', letterSpacing: '0.04em', position: 'relative', zIndex: 1,
          }}>
            WE HANDLE THE ENTIRE JUDICIAL SALE PROCESS.
          </p>
          <Link href="/contact" style={{
            display: 'inline-block', padding: '16px 48px',
            background: '#2A1508', color: '#F5E6D3', fontSize: 11, letterSpacing: '0.24em',
            textTransform: 'uppercase', fontWeight: 700, textDecoration: 'none',
            fontFamily: "'BentonSans', sans-serif",
            transition: 'background 0.3s ease', position: 'relative', zIndex: 1,
          }}>
            Contact Our Team
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
