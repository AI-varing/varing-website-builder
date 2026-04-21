'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const G  = '#C67A3C'
const GL = '#D4943E'
const CR = '#F0EAE0'
const BG = '#080808'
const B  = 'rgba(240,234,224,0.08)'

const SECTION_LINKS = [
  { label: 'Overview', href: '#overview' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Location', href: '#location' },
]

interface ListingNavProps {
  companyName: string
  logoUrl?: string
  phone?: string
}

export default function ListingNav({ companyName, logoUrl, phone = '+1.604.832.5766' }: ListingNavProps) {
  const [scrolled, setScrolled] = useState(false)
  const [hovered, setHovered] = useState<number | null>(null)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 56px', height: 72,
      background: scrolled
        ? 'linear-gradient(180deg, rgba(8,8,8,0.96) 0%, rgba(8,8,8,0.88) 100%)'
        : 'linear-gradient(180deg, rgba(8,8,8,0.6) 0%, transparent 100%)',
      borderBottom: `1px solid ${scrolled ? B : 'transparent'}`,
      backdropFilter: scrolled ? 'blur(28px) saturate(1.4)' : 'none',
      transition: 'all 0.5s cubic-bezier(.22,1,.36,1)',
    }}>
      {/* Logo / Company name */}
      <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 14 }}>
        {logoUrl ? (
          <Image
            src={logoUrl} alt={companyName}
            width={150} height={36}
            style={{ height: 30, width: 'auto', objectFit: 'contain', filter: 'brightness(0) invert(1)' }}
          />
        ) : (
          <>
            <div style={{
              width: 32, height: 32, border: `1.5px solid ${G}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 900, color: G,
              fontFamily: "'BentonSans', sans-serif",
              letterSpacing: '-0.02em',
            }}>
              TA
            </div>
            <span style={{
              fontFamily: "'BentonSans', sans-serif",
              fontSize: 13, fontWeight: 700, letterSpacing: '0.22em',
              color: CR, textTransform: 'uppercase',
            }}>
              {companyName}
            </span>
          </>
        )}
      </Link>

      {/* Section anchors */}
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <Link
          href="/#listings"
          onMouseEnter={() => setHovered(-1)}
          onMouseLeave={() => setHovered(null)}
          style={{
            fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase',
            color: hovered === -1 ? CR : 'rgba(240,234,224,0.5)',
            textDecoration: 'none', padding: '8px 16px',
            position: 'relative', fontWeight: hovered === -1 ? 700 : 500,
            transition: 'all 0.3s ease',
          }}
        >
          All Listings
          <span style={{
            position: 'absolute', bottom: 2, left: '50%', transform: 'translateX(-50%)',
            width: hovered === -1 ? '60%' : '0%', height: 1, background: G,
            transition: 'width 0.3s cubic-bezier(.22,1,.36,1)',
          }} />
        </Link>

        {SECTION_LINKS.map((l, i) => (
          <a
            key={l.href}
            href={l.href}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            style={{
              fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase',
              color: hovered === i ? CR : 'rgba(240,234,224,0.5)',
              textDecoration: 'none', padding: '8px 16px',
              position: 'relative', fontWeight: hovered === i ? 700 : 500,
              transition: 'all 0.3s ease',
            }}
          >
            {l.label}
            <span style={{
              position: 'absolute', bottom: 2, left: '50%', transform: 'translateX(-50%)',
              width: hovered === i ? '60%' : '0%', height: 1, background: G,
              transition: 'width 0.3s cubic-bezier(.22,1,.36,1)',
            }} />
          </a>
        ))}

        <div style={{ width: 1, height: 20, background: B, margin: '0 12px' }} />

        {/* Phone CTA */}
        <a
          href={`tel:${phone.replace(/[^+\d]/g, '')}`}
          style={{
            fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase',
            color: BG, background: G,
            padding: '10px 24px',
            textDecoration: 'none', fontWeight: 700,
            fontFamily: "'BentonSans', sans-serif",
            transition: 'all 0.3s ease',
            boxShadow: '0 0 20px rgba(198,122,60,0.15)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = GL
            e.currentTarget.style.boxShadow = '0 0 30px rgba(198,122,60,0.3)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = G
            e.currentTarget.style.boxShadow = '0 0 20px rgba(198,122,60,0.15)'
          }}
        >
          {phone}
        </a>
      </div>
    </nav>
  )
}
