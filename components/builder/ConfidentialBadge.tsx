'use client'

import React from 'react'
import { storyblokEditable } from '@storyblok/react'
import { G, GB } from '@/lib/tokens'

export default function ConfidentialBadge({ blok }: { blok: any }) {
  const label = blok?.label || 'Confidential & Discreet'
  const icon = blok?.icon || 'lock'
  return (
    <div
      {...storyblokEditable(blok)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 10,
        padding: '8px 16px',
        background: GB(0.1),
        border: `1px solid ${GB(0.35)}`,
      }}
    >
      {icon === 'lock' && (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={G} strokeWidth="2">
          <rect x="3" y="11" width="18" height="11" rx="2" />
          <path d="M7 11V7a5 5 0 0110 0v4" />
        </svg>
      )}
      {icon === 'shield' && (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={G} strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      )}
      <span style={{ fontSize: 9, letterSpacing: '0.32em', textTransform: 'uppercase', color: G, fontWeight: 700 }}>
        {label}
      </span>
    </div>
  )
}
