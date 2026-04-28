'use client'

import React from 'react'
import { storyblokEditable } from '@storyblok/react'
import Link from 'next/link'
import { CR, BG, B, G, GB } from '@/lib/tokens'

export default function Footer({ blok }: { blok?: any }) {
  const companyName = blok?.companyName || 'Targeted Advisors'
  const legalText = blok?.legalText || blok?.address || '5641 200 St, Langley, BC'
  const linkedinUrl = blok?.linkedinUrl || ''
  const address = blok?.address || ''
  const phone = blok?.phone || ''
  const email = blok?.email || ''
  return (
    <footer
      {...(blok ? storyblokEditable(blok) : {})}
      style={{ borderTop: `1px solid ${B}`, padding: '36px 56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: BG, flexWrap: 'wrap', gap: 16 }}
    >
      <span style={{ fontFamily: "'BentonSans', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: '0.22em', color: 'rgba(240,234,224,0.72)', textTransform: 'uppercase' }}>{companyName}</span>
      <p style={{ fontSize: 11, color: 'rgba(240,234,224,0.72)', letterSpacing: '0.04em', textAlign: 'center', flex: 1 }}>
        {legalText}
      </p>
      <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
        <Link href="/submit-mandate" style={{
          fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase',
          color: G, textDecoration: 'none', fontWeight: 700,
          padding: '8px 16px', border: `1px solid ${GB(0.4)}`,
          fontFamily: "'BentonSans', sans-serif",
        }}>Submit a Mandate</Link>
        {linkedinUrl && <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(240,234,224,0.72)', textDecoration: 'none' }}>LinkedIn</a>}
        <span style={{ fontSize: 11, color: 'rgba(240,234,224,0.72)' }}>&copy; {new Date().getFullYear()} {companyName}</span>
      </div>
    </footer>
  )
}
