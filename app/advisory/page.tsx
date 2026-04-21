'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Nav from '@/components/builder/Nav'
import Footer from '@/components/builder/Footer'
import { G, GL, CR, BG, BG2, B, GB, GRAD_SECTION } from '@/lib/tokens'
import { useFadeUp, useStaggerReveal, useFadeFromLeft, useFadeFromRight } from '@/lib/animations'
import FluidGradient from '@/components/builder/FluidGradient'

const SERVICES = [
  {
    title: 'Restructuring of Business Affairs & Debt',
    subtitle: 'Strategic Recovery Planning',
    icon: '01',
    description: 'When debt obligations exceed asset value, a structured approach to reorganization protects stakeholder interests and maximizes recovery. We work alongside receivers, trustees, and legal counsel to develop market-driven disposition strategies that align with restructuring timelines.',
    points: ['Asset valuation & market positioning', 'Court-approved sale processes', 'Stakeholder communication & reporting', 'Accelerated timeline management'],
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80',
  },
  {
    title: 'Mergers & Acquisitions',
    subtitle: 'Strategic Asset Disposition',
    icon: '02',
    description: 'Distressed M&A requires speed, discretion, and deep market knowledge. Whether you\'re a receiver liquidating a portfolio or a lender seeking to recover through a controlled sale, our team identifies qualified buyers and structures transactions that protect your position.',
    points: ['Confidential buyer identification', 'Portfolio & single-asset disposition', 'Cross-border transaction support', 'Due diligence coordination'],
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
  },
  {
    title: 'Sale Leaseback Opportunities',
    subtitle: 'For Active Businesses with Real Estate',
    icon: '03',
    description: 'For operating businesses sitting on valuable real estate, a sale-leaseback unlocks capital without disrupting operations. We connect business owners with investors seeking stable, income-producing assets — and structure deals that work for both sides.',
    points: ['Capital release without relocation', 'Long-term lease structuring', 'Investor matching & negotiation', 'Valuation & market benchmarking'],
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
  },
  {
    title: 'Joint Venture Opportunities',
    subtitle: 'Capital Meets Expertise',
    icon: '04',
    description: 'When a lender inherits development-zoned land, the fastest path to recovery isn\'t always a sale. A joint venture with an experienced developer can unlock significantly higher returns. We broker these partnerships, aligning capital with execution capability.',
    points: ['Developer-lender matchmaking', 'Deal structuring & term sheets', 'Feasibility & highest-and-best-use analysis', 'Ongoing project advisory'],
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80',
  },
  {
    title: 'Land Disposition & Marketing',
    subtitle: 'Court-Ordered & Distressed Land Sales',
    icon: '05',
    description: 'You have land. You need it gone — at the best price, in the shortest time. We\'ve sold 600+ development and investment sites across BC. Our database of 6,000+ qualified buyers, combined with aggressive multi-channel marketing, creates competitive tension that drives value.',
    points: ['600+ land transactions closed', 'Database of 6,000+ active buyers', 'Zoning & development potential analysis', 'Sealed bid & competitive offer processes'],
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80',
  },
  {
    title: 'Development Consulting & Entitlement',
    subtitle: 'Maximize Value Before You Sell',
    icon: '06',
    description: 'Raw land and entitled land are two very different assets. Before you sell, we assess whether rezoning, subdivision, or development permit applications could significantly increase the recovery value — and whether the timeline justifies the investment.',
    points: ['Zoning & OCP analysis', 'Municipal pre-application consultation', 'Highest-and-best-use assessment', 'Cost-benefit analysis for entitlement'],
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80',
  },
]

