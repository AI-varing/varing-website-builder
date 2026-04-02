'use client'

import React from 'react'
import { storyblokEditable } from '@storyblok/react'
import { G, GL, CR, B, GB, GRAD_SECTION } from '@/lib/tokens'
import { useFadeUp, useStaggerReveal } from '@/lib/animations'
import { Label } from '@/lib/ui'
import { PROCESS_STEPS, PROCESS_ICONS } from '@/lib/data'

export default function Process({ blok }: { blok?: any }) {
  const heading = blok?.heading || 'How We Execute'
  const steps = blok?.steps?.length ? blok.steps : PROCESS_STEPS
  const processFade = useFadeUp(0)
  const stagger = useStaggerReveal(0.12)

  return (
    <section id="process" {...(blok ? storyblokEditable(blok) : {})} style={{ background: GRAD_SECTION(0.2), borderTop: `1px solid ${B}`, borderBottom: `1px solid ${B}`, position: 'relative', overflow: 'hidden' }}>
      {/* Background texture */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="https://www.varinggroup.com/wp-content/uploads/SRY-AR_2146_L-76APR2018-WMLCOS-_COS9635.jpg" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.04, filter: 'grayscale(100%)', pointerEvents: 'none' }} />
      {/* Watermark */}
      <div style={{ position: 'absolute', right: -40, top: '50%', transform: 'translateY(-50%) rotate(-90deg)', fontSize: 'clamp(6rem,14vw,12rem)', fontFamily: "'BentonSans', sans-serif", fontWeight: 900, color: 'rgba(240,234,224,0.015)', letterSpacing: '0.1em', pointerEvents: 'none', userSelect: 'none', whiteSpace: 'nowrap' }}>
        PROCESS
      </div>

      <div ref={processFade.ref} style={{ maxWidth: 1300, margin: '0 auto', padding: '96px 56px', position: 'relative', zIndex: 1, ...processFade.style }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <Label>Our Process</Label>
          <h2 style={{ fontFamily: "'BentonSans', sans-serif", fontSize: 'clamp(1.6rem,3.2vw,2.8rem)', fontWeight: 900, color: CR, lineHeight: 1.15, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {heading}
          </h2>
        </div>

        {/* Timeline layout — 2 rows of 3 */}
        <div ref={stagger.ref}>
          {/* Connecting line */}
          <div style={{ position: 'relative' }}>
            {/* Row 1 */}
            <div className="process-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0, marginBottom: 2 }}>
              {steps.slice(0, 3).map((step: any, i: number) => (
                <div key={i} className="process-card" style={{
                  background: '#0c0c0c',
                  padding: '40px 32px 36px',
                  borderRight: i < 2 ? `1px solid ${B}` : 'none',
                  borderBottom: `1px solid ${B}`,
                  position: 'relative',
                  transition: 'background 0.4s ease, transform 0.3s ease',
                  ...stagger.getItemStyle(i),
                }}>
                  {/* Step number ring */}
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24,
                  }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: '50%',
                      border: `2px solid ${G}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 14, fontWeight: 700, color: G,
                      fontFamily: "'Cormorant Garamond', serif",
                      flexShrink: 0,
                      boxShadow: `0 0 16px ${GB(0.15)}`,
                    }}>
                      {String(i + 1).padStart(2, '0')}
                    </div>
                    {/* Connecting dash */}
                    {i < 2 && (
                      <div style={{ flex: 1, height: 1, background: `linear-gradient(to right, ${GB(0.3)}, ${GB(0.05)})` }} />
                    )}
                  </div>

                  {/* Icon */}
                  <div style={{ marginBottom: 14, opacity: 0.5 }}>
                    {PROCESS_ICONS[i]}
                  </div>

                  <h4 style={{ fontSize: 12, fontWeight: 700, color: CR, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10, lineHeight: 1.4 }}>{step.title}</h4>
                  <p style={{ fontSize: 16, lineHeight: 1.85, color: 'rgba(240,234,224,0.72)', fontFamily: "'BentonSans', sans-serif" }}>{step.desc}</p>

                  {/* Bottom accent on hover */}
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: G, opacity: 0, transition: 'opacity 0.4s ease' }} className="process-accent" />
                </div>
              ))}
            </div>

            {/* Row 2 */}
            <div className="process-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0 }}>
              {steps.slice(3, 6).map((step: any, i: number) => (
                <div key={i + 3} className="process-card" style={{
                  background: '#0c0c0c',
                  padding: '40px 32px 36px',
                  borderRight: i < 2 ? `1px solid ${B}` : 'none',
                  position: 'relative',
                  transition: 'background 0.4s ease, transform 0.3s ease',
                  ...stagger.getItemStyle(i + 3),
                }}>
                  {/* Step number ring */}
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24,
                  }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: '50%',
                      border: `2px solid ${G}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 14, fontWeight: 700, color: G,
                      fontFamily: "'Cormorant Garamond', serif",
                      flexShrink: 0,
                      boxShadow: `0 0 16px ${GB(0.15)}`,
                    }}>
                      {String(i + 4).padStart(2, '0')}
                    </div>
                    {i < 2 && (
                      <div style={{ flex: 1, height: 1, background: `linear-gradient(to right, ${GB(0.3)}, ${GB(0.05)})` }} />
                    )}
                  </div>

                  <div style={{ marginBottom: 14, opacity: 0.5 }}>
                    {PROCESS_ICONS[i + 3]}
                  </div>

                  <h4 style={{ fontSize: 12, fontWeight: 700, color: CR, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10, lineHeight: 1.4 }}>{step.title}</h4>
                  <p style={{ fontSize: 16, lineHeight: 1.85, color: 'rgba(240,234,224,0.72)', fontFamily: "'BentonSans', sans-serif" }}>{step.desc}</p>

                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: G, opacity: 0, transition: 'opacity 0.4s ease' }} className="process-accent" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .process-card:hover {
          background: #111 !important;
        }
        .process-card:hover .process-accent {
          opacity: 1 !important;
        }
      `}</style>
    </section>
  )
}
