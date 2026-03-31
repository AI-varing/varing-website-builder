'use client'

import React from 'react'
import Nav from '@/components/builder/Nav'
import Footer from '@/components/builder/Footer'
import { AnimatedCount, Label } from '@/lib/ui'
import { useMarquee } from '@/lib/animations'
import { G, GL, CR, BG, BG2, B, GB, GRAD_HERO } from '@/lib/tokens'

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

const beliefs = [
  { num: '01', title: 'Relentless\nAmbition', bg: 'https://images.unsplash.com/photo-1519834785169-98be25ec3f84?w=600&q=80' },
  { num: '02', title: 'Pursue\nGreatness', bg: 'https://images.unsplash.com/photo-1461896836934-bd45ba10f9c0?w=600&q=80' },
  { num: '03', title: 'Relationship\nDriven', bg: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80' },
  { num: '04', title: 'Over\nDeliver', bg: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&q=80' },
  { num: '05', title: 'Embrace\nIntegrity', bg: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80' },
  { num: '06', title: 'Show\nCompassion', bg: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&q=80' },
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

const affiliations = [
  { name: 'Urban Development Institute', logo: 'https://www.varinggroup.com/wp-content/uploads/web/udi-logo-alt.png' },
  { name: 'Surrey Board of Trade', logo: 'https://www.varinggroup.com/wp-content/uploads/web/sbot-logo.png' },
  { name: 'Langley Chamber of Commerce', logo: 'https://www.varinggroup.com/wp-content/uploads/web/Langley2017.jpg' },
  { name: 'Abbotsford Chamber of Commerce', logo: 'https://www.varinggroup.com/wp-content/uploads/web/Chamber-Logo.png' },
  { name: 'GVHBA', logo: 'https://www.varinggroup.com/wp-content/uploads/web/logo.png' },
  { name: 'IGL Financial', logo: 'https://www.varinggroup.com/wp-content/uploads/web/igl-logo.png' },
  { name: 'BBB', logo: 'https://www.varinggroup.com/wp-content/uploads/web/ab-seal-horizontal-us.png' },
]

const charityLogos = [
  { name: 'Surrey Fire Fighters Charitable Society', url: '/logos/charities/surrey-firefighters.png' },
  { name: 'BC Children\u2019s Hospital', url: '/logos/charities/bc-childrens-hospital.png' },
  { name: 'Adopt-A-Street \u2014 Township of Langley', url: '/logos/charities/adopt-a-street.png' },
  { name: 'Abbotsford Community Services', url: '/logos/charities/abbotsford-community-services.png' },
  { name: 'Abbotsford Food Bank', url: '/logos/charities/abbotsford-food-bank.png' },
  { name: 'Kids Play Foundation', url: '/logos/charities/kids-play.png' },
  { name: 'Mouat Secondary School', url: '/logos/charities/mouat-secondary.png' },
  { name: 'Praise 106.5', url: '/logos/charities/praise-1065.png' },
]

const approach = [
  { step: '01', title: 'Research & Strategy', desc: 'We consistently communicate and network with city officials across Surrey, Langley, Abbotsford, and Mission to ensure we know what\u2019s happening in every development area.' },
  { step: '02', title: 'Opportunity', desc: 'In-depth packages including Comparative Market Analysis, sold comparables, highest and best land uses.' },
  { step: '03', title: 'Marketing Launch', desc: 'Targeted outreach to our 6,000+ direct mailing database, 2,000+ email recipients, and 1,000+ realtors.' },
  { step: '04', title: 'Review Offers', desc: 'All offers presented immediately with reference checks for top offers and personal recommendations.' },
  { step: '05', title: 'Bi-Weekly Updates', desc: 'Detailed reports on exposure, inquiries, tours, and offers \u2014 formatted for court filing without extra work.' },
  { step: '06', title: 'Close & Deliver', desc: 'Coordinated deposits, closing steps, and clear communication until keys are handed over.' },
]

function CharityMarquee() {
  const { trackRef, onMouseEnter, onMouseLeave } = useMarquee(40)
  const tripled = [...charityLogos, ...charityLogos, ...charityLogos]
  const full = [...tripled, ...tripled]

  return (
    <div
      ref={trackRef}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{ display: 'flex', width: 'max-content', alignItems: 'center', willChange: 'transform', cursor: 'default' }}
    >
      {full.map((logo, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 240, flexShrink: 0, borderRight: `1px solid ${B}`, height: 80 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logo.url}
            alt={logo.name}
            style={{
              maxHeight: 60,
              width: 'auto',
              maxWidth: 200,
              opacity: 0.85,
              objectFit: 'contain',
            }}
            onError={(e) => {
              const el = e.currentTarget as HTMLImageElement
              el.style.display = 'none'
            }}
          />
        </div>
      ))}
    </div>
  )
}

export default function AboutPage() {
  return (
    <div style={{ background: BG, minHeight: '100vh' }}>
      <Nav />

      {/* Hero */}
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
            fontSize: 'clamp(14px, 1.6vw, 18px)',
            color: 'rgba(240,234,224,0.55)',
            marginTop: 24,
            letterSpacing: '0.04em',
            maxWidth: 600,
            lineHeight: 1.7,
          }}>
            We pride ourselves on our expertise. The greatest advantage setting us apart from our competition: <span style={{ color: CR, fontWeight: 700 }}>our people.</span>
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

      {/* ── Awards Band ── */}
      <section style={{
        position: 'relative',
        background: G,
        padding: '32px 56px',
        textAlign: 'center',
        overflow: 'hidden',
      }}>
        <p style={{
          fontFamily: "'BentonSans', sans-serif",
          fontSize: 'clamp(0.9rem, 1.8vw, 1.3rem)',
          fontWeight: 900,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: '#fff',
          lineHeight: 1.5,
          margin: 0,
        }}>
          18+ Years of Award Winning Service
        </p>
      </section>

      {/* ── Industry Affiliations — Logo Row ── */}
      <section style={{
        borderBottom: `1px solid ${B}`,
        padding: '64px 56px',
        maxWidth: 1200,
        margin: '0 auto',
        textAlign: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18, marginBottom: 24 }}>
          <div style={{ width: 48, height: 1, background: G }} />
          <span style={{ fontSize: 10, letterSpacing: '0.38em', textTransform: 'uppercase', color: GB(0.6), fontWeight: 500 }}>Industry Affiliations</span>
          <div style={{ width: 48, height: 1, background: G }} />
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 48,
          marginTop: 32,
        }}>
          {affiliations.map(a => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={a.name}
              src={a.logo}
              alt={a.name}
              style={{
                height: 56,
                width: 'auto',
                maxWidth: 160,
                objectFit: 'contain',
                filter: 'brightness(0) invert(1)',
                opacity: 0.55,
                transition: 'opacity 0.3s',
              }}
              onError={(e) => {
                const el = e.currentTarget as HTMLImageElement
                el.style.display = 'none'
                const fallback = document.createElement('span')
                fallback.textContent = a.name
                fallback.style.cssText = `font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:rgba(240,234,224,0.4);font-weight:700;white-space:nowrap`
                el.parentElement?.insertBefore(fallback, el)
              }}
            />
          ))}
        </div>
      </section>

      {/* ── Our Shared Beliefs — Photo cards ── */}
      <section style={{
        position: 'relative',
        overflow: 'hidden',
        borderBottom: `1px solid ${B}`,
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

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0 }}>
            {beliefs.map((b, i) => (
              <div
                key={b.title}
                className={`fade-up-${Math.min(i + 1, 4)}`}
                style={{
                  position: 'relative',
                  overflow: 'hidden',
                  height: 340,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  padding: '36px 32px',
                  cursor: 'default',
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={b.bg}
                  alt=""
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    filter: 'grayscale(100%) brightness(0.45)',
                    transition: 'transform 0.6s ease, filter 0.6s ease',
                  }}
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, rgba(8,8,8,0.1) 0%, rgba(8,8,8,0.7) 70%, rgba(8,8,8,0.85) 100%)',
                }} />
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <p style={{
                    fontFamily: "'BentonSans', sans-serif",
                    fontSize: 13,
                    fontWeight: 900,
                    letterSpacing: '0.14em',
                    color: G,
                    marginBottom: 8,
                  }}>
                    NO. {b.num}
                  </p>
                  <h3 style={{
                    fontFamily: "'BentonSans', sans-serif",
                    fontSize: 'clamp(20px, 2.5vw, 28px)',
                    fontWeight: 900,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: CR,
                    lineHeight: 1.2,
                    whiteSpace: 'pre-line',
                    margin: 0,
                    textShadow: '0 2px 12px rgba(0,0,0,0.5)',
                  }}>
                    {b.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VMG Cares — with scrolling partner logos ── */}
      <section style={{
        position: 'relative',
        overflow: 'hidden',
        borderBottom: `1px solid ${B}`,
      }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1200&q=80"
          alt=""
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'grayscale(70%) brightness(0.2)',
            pointerEvents: 'none',
          }}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(180deg, rgba(8,8,8,0.85) 0%, rgba(8,8,8,0.7) 50%, rgba(8,8,8,0.9) 100%)`,
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'relative',
          maxWidth: 800,
          margin: '0 auto',
          padding: '80px 56px 40px',
          textAlign: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18, marginBottom: 20 }}>
            <div style={{ width: 48, height: 1, background: G }} />
            <span style={{ fontSize: 10, letterSpacing: '0.38em', textTransform: 'uppercase', color: GB(0.6), fontWeight: 500 }}>Giving Back</span>
            <div style={{ width: 48, height: 1, background: G }} />
          </div>
          <h2 style={{
            fontFamily: "'BentonSans', sans-serif",
            fontSize: 'clamp(24px, 3vw, 36px)',
            fontWeight: 900,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: CR,
            margin: '0 0 32px',
          }}>
            VMG Cares
          </h2>
          <p style={{
            fontSize: 15,
            color: 'rgba(240,234,224,0.6)',
            lineHeight: 1.9,
            letterSpacing: '0.02em',
            marginBottom: 0,
          }}>
            It&apos;s not only our success that brings us gratification &mdash; it&apos;s the pleasure of knowing that clients have been served well. In turn, we&apos;re able to give back to the communities that support us. Alongside our daily business activities is a genuine interest for programs supporting youth in education and health.
          </p>
        </div>
        {/* Scrolling charity/foundation names */}
        <div style={{ position: 'relative', overflow: 'hidden', paddingBottom: 40 }}>
          <p style={{ textAlign: 'center', fontSize: 10, letterSpacing: '0.38em', textTransform: 'uppercase', color: 'rgba(240,234,224,0.3)', marginBottom: 16, fontWeight: 500 }}>
            Organizations We Support
          </p>
          <CharityMarquee />
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

      {/* Team Section */}
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

      {/* ── Our Approach ── */}
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
              <div key={a.step} className={`fade-up-${Math.min(i + 1, 4)}`}>
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

      <Footer />
    </div>
  )
}
