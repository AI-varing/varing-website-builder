'use client'

import React, { useEffect, useRef, useState } from 'react'
import Nav from '@/components/builder/Nav'
import Footer from '@/components/builder/Footer'
import { G, GL, CR, BG, B, GB } from '@/lib/tokens'

/* ── Animated counter ── */
function CountUp({ target, suffix = '', prefix = '', duration = 2000 }: { target: number; suffix?: string; prefix?: string; duration?: number }) {
  const [val, setVal] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        let start = 0
        const step = target / (duration / 16)
        const id = setInterval(() => {
          start += step
          if (start >= target) { setVal(target); clearInterval(id) }
          else setVal(Math.floor(start))
        }, 16)
        obs.disconnect()
      }
    }, { threshold: 0.3 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [target, duration])
  return <span ref={ref}>{prefix}{val.toLocaleString()}{suffix}</span>
}

/* ── Typing animation for hero tagline ── */
function TypeWriter({ text, speed = 40 }: { text: string; speed?: number }) {
  const [displayed, setDisplayed] = useState('')
  const [started, setStarted] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setStarted(true); obs.disconnect() }
    }, { threshold: 0.5 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  useEffect(() => {
    if (!started) return
    let i = 0
    const id = setInterval(() => {
      i++
      setDisplayed(text.slice(0, i))
      if (i >= text.length) clearInterval(id)
    }, speed)
    return () => clearInterval(id)
  }, [started, text, speed])
  return <span ref={ref}>{displayed}<span style={{ opacity: displayed.length < text.length ? 1 : 0, transition: 'opacity 0.3s' }}>|</span></span>
}

const capabilities = [
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={G} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/>
      </svg>
    ),
    title: 'Instant Valuations',
    subtitle: 'BC Assessment + ArcGIS + Municipal Data',
    desc: 'Our AI scrapes BC Assessment in real-time, cross-references ArcGIS parcel data, and pulls municipal zoning to deliver property valuations in under 60 seconds \u2014 a process that used to take days.',
    stat: '60',
    statSuffix: 's',
    statLabel: 'Avg. valuation time',
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={G} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
      </svg>
    ),
    title: 'Zoning Intelligence',
    subtitle: '15+ Municipalities Covered',
    desc: 'Automated zoning lookups across Surrey, Langley, Burnaby, Coquitlam, Delta, Abbotsford, Chilliwack, Mission, and more. Instantly identifies OCP designations, ALR status, and creek setbacks.',
    stat: '15',
    statSuffix: '+',
    statLabel: 'Cities mapped',
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={G} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
      </svg>
    ),
    title: 'Market Pulse',
    subtitle: 'Comparable Sales + Trend Analysis',
    desc: 'AI-driven comparable sales analysis pulls recent transactions, calculates price-per-acre trends, and identifies market shifts \u2014 giving our clients a data edge before they make an offer.',
    stat: '600',
    statSuffix: '+',
    statLabel: 'Sites analyzed',
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={G} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
      </svg>
    ),
    title: 'Lead Capture Bot',
    subtitle: 'Automated Qualification + Email',
    desc: 'Our property assessment chatbot captures leads 24/7, qualifies them with AI-powered questions, and sends detailed property reports \u2014 all without human intervention.',
    stat: '24',
    statSuffix: '/7',
    statLabel: 'Always-on capture',
  },
]

const pipeline = [
  { step: '01', label: 'Address Input', desc: 'Client enters a property address into the bot or our internal tools.' },
  { step: '02', label: 'Data Aggregation', desc: 'AI queries BC Assessment, ArcGIS MapServer, municipal zoning APIs, and OpenStreetMap simultaneously.' },
  { step: '03', label: 'Analysis', desc: 'Cross-references assessed values, zoning designations, OCP land use, ALR status, creek setbacks, and recent sales.' },
  { step: '04', label: 'Insight Delivery', desc: 'Client receives a comprehensive property snapshot with value range, zoning, and strategic recommendations.' },
]

const techStack = [
  'BC Assessment Scraping',
  'ArcGIS MapServer Queries',
  'Municipal Open Data APIs',
  'OpenStreetMap Overpass',
  'BC ALR WFS Service',
  'AutoProp Integration',
  'OpenAI GPT Models',
  'Luma AI Image Generation',
  'SendGrid Automation',
  'Puppeteer Headless Capture',
]

