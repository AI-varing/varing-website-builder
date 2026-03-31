'use client'

import React from 'react'
import Nav from '@/components/builder/Nav'
import Footer from '@/components/builder/Footer'
import { AnimatedCount, Label } from '@/lib/ui'
import { G, GL, CR, BG, B, GB, GRAD_HERO } from '@/lib/tokens'

const AERIAL_BG = 'https://www.varinggroup.com/wp-content/uploads/SRY-AR_2146_L-76APR2018-WMLCOS-_COS9635.jpg'
const SOIL_BG = 'https://www.varinggroup.com/wp-content/uploads/bg-meet-joe-soil.jpg'
const RECOGNITION_BG = 'https://www.varinggroup.com/wp-content/uploads/bg-meet-joe-recognition.jpg'
const WATERFRONT = '/vancouver-waterfront.jpg'

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
  {
    title: 'Embrace Integrity',
    desc: 'Transparency and honesty are the foundation of everything we do. Our word is our bond in every transaction.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={G} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
  },
  {
    title: 'Show Compassion',
    desc: 'Behind every property is a person. We approach every situation with empathy and a genuine desire to help.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={G} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
      </svg>
    ),
  },
]

const team = [
  {
    dept: 'Sales',
    tagline: 'Taking Care of Our Relationships.',
    desc: 'The Sales Team provides strategic advice and assistance to all clients, acting as their primary point of contact. Their knowledge of market trends and ability to source opportunities is unmatched.',
    bg: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
  },
  {
    dept: 'Marketing',
    tagline: 'Jumping Off the Page.',
    desc: 'The Marketing Department creates unique materials that enhance every property Varing represents. From custom maps to tailored information packages, they inspire people to see beyond the dirt.',
    bg: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
  },
  {
    dept: 'Paralegal',
    tagline: 'Running Things Smoothly.',
    desc: 'The Paralegal Department\'s attention to detail ensures all of Varing Marketing Group\'s legal interactions run smoothly \u2014 managing complex documentation, court filings, and compliance.',
    bg: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=80',
  },
]

const trustedBy = [
  'Isle of Mann', 'Qualico Communities', 'Concert Properties', 'Hayer Builders Group',
  'Berezan Management', 'Garcha Properties', 'Platinum Group', 'Nordel Homes',
  'Wesmont Homes', 'Mitchell Group', 'Maison Development', 'Northwest Developments',
]

const approach = [
  { step: '01', title: 'Research & Strategy', desc: 'We consistently communicate and network with city officials across Surrey, Langley, Abbotsford, and Mission to ensure we know what\u2019s happening in every development area.' },
  { step: '02', title: 'Opportunity', desc: 'In-depth packages including Comparative Market Analysis, sold comparables, highest and best land uses.' },
  { step: '03', title: 'Marketing Launch', desc: 'Targeted outreach to our 6,000+ direct mailing database, 2,000+ email recipients, and 1,000+ realtors.' },
  { step: '04', title: 'Review Offers', desc: 'All offers presented immediately with reference checks for top offers and personal recommendations.' },
  { step: '05', title: 'Bi-Weekly Updates', desc: 'Detailed reports on exposure, inquiries, tours, and offers \u2014 formatted for court filing without extra work.' },
  { step: '06', title: 'Close & Deliver', desc: 'Coordinated deposits, closing steps, and clear communication until keys are handed over.' },
]

