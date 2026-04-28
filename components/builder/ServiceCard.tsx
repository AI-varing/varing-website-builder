'use client'

import React from 'react'
import { storyblokEditable } from '@storyblok/react'
import { G, CR, B, GB } from '@/lib/tokens'

const ICONS: Record<string, React.ReactNode> = {
  shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
  chart: <><line x1="12" y1="20" x2="12" y2="10" /><line x1="18" y1="20" x2="18" y2="4" /><line x1="6" y1="20" x2="6" y2="16" /></>,
  handshake: <path d="M14 9l-3 3 3 3M9 9l3 3-3 3M2 12h20" />,
  document: <><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></>,
  target: <><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></>,
}

export default function ServiceCard({ blok }: { blok: any }) {
  const icon = blok?.icon || 'none'
  const title = blok?.title || ''
  const description = blok?.description || ''
  const bullets = (blok?.bullets || '').split('\n').map((s: string) => s.trim()).filter(Boolean)

  return (
    <div
      {...storyblokEditable(blok)}
      style={{
        padding: '36px 32px',
        background: 'rgba(240,234,224,0.02)',
        border: `1px solid ${B}`,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {icon !== 'none' && (
        <div style={{
          width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: GB(0.08), border: `1px solid ${GB(0.15)}`, marginBottom: 24,
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={G} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            {ICONS[icon]}
          </svg>
        </div>
      )}
      <h3 style={{
        fontFamily: "'BentonSans', sans-serif",
        fontSize: 16, fontWeight: 900, letterSpacing: '0.08em', textTransform: 'uppercase',
        color: CR, marginBottom: 14,
      }}>{title}</h3>
      {description && (
        <p style={{ fontSize: 14, lineHeight: 1.7, color: 'rgba(240,234,224,0.65)', marginBottom: bullets.length ? 16 : 0 }}>{description}</p>
      )}
      {bullets.length > 0 && (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8, marginTop: 'auto' }}>
          {bullets.map((b: string, i: number) => (
            <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13, color: 'rgba(240,234,224,0.7)' }}>
              <span style={{ color: G, marginTop: 2 }}>›</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
