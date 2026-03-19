'use client'

import React from 'react'
import { storyblokEditable } from '@storyblok/react'
import { G, CR, BG2, B } from '@/lib/tokens'
import { useFadeUp } from '@/lib/animations'
import { Label } from '@/lib/ui'

export default function About({ blok }: { blok?: any }) {
  const heading = blok?.heading || 'Land Is\nOur Language'
  const paragraph1 = blok?.paragraph1 || "Since 2007, Varing Marketing Group has specialized in the transactions others avoid \u2014 court-ordered sales, strata wind-ups, receivership properties, and complex land assemblies across BC\u2019s Lower Mainland and Fraser Valley."
  const paragraph2 = blok?.paragraph2 || 'Rated <strong style="color:#F0EAE0;font-weight:700">#1 Agent in BC and Canada</strong> by Homelife International from 2013\u20132024, our team delivers the legal expertise, market intelligence, and network to move complex assets at maximum value.'
  const quoteText = blok?.quoteText || "\u201CIt\u2019s not just the bottom line anymore, it\u2019s all the lines that matter.\u201D"
  const quoteAuthor = blok?.quoteAuthor || 'Joe Varing, Principal'
  const ctaLabel = blok?.ctaLabel || 'Work With Us'
  const ctaHref = blok?.ctaHref || '#contact'
  const aboutFade = useFadeUp(0)

  return (
    <section id="about" style={{ background: BG2, borderTop: `1px solid ${B}`, overflow: 'hidden' }}>
      <div ref={aboutFade.ref} style={{ maxWidth: 1400, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', alignItems: 'stretch', ...aboutFade.style }}>
        {/* Left — text */}
        <div style={{ padding: '96px 72px 96px 56px', borderRight: `1px solid ${B}`, position: 'relative', zIndex: 2 }}>
          <Label>About</Label>
          <h2 style={{ fontFamily: "'BentonSans', sans-serif", fontSize: 'clamp(1.8rem,3vw,2.8rem)', fontWeight: 700, color: CR, lineHeight: 1.15, marginBottom: 24, textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'pre-line' }}>
            {heading}
          </h2>
          <p style={{ fontSize: 13, lineHeight: 1.9, color: 'rgba(240,234,224,0.48)', marginBottom: 16 }}>{paragraph1}</p>
          <p style={{ fontSize: 13, lineHeight: 1.9, color: 'rgba(240,234,224,0.48)', marginBottom: 36 }} dangerouslySetInnerHTML={{ __html: paragraph2 }} />
          <blockquote style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 15, fontStyle: 'italic', color: 'rgba(240,234,224,0.32)', lineHeight: 1.75, paddingLeft: 20, borderLeft: `2px solid ${B}`, margin: '0 0 40px' }}>
            {quoteText}
            <span style={{ fontFamily: "'BentonSans', sans-serif", fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: G, fontStyle: 'normal', display: 'block', marginTop: 10 }}>{quoteAuthor}</span>
          </blockquote>
          <a href={ctaHref} style={{ display: 'inline-flex', alignItems: 'center', gap: 10, color: G, textDecoration: 'none', fontSize: 10, letterSpacing: '0.28em', textTransform: 'uppercase', fontWeight: 700, borderBottom: `1px solid ${G}`, paddingBottom: 3 }}>
            {ctaLabel} &nbsp;&rarr;
          </a>
        </div>

        {/* Right — aerial image panel */}
        <div style={{ position: 'relative', overflow: 'hidden', minHeight: 600 }}>
          {/* Aerial city/land image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1200&q=80&auto=format"
            alt="Aerial view of city and land"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 40%', filter: 'grayscale(100%) brightness(0.35) contrast(1.2)' }}
          />
          {/* Dark overlay for depth */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(8,8,8,0.7) 0%, rgba(8,8,8,0.3) 50%, rgba(8,8,8,0.6) 100%)' }} />
          {/* Subtle blue tint overlay */}
          <div style={{ position: 'absolute', inset: 0, background: `rgba(41,82,163,0.08)`, mixBlendMode: 'screen' }} />
          {/* Dot-grid pattern */}
          <div style={{ position: 'absolute', inset: 0, backgroundImage: `radial-gradient(circle, rgba(41,82,163,0.12) 1px, transparent 1px)`, backgroundSize: '32px 32px', pointerEvents: 'none' }} />
          {/* Watermark text */}
          <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', fontSize: 'clamp(3rem,8vw,7rem)', fontFamily: "'BentonSans', sans-serif", fontWeight: 900, color: 'rgba(240,234,224,0.05)', letterSpacing: '0.08em', lineHeight: 1.1, pointerEvents: 'none', userSelect: 'none', textTransform: 'uppercase', whiteSpace: 'nowrap', textAlign: 'center' }}>
            LAND IS<br />OUR<br />LANGUAGE
          </div>
          {/* Blue accent line at bottom */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: `linear-gradient(to right, transparent, ${G}, transparent)`, opacity: 0.5 }} />
          {/* Left edge fade to blend with text */}
          <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to right, ${BG2} 0%, transparent 15%)` }} />
        </div>
      </div>
    </section>
  )
}
