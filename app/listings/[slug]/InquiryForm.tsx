'use client'

import { useRef } from 'react'

const G  = '#C67A3C'
const GL = '#D4943E'
const CR = '#F0EAE0'
const BG = '#080808'
const B  = 'rgba(240,234,224,0.08)'

const INPUT_STYLE: React.CSSProperties = {
  width: '100%',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(240,234,224,0.12)',
  padding: '13px 16px',
  fontSize: 15,
  color: CR,
  fontFamily: "'BentonSans', sans-serif",
  outline: 'none',
  transition: 'border-color 0.3s ease',
}

const LABEL_STYLE: React.CSSProperties = {
  fontSize: 10,
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  color: 'rgba(240,234,224,0.45)',
  display: 'block',
  marginBottom: 8,
  fontWeight: 600,
}

interface InquiryFormProps {
  address: string
  price: number | null
  ctaLabel: string
  brochureUrl: string | null
  phone: string
  email: string
}

export default function InquiryForm({ address, price, ctaLabel, brochureUrl, phone, email }: InquiryFormProps) {
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const firstName = fd.get('firstName') as string
    const lastName = fd.get('lastName') as string
    const userEmail = fd.get('email') as string
    const userPhone = fd.get('phone') as string
    const message = fd.get('message') as string

    const subject = encodeURIComponent(`Listing Inquiry: ${address}`)
    const body = encodeURIComponent(
      `Name: ${firstName} ${lastName}\nEmail: ${userEmail}\nPhone: ${userPhone || 'N/A'}\n\n${message}`
    )

    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`
  }

  const focusStyle = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = G
  }
  const blurStyle = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = 'rgba(240,234,224,0.12)'
  }

  return (
    <div style={{
      border: '1px solid rgba(240,234,224,0.1)',
      background: '#0c0c0c',
      padding: '40px 36px',
    }}>
      {/* Header */}
      <div style={{ marginBottom: 28, paddingBottom: 24, borderBottom: `1px solid ${B}` }}>
        <span style={{
          fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase',
          color: G, display: 'block', marginBottom: 12, fontWeight: 700,
        }}>
          Interested in This Property?
        </span>
        <p style={{
          fontFamily: "'BentonSans', sans-serif",
          fontSize: 20, fontWeight: 900, color: CR, lineHeight: 1.3,
          textTransform: 'uppercase', letterSpacing: '0.02em',
        }}>
          {address}
        </p>
        {price && (
          <p style={{ fontSize: 16, color: 'rgba(240,234,224,0.5)', marginTop: 8 }}>
            ${price.toLocaleString()}
          </p>
        )}
      </div>

      {/* Form */}
      <form ref={formRef} onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label style={LABEL_STYLE}>First Name *</label>
            <input
              type="text" name="firstName" required
              style={INPUT_STYLE}
              onFocus={focusStyle} onBlur={blurStyle}
            />
          </div>
          <div>
            <label style={LABEL_STYLE}>Last Name *</label>
            <input
              type="text" name="lastName" required
              style={INPUT_STYLE}
              onFocus={focusStyle} onBlur={blurStyle}
            />
          </div>
        </div>

        <div>
          <label style={LABEL_STYLE}>Email *</label>
          <input
            type="email" name="email" required
            style={INPUT_STYLE}
            onFocus={focusStyle} onBlur={blurStyle}
          />
        </div>

        <div>
          <label style={LABEL_STYLE}>Phone</label>
          <input
            type="tel" name="phone"
            style={INPUT_STYLE}
            onFocus={focusStyle} onBlur={blurStyle}
          />
        </div>

        <div>
          <label style={LABEL_STYLE}>Message</label>
          <textarea
            name="message" rows={4}
            defaultValue={`I'm interested in ${address}. Please contact me with more details.`}
            style={{
              ...INPUT_STYLE,
              resize: 'none',
              lineHeight: 1.7,
            }}
            onFocus={focusStyle as any}
            onBlur={blurStyle as any}
          />
        </div>

        <button
          type="submit"
          style={{
            width: '100%', background: G, color: BG,
            padding: '16px', fontSize: 12,
            letterSpacing: '0.24em', textTransform: 'uppercase',
            fontWeight: 900, border: 'none', cursor: 'pointer',
            fontFamily: "'BentonSans', sans-serif",
            marginTop: 4,
            transition: 'background 0.3s ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = GL }}
          onMouseLeave={(e) => { e.currentTarget.style.background = G }}
        >
          {ctaLabel}
        </button>
      </form>

      {/* Brochure download */}
      {brochureUrl && (
        <a
          href={brochureUrl} target="_blank" rel="noopener noreferrer"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 10, marginTop: 14, width: '100%',
            border: `1px solid ${G}`, padding: '14px',
            fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase',
            color: G, textDecoration: 'none', fontWeight: 600,
            transition: 'background 0.3s ease, color 0.3s ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = G; e.currentTarget.style.color = BG }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = G }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Download Brochure
        </a>
      )}

      {/* Direct contact */}
      <div style={{ marginTop: 28, paddingTop: 24, borderTop: `1px solid ${B}` }}>
        <p style={{
          fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase',
          color: 'rgba(240,234,224,0.3)', marginBottom: 14, fontWeight: 600,
        }}>
          Or contact directly
        </p>
        <a
          href={`tel:${phone.replace(/[^+\d]/g, '')}`}
          style={{
            display: 'block', fontSize: 15, color: CR,
            textDecoration: 'none', marginBottom: 8, fontWeight: 500,
            transition: 'color 0.2s ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = G }}
          onMouseLeave={(e) => { e.currentTarget.style.color = CR }}
        >
          {phone}
        </a>
        <a
          href={`mailto:${email}`}
          style={{
            display: 'block', fontSize: 15, color: 'rgba(240,234,224,0.55)',
            textDecoration: 'none', fontWeight: 400,
            transition: 'color 0.2s ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = G }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(240,234,224,0.55)' }}
        >
          {email}
        </a>
      </div>
    </div>
  )
}