export default function AIPage() {
  return (
    <div style={{ background: BG, minHeight: '100vh' }}>
      <Nav />

      {/* ── Hero ── */}
      <section style={{
        position: 'relative',
        minHeight: '85vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}>
        {/* Animated grid background */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(198,122,60,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(198,122,60,0.06) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          maskImage: 'radial-gradient(ellipse at 50% 50%, black 30%, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(ellipse at 50% 50%, black 30%, transparent 70%)',
        }} />
        {/* Radial glow */}
        <div style={{
          position: 'absolute',
          top: '30%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80vw',
          height: '80vw',
          maxWidth: 900,
          maxHeight: 900,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${GB(0.12)} 0%, ${GB(0.04)} 40%, transparent 70%)`,
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 900, padding: '0 40px' }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            padding: '10px 24px',
            background: 'rgba(240,234,224,0.03)',
            border: `1px solid ${GB(0.2)}`,
            marginBottom: 40,
            backdropFilter: 'blur(12px)',
          }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#34D399', boxShadow: '0 0 12px rgba(52,211,153,0.4)' }} />
            <span style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: GB(0.7), fontWeight: 600 }}>
              AI-Powered Intelligence
            </span>
          </div>

          <h1 style={{
            fontFamily: "'BentonSans', sans-serif",
            fontSize: 'clamp(40px, 6vw, 80px)',
            fontWeight: 900,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            color: CR,
            margin: '0 0 12px',
            lineHeight: 1.05,
          }}>
            VARING<span style={{ color: G }}>.AI</span>
          </h1>

          <p style={{
            fontFamily: "'BentonSans', sans-serif",
            fontSize: 'clamp(14px, 1.8vw, 20px)',
            fontWeight: 700,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'rgba(240,234,224,0.4)',
            marginBottom: 40,
          }}>
            Fast, Data-Driven Land Intelligence
          </p>

          <div style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(18px, 2.2vw, 26px)',
            fontStyle: 'italic',
            color: 'rgba(240,234,224,0.5)',
            lineHeight: 1.7,
            maxWidth: 700,
            margin: '0 auto 48px',
          }}>
            <TypeWriter text="We built proprietary AI tools that analyze properties in seconds, not days \u2014 giving our clients a decisive edge in BC\u2019s fastest-moving land market." speed={25} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 20, flexWrap: 'wrap' }}>
            <a href="#capabilities" style={{
              fontFamily: "'BentonSans', sans-serif",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: BG,
              background: G,
              padding: '16px 40px',
              textDecoration: 'none',
              transition: 'all 0.3s ease',
              boxShadow: `0 0 30px ${GB(0.2)}`,
            }}>
              See Our Capabilities
            </a>
            <a href="/contact" style={{
              fontFamily: "'BentonSans', sans-serif",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: CR,
              background: 'transparent',
              border: `1px solid ${B}`,
              padding: '16px 40px',
              textDecoration: 'none',
              transition: 'all 0.3s ease',
            }}>
              Request a Demo
            </a>
          </div>
        </div>
      </section>

      {/* ── Positioning Statement ── */}
      <section style={{
        borderTop: `1px solid ${B}`,
        borderBottom: `1px solid ${B}`,
        background: G,
        padding: '36px 56px',
        textAlign: 'center',
      }}>
        <p style={{
          fontFamily: "'BentonSans', sans-serif",
          fontSize: 'clamp(0.85rem, 1.6vw, 1.15rem)',
          fontWeight: 900,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: '#fff',
          lineHeight: 1.6,
          margin: 0,
          maxWidth: 900,
          marginLeft: 'auto',
          marginRight: 'auto',
        }}>
          While others wait for reports, our clients already have the data. AI doesn&apos;t replace our expertise &mdash; it accelerates it.
        </p>
      </section>

      {/* ── Capabilities Grid ── */}
      <section id="capabilities" style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: '100px 56px',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 72 }} className="fade-up">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18, marginBottom: 20 }}>
            <div style={{ width: 48, height: 1, background: G }} />
            <span style={{ fontSize: 10, letterSpacing: '0.38em', textTransform: 'uppercase', color: GB(0.6), fontWeight: 500 }}>What We Built</span>
            <div style={{ width: 48, height: 1, background: G }} />
          </div>
          <h2 style={{
            fontFamily: "'BentonSans', sans-serif",
            fontSize: 'clamp(28px, 3.5vw, 42px)',
            fontWeight: 900,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: CR,
            margin: 0,
          }}>
            AI Capabilities
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }}>
          {capabilities.map((c, i) => (
            <div
              key={c.title}
              className={`fade-up-${Math.min(i + 1, 4)}`}
              style={{
                padding: '48px 40px',
                background: 'rgba(240,234,224,0.015)',
                border: `1px solid ${B}`,
                transition: 'border-color 0.3s',
                display: 'flex',
                flexDirection: 'column',
                gap: 20,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div>
                  <div style={{
                    width: 60,
                    height: 60,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: GB(0.08),
                    border: `1px solid ${GB(0.15)}`,
                    marginBottom: 20,
                  }}>
                    {c.icon}
                  </div>
                  <h3 style={{
                    fontFamily: "'BentonSans', sans-serif",
                    fontSize: 18,
                    fontWeight: 900,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: CR,
                    marginBottom: 4,
                  }}>
                    {c.title}
                  </h3>
                  <p style={{
                    fontSize: 11,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: G,
                    fontWeight: 600,
                  }}>
                    {c.subtitle}
                  </p>
                </div>
                {/* Stat badge */}
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{
                    fontFamily: "'BentonSans', sans-serif",
                    fontSize: 36,
                    fontWeight: 900,
                    color: GB(0.25),
                    lineHeight: 1,
                  }}>
                    <CountUp target={parseInt(c.stat)} suffix={c.statSuffix} />
                  </div>
                  <p style={{ fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(240,234,224,0.25)', fontWeight: 600, marginTop: 4 }}>
                    {c.statLabel}
                  </p>
                </div>
              </div>
              <p style={{
                fontSize: 14,
                color: 'rgba(240,234,224,0.5)',
                lineHeight: 1.85,
                letterSpacing: '0.02em',
              }}>
                {c.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How It Works Pipeline ── */}
      <section style={{
        position: 'relative',
        borderTop: `1px solid ${B}`,
        borderBottom: `1px solid ${B}`,
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(198,122,60,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(198,122,60,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'relative',
          maxWidth: 1200,
          margin: '0 auto',
          padding: '100px 56px',
        }}>
          <div style={{ textAlign: 'center', marginBottom: 72 }} className="fade-up">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18, marginBottom: 20 }}>
              <div style={{ width: 48, height: 1, background: G }} />
              <span style={{ fontSize: 10, letterSpacing: '0.38em', textTransform: 'uppercase', color: GB(0.6), fontWeight: 500 }}>The Pipeline</span>
              <div style={{ width: 48, height: 1, background: G }} />
            </div>
            <h2 style={{
              fontFamily: "'BentonSans', sans-serif",
              fontSize: 'clamp(28px, 3.5vw, 42px)',
              fontWeight: 900,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: CR,
              margin: 0,
            }}>
              How It Works
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0 }}>
            {pipeline.map((p, i) => (
              <div key={p.step} className={`fade-up-${Math.min(i + 1, 4)}`} style={{
                padding: '40px 28px',
                borderRight: i < pipeline.length - 1 ? `1px solid ${B}` : 'none',
                position: 'relative',
              }}>
                {/* Connector dot */}
                <div style={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  background: i === 3 ? G : GB(0.3),
                  border: `2px solid ${i === 3 ? G : GB(0.15)}`,
                  marginBottom: 24,
                  boxShadow: i === 3 ? `0 0 16px ${GB(0.4)}` : 'none',
                }} />
                <div style={{
                  fontFamily: "'BentonSans', sans-serif",
                  fontSize: 11,
                  fontWeight: 900,
                  letterSpacing: '0.14em',
                  color: GB(0.4),
                  marginBottom: 12,
                }}>
                  STEP {p.step}
                </div>
                <h3 style={{
                  fontFamily: "'BentonSans', sans-serif",
                  fontSize: 15,
                  fontWeight: 900,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: CR,
                  marginBottom: 12,
                }}>
                  {p.label}
                </h3>
                <p style={{
                  fontSize: 13,
                  color: 'rgba(240,234,224,0.4)',
                  lineHeight: 1.8,
                  letterSpacing: '0.02em',
                }}>
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tech Stack ── */}
      <section style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: '80px 56px',
        textAlign: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18, marginBottom: 20 }}>
          <div style={{ width: 48, height: 1, background: G }} />
          <span style={{ fontSize: 10, letterSpacing: '0.38em', textTransform: 'uppercase', color: GB(0.6), fontWeight: 500 }}>Under the Hood</span>
          <div style={{ width: 48, height: 1, background: G }} />
        </div>
        <h2 style={{
          fontFamily: "'BentonSans', sans-serif",
          fontSize: 'clamp(22px, 3vw, 32px)',
          fontWeight: 900,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: CR,
          margin: '0 0 40px',
        }}>
          Our Data Sources &amp; Stack
        </h2>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: 10,
        }}>
          {techStack.map(t => (
            <span key={t} style={{
              fontFamily: "'SF Mono', 'Fira Code', monospace",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.06em',
              color: GB(0.6),
              padding: '12px 22px',
              background: GB(0.04),
              border: `1px solid ${GB(0.1)}`,
            }}>
              {t}
            </span>
          ))}
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section style={{
        position: 'relative',
        borderTop: `1px solid ${B}`,
        overflow: 'hidden',
        padding: '100px 56px',
        textAlign: 'center',
      }}>
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '70vw',
          height: '70vw',
          maxWidth: 700,
          maxHeight: 700,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${GB(0.08)} 0%, transparent 60%)`,
          pointerEvents: 'none',
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{
            fontFamily: "'BentonSans', sans-serif",
            fontSize: 'clamp(28px, 4vw, 48px)',
            fontWeight: 900,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: CR,
            margin: '0 0 16px',
          }}>
            Ready for Faster Insights?
          </h2>
          <p style={{
            fontSize: 15,
            color: 'rgba(240,234,224,0.45)',
            lineHeight: 1.8,
            maxWidth: 550,
            margin: '0 auto 40px',
            letterSpacing: '0.02em',
          }}>
            Whether you&apos;re a developer evaluating a site, a lender assessing collateral, or a landowner exploring options &mdash; our AI tools get you answers in seconds.
          </p>
          <a href="/contact" style={{
            fontFamily: "'BentonSans', sans-serif",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: BG,
            background: G,
            padding: '18px 48px',
            textDecoration: 'none',
            transition: 'all 0.3s ease',
            boxShadow: `0 0 30px ${GB(0.2)}`,
          }}>
            Get Your 60-Second Assessment
          </a>
        </div>
      </section>

      <Footer />
    </div>
  )
}
