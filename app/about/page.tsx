'use client'

import React from 'react'
import Nav from '@/components/builder/Nav'
import Footer from '@/components/builder/Footer'
import { AnimatedCount, Label } from '@/lib/ui'
import { G, GL, CR, BG, B, GB, GRAD_HERO } from '@/lib/tokens'

const JOE_IMG = 'https://www.varinggroup.com/wp-content/uploads/Joe-Main-e1711665429689.png'

const stats = [
  { value: 19, suffix: '+', label: 'Years', sublabel: 'of Experience' },
  { value: 4, prefix: '$', suffix: 'B+', label: 'Volume', sublabel: 'in Transactions' },
  { value: 600, suffix: '+', label: 'Sites Sold', sublabel: 'Across the Valley' },
  { value: 75, suffix: '%', label: 'Repeat', sublabel: 'Business Rate' },
]

const values = [
  {
    title: 'Relentless Ambition',
    desc: 'We pursue every opportunity with unmatched determination, leaving no stone unturned to deliver results for our clients.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={G} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
    ),
  },
  {
    title: 'Pursue Greatness',
    desc: 'Mediocrity is not in our vocabulary. We hold ourselves to the highest standard in every transaction and relationship.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={G} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>
      </svg>
    ),
  },
  {
    title: 'Relationship Driven',
    desc: 'Built on trust and loyalty, our business thrives because we treat every client like family and every deal like our own.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={G} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
      </svg>
    ),
  },
  {
    title: 'Over Deliver',
    desc: 'We don\'t just meet expectations \u2014 we exceed them. Going above and beyond is how we\'ve earned the trust of BC\'s top developers.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={G} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
    ),
  },
]

const team = [
  {
    dept: 'Sales',
    desc: 'Our sales team brings decades of combined experience in Fraser Valley development land, delivering strategic counsel and market-leading results.',
  },
  {
    dept: 'Marketing',
    desc: 'From targeted outreach to premium brand positioning, our marketing team ensures every property reaches the right audience at the right time.',
  },
  {
    dept: 'Paralegal',
    desc: 'Our paralegal department manages complex documentation, court filings, and compliance, ensuring seamless execution on every mandate.',
  },
]

