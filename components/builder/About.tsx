'use client'

import React from 'react'
import { storyblokEditable } from '@storyblok/react'
import { G, CR, B, GRAD_SECTION } from '@/lib/tokens'
import { useFadeUp, useParallax } from '@/lib/animations'
import { Label } from '@/lib/ui'

export default function About({ blok }: { blok?: any }) {
  const heading = blok?.heading || 'House\nOf Land'
  const paragraph1 = blok?.paragraph1 || "Since 2007, Varing Marketing Group has specialized in the transactions others avoid \u2014 court-ordered sales, strata wind-ups, receivership properties, and complex land assemblies across BC\u2019s Lower Mainland and Fraser Valley."
  const paragraph2 = blok?.paragraph2 || 'Rated <strong style="color:#F0EAE0;font-weight:700">#1 Agent in BC and Canada</strong> by Homelife International from 2014\u20132025, our team delivers the legal expertise, market intelligence, and network to move complex assets at maximum value.'
  const quoteText = blok?.quoteText || "\u201CIn land, there\u2019s no substitute for knowing the market better than anyone else in the room.\u201D"
  const quoteAuthor = blok?.quoteAuthor || 'Joe Varing, Principal'
  const ctaLabel = blok?.ctaLabel || 'Work With Us'
  const ctaHref = blok?.ctaHref || '#contact'
  const aboutFade = useFadeUp(0)
  const parallaxRef = useParallax(0.2)

  return (
    <section id="about" style={{ background: GRAD_SECTION(0.35), borderTop: `1px solid ${B}`, overflow: 'hidden' }}>
      <div ref={aboutFade.ref} style={{ maxWidth: 1400, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', alignItems: 'stretch', ...aboutFade.style }}>
        {/* Left — text */}
        <div style={{ padding: '96px 72px 96px 56px', borderRight: `1px solid ${B}`, position: 'relative', zIndex: 2 }}>
          <Label>About</Label>
          <h2 style={{ fontFamily: "'BentonSans', sans-serif", fontSize: 'clamp(1.8rem,3vw,2.8rem)', fontWeight: 900, color: CR, lineHeight: 1.15, marginBottom: 24, textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'pre-line' }}>
            {heading}
          </h2>
          <p style={{ fontSize: 15, lineHeight: 1.9, color: 'rgba(240,234,224,0.75)', marginBottom: 16 }}>{paragraph1}</p>
          <p style={{ fontSize: 15, lineHeight: 1.9, color: 'rgba(240,234,224,0.75)', marginBottom: 36 }} dangerouslySetInnerHTML={{ __html: paragraph2 }} />
          <blockquote style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 15, fontStyle: 'italic', color: 'rgba(240,234,224,0.72)', lineHeight: 1.75, paddingLeft: 20, borderLeft: `2px solid ${B}`, margin: '0 0 40px' }}>
            {quoteText}
            <span style={{ fontFamily: "'BentonSans', sans-serif", fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: G, fontStyle: 'normal', display: 'block', marginTop: 10 }}>{quoteAuthor}</span>
          </blockquote>
          <a href={ctaHref} style={{ display: 'inline-flex', alignItems: 'center', gap: 10, color: G, textDecoration: 'none', fontSize: 12, letterSpacing: '0.28em', textTransform: 'uppercase', fontWeight: 700, borderBottom: `1px solid ${G}`, paddingBottom: 3 }}>
            {ctaLabel} &nbsp;&rarr;
          </a>
        </div>

        {/* Right — aerial image panel */}
        <div style={{ position: 'relative', overflow: 'hidden', minHeight: 600 }}>
          {/* Aerial city/land image with parallax */}
          <div ref={parallaxRef} style={{ position: 'absolute', inset: '-15% 0', width: '100%', height: '130%' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/vancouver-waterfront.jpg"
              alt="Vancouver waterfront marina"
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 40%' }}
            />
          </div>
          {/* Subtle dark edge overlay only */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(8,8,8,0.15) 0%, transparent 50%, rgba(8,8,8,0.1) 100%)' }} />
          {/* Watermark text */}
          <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', fontSize: 'clamp(3rem,8vw,7rem)', fontFamily: "'BentonSans', sans-serif", fontWeight: 900, color: 'rgba(240,234,224,0.05)', letterSpacing: '0.08em', lineHeight: 1.1, pointerEvents: 'none', userSelect: 'none', textTransform: 'uppercase', whiteSpace: 'nowrap', textAlign: 'center' }}>
            LEADERS<br />IN<br />LAND
          </div>
          {/* Blue accent line at bottom */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: `linear-gradient(to right, transparent, ${G}, transparent)`, opacity: 0.5 }} />
          {/* Left edge fade to blend with text */}
          <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to right, #0a0e1a 0%, transparent 15%)` }} />
        </div>
      </div>
    </section>
  )
}
