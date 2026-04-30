'use client'

import React from 'react'
import { storyblokEditable } from '@storyblok/react'
import { BG2, B, CR } from '@/lib/tokens'
import { PRESS_LOGOS } from '@/lib/data'
import { useMarquee } from '@/lib/animations'

export default function PressLogos({ blok }: { blok?: any }) {
  // Source of truth is local PRESS_LOGOS (lib/data.ts) — Storyblok-uploaded copies were
  // monochrome/empty PNGs. Re-add Storyblok override later if CMS-driven editing is needed.
  const logos = PRESS_LOGOS
  const speed = blok?.speed || 55
  const { trackRef, onMouseEnter, onMouseLeave } = useMarquee(speed)

  const tripled = [...logos, ...logos, ...logos]
  const full = [...tripled, ...tripled]

  return (
    <section {...(blok ? storyblokEditable(blok) : {})} style={{ background: BG2, borderBottom: `1px solid ${B}`, overflow: 'hidden' }}>
      <div style={{ padding: '32px 0 24px', textAlign: 'center' }}>
        <p style={{ fontSize: 11, letterSpacing: '0.42em', textTransform: 'uppercase', color: 'rgba(240,234,224,0.5)' }}>In the News</p>
      </div>
      <div
        ref={trackRef}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        style={{ display: 'flex', width: 'max-content', alignItems: 'center', willChange: 'transform', paddingBottom: 28, cursor: 'default' }}
      >
        {full.map((logo: any, i: number) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 260, flexShrink: 0, borderRight: `1px solid ${B}`, height: 72 }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: logo.tile ? CR : 'transparent',
              padding: logo.tile ? '8px 18px' : 0,
              borderRadius: logo.tile ? 4 : 0,
              height: logo.tile ? 56 : '100%',
              minWidth: logo.tile ? 168 : 0,
            }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logo.url}
                alt={logo.name}
                style={{ maxHeight: Math.round(logo.height * 1.4), width: 'auto', maxWidth: logo.tile ? 188 : 210, opacity: 0.95, objectFit: 'contain' }}
                onError={(e) => {
                  const el = e.currentTarget
                  el.style.display = 'none'
                  const txt = el.nextElementSibling as HTMLElement | null
                  if (txt) txt.style.display = 'block'
                }}
              />
              <span style={{ display: 'none', fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: logo.tile ? '#2A1508' : 'rgba(240,234,224,0.5)', fontWeight: 700, whiteSpace: 'nowrap', textAlign: 'center', padding: '0 12px' }}>{logo.name}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
