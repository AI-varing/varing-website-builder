'use client'

import React, { useEffect, useRef, useState } from 'react'
import { storyblokEditable } from '@storyblok/react'
import { G, GL, CR, BG, B, GB, GRAD_HERO } from '@/lib/tokens'
import { useTypewriter } from '@/lib/animations'
import { AnimatedCount, Label } from '@/lib/ui'

const DEFAULT_STATS = [
  { target: 19, prefix: '', suffix: '+', label: 'YEARS IN BUSINESS' },
  { target: 4, prefix: '$', suffix: 'B+', label: 'TOTAL VOLUME SOLD' },
  { target: 600, prefix: '', suffix: '+', label: 'TRANSACTIONS CLOSED' },
]

export default function Hero({ blok }: { blok?: any }) {
  const tagline = blok?.tagline || 'WE SELL DIRT.\u2122'
  const typewriterText =
    blok?.typewriterText || 'INVESTMENTS  |  DEVELOPMENT  |  COURT-ORDERED MANDATES'
  const heading =
    blok?.heading || "BC\u2019S SPECIALISTS IN COURT\u2011ORDERED MANDATES"
  const subheading =
    blok?.subheading ||
    'Strategic marketing and execution for lender, receiver, and court-directed dispositions across development land, commercial, and investment assets.'
  const poeticTagline =
    blok?.poeticTagline || 'The story behind the art of distress.'
  const primaryCtaLabel = blok?.primaryCtaLabel || 'VIEW LISTINGS'
  const primaryCtaHref = blok?.primaryCtaHref || '#listings'
  // Hardcoded — Storyblok-stored value ("Court-Ordered Sales") was redundant with #mandates section below
  const secondaryCtaLabel = 'SUBMIT A MANDATE'
  const secondaryCtaHref = '/submit-mandate'
  const heroVideos = blok?.heroVideos?.length
    ? blok.heroVideos.map((v: any) => v.filename || v)
    : ['/joe-reversed-scaled.mp4', '/weselldirt.mp4']
  const stats = blok?.stats?.length ? blok.stats : DEFAULT_STATS

  const typedTag = useTypewriter(typewriterText, 38)
  const heroVideoRef = useRef<HTMLVideoElement>(null)
  const [scrollY, setScrollY] = useState(0)
  const [videoIdx, setVideoIdx] = useState(0)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.history.scrollRestoration = 'manual'
      window.scrollTo(0, 0)
    }
  }, [])

  // Cycle through hero videos on ended
  useEffect(() => {
    const v = heroVideoRef.current
    if (!v) return
    const onEnded = () => {
      const next = (videoIdx + 1) % heroVideos.length
      setVideoIdx(next)
      v.src = heroVideos[next]
      v.play().catch(() => {})
    }
    v.addEventListener('ended', onEnded)
    return () => v.removeEventListener('ended', onEnded)
  }, [videoIdx, heroVideos])

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const rootProps = blok ? storyblokEditable(blok) : {}

  return (
    <section
      {...rootProps}
      className="hero-section"
      style={{
        position: 'relative',
        height: '100vh',
        overflow: 'hidden',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        background: BG,
      }}
    >
      {/* ── Left: Text content ── */}
      <div className="hero-text" style={{
        position: 'relative',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '0 64px',
        backgroundImage: `radial-gradient(circle, ${GB(0.06)} 1px, transparent 1px)`,
        backgroundSize: '40px 40px',
      }}>
        {/* Typewriter label */}
        <p
          className="fade-up-1"
          style={{
            fontSize: 12,
            letterSpacing: '0.42em',
            textTransform: 'uppercase',
            color: G,
            marginBottom: 28,
            fontWeight: 700,
            fontFamily: "'BentonSans', sans-serif",
            minHeight: '1.2em',
          }}
        >
          {typedTag}
          <span style={{
            animation: 'blink 1s step-end infinite',
            opacity: typedTag.length < typewriterText.length ? 1 : 0,
            transition: 'opacity 0.3s 0.5s',
          }}>|</span>
        </p>

        {/* Main heading — word-by-word reveal */}
        <h1 style={{
          fontFamily: "'BentonSans', sans-serif",
          fontSize: 'clamp(2rem, 3.5vw, 3.2rem)',
          fontWeight: 900,
          lineHeight: 1.12,
          color: CR,
          marginBottom: 22,
          letterSpacing: '0.03em',
          textTransform: 'uppercase',
        }}>
          {heading.split(' ').map((word: string, i: number) => (
            <span
              key={i}
              style={{
                display: 'inline-block',
                marginRight: '0.28em',
                opacity: 0,
                animation: `fadeUpWord 0.55s cubic-bezier(.22,1,.36,1) ${0.55 + i * 0.07}s forwards`,
              }}
            >
              {word}
            </span>
          ))}
        </h1>

        {/* Poetic tagline — Joe's voice */}
        <p
          className="fade-up-2"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: 'italic',
            fontSize: 22,
            lineHeight: 1.4,
            color: G,
            marginBottom: 22,
            letterSpacing: '0.01em',
            maxWidth: 520,
          }}
        >
          {poeticTagline}
        </p>

        {/* Subheading */}
        <p
          className="fade-up-3"
          style={{
            fontSize: 16,
            lineHeight: 1.85,
            color: 'rgba(240,234,224,0.65)',
            maxWidth: 520,
            marginBottom: 44,
            fontFamily: "'BentonSans', sans-serif",
          }}
        >
          {subheading}
        </p>

        {/* CTA buttons */}
        <div className="fade-up-4" style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          <a
            href={primaryCtaHref}
            className="cta-glow"
            style={{
              background: G,
              color: '#fff',
              padding: '15px 44px',
              fontSize: 12,
              letterSpacing: '0.28em',
              textTransform: 'uppercase' as const,
              textDecoration: 'none',
              fontWeight: 700,
              borderRadius: 2,
              transition: 'background 0.25s, box-shadow 0.25s',
              boxShadow: `0 0 24px ${GB(0.35)}, 0 0 60px ${GB(0.15)}`,
            }}
          >
            {primaryCtaLabel}
          </a>
          <a
            href={secondaryCtaHref}
            style={{
              border: '1px solid rgba(240,234,224,0.22)',
              color: 'rgba(240,234,224,0.7)',
              padding: '15px 44px',
              fontSize: 12,
              letterSpacing: '0.28em',
              textTransform: 'uppercase' as const,
              textDecoration: 'none',
              borderRadius: 2,
              transition: 'all 0.25s',
            }}
          >
            {secondaryCtaLabel}
          </a>
        </div>
      </div>

      {/* ── Right: Video with parallax ── */}
      <div className="hero-video" style={{ position: 'relative', overflow: 'hidden' }}>
        <video
          ref={heroVideoRef}
          autoPlay
          muted
          playsInline
          src={heroVideos[videoIdx]}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '115%',
            objectFit: 'cover',
            objectPosition: '50% 35%',
            transform: `translateY(${scrollY * 0.25}px)`,
            willChange: 'transform',
          }}
        />

        {/* Gradient overlays */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(8,8,8,1) 0%, rgba(8,8,8,0.3) 30%, transparent 100%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(8,8,8,0.8) 0%, transparent 40%)', pointerEvents: 'none' }} />
      </div>

      {/* Corporate Profile CTA — above stats bar */}
      <a
        href="#video-showcase"
        onClick={(e: React.MouseEvent) => {
          e.preventDefault()
          document.getElementById('video-showcase')?.scrollIntoView({ behavior: 'smooth' })
        }}
        className="corporate-cta"
        style={{
          position: 'absolute', bottom: 100, right: 48, zIndex: 25,
          display: 'inline-flex', alignItems: 'center', gap: 10,
          background: G,
          color: '#fff',
          padding: '16px 32px',
          fontSize: 12,
          fontWeight: 800,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          textDecoration: 'none',
          fontFamily: "'BentonSans', sans-serif",
          borderRadius: 2,
          boxShadow: '0 4px 20px rgba(198,122,60,0.4)',
          transition: 'all 0.3s ease',
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff" stroke="none"><polygon points="8,5 20,12 8,19" /></svg>
        Corporate Profile
      </a>

      {/* ── Stats bar — glassmorphism ── */}
      <div className="hero-stats" style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 20,
        background: 'rgba(8,8,8,0.5)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(240,234,224,0.06)',
        display: 'grid',
        gridTemplateColumns: `repeat(${stats.length}, 1fr)`,
      }}>
        {stats.map((s: any, i: number) => (
          <div key={i} style={{
            padding: '24px 0',
            textAlign: 'center',
            borderRight: i < stats.length - 1 ? '1px solid rgba(240,234,224,0.06)' : 'none',
          }}>
            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 30, fontWeight: 600, color: CR, lineHeight: 1,
            }}>
              <AnimatedCount target={s.target} prefix={s.prefix} suffix={s.suffix} />
            </p>
            <p style={{
              fontSize: 11, letterSpacing: '0.28em',
              color: 'rgba(240,234,224,0.72)', marginTop: 8,
              fontFamily: "'BentonSans', sans-serif",
            }}>
              {s.label}
            </p>
          </div>
        ))}
      </div>

      {/* ── Inline keyframes ── */}
      <style jsx global>{`
        @keyframes fadeUpWord {
          from { opacity: 0; transform: translateY(28px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes blink { 50% { opacity: 0; } }
        .cta-glow { animation: ctaGlowPulse 2.8s ease-in-out infinite; }
        @keyframes ctaGlowPulse {
          0%, 100% { box-shadow: 0 0 24px rgba(198,122,60,0.35), 0 0 60px rgba(198,122,60,0.15); }
          50% { box-shadow: 0 0 32px rgba(198,122,60,0.55), 0 0 80px rgba(198,122,60,0.25); }
        }
        .cta-glow:hover {
          background: ${GL} !important;
          box-shadow: 0 0 40px rgba(198,122,60,0.6), 0 0 100px rgba(198,122,60,0.3) !important;
        }
        .fade-up-1 { opacity: 0; animation: fadeUpWord 0.7s cubic-bezier(.22,1,.36,1) 0.15s forwards; }
        .fade-up-2 { opacity: 0; animation: fadeUpWord 0.7s cubic-bezier(.22,1,.36,1) 0.95s forwards; }
        .fade-up-3 { opacity: 0; animation: fadeUpWord 0.7s cubic-bezier(.22,1,.36,1) 1.2s forwards; }
        .fade-up-4 { opacity: 0; animation: fadeUpWord 0.7s cubic-bezier(.22,1,.36,1) 1.5s forwards; }
      `}</style>
    </section>
  )
}
