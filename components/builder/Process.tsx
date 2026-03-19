'use client'

import React from 'react'
import { storyblokEditable } from '@storyblok/react'
import { G, CR, B } from '@/lib/tokens'
import { useFadeUp } from '@/lib/animations'
import { Label } from '@/lib/ui'
import { PROCESS_STEPS, PROCESS_ICONS } from '@/lib/data'

export default function Process({ blok }: { blok?: any }) {
  const heading = blok?.heading || 'How We Execute'
  const steps = blok?.steps?.length ? blok.steps : PROCESS_STEPS
  const processFade = useFadeUp(0)

  return (
    <section id="process" style={{ background: '#050505', borderTop: `1px solid ${B}`, borderBottom: `1px solid ${B}`, position: 'relative', overflow: 'hidden' }}>
      <div ref={processFade.ref} style={{ maxWidth: 1300, margin: '0 auto', padding: '96px 56px', ...processFade.style }}>
        <div style={{ marginBottom: 52 }}>
          <Label>Our Process</Label>
          <h2 style={{ fontFamily: "'BentonSans', sans-serif", fontSize: 'clamp(1.6rem,3.2vw,2.8rem)', fontWeight: 700, color: CR, lineHeight: 1.15, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {heading}
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 2 }}>
          {steps.map((step: any, i: number) => (
            <div key={i} style={{ background: '#0e0e0e', padding: '36px 30px', borderTop: `2px solid ${i === 0 ? G : B}` }}>
              <div style={{ marginBottom: 18, opacity: 0.6 }}>
                {PROCESS_ICONS[i]}
              </div>
              <p style={{ fontSize: 9, letterSpacing: '0.3em', color: 'rgba(41,82,163,0.5)', marginBottom: 16, fontWeight: 700 }}>STEP 0{i + 1}</p>
              <h4 style={{ fontSize: 11, fontWeight: 700, color: CR, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10, lineHeight: 1.4 }}>{step.title}</h4>
              <p style={{ fontSize: 11.5, lineHeight: 1.8, color: 'rgba(240,234,224,0.4)', fontFamily: "'BentonSans', sans-serif" }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
