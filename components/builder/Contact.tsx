'use client'

import React from 'react'
import { storyblokEditable } from '@storyblok/react'
import { G, CR, BG, B, GRAD_SECTION } from '@/lib/tokens'
import { useFadeFromLeft, useFadeFromRight } from '@/lib/animations'
import { Label } from '@/lib/ui'

const DEFAULT_STAT_BOXES = [
  { value: '20+', label: 'Court-Ordered Files' },
  { value: 'BC-Wide', label: 'Coverage Area' },
  { value: '2013\u201324', label: '#1 In BC & Canada' },
  { value: '19+', label: 'Years Experience' },
]

export default function Contact({ blok }: { blok?: any }) {
  const heading = blok?.heading || 'Ready to Talk?'
  const subheading = blok?.subheading || "Whether you\u2019re a lender, developer, or landowner \u2014 our team responds within 2 hours."
  const phone = blok?.phone || '+1.604.565.3478'
  const email = blok?.email || 'info@varinggroup.com'
  const officeAddress = blok?.officeAddress || '360\u20133033 Immel St, Abbotsford, BC V2S 6S2'
  const statBoxes = blok?.statBoxes?.length ? blok.statBoxes : DEFAULT_STAT_BOXES
  const quote = blok?.quote || '\u201CThe right advisor makes all the difference in a complex transaction.\u201D'
  const ctaLeft = useFadeFromLeft(0)
  const ctaRight = useFadeFromRight(0.15)

  return (
    <section id="contact" style={{ background: GRAD_SECTION(0.3), borderTop: `1px solid ${B}` }}>
      <div style={{ maxWidth: 1300, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
        <div ref={ctaLeft.ref} style={{ padding: '96px 56px', borderRight: `1px solid ${B}`, ...ctaLeft.style }}>
          <Label>Get in Touch</Label>
          <h2 style={{ fontFamily: "'BentonSans', sans-serif", fontSize: 'clamp(1.8rem,3vw,2.8rem)', fontWeight: 900, color: CR, lineHeight: 1.15, marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {heading}
          </h2>
          <p style={{ fontSize: 15, lineHeight: 1.85, color: 'rgba(240,234,224,0.5)', marginBottom: 48, maxWidth: 380 }}>
            {subheading}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <a href={`tel:${phone.replace(/[^+\d]/g, '')}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: `1px solid ${B}`, padding: '20px 24px', textDecoration: 'none' }}>
              <div>
                <p style={{ fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(240,234,224,0.5)', marginBottom: 6 }}>Phone</p>
                <p style={{ fontSize: 16, color: CR }}>{phone}</p>
              </div>
              <span style={{ color: G }}>&rarr;</span>
            </a>
            <a href={`mailto:${email}`} className="cta-glow" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: G, padding: '20px 24px', textDecoration: 'none' }}>
              <div>
                <p style={{ fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(8,8,8,0.45)', marginBottom: 6 }}>Email</p>
                <p style={{ fontSize: 15, color: BG, fontWeight: 700 }}>{email}</p>
              </div>
              <span style={{ color: BG }}>&rarr;</span>
            </a>
            <div style={{ border: `1px solid ${B}`, padding: '20px 24px' }}>
              <p style={{ fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(240,234,224,0.5)', marginBottom: 6 }}>Office</p>
              <p style={{ fontSize: 15, color: 'rgba(240,234,224,0.55)', lineHeight: 1.5 }}>{officeAddress}</p>
            </div>
          </div>
        </div>
        <div ref={ctaRight.ref} style={{ padding: '96px 56px', ...ctaRight.style }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, marginBottom: 56 }}>
            {statBoxes.map((x: any, i: number) => (
              <div key={i} className="contact-card" style={{ background: '#0e0e0e', padding: '28px 22px', transition: 'transform 0.3s ease' }}>
                <p style={{ fontFamily: "'BentonSans', sans-serif", fontSize: 20, fontWeight: 900, color: G, lineHeight: 1, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{x.value}</p>
                <p style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(240,234,224,0.5)' }}>{x.label}</p>
              </div>
            ))}
          </div>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.1rem,1.8vw,1.45rem)', fontWeight: 300, fontStyle: 'italic', color: 'rgba(240,234,224,0.5)', lineHeight: 1.7 }}>
            {quote}
          </p>
        </div>
      </div>
    </section>
  )
}