export default function AdvisoryPage() {
  const heroFade = useFadeUp(0)
  const { ref: gridRef, getItemStyle } = useStaggerReveal(0.12)

  return (
    <main style={{ background: BG, color: CR, minHeight: '100vh', fontFamily: "'BentonSans', sans-serif" }}>
      <Nav />

      {/* ─── Hero ─── */}
      <section style={{
        padding: '180px 56px 100px',
        position: 'relative',
        overflow: 'hidden',
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'center',
      }}>
        {/* Background image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80"
          alt=""
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'cover', filter: 'brightness(0.15) grayscale(60%)',
          }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, rgba(8,8,8,0.95) 0%, rgba(8,8,8,0.7) 50%, rgba(8,8,8,0.9) 100%)',
        }} />

        <div {...heroFade} style={{ ...heroFade.style, position: 'relative', zIndex: 1, maxWidth: 800 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
            <div style={{ width: 48, height: 2, background: G }} />
            <span style={{ fontSize: 11, letterSpacing: '0.35em', textTransform: 'uppercase', color: G, fontWeight: 600 }}>Advisory Services</span>
          </div>
          <h1 style={{
            fontSize: 'clamp(2.4rem, 5vw, 4rem)',
            fontWeight: 900,
            letterSpacing: '0.03em',
            textTransform: 'uppercase',
            lineHeight: 1.1,
            marginBottom: 28,
          }}>
            Your Asset.<br />
            <span style={{ color: G }}>Our Execution.</span>
          </h1>
          <p style={{
            fontSize: 18,
            lineHeight: 1.8,
            color: 'rgba(240,234,224,0.6)',
            maxWidth: 600,
            marginBottom: 40,
          }}>
            When a borrower defaults and you&rsquo;re left holding land, commercial assets, or an operating business &mdash; you need a partner who moves fast, communicates clearly, and maximizes recovery. That&rsquo;s what we do.
          </p>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <a href="/contact" style={{
              padding: '16px 40px', background: G, color: '#fff',
              fontSize: 12, fontWeight: 700, letterSpacing: '0.22em',
              textTransform: 'uppercase', textDecoration: 'none', borderRadius: 2,
              boxShadow: `0 4px 24px rgba(198,122,60,0.3)`,
            }}>
              Schedule a Consultation
            </a>
            <a href="tel:+16048325766" style={{
              padding: '16px 40px', border: '1px solid rgba(240,234,224,0.2)',
              color: 'rgba(240,234,224,0.7)', fontSize: 12, letterSpacing: '0.22em',
              textTransform: 'uppercase', textDecoration: 'none', borderRadius: 2,
            }}>
              Call 604.832.5766
            </a>
          </div>
        </div>
      </section>

      {/* ─── Problem Statement ─── */}
      <section style={{
        padding: '100px 56px',
        background: '#F5E6D3',
        position: 'relative',
        overflow: 'hidden',
        textAlign: 'center',
      }}>
        <FluidGradient />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 800, margin: '0 auto' }}>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(1.6rem, 3vw, 2.4rem)',
            fontWeight: 400, color: '#2A1508',
            lineHeight: 1.5, marginBottom: 24,
          }}>
            &ldquo;We just received this property back from a defaulted loan.
            <br />What do we do now?&rdquo;
          </h2>
          <p style={{
            fontSize: 15, lineHeight: 1.8, color: 'rgba(42,21,8,0.6)',
            maxWidth: 600, margin: '0 auto',
          }}>
            Whether it&rsquo;s a single lot or a multi-parcel assembly, our team provides end-to-end advisory and execution &mdash; from initial valuation through court-approved sale to final closing.
          </p>
        </div>
      </section>

      {/* ─── Services Grid ─── */}
      <section style={{ padding: '100px 56px', background: BG }}>
        <div style={{ maxWidth: 1300, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 72 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16, justifyContent: 'center' }}>
              <div style={{ width: 36, height: 1, background: G, flexShrink: 0 }} />
              <span style={{ fontSize: 10, letterSpacing: '0.38em', textTransform: 'uppercase', color: G, fontWeight: 500 }}>What We Do</span>
            </div>
            <h2 style={{
              fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
              fontWeight: 800, textTransform: 'uppercase',
              letterSpacing: '0.04em', marginBottom: 16,
            }}>
              Advisory Services
            </h2>
            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 18, color: 'rgba(240,234,224,0.7)',
              maxWidth: 550, margin: '0 auto',
            }}>
              Six specialized services designed for lenders, receivers, and insolvency professionals navigating distressed real estate.
            </p>
          </div>

          <div ref={gridRef}>
            {SERVICES.map((service, i) => (
              <ServiceCard key={service.title} service={service} index={i} style={getItemStyle(i)} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── Bottom CTA ─── */}
      <section style={{
        padding: '100px 56px',
        background: '#F5E6D3',
        position: 'relative',
        overflow: 'hidden',
        textAlign: 'center',
      }}>
        <FluidGradient />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{
            fontSize: 'clamp(1.6rem, 3.5vw, 2.6rem)',
            fontWeight: 900, color: '#2A1508',
            textTransform: 'uppercase', letterSpacing: '0.04em',
            marginBottom: 16,
          }}>
            Ready to Recover Value?
          </h2>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 18, color: 'rgba(42,21,8,0.55)',
            marginBottom: 40,
            maxWidth: 500, margin: '0 auto 40px',
          }}>
            Every day your asset sits idle, value erodes. Let&rsquo;s start the conversation.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/contact" style={{
              padding: '16px 44px', background: '#2A1508', color: '#F5E6D3',
              fontSize: 12, fontWeight: 700, letterSpacing: '0.22em',
              textTransform: 'uppercase', textDecoration: 'none', borderRadius: 2,
            }}>
              Contact Our Team
            </a>
            <a href="mailto:info@targetedadvisors.ca" style={{
              padding: '16px 44px', border: '2px solid #2A1508', color: '#2A1508',
              fontSize: 12, fontWeight: 700, letterSpacing: '0.22em',
              textTransform: 'uppercase', textDecoration: 'none', borderRadius: 2,
            }}>
              Email Us Directly
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

