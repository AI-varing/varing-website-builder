'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { storyblokEditable } from '@storyblok/react'
import { G, GL, CR, BG, B, GB, GRAD_NAV } from '@/lib/tokens'

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'ATLAS.AI', href: '/ai' },
  { label: 'Mandates', href: '/#mandates' },
  { label: 'Listings', href: '/#listings' },
  { label: 'Advisory', href: '/advisory' },
  { label: 'News', href: '/insolvency-news' },
  { label: 'Contact', href: '/contact' },
]

export default function Nav({ blok }: { blok?: any }) {
  const logoUrl = blok?.logoUrl?.filename || blok?.logoUrl || ''
  const companyName = blok?.companyName || 'Targeted Advisors'
  const baseLinks = blok?.navLinks?.length ? blok.navLinks : NAV_LINKS
  // Always inject Advisory + News before Contact, and force Contact to /contact
  const ensureLinks = [
    { label: 'Advisory', href: '/advisory' },
    { label: 'News', href: '/insolvency-news' },
  ]
  let merged = [...baseLinks]
  for (const link of ensureLinks) {
    if (!merged.some((l: any) => (l.href || l.url) === link.href)) {
      const contactIdx = merged.findIndex((l: any) => (l.label || '').toLowerCase() === 'contact')
      if (contactIdx >= 0) merged.splice(contactIdx, 0, link)
      else merged.push(link)
    }
  }
  const navLinks = merged.map((l: any) => (l.label || '').toLowerCase() === 'contact' ? { ...l, href: '/contact', url: '/contact' } : l)
  const phone = blok?.phone || '+1.604.832.5766'
  const [scrolled, setScrolled] = useState(false)
  const [hovered, setHovered] = useState<number | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <>
      <nav className="site-nav" style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 56px', height: 72,
        background: scrolled
          ? 'linear-gradient(180deg, rgba(8,8,8,0.95) 0%, rgba(8,8,8,0.85) 100%)'
          : 'linear-gradient(180deg, rgba(8,8,8,0.6) 0%, transparent 100%)',
        borderBottom: `1px solid ${scrolled ? B : 'transparent'}`,
        backdropFilter: scrolled ? 'blur(28px) saturate(1.4)' : 'none',
        transition: 'all 0.5s cubic-bezier(.22,1,.36,1)',
      }}>
        {/* Logo cluster: TA + Varing + Homelife */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 14 }}>
            {logoUrl
              ? <Image src={logoUrl} alt={companyName} width={150} height={36} style={{ height: 30, width: 'auto', objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
              : <>
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
            }
          </Link>
          <div style={{ width: 1, height: 24, background: 'rgba(240,234,224,0.12)' }} />
          <a href="https://www.varinggroup.com" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center' }}>
            <Image src="/logos/varing-old-mg-white.png" alt="Varing Marketing Group" width={400} height={80} style={{ height: 28, width: 'auto', objectFit: 'contain', opacity: 0.85 }} />
          </a>
        </div>

        {/* Nav Links */}
        <div className="nav-links-container" style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {navLinks.map((l: any, i: number) => (
            <Link
              key={l.href}
              href={l.href}
              className="nav-link-item"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{
                fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase',
                color: hovered === i ? CR : 'rgba(240,234,224,0.72)',
                textDecoration: 'none',
                padding: '8px 16px',
                position: 'relative',
                fontWeight: hovered === i ? 700 : 500,
                transition: 'all 0.3s ease',
              }}
            >
              {l.label}
              {/* Underline indicator */}
              <span style={{
                position: 'absolute', bottom: 2, left: '50%',
                transform: 'translateX(-50%)',
                width: hovered === i ? '60%' : '0%',
                height: 1, background: G,
                transition: 'width 0.3s cubic-bezier(.22,1,.36,1)',
              }} />
            </Link>
          ))}

          {/* Separator */}
          <div className="nav-separator" style={{ width: 1, height: 20, background: B, margin: '0 12px' }} />

          {/* Phone CTA */}
          <a
            className="nav-phone-cta"
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

      {/* Spacer to prevent content from hiding behind fixed nav */}
      <div style={{ height: 0 }} />
    </>
  )
}
