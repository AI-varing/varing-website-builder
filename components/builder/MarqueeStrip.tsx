'use client'

import React from 'react'
import { storyblokEditable } from '@storyblok/react'
import { MNAV, MTEXT } from '@/lib/tokens'
import { MARQUEE_ITEMS } from '@/lib/data'
import { useMarquee } from '@/lib/animations'

export default function MarqueeStrip({ blok }: { blok?: any }) {
  const items = blok?.items?.length ? blok.items.map((i: any) => i.text || i) : MARQUEE_ITEMS
  const speed = blok?.speed || 70
  const { trackRef, onMouseEnter, onMouseLeave } = useMarquee(speed)

  return (
    <section onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} style={{ background: MNAV, overflow: 'hidden', padding: '18px 0', borderBottom: '1px solid rgba(8,8,8,0.2)', cursor: 'default' }}>
      <div ref={trackRef} style={{ display: 'inline-flex', willChange: 'transform', whiteSpace: 'nowrap' }}>
        {[...items, ...items].map((item, k) => (
          <span key={k} style={{ fontSize: 10, letterSpacing: '0.46em', textTransform: 'uppercase', color: MTEXT, fontWeight: 700, padding: '0 60px', whiteSpace: 'nowrap', borderRight: '1px solid rgba(255,255,255,0.12)', flexShrink: 0 }}>
            {item}
          </span>
        ))}
      </div>
    </section>
  )
}
