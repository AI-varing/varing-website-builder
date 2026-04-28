'use client'

import React from 'react'
import { storyblokEditable } from '@storyblok/react'
import { CR, B, G, GB } from '@/lib/tokens'
import ChatDemo from '@/app/ai/ChatDemo'

export default function ChatDemoEmbed({ blok }: { blok: any }) {
  const heading = blok?.heading
  const subheading = blok?.subheading
  const prompts = (blok?.suggestedPrompts || '').split('\n').map((s: string) => s.trim()).filter(Boolean)

  return (
    <section
      {...storyblokEditable(blok)}
      style={{ padding: '64px 24px 96px', borderTop: `1px solid ${B}` }}
    >
      <div style={{ maxWidth: 980, margin: '0 auto' }}>
        {(heading || subheading) && (
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            {heading && (
              <h2 style={{
                fontFamily: "'BentonSans', sans-serif",
                fontSize: 'clamp(24px, 2.4vw, 32px)',
                fontWeight: 900, letterSpacing: '0.06em', textTransform: 'uppercase',
                color: CR, margin: '0 0 12px',
              }}>{heading}</h2>
            )}
            {subheading && (
              <p style={{
                fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic',
                fontSize: 'clamp(15px, 1.5vw, 18px)',
                color: 'rgba(240,234,224,0.7)', maxWidth: 620, margin: '0 auto', lineHeight: 1.5,
              }}>{subheading}</p>
            )}
          </div>
        )}
        <ChatDemo autoPlay />
        {prompts.length > 0 && (
          <div style={{ marginTop: 32 }}>
            <p style={{ fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: GB(0.7), fontWeight: 600, marginBottom: 12, textAlign: 'center' }}>
              Try asking
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
              {prompts.map((p: string, i: number) => (
                <span key={i} style={{
                  padding: '8px 16px',
                  background: 'rgba(240,234,224,0.04)',
                  border: `1px solid ${B}`,
                  fontSize: 12, color: 'rgba(240,234,224,0.75)',
                  fontFamily: "'BentonSans', sans-serif",
                }}>{p}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
