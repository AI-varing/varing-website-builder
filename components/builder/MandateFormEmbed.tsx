'use client'

import React from 'react'
import { storyblokEditable } from '@storyblok/react'
import { CR, B } from '@/lib/tokens'
import MandateForm from '@/components/MandateForm'
import ConfidentialBadge from './ConfidentialBadge'

export default function MandateFormEmbed({ blok }: { blok: any }) {
  const heading = blok?.heading || 'Submit a Mandate'
  const subheading = blok?.subheading
  const showBadge = blok?.showConfidentialBadge ?? true
  const successMessage = blok?.successMessage

  return (
    <section
      {...storyblokEditable(blok)}
      style={{ padding: '64px 24px 96px', borderTop: `1px solid ${B}` }}
    >
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          {showBadge && (
            <div style={{ marginBottom: 20 }}>
              <ConfidentialBadge blok={{ component: 'confidential_badge', label: 'Confidential & Discreet', icon: 'lock' }} />
            </div>
          )}
          <h2 style={{
            fontFamily: "'BentonSans', sans-serif",
            fontSize: 'clamp(28px, 3vw, 40px)',
            fontWeight: 900, letterSpacing: '0.06em', textTransform: 'uppercase',
            color: CR, margin: '0 0 12px',
          }}>{heading}</h2>
          {subheading && (
            <p style={{
              fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic',
              fontSize: 'clamp(15px, 1.5vw, 18px)',
              color: 'rgba(240,234,224,0.7)', maxWidth: 580, margin: '0 auto', lineHeight: 1.5,
            }}>{subheading}</p>
          )}
        </div>
        <MandateForm successMessage={successMessage} />
      </div>
    </section>
  )
}
