'use client'

import React from 'react'
import { storyblokEditable } from '@storyblok/react'
import { G, GL, CR, B, GB, GRAD_SECTION } from '@/lib/tokens'
import { useFadeUp, useStaggerReveal } from '@/lib/animations'
import { Label } from '@/lib/ui'
import { PROCESS_STEPS, PROCESS_ICONS } from '@/lib/data'

function ProcessCard({ step, index, lastInRow, isBottomRow }: { step: any; index: number; lastInRow: boolean; isBottomRow: boolean }) {
  return (
    <div className="process-card" style={{
      background: '#0c0c0c',
      padding: '40px 32px 36px',
      borderRight: !lastInRow ? `1px solid ${B}` : 'none',
      borderBottom: isBottomRow ? 'none' : `1px solid ${B}`,
      position: 'relative',
      overflow: 'hidden',
      transition: 'background 0.4s ease, transform 0.3s ease',
      minHeight: 280,
    }}>
      {step.bg && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={step.bg} alt="" style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          objectFit: 'cover',
          opacity: 0.22,
          filter: 'grayscale(40%) brightness(0.7) sepia(0.4) hue-rotate(-15deg)',
          pointerEvents: 'none',
        }} />
      )}
      {/* Dark overlay so text remains readable */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(8,8,8,0.55) 0%, rgba(8,8,8,0.88) 100%)', pointerEvents: 'none' }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Step number ring */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
          <div style={{
            width: 44, height: 44, borderRadius: '50%',
            border: `2px solid ${G}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, fontWeight: 700, color: G,
            fontFamily: "'Cormorant Garamond', serif",
            flexShrink: 0,
            boxShadow: `0 0 16px ${GB(0.15)}`,
            background: 'rgba(8,8,8,0.6)',
          }}>
            {String(index + 1).padStart(2, '0')}
          </div>
          {!lastInRow && (
            <div style={{ flex: 1, height: 1, background: `linear-gradient(to right, ${GB(0.3)}, ${GB(0.05)})` }} />
          )}
        </div>

        {/* Icon */}
        <div style={{ marginBottom: 14, opacity: 0.55 }}>
          {PROCESS_ICONS[index]}
        </div>

        <h4 style={{ fontSize: 12, fontWeight: 700, color: CR, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10, lineHeight: 1.4 }}>
          {step.title}
        </h4>
        <p style={{ fontSize: 16, lineHeight: 1.85, color: 'rgba(240,234,224,0.78)', fontFamily: "'BentonSans', sans-serif" }}>
          {step.desc}
        </p>
      </div>

      {/* Bottom accent on hover */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: G, opacity: 0, transition: 'opacity 0.4s ease', zIndex: 2 }} className="process-accent" />
    </div>
  )
}

export default function Process({ blok }: { blok?: any }) {
  const heading = blok?.heading || 'How We Execute'
  // Merge: use Storyblok-provided steps if available, but layer in the bg image
  // from PROCESS_STEPS (by index) since Storyblok schema doesn't have a bg field yet.
  const sourceSteps = blok?.steps?.length ? blok.steps : PROCESS_STEPS
  const steps = sourceSteps.map((s: any, i: number) => ({
    ...s,
    bg: s.bg || PROCESS_STEPS[i]?.bg,
  }))
  const processFade = useFadeUp(0)
  const stagger = useStaggerReveal(0.12)

  return (
    <section
      id="process"
      {...(blok ? storyblokEditable(blok) : {})}
      style={{ background: GRAD_SECTION(0.2), borderTop: `1px solid ${B}`, borderBottom: `1px solid ${B}`, position: 'relative', overflow: 'hidden' }}
    >
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

        <div ref={stagger.ref}>
          {/* Row 1 */}
          <div className="process-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0, marginBottom: 2 }}>
            {steps.slice(0, 3).map((step: any, i: number) => (
              <div key={i} style={stagger.getItemStyle(i)}>
                <ProcessCard step={step} index={i} lastInRow={i === 2} isBottomRow={false} />
              </div>
            ))}
          </div>

          {/* Row 2 */}
          <div className="process-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0 }}>
            {steps.slice(3, 6).map((step: any, i: number) => (
              <div key={i + 3} style={stagger.getItemStyle(i + 3)}>
                <ProcessCard step={step} index={i + 3} lastInRow={i === 2} isBottomRow={true} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .process-card:hover {
          background: #111 !important;
        }
        .process-card:hover img {
          opacity: 0.32 !important;
          transition: opacity 0.4s ease;
        }
        .process-card:hover :global(.process-accent) {
          opacity: 1 !important;
        }
      `}</style>
    </section>
  )
}
