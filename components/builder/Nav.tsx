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
  const logoUrl = blok?.logoUrl?.filename || blok?.logoUrl || '/logos/targeted-advisors-logo.png'
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
  const phone = '+1.604.832.5766'
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
        {/* Logo cluster: TA + Varing Marketing Group */}
        <div className="nav-logo-cluster" style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }} aria-label={companyName}>
            <Image
              src={logoUrl}
              alt={companyName}
              width={480}
              height={80}
              priority
              className="site-logo"
              style={{ height: 56, width: 'auto', maxWidth: 340, objectFit: 'contain' }}
            />
          </Link>
          <div style={{ width: 1, height: 26, background: 'rgba(240,234,224,0.14)' }} />
          <a href="https://www.varinggroup.com" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center' }}>
            <Image src="/logos/varing-old-mg-white.png" alt="Varing Marketing Group" width={400} height={80} className="site-varing-logo" style={{ height: 26, width: 'auto', objectFit: 'contain', opacity: 0.85 }} />
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

        {/* Hamburger — mobile only */}
        <button
          className="nav-hamburger"
          aria-label="Menu"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen(v => !v)}
          style={{
            display: 'none',
            background: 'transparent',
            border: `1px solid ${GB(0.4)}`,
            borderRadius: 2,
            width: 40, height: 40,
            padding: 0,
            cursor: 'pointer',
            position: 'relative',
          }}
        >
          <span style={{
            position: 'absolute', left: 10, right: 10,
            top: mobileOpen ? 19 : 13,
            height: 1.5, background: G,
            transform: mobileOpen ? 'rotate(45deg)' : 'none',
            transition: 'transform 0.25s ease, top 0.25s ease, opacity 0.2s',
          }} />
          <span style={{
            position: 'absolute', left: 10, right: 10, top: 19,
            height: 1.5, background: G,
            opacity: mobileOpen ? 0 : 1,
            transition: 'opacity 0.2s',
          }} />
          <span style={{
            position: 'absolute', left: 10, right: 10,
            top: mobileOpen ? 19 : 25,
            height: 1.5, background: G,
            transform: mobileOpen ? 'rotate(-45deg)' : 'none',
            transition: 'transform 0.25s ease, top 0.25s ease',
          }} />
        </button>
      </nav>

      {/* Mobile dropdown panel */}
      <div
        className="nav-mobile-panel"
        style={{
          position: 'fixed',
          top: 72, left: 0, right: 0,
          zIndex: 199,
          background: 'rgba(8,8,8,0.97)',
          backdropFilter: 'blur(24px) saturate(1.4)',
          WebkitBackdropFilter: 'blur(24px) saturate(1.4)',
          borderBottom: `1px solid ${B}`,
          transform: mobileOpen ? 'translateY(0)' : 'translateY(-110%)',
          opacity: mobileOpen ? 1 : 0,
          pointerEvents: mobileOpen ? 'auto' : 'none',
          transition: 'transform 0.35s cubic-bezier(.22,1,.36,1), opacity 0.25s ease',
          padding: '16px 0 24px',
          display: 'none',
        }}
      >
        {navLinks.map((l: any) => (
          <Link
            key={l.href}
            href={l.href}
            onClick={() => setMobileOpen(false)}
            style={{
              display: 'block',
              padding: '16px 28px',
              fontSize: 13,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: CR,
              textDecoration: 'none',
              fontWeight: 600,
              borderBottom: `1px solid ${B}`,
              fontFamily: "'BentonSans', sans-serif",
            }}
          >
            {l.label}
          </Link>
        ))}
        <a
          href={`tel:${phone.replace(/[^+\d]/g, '')}`}
          style={{
            display: 'block',
            margin: '20px 28px 0',
            padding: '14px 20px',
            textAlign: 'center',
            background: G, color: '#fff',
            fontSize: 12, letterSpacing: '0.16em',
            textTransform: 'uppercase', fontWeight: 700,
            textDecoration: 'none',
            fontFamily: "'BentonSans', sans-serif",
          }}
          onClick={() => setMobileOpen(false)}
        >
          Call {phone}
        </a>
      </div>

      {/* Spacer to prevent content from hiding behind fixed nav */}
      <div style={{ height: 0 }} />
    </>
  )
}
