'use client'

import React from 'react'
import { storyblokEditable } from '@storyblok/react'
import { G, CR, B, GB } from '@/lib/tokens'

const ICONS: Record<string, React.ReactNode> = {
  phone: <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />,
  email: <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></>,
  location: <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></>,
  clock: <><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></>,
  calendar: <><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></>,
  chat: <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />,
}

export default function InfoCard({ blok }: { blok: any }) {
  const icon = blok?.icon || 'none'
  const label = blok?.label || ''
  const value = blok?.value || ''
  const href = blok?.href

  const inner = (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: 20,
      padding: '24px 28px',
      background: 'rgba(240,234,224,0.02)',
      border: `1px solid ${B}`,
      transition: 'border-color 0.3s, transform 0.3s',
      cursor: href ? 'pointer' : 'default',
      height: '100%',
    }}>
      {icon !== 'none' && (
        <div style={{
          width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: GB(0.08), border: `1px solid ${GB(0.15)}`, flexShrink: 0,
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={G} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            {ICONS[icon]}
          </svg>
        </div>
      )}
      <div>
        {label && <p style={{ fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: G, fontWeight: 700, marginBottom: 6 }}>{label}</p>}
        <p style={{ fontSize: 15, color: CR, lineHeight: 1.6, fontWeight: 400, letterSpacing: '0.02em' }}>{value}</p>
      </div>
    </div>
  )

  return (
    <div {...storyblokEditable(blok)}>
      {href ? (
        <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
          {inner}
        </a>
      ) : inner}
    </div>
  )
}
