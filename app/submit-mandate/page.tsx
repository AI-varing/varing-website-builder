'use client'

import React, { useState } from 'react'
import Nav from '@/components/builder/Nav'
import Footer from '@/components/builder/Footer'
import { G, GL, CR, BG, B, GB } from '@/lib/tokens'
import { track } from '@/lib/analytics'

const HERO_IMG = 'https://www.varinggroup.com/wp-content/uploads/SRY-AR_2146_L-76APR2018-WMLCOS-_COS9635.jpg'

type Form = {
  assetType: string
  status: string
  city: string
  address: string
  estValue: string
  documents: string[]
  timeline: string
  notes: string
  fullName: string
  role: string
  firm: string
  email: string
  phone: string
}

const ASSET_TYPES = [
  'Development land',
  'Income-producing property',
  'Commercial / industrial',
  'Residential',
  'Business / operating company',
  'Other',
]

const STATUSES = [
  'Court-ordered sale',
  'Foreclosure',
  'Receivership',
  'Lender-directed',
  'Distressed / confidential',
  'Pre-enforcement',
]

const DOC_OPTIONS = [
  'Title',
  'Appraisal',
  'Lease information',
  'Financials',
  'Court order',
  'Environmental reports',
  'Survey',
  'Offering package',
]

const TIMELINES = [
  'Immediate (0–30 days)',
  'Near-term (30–60 days)',
  '60–90 days',
  'Flexible',
]

const ROLES = [
  'Lender',
  'Lawyer',
  'Receiver / Trustee',
  'Mortgage broker',
  'Realtor',
  'Asset owner',
  'Other',
]

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '14px 18px',
  background: 'rgba(240,234,224,0.04)',
  border: `1px solid ${B}`,
  color: CR,
  fontFamily: "'BentonSans', sans-serif",
  fontSize: 14,
  letterSpacing: '0.04em',
  transition: 'border-color 0.3s',
}

const labelStyle: React.CSSProperties = {
  fontSize: 10,
  letterSpacing: '0.22em',
  textTransform: 'uppercase',
  color: 'rgba(240,234,224,0.5)',
  fontWeight: 500,
  marginBottom: 8,
  display: 'block',
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: '12px 18px',
        background: active ? GB(0.18) : 'rgba(240,234,224,0.03)',
        border: `1px solid ${active ? G : B}`,
        color: active ? CR : 'rgba(240,234,224,0.7)',
        fontFamily: "'BentonSans', sans-serif",
        fontSize: 12,
        letterSpacing: '0.06em',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        textAlign: 'left',
      }}
    >
      {children}
    </button>
  )
}

