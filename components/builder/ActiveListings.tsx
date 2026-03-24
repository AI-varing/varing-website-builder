'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { storyblokEditable } from '@storyblok/react'
import { G, CR, BG, B, GRAD_SECTION } from '@/lib/tokens'
import { Label, MagneticCard } from '@/lib/ui'
import { useStaggerReveal } from '@/lib/animations'

export default function ActiveListings({ blok }: { blok?: any }) {
  const sectionTitle = blok?.sectionTitle || 'Featured Court-Ordered'
  const maxListings = blok?.maxListings || 9
  const showViewAll = blok?.showViewAll !== false
  const [listings, setListings] = useState<any[]>([])
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const stagger = useStaggerReveal(0.1)

  useEffect(() => {
    fetch('/api/listings')
      .then(r => r.json())
      .then(data => setListings(data?.slice(0, maxListings) || []))
      .catch(() => {})
  }, [maxListings])

  return (
    <section id="listings" style={{ padding: '96px 56px', background: GRAD_SECTION(0.25) }}>
      <div style={{ maxWidth: 1300, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 52 }}>
          <div>
            <Label>Portfolio</Label>
            <h2 style={{ fontFamily: "'BentonSans', sans-serif", fontSize: 'clamp(1.8rem,3.2vw,2.6rem)', fontWeight: 700, color: CR, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {sectionTitle}
            </h2>
          </div>
          <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
            <span style={{ fontSize: 10, letterSpacing: '0.15em', color: 'rgba(240,234,224,0.2)', textTransform: 'uppercase' }}>{listings.length} Properties</span>
            {showViewAll && <Link href="/listings" style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: G, textDecoration: 'none', borderBottom: `1px solid ${G}`, paddingBottom: 2 }}>View All &rarr;</Link>}
          </div>
        </div>

        <div ref={stagger.ref} style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 2 }}>
          {listings.length > 0 ? listings.map((l: any, i: number) => (
            <div key={l._id}
              onMouseEnter={() => setHoveredCard(i)}
              onMouseLeave={() => setHoveredCard(null)}
              style={{
                ...stagger.getItemStyle(i),
                boxShadow: hoveredCard === i ? '0 8px 32px rgba(0,0,0,0.4)' : 'none',
                transform: hoveredCard === i ? 'translateY(-4px)' : (stagger.inView ? 'translateY(0) scale(1)' : 'translateY(36px) scale(0.97)'),
                transition: `opacity 0.75s ${i * 0.1}s cubic-bezier(.22,1,.36,1), transform 0.35s ease, box-shadow 0.35s ease`,
              }}
            >
            <MagneticCard>
              <Link href={l.slug ? `/listings/${l.slug}` : '#'} className="listing-card" style={{ textDecoration: 'none', display: 'block', background: '#0f0f0f', overflow: 'hidden' }}>
                <div style={{ position: 'relative', height: 240, background: '#141414', overflow: 'hidden' }}>
                  {l.mainImage ? (
                    <Image src={l.mainImage} alt={l.address} fill className="listing-img" style={{ objectFit: 'cover', filter: 'grayscale(85%)', transition: 'filter 0.65s ease, transform 0.65s ease' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', background: '#181818', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: 9, letterSpacing: '0.3em', color: 'rgba(240,234,224,0.06)', textTransform: 'uppercase' }}>No Photo</span>
                    </div>
                  )}
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(8,8,8,0.75) 0%, transparent 55%)' }} />
                  <div style={{ position: 'absolute', top: 14, left: 14, display: 'flex', gap: 6 }}>
                    {l.status && <span style={{ fontSize: 8, letterSpacing: '0.22em', textTransform: 'uppercase', background: l.status === 'Active' ? G : 'rgba(240,234,224,0.12)', color: l.status === 'Active' ? BG : CR, padding: '4px 10px', fontWeight: 700 }}>{l.status}</span>}
                    {l.featured && <span style={{ fontSize: 8, letterSpacing: '0.22em', textTransform: 'uppercase', border: '1px solid rgba(240,234,224,0.35)', color: CR, padding: '4px 10px', backdropFilter: 'blur(4px)', background: 'rgba(8,8,8,0.3)' }}>FEATURED</span>}
                  </div>
                </div>
                <div style={{ padding: '24px 26px 28px' }}>
                  <p style={{ fontSize: 8, letterSpacing: '0.38em', textTransform: 'uppercase', color: G, marginBottom: 9, fontWeight: 700 }}>{l.propertyType || 'Property'}</p>
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 400, color: CR, marginBottom: 5, lineHeight: 1.25 }}>{l.address}</h3>
                  <p style={{ fontSize: 11, color: 'rgba(240,234,224,0.38)', marginBottom: 20 }}>
                    {l.city}{l.city ? ', BC' : ''}{l.mlsNumber ? ` \u00b7 MLS\u00ae ${l.mlsNumber}` : ''}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 500, color: CR }}>
                      {l.price ? `$${l.price.toLocaleString()}` : 'Price on Request'}
                    </span>
                    {l.lotSize && <span style={{ fontSize: 10, color: 'rgba(240,234,224,0.28)' }}>{l.lotSize} ac</span>}
                  </div>
                  <div style={{ marginTop: 18, paddingTop: 16, borderTop: `1px solid ${B}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(240,234,224,0.3)' }}>View Details</span>
                    <span style={{ color: G, fontSize: 14 }}>&rarr;</span>
                  </div>
                </div>
              </Link>
            </MagneticCard>
            </div>
          )) : (
            <div style={{ gridColumn: '1/-1', border: `1px solid ${B}`, padding: '80px', textAlign: 'center' }}>
              <p style={{ fontSize: 12, color: 'rgba(240,234,224,0.2)', letterSpacing: '0.08em' }}>No listings available</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
