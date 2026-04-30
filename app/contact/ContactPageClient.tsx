'use client'

import React, { useState } from 'react'
import Nav from '@/components/builder/Nav'
import Footer from '@/components/builder/Footer'
import { G, GL, CR, BG, B, GB, GRAD_HERO } from '@/lib/tokens'

const HERO_IMG = 'https://www.varinggroup.com/wp-content/uploads/SRY-AR_2146_L-76APR2018-WMLCOS-_COS9635.jpg'

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
  color: 'rgba(240,234,224,0.4)',
  fontWeight: 500,
  marginBottom: 8,
  display: 'block',
}

const contactItems = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={G} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
      </svg>
    ),
    label: 'Phone',
    value: '+1.604.832.5766',
    href: 'tel:+16048325766',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={G} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
        <polyline points="22,6 12,13 2,6"/>
      </svg>
    ),
    label: 'Email',
    value: 'info@targetedadvisors.ca',
    href: 'mailto:info@targetedadvisors.ca',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={G} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
    ),
    label: 'Address',
    value: '5641 200 St, Langley, BC',
    href: 'https://maps.google.com/?q=5641+200+St+Langley+BC',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={G} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
    label: 'Hours',
    value: 'Monday \u2013 Friday, 9AM to 5PM',
    href: undefined,
  },
]

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const mailtoLink = `mailto:info@targetedadvisors.ca?subject=${encodeURIComponent(form.subject || 'Contact Form Submission')}&body=${encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\n\n${form.message}`
    )}`
    window.location.href = mailtoLink
    setSubmitted(true)
  }

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }))

  return (
    <div style={{ background: BG, minHeight: '100vh' }}>
      <Nav />

      {/* Hero */}
      <section style={{
        position: 'relative',
        height: 420,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={HERO_IMG}
          alt="Fraser Valley real estate"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center 40%',
            filter: 'grayscale(30%)',
          }}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(8,8,8,0.5) 0%, rgba(8,8,8,0.82) 100%)',
        }} />
        <div style={{ position: 'relative', textAlign: 'center', zIndex: 1 }} className="fade-up">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18, marginBottom: 20 }}>
            <div style={{ width: 48, height: 1, background: G }} />
            <span style={{ fontSize: 10, letterSpacing: '0.38em', textTransform: 'uppercase', color: GB(0.6), fontWeight: 500 }}>Get In Touch</span>
            <div style={{ width: 48, height: 1, background: G }} />
          </div>
          <h1 style={{
            fontFamily: "'BentonSans', sans-serif",
            fontSize: 'clamp(36px, 5vw, 60px)',
            fontWeight: 900,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: CR,
            margin: 0,
          }}>
            Contact Us
          </h1>
        </div>
      </section>

      {/* Main Content */}
      <section style={{
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Subtle background texture */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://www.varinggroup.com/wp-content/uploads/bg-meet-joe-soil.jpg"
          alt=""
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.03,
            filter: 'grayscale(100%)',
            pointerEvents: 'none',
          }}
        />
        {/* Radial glow accent */}
        <div style={{
          position: 'absolute',
          top: '20%',
          left: '0',
          width: '50%',
          height: '60%',
          background: `radial-gradient(ellipse at center, ${GB(0.05)} 0%, transparent 70%)`,
          pointerEvents: 'none',
        }} />
        <div className="contact-grid" style={{
          position: 'relative',
          maxWidth: 1200,
          margin: '0 auto',
          padding: '80px 56px',
          display: 'grid',
          gridTemplateColumns: '1fr 1.2fr',
          gap: 80,
        }}>
        {/* Left: Contact Info */}
        <div className="fade-up-1">
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
            <div style={{ width: 36, height: 1, background: G }} />
            <span style={{ fontSize: 10, letterSpacing: '0.38em', textTransform: 'uppercase', color: 'rgba(240,234,224,0.35)', fontWeight: 500 }}>Reach Out</span>
          </div>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(26px, 3vw, 36px)',
            fontWeight: 300,
            fontStyle: 'italic',
            color: CR,
            lineHeight: 1.3,
            marginBottom: 48,
          }}>
            We&apos;re here to help with <span style={{ color: G }}>development land, commercial, and investment</span> assets.
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            {contactItems.map((item) => (
              <div key={item.label} className="contact-card" style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 20,
                padding: '24px 28px',
                background: 'rgba(240,234,224,0.02)',
                border: `1px solid ${B}`,
                transition: 'transform 0.3s ease, border-color 0.3s',
                cursor: item.href ? 'pointer' : 'default',
              }}
              onClick={() => item.href && window.open(item.href, item.href.startsWith('http') ? '_blank' : '_self')}
              >
                <div style={{
                  width: 44,
                  height: 44,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: GB(0.08),
                  border: `1px solid ${GB(0.15)}`,
                  flexShrink: 0,
                }}>
                  {item.icon}
                </div>
                <div>
                  <p style={{ fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: G, fontWeight: 700, marginBottom: 6 }}>{item.label}</p>
                  <p style={{ fontSize: 15, color: CR, lineHeight: 1.6, fontWeight: 400, letterSpacing: '0.02em' }}>{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Contact Form */}
        <div className="fade-up-2">
          <div style={{
            padding: '48px 44px',
            background: 'rgba(240,234,224,0.02)',
            border: `1px solid ${B}`,
          }}>
            <h3 style={{
              fontFamily: "'BentonSans', sans-serif",
              fontSize: 18,
              fontWeight: 900,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: CR,
              marginBottom: 8,
            }}>
              Send Us a Message
            </h3>
            <p style={{ fontSize: 13, color: 'rgba(240,234,224,0.4)', letterSpacing: '0.04em', marginBottom: 36, lineHeight: 1.6 }}>
              Fill out the form below and our team will get back to you promptly.
            </p>

            {submitted ? (
              <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                <div style={{ fontSize: 48, marginBottom: 16, color: G }}>&#10003;</div>
                <p style={{ fontSize: 16, color: CR, fontWeight: 500, letterSpacing: '0.04em', marginBottom: 8 }}>Thank you for reaching out.</p>
                <p style={{ fontSize: 13, color: 'rgba(240,234,224,0.4)', letterSpacing: '0.04em' }}>Your email client should have opened with the message details.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                  <div>
                    <label style={labelStyle}>Full Name</label>
                    <input type="text" required value={form.name} onChange={update('name')} placeholder="John Smith" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Email</label>
                    <input type="email" required value={form.email} onChange={update('email')} placeholder="john@example.com" style={inputStyle} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                  <div>
                    <label style={labelStyle}>Phone Number</label>
                    <input type="tel" value={form.phone} onChange={update('phone')} placeholder="604-555-0000" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Subject</label>
                    <input type="text" value={form.subject} onChange={update('subject')} placeholder="Property Inquiry" style={inputStyle} />
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Message</label>
                  <textarea required value={form.message} onChange={update('message')} placeholder="Tell us about your property or inquiry..." rows={6} style={{ ...inputStyle, resize: 'vertical', minHeight: 140 }} />
                </div>

                <button
                  type="submit"
                  className="btn-gold cta-glow"
                  style={{
                    width: '100%',
                    padding: '16px 32px',
                    background: G,
                    color: BG,
                    fontFamily: "'BentonSans', sans-serif",
                    fontSize: 12,
                    fontWeight: 900,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'background 0.3s',
                    marginTop: 8,
                  }}
                >
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