export default function AboutPage() {
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
        background: 'linear-gradient(180deg, rgba(42,21,8,0.35) 0%, rgba(8,8,8,0.95) 100%)',
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse at 50% 40%, ${GB(0.08)} 0%, transparent 60%)`,
        }} />
        <div style={{ position: 'relative', textAlign: 'center', zIndex: 1 }} className="fade-up">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18, marginBottom: 20 }}>
            <div style={{ width: 48, height: 1, background: G }} />
            <span style={{ fontSize: 10, letterSpacing: '0.38em', textTransform: 'uppercase', color: GB(0.6), fontWeight: 500 }}>Leaders In Land</span>
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
            About Us
          </h1>
        </div>
      </section>

      {/* Joe Varing Bio */}
      <section style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: '100px 56px',
        display: 'grid',
        gridTemplateColumns: '380px 1fr',
        gap: 72,
        alignItems: 'start',
      }}>
        {/* Photo */}
        <div className="fade-up-1" style={{ position: 'relative' }}>
          <div style={{
            position: 'relative',
            overflow: 'hidden',
            border: `1px solid ${B}`,
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={JOE_IMG}
              alt="Joe Varing"
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
                filter: 'grayscale(20%)',
              }}
            />
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '40%',
              background: 'linear-gradient(180deg, transparent 0%, rgba(8,8,8,0.7) 100%)',
            }} />
          </div>
          {/* Decorative corner accents */}
          <div style={{ position: 'absolute', top: -8, left: -8, width: 32, height: 32, borderTop: `2px solid ${G}`, borderLeft: `2px solid ${G}` }} />
          <div style={{ position: 'absolute', bottom: -8, right: -8, width: 32, height: 32, borderBottom: `2px solid ${G}`, borderRight: `2px solid ${G}` }} />
        </div>

        {/* Bio */}
        <div className="fade-up-2">
          <Label>Principal</Label>
          <h2 style={{
            fontFamily: "'BentonSans', sans-serif",
            fontSize: 'clamp(32px, 4vw, 48px)',
            fontWeight: 900,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: CR,
            margin: '0 0 8px',
          }}>
            Joe Varing
          </h2>
          <p style={{
            fontSize: 13,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: G,
            fontWeight: 600,
            marginBottom: 36,
          }}>
            Personal Real Estate Corporation Ltd.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <p style={{ fontSize: 15, color: 'rgba(240,234,224,0.65)', lineHeight: 1.85, letterSpacing: '0.02em' }}>
              With over 19 years of experience in the Fraser Valley&apos;s competitive development land market, Joe Varing has established himself as one of British Columbia&apos;s most trusted and prolific land brokers. His deep understanding of zoning, land assembly, and the intricacies of court-ordered sales has made him the go-to advisor for developers, lenders, and institutional investors alike.
            </p>
            <p style={{ fontSize: 15, color: 'rgba(240,234,224,0.65)', lineHeight: 1.85, letterSpacing: '0.02em' }}>
              Joe&apos;s track record speaks for itself: over $4 billion in transaction volume, 600+ development and investment sites sold, and an extraordinary 75% repeat business rate. His approach is simple yet relentless &mdash; deep market intelligence, unwavering client advocacy, and a commitment to achieving results that consistently exceed expectations.
            </p>
            <p style={{ fontSize: 15, color: 'rgba(240,234,224,0.65)', lineHeight: 1.85, letterSpacing: '0.02em' }}>
              Under Joe&apos;s leadership, Varing Group has become the dominant force in Fraser Valley land brokerage, representing the most significant court-ordered mandates, receivership sales, and private development land transactions in the region.
            </p>
          </div>

          {/* Divider */}
          <div style={{ width: 48, height: 2, background: GB(0.3), margin: '40px 0' }} />

          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 22,
            fontWeight: 400,
            fontStyle: 'italic',
            color: 'rgba(240,234,224,0.5)',
            lineHeight: 1.6,
          }}>
            &ldquo;In land, there&apos;s no substitute for knowing the market better than anyone else in the room.&rdquo;
          </p>
        </div>
      </section>

      {/* Stats Row */}
      <section style={{
        borderTop: `1px solid ${B}`,
        borderBottom: `1px solid ${B}`,
        background: 'rgba(240,234,224,0.015)',
      }}>
        <div style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '64px 56px',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 0,
        }}>
          {stats.map((s, i) => (
            <div key={s.label} style={{
              textAlign: 'center',
              padding: '0 24px',
              borderRight: i < stats.length - 1 ? `1px solid ${B}` : 'none',
            }}>
              <div style={{
                fontFamily: "'BentonSans', sans-serif",
                fontSize: 'clamp(36px, 4vw, 52px)',
                fontWeight: 900,
                color: G,
                lineHeight: 1,
                marginBottom: 12,
              }}>
                <AnimatedCount target={s.value} prefix={s.prefix || ''} suffix={s.suffix} />
              </div>
              <p style={{
                fontSize: 11,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: CR,
                fontWeight: 700,
                marginBottom: 4,
              }}>
                {s.label}
              </p>
              <p style={{ fontSize: 12, color: 'rgba(240,234,224,0.3)', letterSpacing: '0.04em' }}>
                {s.sublabel}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: '100px 56px',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }} className="fade-up">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18, marginBottom: 20 }}>
            <div style={{ width: 48, height: 1, background: G }} />
            <span style={{ fontSize: 10, letterSpacing: '0.38em', textTransform: 'uppercase', color: GB(0.6), fontWeight: 500 }}>Our Departments</span>
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
            The Team
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }}>
          {team.map((t, i) => (
            <div
              key={t.dept}
              className={`fade-up-${i + 1}`}
              style={{
                padding: '48px 36px',
                background: 'rgba(240,234,224,0.02)',
                border: `1px solid ${B}`,
                textAlign: 'center',
                transition: 'border-color 0.3s',
              }}
            >
              <div style={{
                width: 56,
                height: 56,
                margin: '0 auto 28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: GB(0.08),
                border: `1px solid ${GB(0.15)}`,
                borderRadius: '50%',
              }}>
                <span style={{ fontSize: 22, fontWeight: 900, color: G }}>{t.dept[0]}</span>
              </div>
              <h3 style={{
                fontFamily: "'BentonSans', sans-serif",
                fontSize: 16,
                fontWeight: 900,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: CR,
                marginBottom: 16,
              }}>
                {t.dept}
              </h3>
              <p style={{
                fontSize: 14,
                color: 'rgba(240,234,224,0.45)',
                lineHeight: 1.8,
                letterSpacing: '0.02em',
              }}>
                {t.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Core Values */}
      <section style={{
        borderTop: `1px solid ${B}`,
        background: 'rgba(240,234,224,0.01)',
      }}>
        <div style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '100px 56px',
        }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }} className="fade-up">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18, marginBottom: 20 }}>
              <div style={{ width: 48, height: 1, background: G }} />
              <span style={{ fontSize: 10, letterSpacing: '0.38em', textTransform: 'uppercase', color: GB(0.6), fontWeight: 500 }}>What Drives Us</span>
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
              Our Shared Beliefs
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32 }}>
            {values.map((v, i) => (
              <div
                key={v.title}
                className={`fade-up-${Math.min(i + 1, 4)}`}
                style={{
                  padding: '44px 28px',
                  background: 'rgba(240,234,224,0.02)',
                  border: `1px solid ${B}`,
                  textAlign: 'center',
                  transition: 'border-color 0.3s, transform 0.3s',
                }}
              >
                <div style={{
                  width: 60,
                  height: 60,
                  margin: '0 auto 24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: GB(0.06),
                  border: `1px solid ${GB(0.12)}`,
                }}>
                  {v.icon}
                </div>
                <h3 style={{
                  fontFamily: "'BentonSans', sans-serif",
                  fontSize: 13,
                  fontWeight: 900,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: CR,
                  marginBottom: 14,
                }}>
                  {v.title}
                </h3>
                <p style={{
                  fontSize: 13,
                  color: 'rgba(240,234,224,0.4)',
                  lineHeight: 1.8,
                  letterSpacing: '0.02em',
                }}>
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
