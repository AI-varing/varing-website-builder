'use client'

import React from 'react'
import { storyblokEditable } from '@storyblok/react'
import { CR, BG, B } from '@/lib/tokens'

export default function Footer({ blok }: { blok?: any }) {
  const companyName = blok?.companyName || 'Varing Marketing Group'
  const legalText = blok?.legalText || 'Joe Varing Personal Real Estate Corporation Ltd. | Homelife Advantage Realty Ltd. | 5641 200 St, Langley, BC'
  const linkedinUrl = blok?.linkedinUrl || ''
  return (
    <footer style={{ borderTop: `1px solid ${B}`, padding: '36px 56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: BG, flexWrap: 'wrap', gap: 16 }}>
      <span style={{ fontFamily: "'BentonSans', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: '0.22em', color: 'rgba(240,234,224,0.5)', textTransform: 'uppercase' }}>{companyName}</span>
      <p style={{ fontSize: 11, color: 'rgba(240,234,224,0.5)', letterSpacing: '0.04em', textAlign: 'center', flex: 1 }}>
        {legalText}
      </p>
      <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
        {linkedinUrl && <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(240,234,224,0.5)', textDecoration: 'none' }}>LinkedIn</a>}
        <span style={{ fontSize: 11, color: 'rgba(240,234,224,0.5)' }}>&copy; {new Date().getFullYear()} {companyName}</span>
      </div>
    </footer>
  )
}
