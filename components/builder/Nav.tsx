'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { storyblokEditable } from '@storyblok/react'
import { G, CR, BG, B, GRAD_NAV } from '@/lib/tokens'

export default function Nav({ blok }: { blok?: any }) {
  const logoUrl = blok?.logoUrl || ''
  const companyName = blok?.companyName || 'Targeted Advisors'
  const navLinks = blok?.navLinks?.length ? blok.navLinks : [
    { label: 'Listings', href: '#listings' },
    { label: 'Mandates', href: '#mandates' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ]
  const phone = blok?.phone || '+1.604.565.3478'
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 56px', height: 66,
      background: scrolled ? GRAD_NAV : 'transparent',
      borderBottom: `1px solid ${scrolled ? B : 'transparent'}`,
      backdropFilter: scrolled ? 'blur(24px)' : 'none',
      transition: 'background 0.4s, border-color 0.4s',
    }}>
      <Link href="/" style={{ textDecoration: 'none' }}>
        {logoUrl
          ? <Image src={logoUrl} alt={companyName} width={150} height={36} style={{ height: 28, width: 'auto', objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
          : <span style={{ fontFamily: "'BentonSans', sans-serif", fontSize: 13, fontWeight: 700, letterSpacing: '0.22em', color: CR, textTransform: 'uppercase' }}>{companyName}</span>
        }
      </Link>
      <div style={{ display: 'flex', gap: 38, alignItems: 'center' }}>
        {navLinks.map((l: any) => (
          <a key={l.href} href={l.href} className="nav-link nav-link-slide" style={{ fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(240,234,224,0.45)', textDecoration: 'none', transition: 'color 0.2s' }}>{l.label}</a>
        ))}
        <a href={`tel:${phone.replace(/[^+\d]/g, '')}`} style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: BG, background: G, padding: '9px 22px', textDecoration: 'none', fontWeight: 700 }}>
          {phone}
        </a>
      </div>
    </nav>
  )
}
