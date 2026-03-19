'use client'

import React from 'react'
import { storyblokEditable } from '@storyblok/react'
import { G, CR, BG2, B } from '@/lib/tokens'
import { SPECIALTIES } from '@/lib/data'
import { useMarquee } from '@/lib/animations'

export default function SpecialtiesStrip({ blok }: { blok?: any }) {
  const specialties = blok?.specialties?.length ? blok.specialties : SPECIALTIES
  const speed = blok?.speed || 50
  const { trackRef, onMouseEnter, onMouseLeave } = useMarquee(speed)

  return (
    <section onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} style={{ background: BG2, borderBottom: `1px solid ${B}`, borderTop: `1px solid ${B}`, overflow: 'hidden', cursor: 'default' }}>
      <div ref={trackRef} style={{ display: 'inline-flex', willChange: 'transform' }}>
        {[...specialties, ...specialties].map((item: any, i: number) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 20, padding: '40px 60px', borderRight: `1px solid ${B}`, width: 420, flexShrink: 0 }}>
            <div style={{ paddingTop: 4, flexShrink: 0 }}>
              <div style={{ width: 24, height: 2, background: G, marginBottom: 12 }} />
              <p style={{ fontSize: 9, letterSpacing: '0.36em', color: G, fontWeight: 700 }}>0{(i % specialties.length) + 1}</p>
            </div>
            <div>
              <h3 style={{ fontSize: 12, fontWeight: 700, color: CR, marginBottom: 8, letterSpacing: '0.1em', textTransform: 'uppercase', lineHeight: 1.4, whiteSpace: 'nowrap' }}>{item.title}</h3>
              <p style={{ fontSize: 11.5, lineHeight: 1.75, color: 'rgba(240,234,224,0.36)', maxWidth: 280 }}>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