export default function SubmitMandatePage() {
  const [step, setStep] = useState(1)
  const totalSteps = 5
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState<Form>({
    assetType: '',
    status: '',
    city: '',
    address: '',
    estValue: '',
    documents: [],
    timeline: '',
    notes: '',
    fullName: '',
    role: '',
    firm: '',
    email: '',
    phone: '',
  })

  const update = <K extends keyof Form>(field: K, value: Form[K]) =>
    setForm(prev => ({ ...prev, [field]: value }))

  const toggleDoc = (doc: string) => {
    setForm(prev => ({
      ...prev,
      documents: prev.documents.includes(doc)
        ? prev.documents.filter(d => d !== doc)
        : [...prev.documents, doc],
    }))
  }

  const canProceed = () => {
    if (step === 1) return !!form.assetType && !!form.status
    if (step === 2) return !!form.city
    if (step === 3) return true
    if (step === 4) return !!form.timeline
    if (step === 5) return !!form.fullName && !!form.email && !!form.role
    return false
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch('/api/mandate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Submission failed')
      track('mandate_submitted', {
        asset_type: form.assetType,
        status: form.status,
        role: form.role,
        timeline: form.timeline,
      })
      setSubmitted(true)
    } catch (e) {
      setError('Something went wrong. Please email info@targetedadvisors.ca directly.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ background: BG, minHeight: '100vh' }}>
      <Nav />

      {/* Hero */}
      <section style={{
        position: 'relative',
        height: 360,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={HERO_IMG}
          alt=""
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'grayscale(40%)',
          }}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(8,8,8,0.55) 0%, rgba(8,8,8,0.88) 100%)',
        }} />
        <div style={{ position: 'relative', textAlign: 'center', zIndex: 1, padding: '0 24px' }} className="fade-up">
          {/* Confidential badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            padding: '8px 16px',
            background: GB(0.1),
            border: `1px solid ${GB(0.35)}`,
            marginBottom: 24,
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={G} strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2"/>
              <path d="M7 11V7a5 5 0 0110 0v4"/>
            </svg>
            <span style={{ fontSize: 9, letterSpacing: '0.32em', textTransform: 'uppercase', color: G, fontWeight: 700 }}>
              Confidential &amp; Discreet
            </span>
          </div>
          <h1 style={{
            fontFamily: "'BentonSans', sans-serif",
            fontSize: 'clamp(32px, 4.5vw, 54px)',
            fontWeight: 900,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: CR,
            margin: '0 0 16px',
          }}>
            Submit a Mandate
          </h1>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: 'italic',
            fontSize: 'clamp(16px, 1.6vw, 20px)',
            color: 'rgba(240,234,224,0.75)',
            maxWidth: 620,
            margin: '0 auto',
            lineHeight: 1.5,
          }}>
            For lenders, lawyers, receivers, and trustees with distressed real estate or court-directed sales.
          </p>
        </div>
      </section>

      {/* Form */}
      <section style={{
        position: 'relative',
        padding: '64px 24px 96px',
      }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          {submitted ? (
            <div style={{
              padding: '64px 32px',
              background: 'rgba(240,234,224,0.02)',
              border: `1px solid ${B}`,
              textAlign: 'center',
            }}>
              <div style={{ fontSize: 42, color: G, marginBottom: 18 }}>&#10003;</div>
              <h2 style={{ fontFamily: "'BentonSans', sans-serif", fontSize: 22, fontWeight: 900, letterSpacing: '0.08em', textTransform: 'uppercase', color: CR, marginBottom: 12 }}>
                Mandate Received
              </h2>
              <p style={{ fontSize: 14, color: 'rgba(240,234,224,0.7)', maxWidth: 460, margin: '0 auto', lineHeight: 1.6 }}>
                Our advisory team will review the details and reach out within one business day. Sensitive material is handled in confidence.
              </p>
            </div>
          ) : (
            <>
              {/* Progress */}
              <div style={{ marginBottom: 40 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <span style={{ fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(240,234,224,0.5)', fontWeight: 600 }}>
                    Step {step} of {totalSteps}
                  </span>
                  <span style={{ fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: G, fontWeight: 600 }}>
                    {Math.round((step / totalSteps) * 100)}%
                  </span>
                </div>
                <div style={{ height: 2, background: B, position: 'relative' }}>
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    width: `${(step / totalSteps) * 100}%`,
                    background: G,
                    transition: 'width 0.4s cubic-bezier(.22,1,.36,1)',
                  }} />
                </div>
              </div>

              <div style={{
                padding: '40px 36px',
                background: 'rgba(240,234,224,0.02)',
                border: `1px solid ${B}`,
              }}>
                {step === 1 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                    <div>
                      <label style={labelStyle}>Asset Type</label>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10 }}>
                        {ASSET_TYPES.map(t => (
                          <Chip key={t} active={form.assetType === t} onClick={() => update('assetType', t)}>{t}</Chip>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label style={labelStyle}>Current Status</label>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10 }}>
                        {STATUSES.map(s => (
                          <Chip key={s} active={form.status === s} onClick={() => update('status', s)}>{s}</Chip>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                    <div>
                      <label style={labelStyle}>City / Region</label>
                      <input type="text" required value={form.city} onChange={e => update('city', e.target.value)} placeholder="Surrey, Langley, Vancouver…" style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Address (optional)</label>
                      <input type="text" value={form.address} onChange={e => update('address', e.target.value)} placeholder="Civic address or PID" style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Approximate Value or Debt Exposure</label>
                      <input type="text" value={form.estValue} onChange={e => update('estValue', e.target.value)} placeholder="$2M – $5M, or specific figure" style={inputStyle} />
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div>
                    <label style={labelStyle}>Documents Available</label>
                    <p style={{ fontSize: 13, color: 'rgba(240,234,224,0.5)', marginBottom: 16, lineHeight: 1.6 }}>
                      Select what you can share — anything missing, our team can help assemble.
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10 }}>
                      {DOC_OPTIONS.map(d => (
                        <Chip key={d} active={form.documents.includes(d)} onClick={() => toggleDoc(d)}>{d}</Chip>
                      ))}
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                    <div>
                      <label style={labelStyle}>Timeline</label>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10 }}>
                        {TIMELINES.map(t => (
                          <Chip key={t} active={form.timeline === t} onClick={() => update('timeline', t)}>{t}</Chip>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label style={labelStyle}>Anything Else We Should Know</label>
                      <textarea
                        value={form.notes}
                        onChange={e => update('notes', e.target.value)}
                        rows={5}
                        placeholder="Court approval status, prior marketing efforts, sensitivities, etc."
                        style={{ ...inputStyle, resize: 'vertical', minHeight: 120 }}
                      />
                    </div>
                  </div>
                )}

                {step === 5 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                      <div>
                        <label style={labelStyle}>Full Name *</label>
                        <input type="text" required value={form.fullName} onChange={e => update('fullName', e.target.value)} style={inputStyle} />
                      </div>
                      <div>
                        <label style={labelStyle}>Your Role *</label>
                        <select
                          required
                          value={form.role}
                          onChange={e => update('role', e.target.value)}
                          style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}
                        >
                          <option value="">Select…</option>
                          {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label style={labelStyle}>Firm / Organization</label>
                      <input type="text" value={form.firm} onChange={e => update('firm', e.target.value)} style={inputStyle} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                      <div>
                        <label style={labelStyle}>Email *</label>
                        <input type="email" required value={form.email} onChange={e => update('email', e.target.value)} style={inputStyle} />
                      </div>
                      <div>
                        <label style={labelStyle}>Phone</label>
                        <input type="tel" value={form.phone} onChange={e => update('phone', e.target.value)} style={inputStyle} />
                      </div>
                    </div>
                    <p style={{ fontSize: 11, color: 'rgba(240,234,224,0.4)', lineHeight: 1.6, marginTop: 4 }}>
                      Submissions are reviewed by our advisory team only. We do not share details with third parties without consent.
                    </p>
                  </div>
                )}

                {error && (
                  <div style={{ marginTop: 24, padding: '12px 16px', background: 'rgba(220,80,60,0.08)', border: '1px solid rgba(220,80,60,0.3)', color: '#e89888', fontSize: 13 }}>
                    {error}
                  </div>
                )}

                {/* Nav buttons */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 36, paddingTop: 24, borderTop: `1px solid ${B}` }}>
                  <button
                    type="button"
                    onClick={() => setStep(s => Math.max(1, s - 1))}
                    disabled={step === 1}
                    style={{
                      padding: '12px 24px',
                      background: 'transparent',
                      border: `1px solid ${B}`,
                      color: step === 1 ? 'rgba(240,234,224,0.25)' : CR,
                      fontFamily: "'BentonSans', sans-serif",
                      fontSize: 11,
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                      fontWeight: 700,
                      cursor: step === 1 ? 'not-allowed' : 'pointer',
                    }}
                  >
                    ← Back
                  </button>
                  {step < totalSteps ? (
                    <button
                      type="button"
                      onClick={() => setStep(s => s + 1)}
                      disabled={!canProceed()}
                      style={{
                        padding: '14px 32px',
                        background: canProceed() ? G : 'rgba(198,122,60,0.3)',
                        border: 'none',
                        color: BG,
                        fontFamily: "'BentonSans', sans-serif",
                        fontSize: 11,
                        letterSpacing: '0.18em',
                        textTransform: 'uppercase',
                        fontWeight: 900,
                        cursor: canProceed() ? 'pointer' : 'not-allowed',
                        transition: 'background 0.2s',
                      }}
                      onMouseEnter={e => { if (canProceed()) e.currentTarget.style.background = GL }}
                      onMouseLeave={e => { if (canProceed()) e.currentTarget.style.background = G }}
                    >
                      Continue →
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={!canProceed() || submitting}
                      style={{
                        padding: '14px 32px',
                        background: canProceed() && !submitting ? G : 'rgba(198,122,60,0.3)',
                        border: 'none',
                        color: BG,
                        fontFamily: "'BentonSans', sans-serif",
                        fontSize: 11,
                        letterSpacing: '0.18em',
                        textTransform: 'uppercase',
                        fontWeight: 900,
                        cursor: canProceed() && !submitting ? 'pointer' : 'not-allowed',
                      }}
                    >
                      {submitting ? 'Submitting…' : 'Submit Mandate'}
                    </button>
                  )}
                </div>
              </div>

              {/* Trust footer */}
              <div style={{ marginTop: 32, textAlign: 'center', fontSize: 11, color: 'rgba(240,234,224,0.4)', letterSpacing: '0.04em', lineHeight: 1.7 }}>
                Prefer to talk first? Call <a href="tel:+16048325766" style={{ color: G, textDecoration: 'none' }}>604.832.5766</a> or email <a href="mailto:info@targetedadvisors.ca" style={{ color: G, textDecoration: 'none' }}>info@targetedadvisors.ca</a>
              </div>
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
