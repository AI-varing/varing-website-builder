'use client'

import React from 'react'
import { storyblokEditable } from '@storyblok/react'
import { BG2, B } from '@/lib/tokens'
import { PRESS_LOGOS } from '@/lib/data'
import { useMarquee } from '@/lib/animations'

export default function PressLogos({ blok }: { blok?: any }) {
  const logos = blok?.logos?.length ? blok.logos : PRESS_LOGOS
  const speed = blok?.speed || 55
  const { trackRef, onMouseEnter, onMouseLeave } = useMarquee(speed)

  // Triple the set, then double for seamless loop (useMarquee resets at scrollWidth/2)
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
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logo.url}
              alt={logo.name}
              style={{ maxHeight: Math.round(logo.height * 1.4), width: 'auto', maxWidth: 210, opacity: 0.9, objectFit: 'contain' }}
              onError={(e) => {
                const el = e.currentTarget
                el.style.display = 'none'
                const txt = el.nextElementSibling as HTMLElement | null
                if (txt) txt.style.display = 'block'
              }}
            />
            <span style={{ display: 'none', fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(240,234,224,0.5)', fontWeight: 700, whiteSpace: 'nowrap', textAlign: 'center', padding: '0 12px' }}>{logo.name}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