/* ─── Service Card — alternating layout ─── */
function ServiceCard({ service, index, style }: { service: typeof SERVICES[0]; index: number; style: React.CSSProperties }) {
  const [hovered, setHovered] = useState(false)
  const isEven = index % 2 === 0

  return (
    <div
      style={{
        ...style,
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 0,
        marginBottom: 2,
        background: hovered ? 'rgba(240,234,224,0.02)' : BG2,
        border: `1px solid ${hovered ? GB(0.15) : B}`,
        overflow: 'hidden',
        transition: 'all 0.4s ease',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div style={{
        position: 'relative',
        minHeight: 400,
        order: isEven ? 0 : 1,
        overflow: 'hidden',
      }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={service.image}
          alt={service.title}
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'cover',
            filter: hovered ? 'grayscale(0%) brightness(0.75)' : 'grayscale(60%) brightness(0.5)',
            transform: hovered ? 'scale(1.04)' : 'scale(1)',
            transition: 'all 0.8s cubic-bezier(.22,1,.36,1)',
          }}
        />
        {/* Number overlay */}
        <div style={{
          position: 'absolute', top: 32, left: 32,
          fontSize: 72, fontWeight: 900, color: 'rgba(198,122,60,0.15)',
          fontFamily: "'BentonSans', sans-serif", lineHeight: 1,
        }}>
          {service.icon}
        </div>
      </div>

      {/* Content */}
      <div style={{
        padding: '56px 48px',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        order: isEven ? 1 : 0,
      }}>
        <span style={{
          fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase',
          color: G, fontWeight: 600, marginBottom: 12,
        }}>
          {service.subtitle}
        </span>
        <h3 style={{
          fontSize: 24, fontWeight: 800, textTransform: 'uppercase',
          letterSpacing: '0.03em', lineHeight: 1.3, marginBottom: 20,
        }}>
          {service.title}
        </h3>
        <p style={{
          fontSize: 14, lineHeight: 1.85, color: 'rgba(240,234,224,0.55)',
          marginBottom: 28,
        }}>
          {service.description}
        </p>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {service.points.map(point => (
            <li key={point} style={{
              fontSize: 12, letterSpacing: '0.08em', color: 'rgba(240,234,224,0.7)',
              padding: '8px 0', borderBottom: `1px solid ${B}`,
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <div style={{ width: 6, height: 6, background: G, borderRadius: '50%', flexShrink: 0, opacity: 0.6 }} />
              {point}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
