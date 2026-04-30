'use client'

import React, { useState } from 'react'
import Nav from '@/components/builder/Nav'
import Footer from '@/components/builder/Footer'
import EconomicIndicators from '@/components/builder/EconomicIndicators'
import { G, GL, CR, BG, BG2, B, GB, GRAD_SECTION } from '@/lib/tokens'
import { useFadeUp, useStaggerReveal } from '@/lib/animations'

interface Article {
  id: string
  title: string
  date: string
  author: string
  category: string
  url: string
  summary: string
  image?: string
}

const CATEGORIES = ['All', 'Real Estate & Development', 'Operating Businesses', 'Court Decisions']

const PAGE_SIZE = 9

export default function NewsPageClient({ articles }: { articles: Article[] }) {
  const [activeCategory, setActiveCategory] = useState('All')
  const [page, setPage] = useState(1)
  const heroFade = useFadeUp(0)
  const { ref: gridRef, getItemStyle } = useStaggerReveal(0.08)

  const filtered = activeCategory === 'All'
    ? articles
    : articles.filter(a => a.category === activeCategory)

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const pageStart = (safePage - 1) * PAGE_SIZE
  const visible = filtered.slice(pageStart, pageStart + PAGE_SIZE)

  // Reset to page 1 whenever the category changes
  React.useEffect(() => { setPage(1) }, [activeCategory])

  return (
    <main style={{ background: BG, color: CR, minHeight: '100vh', fontFamily: "'BentonSans', sans-serif" }}>
      <Nav />

      {/* Hero */}
      <section style={{ padding: '180px 40px 80px', background: GRAD_SECTION(0.5), textAlign: 'center' }}>
        <div {...heroFade}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16, justifyContent: 'center' }}>
            <div style={{ width: 36, height: 1, background: G, flexShrink: 0 }} />
            <span style={{ fontSize: 10, letterSpacing: '0.38em', textTransform: 'uppercase', color: 'rgba(240,234,224,0.35)', fontWeight: 500 }}>Insolvency News</span>
          </div>
          <h1 style={{
            fontSize: 'clamp(2.2rem, 4.5vw, 3.6rem)', fontWeight: 800,
            letterSpacing: '0.04em', textTransform: 'uppercase', lineHeight: 1.15,
            marginBottom: 20, maxWidth: 800, marginLeft: 'auto', marginRight: 'auto',
          }}>
            BC Insolvency &<br />Receivership News
          </h1>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(1rem, 1.8vw, 1.25rem)',
            color: 'rgba(240,234,224,0.7)', maxWidth: 600, margin: '0 auto', lineHeight: 1.7,
          }}>
            Tracking court-ordered sales, receiverships, and insolvency developments across British Columbia.
          </p>
        </div>
      </section>

      {/* Economic Indicators */}
      <EconomicIndicators />

      {/* Category Filter */}
      <section style={{ padding: '0 40px', maxWidth: 1300, margin: '0 auto' }}>
        <div style={{
          display: 'flex', gap: 8, flexWrap: 'wrap',
          borderBottom: `1px solid ${B}`, paddingBottom: 20, paddingTop: 40,
        }}>
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} style={{
              padding: '8px 20px', fontSize: 11, letterSpacing: '0.18em',
              textTransform: 'uppercase', fontWeight: 600, fontFamily: "'BentonSans', sans-serif",
              background: activeCategory === cat ? G : 'rgba(240,234,224,0.04)',
              color: activeCategory === cat ? '#080808' : 'rgba(240,234,224,0.7)',
              border: `1px solid ${activeCategory === cat ? G : B}`,
              cursor: 'pointer', transition: 'all 0.3s ease',
            }}>
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Articles Grid */}
      <section style={{ padding: '48px 40px 80px', maxWidth: 1300, margin: '0 auto' }}>
        <div ref={gridRef} style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: 28,
        }}>
          {visible.map((article, i) => (
            <ArticleCard key={article.id} article={article} style={getItemStyle(i)} />
          ))}
        </div>
        {filtered.length === 0 && (
          <p style={{ textAlign: 'center', color: 'rgba(240,234,224,0.7)', fontSize: 14, padding: '80px 0' }}>
            No articles found in this category.
          </p>
        )}

        {totalPages > 1 && (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 6, marginTop: 56, flexWrap: 'wrap',
          }}>
            <button
              type="button"
              onClick={() => { setPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
              disabled={safePage === 1}
              style={{
                padding: '10px 18px', fontSize: 11, letterSpacing: '0.2em', fontWeight: 700,
                textTransform: 'uppercase', fontFamily: "'BentonSans', sans-serif",
                background: 'transparent', color: safePage === 1 ? 'rgba(240,234,224,0.25)' : CR,
                border: `1px solid ${safePage === 1 ? B : 'rgba(240,234,224,0.18)'}`,
                cursor: safePage === 1 ? 'not-allowed' : 'pointer', transition: 'all 0.25s ease',
              }}
            >
              ← Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
              <button
                key={n}
                type="button"
                onClick={() => { setPage(n); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                aria-current={n === safePage ? 'page' : undefined}
                style={{
                  minWidth: 40, padding: '10px 14px', fontSize: 12, fontWeight: 700,
                  fontFamily: "'BentonSans', sans-serif", letterSpacing: '0.04em',
                  background: n === safePage ? G : 'rgba(240,234,224,0.04)',
                  color: n === safePage ? '#080808' : 'rgba(240,234,224,0.7)',
                  border: `1px solid ${n === safePage ? G : B}`,
                  cursor: 'pointer', transition: 'all 0.25s ease',
                }}
              >
                {n}
              </button>
            ))}
            <button
              type="button"
              onClick={() => { setPage(p => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
              disabled={safePage === totalPages}
              style={{
                padding: '10px 18px', fontSize: 11, letterSpacing: '0.2em', fontWeight: 700,
                textTransform: 'uppercase', fontFamily: "'BentonSans', sans-serif",
                background: 'transparent', color: safePage === totalPages ? 'rgba(240,234,224,0.25)' : CR,
                border: `1px solid ${safePage === totalPages ? B : 'rgba(240,234,224,0.18)'}`,
                cursor: safePage === totalPages ? 'not-allowed' : 'pointer', transition: 'all 0.25s ease',
              }}
            >
              Next →
            </button>
          </div>
        )}

        {totalPages > 1 && (
          <p style={{
            textAlign: 'center', marginTop: 16, fontSize: 11,
            letterSpacing: '0.18em', textTransform: 'uppercase',
            color: 'rgba(240,234,224,0.4)', fontWeight: 600,
          }}>
            Page {safePage} of {totalPages} · {filtered.length} article{filtered.length === 1 ? '' : 's'}
          </p>
        )}
      </section>

      {/* CTA */}
      <section style={{
        padding: '80px 40px', borderTop: `1px solid ${B}`,
        textAlign: 'center', background: GRAD_SECTION(0.25),
      }}>
        <h2 style={{
          fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 700,
          letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 16,
        }}>
          Have a Court-Ordered Mandate?
        </h2>
        <p style={{
          fontFamily: "'Cormorant Garamond', serif", fontSize: 16,
          color: 'rgba(240,234,224,0.7)', marginBottom: 32, maxWidth: 500, margin: '0 auto 32px',
        }}>
          Our team specializes in maximizing recovery on distressed and court-ordered real estate assets across BC.
        </p>
        <a href="/contact" style={{
          display: 'inline-block', padding: '14px 40px', background: G, color: '#080808',
          fontSize: 12, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase',
          textDecoration: 'none',
        }}>
          Contact Us
        </a>
      </section>

      <Footer />
    </main>
  )
}