export default function AboutPage() {
  return (
    <div style={{ background: BG, minHeight: '100vh' }}>
      <Nav />

      {/* Hero — Full-width waterfront image */}
      <section style={{
        position: 'relative',
        height: 520,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={WATERFRONT}
          alt="Vancouver waterfront"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center 40%',
          }}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(8,8,8,0.5) 0%, rgba(8,8,8,0.85) 100%)',
        }} />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse at 50% 40%, ${GB(0.12)} 0%, transparent 60%)`,
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
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(16px, 2vw, 22px)',
            fontStyle: 'italic',
            color: 'rgba(240,234,224,0.5)',
            marginTop: 20,
            letterSpacing: '0.02em',
          }}>
            19+ years of award-winning service across the Fraser Valley
          </p>
        </div>
      </section>

      {/* Joe Varing Bio */}
      <section style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: '100px 56px',
      }}>
        <div className="fade-up-1">
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <p style={{ fontSize: 15, color: 'rgba(240,234,224,0.65)', lineHeight: 1.85, letterSpacing: '0.02em' }}>
                With over 19 years of experience in the Fraser Valley&apos;s competitive development land market, Joe Varing has established himself as one of British Columbia&apos;s most trusted and prolific land brokers. His deep understanding of zoning, land assembly, and the intricacies of court-ordered sales has made him the go-to advisor for developers, lenders, and institutional investors alike.
              </p>
              <p style={{ fontSize: 15, color: 'rgba(240,234,224,0.65)', lineHeight: 1.85, letterSpacing: '0.02em' }}>
                Joe&apos;s track record speaks for itself: over $4 billion in transaction volume, 600+ development and investment sites sold, and an extraordinary 75% repeat business rate. His approach is simple yet relentless &mdash; deep market intelligence, unwavering client advocacy, and a commitment to achieving results that consistently exceed expectations.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <p style={{ fontSize: 15, color: 'rgba(240,234,224,0.65)', lineHeight: 1.85, letterSpacing: '0.02em' }}>
                Under Joe&apos;s leadership, Varing Group has become the dominant force in Fraser Valley land brokerage, representing the most significant court-ordered mandates, receivership sales, and private development land transactions in the region.
              </p>
              {/* Quote */}
              <div style={{ marginTop: 'auto', paddingTop: 20 }}>
                <div style={{ width: 48, height: 2, background: GB(0.3), marginBottom: 28 }} />
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
            </div>
          </div>
        </div>
      </section>

      {/* Stats Row */}
      <section style={{
        position: 'relative',
        borderTop: `1px solid ${B}`,
        borderBottom: `1px solid ${B}`,
        background: 'rgba(240,234,224,0.015)',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80%',
          height: '200%',
          background: `radial-gradient(ellipse at center, ${GB(0.08)} 0%, transparent 70%)`,
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'relative',
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

      {/* ── Quote Divider: Glickman ── */}
      <section style={{
        position: 'relative',
        overflow: 'hidden',
        height: '45vh',
        minHeight: 320,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={AERIAL_BG}
          alt=""
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'grayscale(60%) brightness(0.5)',
          }}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(8,8,8,0.6) 0%, rgba(8,8,8,0.45) 50%, rgba(8,8,8,0.7) 100%)',
        }} />
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '0 40px', maxWidth: 900 }}>
          <p style={{
            fontFamily: "'BentonSans', sans-serif",
            fontSize: 'clamp(1.5rem, 3.5vw, 2.8rem)',
            fontWeight: 700,
            textTransform: 'uppercase',
            color: CR,
            letterSpacing: '0.14em',
            lineHeight: 1.3,
            textShadow: '0 2px 16px rgba(0,0,0,0.6)',
            marginBottom: 20,
          }}>
            &ldquo;The Best Investment on Earth Is Earth.&rdquo;
          </p>
          <p style={{
            fontSize: 12,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: GB(0.6),
            fontWeight: 500,
          }}>
            &mdash; Louis Glickman
          </p>
        </div>
      </section>

      {/* Team Section — with background images behind each card */}
      <section style={{
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse at 30% 50%, ${GB(0.06)} 0%, transparent 60%)`,
          pointerEvents: 'none',
        }} />
        <div style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '100px 56px',
          position: 'relative',
        }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }} className="fade-up">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18, marginBottom: 20 }}>
              <div style={{ width: 48, height: 1, background: G }} />
              <span style={{ fontSize: 10, letterSpacing: '0.38em', textTransform: 'uppercase', color: GB(0.6), fontWeight: 500 }}>Our People</span>
              <div style={{ width: 48, height: 1, background: G }} />
            </div>
            <h2 style={{
              fontFamily: "'BentonSans', sans-serif",
              fontSize: 'clamp(28px, 3.5vw, 42px)',
              fontWeight: 900,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: CR,
              margin: '0 0 12px',
            }}>
              The Team
            </h2>
            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 17,
              fontStyle: 'italic',
              color: 'rgba(240,234,224,0.4)',
              maxWidth: 600,
              margin: '0 auto',
              lineHeight: 1.7,
            }}>
              Although awards speak volumes about our track record, we&apos;d rather focus on our greatest strength: our people.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {team.map((t, i) => (
              <div
                key={t.dept}
                className={`fade-up-${i + 1}`}
                style={{
                  position: 'relative',
                  overflow: 'hidden',
                  minHeight: 380,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  border: `1px solid ${B}`,
                  transition: 'border-color 0.3s, transform 0.3s',
                }}
              >
                {/* Background image */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={t.bg}
                  alt=""
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    filter: 'grayscale(80%) brightness(0.3)',
                    transition: 'transform 0.6s ease',
                  }}
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, rgba(8,8,8,0.2) 0%, rgba(8,8,8,0.85) 60%, rgba(8,8,8,0.95) 100%)',
                }} />
                <div style={{ position: 'relative', zIndex: 1, padding: '40px 32px' }}>
                  <div style={{
                    width: 48,
                    height: 48,
                    marginBottom: 20,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: GB(0.12),
                    border: `1px solid ${GB(0.2)}`,
                    borderRadius: '50%',
                  }}>
                    <span style={{ fontSize: 20, fontWeight: 900, color: G }}>{t.dept[0]}</span>
                  </div>
                  <h3 style={{
                    fontFamily: "'BentonSans', sans-serif",
                    fontSize: 16,
                    fontWeight: 900,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: CR,
                    marginBottom: 6,
                  }}>
                    {t.dept}
                  </h3>
                  <p style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 14,
                    fontStyle: 'italic',
                    color: G,
                    marginBottom: 14,
                    letterSpacing: '0.02em',
                  }}>
                    {t.tagline}
                  </p>
                  <p style={{
                    fontSize: 13,
                    color: 'rgba(240,234,224,0.5)',
                    lineHeight: 1.8,
                    letterSpacing: '0.02em',
                  }}>
                    {t.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Our Approach — 6-step process ── */}
      <section style={{
        position: 'relative',
        borderTop: `1px solid ${B}`,
        borderBottom: `1px solid ${B}`,
        overflow: 'hidden',
      }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={SOIL_BG}
          alt=""
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.05,
            filter: 'grayscale(100%)',
            pointerEvents: 'none',
          }}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(180deg, ${BG} 0%, rgba(8,8,8,0.92) 50%, ${BG} 100%)`,
          pointerEvents: 'none',
        }} />
        <div style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '100px 56px',
          position: 'relative',
        }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }} className="fade-up">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18, marginBottom: 20 }}>
              <div style={{ width: 48, height: 1, background: G }} />
              <span style={{ fontSize: 10, letterSpacing: '0.38em', textTransform: 'uppercase', color: GB(0.6), fontWeight: 500 }}>How We Work</span>
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
              Our Approach
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32, rowGap: 48 }}>
            {approach.map((a, i) => (
              <div key={a.step} className={`fade-up-${Math.min(i + 1, 4)}`} style={{ position: 'relative', paddingLeft: 0 }}>
                <div style={{
                  fontFamily: "'BentonSans', sans-serif",
                  fontSize: 48,
                  fontWeight: 900,
                  color: GB(0.12),
                  lineHeight: 1,
                  marginBottom: 12,
                }}>
                  {a.step}
                </div>
                <h3 style={{
                  fontFamily: "'BentonSans', sans-serif",
                  fontSize: 13,
                  fontWeight: 900,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: CR,
                  marginBottom: 12,
                }}>
                  {a.title}
                </h3>
                <p style={{
                  fontSize: 13,
                  color: 'rgba(240,234,224,0.45)',
                  lineHeight: 1.8,
                  letterSpacing: '0.02em',
                }}>
                  {a.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trusted By — Developer/Lender Names ── */}
      <section style={{
        position: 'relative',
        overflow: 'hidden',
        borderTop: `1px solid ${B}`,
        borderBottom: `1px solid ${B}`,
      }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={RECOGNITION_BG}
          alt=""
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center 30%',
            filter: 'grayscale(60%) brightness(0.25)',
          }}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(8,8,8,0.75) 0%, rgba(8,8,8,0.6) 50%, rgba(8,8,8,0.8) 100%)',
        }} />
        <div style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: 1100,
          margin: '0 auto',
          padding: '80px 56px',
          textAlign: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18, marginBottom: 20 }}>
            <div style={{ width: 48, height: 1, background: G }} />
            <span style={{ fontSize: 10, letterSpacing: '0.38em', textTransform: 'uppercase', color: GB(0.6), fontWeight: 500 }}>Representations</span>
            <div style={{ width: 48, height: 1, background: G }} />
          </div>
          <h2 style={{
            fontFamily: "'BentonSans', sans-serif",
            fontSize: 'clamp(22px, 3vw, 36px)',
            fontWeight: 900,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: CR,
            margin: '0 0 12px',
          }}>
            Trusted By the Valley&apos;s Best
          </h2>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 16,
            fontStyle: 'italic',
            color: 'rgba(240,234,224,0.4)',
            marginBottom: 48,
          }}>
            Leading developers, well-capitalized mortgage &amp; investment groups, and landowners across the Fraser Valley.
          </p>

          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 12,
          }}>
            {trustedBy.map(name => (
              <span key={name} style={{
                fontFamily: "'BentonSans', sans-serif",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'rgba(240,234,224,0.6)',
                padding: '14px 28px',
                background: 'rgba(240,234,224,0.04)',
                border: `1px solid rgba(240,234,224,0.1)`,
                backdropFilter: 'blur(8px)',
              }}>
                {name}
              </span>
            ))}
          </div>

          {/* Top Agent Magazine Feature Quote */}
          <div style={{ marginTop: 56, maxWidth: 700, margin: '56px auto 0' }}>
            <div style={{ width: 32, height: 2, background: GB(0.3), margin: '0 auto 24px' }} />
            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 18,
              fontStyle: 'italic',
              color: 'rgba(240,234,224,0.55)',
              lineHeight: 1.8,
            }}>
              &ldquo;Having stepped into the world of real estate at 21, Joe Varing has spent 19 years honing his craft. His formidable team of committed professionals is the engine behind his operations &mdash; a unique blend of roles, from marketing to legal, cultivating a comprehensive approach.&rdquo;
            </p>
            <p style={{
              fontSize: 10,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: GB(0.5),
              fontWeight: 500,
              marginTop: 16,
            }}>
              &mdash; Top Agent Magazine
            </p>
          </div>
        </div>
      </section>

      {/* Core Values — with aerial background */}
      <section style={{
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={AERIAL_BG}
          alt=""
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.08,
            filter: 'grayscale(100%) brightness(0.6)',
            pointerEvents: 'none',
          }}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(8,8,8,0.88) 0%, rgba(8,8,8,0.75) 50%, rgba(8,8,8,0.92) 100%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'relative',
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
              margin: '0 0 12px',
            }}>
              Our Shared Beliefs
            </h2>
            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 17,
              fontStyle: 'italic',
              color: 'rgba(240,234,224,0.4)',
              maxWidth: 650,
              margin: '0 auto',
              lineHeight: 1.7,
            }}>
              Our core values represent who we are as people and professionals. More than just a plaque on our wall, they guide our decisions and inspire us in real estate and life.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, rowGap: 24 }}>
            {values.map((v, i) => (
              <div
                key={v.title}
                className={`fade-up-${Math.min(i + 1, 4)}`}
                style={{
                  padding: '44px 28px',
                  background: 'rgba(240,234,224,0.025)',
                  border: `1px solid ${B}`,
                  textAlign: 'center',
                  transition: 'border-color 0.3s, transform 0.3s',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <div style={{
                  width: 60,
                  height: 60,
                  margin: '0 auto 24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: GB(0.08),
                  border: `1px solid ${GB(0.15)}`,
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

      {/* ── Outreach & Resources Band ── */}
      <section style={{
        position: 'relative',
        background: G,
        padding: '40px 56px',
        textAlign: 'center',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(90deg, rgba(0,0,0,0.15) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.15) 100%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'relative',
          maxWidth: 1000,
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'center',
          gap: 56,
          flexWrap: 'wrap',
        }}>
          {[
            { num: '6,000+', label: 'Direct Mailing Database' },
            { num: '2,000+', label: 'Email Recipients' },
            { num: '150+', label: 'Recent Testimonials' },
            { num: '90', label: 'Avg. Days to Firm Sale' },
          ].map(item => (
            <div key={item.label} style={{ minWidth: 160 }}>
              <div style={{
                fontFamily: "'BentonSans', sans-serif",
                fontSize: 28,
                fontWeight: 900,
                color: '#fff',
                lineHeight: 1,
                marginBottom: 6,
              }}>
                {item.num}
              </div>
              <p style={{
                fontSize: 10,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.7)',
                fontWeight: 600,
              }}>
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Affiliations & Recognition ── */}
      <section style={{
        borderTop: `1px solid ${B}`,
        padding: '80px 56px',
        maxWidth: 1200,
        margin: '0 auto',
        textAlign: 'center',
      }}>
        <div className="fade-up">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18, marginBottom: 20 }}>
            <div style={{ width: 48, height: 1, background: G }} />
            <span style={{ fontSize: 10, letterSpacing: '0.38em', textTransform: 'uppercase', color: GB(0.6), fontWeight: 500 }}>Recognition</span>
            <div style={{ width: 48, height: 1, background: G }} />
          </div>
          <h2 style={{
            fontFamily: "'BentonSans', sans-serif",
            fontSize: 'clamp(22px, 3vw, 36px)',
            fontWeight: 900,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: CR,
            margin: '0 0 48px',
          }}>
            Awards &amp; Affiliations
          </h2>

          {/* Awards timeline */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: 16,
            marginBottom: 48,
          }}>
            {Array.from({ length: 13 }, (_, i) => 2013 + i).map(year => (
              <div key={year} style={{
                padding: '16px 20px',
                background: 'rgba(240,234,224,0.02)',
                border: `1px solid ${B}`,
                textAlign: 'center',
                minWidth: 70,
              }}>
                <div style={{
                  fontFamily: "'BentonSans', sans-serif",
                  fontSize: 11,
                  fontWeight: 700,
                  color: G,
                  letterSpacing: '0.06em',
                  marginBottom: 4,
                }}>
                  {year}
                </div>
                <div style={{
                  fontSize: 9,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'rgba(240,234,224,0.35)',
                  fontWeight: 600,
                }}>
                  #1 BC
                </div>
              </div>
            ))}
          </div>

          <p style={{
            fontSize: 13,
            color: 'rgba(240,234,224,0.4)',
            letterSpacing: '0.04em',
            lineHeight: 1.8,
            maxWidth: 700,
            margin: '0 auto',
          }}>
            Rated <span style={{ color: CR, fontWeight: 700 }}>#1 Agent in BC and Canada</span> by Homelife International from 2013&ndash;2025. CoStar Power Broker Award recipient. Featured in Business in Vancouver, Western Investor, and Top Agent Magazine.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  )
}
