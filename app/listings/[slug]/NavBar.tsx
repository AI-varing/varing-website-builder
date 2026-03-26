'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface NavBarProps {
  companyName: string
  logoUrl?: string
}

export default function NavBar({ companyName, logoUrl }: NavBarProps) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const G = '#C67A3C'
  const CR = '#F0EAE0'
  const B = 'rgba(240,234,224,0.08)'

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 48px', height: 72,
      background: scrolled ? 'rgba(8,8,8,0.97)' : 'transparent',
      borderBottom: scrolled ? `1px solid ${B}` : '1px solid transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      transition: 'background 0.5s ease, border-color 0.5s ease',
    }}>
      <Link href="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
        {logoUrl
          ? <Image src={logoUrl} alt={companyName} width={140} height={32}
              style={{ height: 26, width: 'auto', objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
          : <span style={{
              fontFamily: "'BentonSans', sans-serif",
              fontSize: 13, fontWeight: 700,
              letterSpacing: '0.22em', color: CR, textTransform: 'uppercase',
            }}>{companyName}</span>
        }
      </Link>
      <div style={{ display: 'flex', gap: 40, alignItems: 'center' }}>
        {[['Overview', '#overview'], ['Gallery', '#gallery'], ['Location', '#location']].map(([label, href]) => (
          <a key={href} href={href} style={{
            fontSize: 10, letterSpacing: '0.24em', textTransform: 'uppercase',
            color: 'rgba(240,234,224,0.6)', textDecoration: 'none',
            fontFamily: "'BentonSans', sans-serif",
            transition: 'color 0.2s ease',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = CR)}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(240,234,224,0.6)')}
          >{label}</a>
        ))}
      </div>
      <a href="#overview" style={{
        fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase',
        color: G, border: `1px solid ${G}`, padding: '9px 22px',
        textDecoration: 'none', fontFamily: "'BentonSans', sans-serif",
        transition: 'background 0.25s ease, color 0.25s ease',
        flexShrink: 0,
      }}
      onMouseEnter={e => { e.currentTarget.style.background = G; e.currentTarget.style.color = '#080808' }}
      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = G }}
      >Contact</a>
    </nav>
  )
}