function ArticleCard({ article, style }: { article: Article; style: React.CSSProperties }) {
  const [hovered, setHovered] = useState(false)
  const dateFormatted = new Date(article.date).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  })

  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...style,
        display: 'block',
        background: hovered ? 'rgba(240,234,224,0.03)' : BG2,
        border: `1px solid ${hovered ? GB(0.2) : B}`,
        padding: 0, overflow: 'hidden', textDecoration: 'none', color: 'inherit',
        transition: 'all 0.35s cubic-bezier(.22,1,.36,1)',
        transform: `${style.transform || ''} ${hovered ? 'translateY(-4px)' : ''}`.trim(),
      }}
    >
      {/* Article image */}
      {article.image && (
        <div style={{
          position: 'relative', height: 180, overflow: 'hidden',
          borderBottom: `1px solid ${B}`,
        }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={article.image}
            alt={article.title}
            style={{
              width: '100%', height: '100%', objectFit: 'cover',
              filter: hovered ? 'brightness(0.85)' : 'brightness(0.6) grayscale(30%)',
              transform: hovered ? 'scale(1.04)' : 'scale(1)',
              transition: 'all 0.6s cubic-bezier(.22,1,.36,1)',
            }}
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
          />
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: 60,
            background: `linear-gradient(to top, ${BG2}, transparent)`,
            pointerEvents: 'none',
          }} />
        </div>
      )}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '16px 28px', borderBottom: `1px solid ${B}`,
      }}>
        <span style={{ fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', color: G, fontWeight: 700 }}>
          {article.category}
        </span>
        <span style={{ fontSize: 11, color: 'rgba(240,234,224,0.7)', letterSpacing: '0.05em' }}>
          {dateFormatted}
        </span>
      </div>
      <div style={{ padding: '24px 28px 28px' }}>
        <h3 style={{
          fontSize: 18, fontWeight: 700, lineHeight: 1.4, letterSpacing: '0.02em',
          marginBottom: 12, color: hovered ? CR : 'rgba(240,234,224,0.88)', transition: 'color 0.3s',
        }}>
          {article.title}
        </h3>
        <p style={{ fontSize: 13, lineHeight: 1.75, color: 'rgba(240,234,224,0.45)', marginBottom: 20 }}>
          {article.summary}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 4, height: 4, borderRadius: '50%', background: G, opacity: 0.6 }} />
          <span style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: G, fontWeight: 600 }}>
            {article.author}
          </span>
        </div>
      </div>
    </a>
  )
}
