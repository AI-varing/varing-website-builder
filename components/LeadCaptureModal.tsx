'use client'

import React, { useState, useEffect } from 'react'
import { G, GL, CR, BG, B, GB } from '@/lib/tokens'
import { track } from '@/lib/analytics'

type Props = {
  open: boolean
  onClose: () => void
  title: string
  subtitle?: string
  ctaLabel?: string
  successMessage?: string
  endpoint: string
  eventName?: string
}

export default function LeadCaptureModal({
  open, onClose, title, subtitle,
  ctaLabel = 'Send Me the PDF',
  successMessage = 'Sent. The PDF will land in your inbox shortly.',
  endpoint,
  eventName,
}: Props) {
  const [form, setForm] = useState({ fullName: '', email: '', firm: '', role: '' })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) {
      setForm({ fullName: '', email: '', firm: '', role: '' })
      setSubmitted(false)
      setError(null)
    }
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  const handleSubmit = async () => {
    if (!form.fullName || !form.email) {
      setError('Name and email are required.')
      return
    }
    setSubmitting(true); setError(null)
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('failed')
      if (eventName) track(eventName, { has_firm: !!form.firm })
      setSubmitted(true)
    } catch {
      setError('Something went wrong. Please email info@targetedadvisors.ca directly.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(8,8,8,0.85)',
        backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 480,
          background: '#1a1a1a',
          border: `2px solid ${G}`,
          padding: '40px 36px',
          position: 'relative',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: `0 20px 60px rgba(0,0,0,0.6), 0 0 40px ${GB(0.25)}`,
          borderRadius: 4,
        }}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: 'absolute', top: 14, right: 14,
            width: 32, height: 32,
            background: 'transparent', border: 'none',
            color: 'rgba(240,234,224,0.5)',
            cursor: 'pointer', fontSize: 22,
            lineHeight: 1,
          }}
        >×</button>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: 38, color: G, marginBottom: 14 }}>✓</div>
            <h3 style={{
              fontFamily: "'BentonSans', sans-serif",
              fontSize: 18, fontWeight: 900, letterSpacing: '0.06em',
              textTransform: 'uppercase', color: CR, margin: '0 0 12px',
            }}>Sent</h3>
            <p style={{ fontSize: 14, color: 'rgba(240,234,224,0.7)', lineHeight: 1.6, margin: 0 }}>
              {successMessage}
            </p>
          </div>
        ) : (
          <>
            <h3 style={{
              fontFamily: "'BentonSans', sans-serif",
              fontSize: 18, fontWeight: 900, letterSpacing: '0.06em',
              textTransform: 'uppercase', color: CR, margin: '0 0 8px',
            }}>{title}</h3>
            {subtitle && (
              <p style={{
                fontSize: 13, color: 'rgba(240,234,224,0.6)',
                lineHeight: 1.6, margin: '0 0 24px',
              }}>{subtitle}</p>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { key: 'fullName', label: 'Full Name *', type: 'text', required: true },
                { key: 'email', label: 'Email *', type: 'email', required: true },
                { key: 'firm', label: 'Firm / Company', type: 'text' },
                { key: 'role', label: 'Role (e.g. Lender, Lawyer, Receiver)', type: 'text' },
              ].map(f => (
                <div key={f.key}>
                  <label style={{
                    display: 'block', fontSize: 9, letterSpacing: '0.22em',
                    textTransform: 'uppercase', color: 'rgba(240,234,224,0.5)',
                    fontWeight: 600, marginBottom: 6,
                  }}>{f.label}</label>
                  <input
                    type={f.type}
                    required={f.required}
                    value={(form as any)[f.key]}
                    onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    style={{
                      width: '100%', padding: '11px 14px',
                      background: 'rgba(240,234,224,0.04)',
                      border: `1px solid ${B}`,
                      color: CR,
                      fontFamily: "'BentonSans', sans-serif",
                      fontSize: 13,
                    }}
                  />
                </div>
              ))}
            </div>
            {error && (
              <div style={{
                marginTop: 14, padding: '10px 14px',
                background: 'rgba(220,80,60,0.08)',
                border: '1px solid rgba(220,80,60,0.3)',
                color: '#e89888', fontSize: 12,
              }}>{error}</div>
            )}
            <button
              onClick={handleSubmit}
              disabled={submitting}
              style={{
                width: '100%', marginTop: 22,
                padding: '14px 24px',
                background: submitting ? 'rgba(198,122,60,0.4)' : G,
                color: BG, border: 'none',
                fontFamily: "'BentonSans', sans-serif",
                fontSize: 11, fontWeight: 900,
                letterSpacing: '0.18em', textTransform: 'uppercase',
                cursor: submitting ? 'not-allowed' : 'pointer',
              }}
              onMouseEnter={e => { if (!submitting) e.currentTarget.style.background = GL }}
              onMouseLeave={e => { if (!submitting) e.currentTarget.style.background = G }}
            >
              {submitting ? 'Sending…' : ctaLabel}
            </button>
            <p style={{
              fontSize: 10, color: 'rgba(240,234,224,0.35)',
              marginTop: 14, lineHeight: 1.6, textAlign: 'center',
            }}>
              We don&apos;t share your details with third parties.
            </p>
          </>
        )}
      </div>
    </div>
  )
}
