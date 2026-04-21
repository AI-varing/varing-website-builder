'use client'

import React, { useEffect, useState } from 'react'
import { G, CR, BG2, B, GB } from '@/lib/tokens'

interface RateAnnouncement {
  date: string
  isoDate: string
  hasMpr: boolean
  rate?: number | null
}

interface FraserValleyStat {
  value: string
  label: string
  source?: string
}

interface IndicatorsData {
  boc: {
    currentRate: number | null
    lastUpdated: string | null
    schedule: RateAnnouncement[]
  }
  fraserValley: FraserValleyStat[]
}

const FALLBACK: IndicatorsData = {
  boc: {
    currentRate: null,
    lastUpdated: null,
    schedule: [
      { date: 'April 29', isoDate: '2026-04-29', hasMpr: true },
      { date: 'June 10', isoDate: '2026-06-10', hasMpr: false },
      { date: 'July 15', isoDate: '2026-07-15', hasMpr: true },
      { date: 'September 2', isoDate: '2026-09-02', hasMpr: false },
      { date: 'October 28', isoDate: '2026-10-28', hasMpr: true },
      { date: 'December 9', isoDate: '2026-12-09', hasMpr: false },
    ],
  },
  fraserValley: [
    { value: '480K', label: 'Total Acres of Land' },
    { value: '1.03M', label: 'Population of the Fraser Valley' },
    { value: '7.7%', label: 'Avg Population Increase Yr/Yr' },
    { value: '4.9%', label: 'Unemployment Rate' },
  ],
}

export default function EconomicIndicators() {
  const [data, setData] = useState<IndicatorsData>(FALLBACK)

  useEffect(() => {
    let cancelled = false
    fetch('/api/economic-indicators')
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (!cancelled && d) setData({ ...FALLBACK, ...d, boc: { ...FALLBACK.boc, ...(d.boc || {}) } }) })
      .catch(() => {})
    return () => { cancelled = true }
  }, [])

  const today = new Date().toISOString().slice(0, 10)

  return (
    <section style={{ padding: '0 40px', maxWidth: 1300, margin: '0 auto 48px' }}>
      {/* BoC Rate Announcements */}
      <div style={{ padding: '48px 0 32px', borderBottom: `1px solid ${B}` }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 28 }}>
          <div>
            <p style={{ fontSize: 10, letterSpacing: '0.38em', textTransform: 'uppercase', color: 'rgba(240,234,224,0.35)', marginBottom: 8 }}>
              Bank of Canada · 2026 Schedule
            </p>
            <h2 style={{ fontSize: 'clamp(1.4rem, 2.5vw, 1.8rem)', fontWeight: 800, letterSpacing: '0.04em', textTransform: 'uppercase', lineHeight: 1.2 }}>
              Interest Rate Announcements
            </h2>
          </div>
          {data.boc.currentRate !== null && (
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(240,234,224,0.5)', marginBottom: 4 }}>
                Current Policy Rate
              </p>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, color: G, fontWeight: 500, lineHeight: 1 }}>
                {data.boc.currentRate.toFixed(2)}%
              </p>
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
          {data.boc.schedule.map(item => {
            const isPast = item.isoDate < today
            return (
              <div key={item.isoDate} style={{
                padding: '18px 20px',
                background: isPast ? 'rgba(240,234,224,0.02)' : BG2,
                border: `1px solid ${isPast ? B : GB(0.15)}`,
                opacity: isPast ? 0.55 : 1,
              }}>
                <p style={{
                  fontFamily: "'Cormorant Garamond', serif", fontSize: 22,
                  color: CR, fontWeight: 500, lineHeight: 1.1, marginBottom: 6,
                }}>
                  {item.date}
                </p>
                <p style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(240,234,224,0.5)' }}>
                  Rate Announcement{item.hasMpr ? ' + MPR' : ''}
                </p>
                {item.rate != null && (
                  <p style={{ fontSize: 13, color: G, marginTop: 8, fontWeight: 600 }}>
                    {item.rate.toFixed(2)}%
                  </p>
                )}
              </div>
            )
          })}
        </div>
        <p style={{ fontSize: 10, color: 'rgba(240,234,224,0.35)', marginTop: 16, letterSpacing: '0.08em' }}>
          Source: <a href="https://www.bankofcanada.ca/core-functions/monetary-policy/key-interest-rate/" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(240,234,224,0.55)', textDecoration: 'underline' }}>Bank of Canada</a>
          {data.boc.lastUpdated && ` · Updated ${new Date(data.boc.lastUpdated).toLocaleDateString('en-CA')}`}
        </p>
      </div>

      {/* Fraser Valley Stats */}
      <div style={{ padding: '48px 0 16px' }}>
        <p style={{ fontSize: 10, letterSpacing: '0.38em', textTransform: 'uppercase', color: 'rgba(240,234,224,0.35)', marginBottom: 8 }}>
          Statistics Canada · Fraser Valley
        </p>
        <h2 style={{ fontSize: 'clamp(1.4rem, 2.5vw, 1.8rem)', fontWeight: 800, letterSpacing: '0.04em', textTransform: 'uppercase', lineHeight: 1.2, marginBottom: 28 }}>
          Regional Indicators
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 24 }}>
          {data.fraserValley.map(stat => (
            <div key={stat.label} style={{ padding: '20px 4px', borderTop: `1px solid ${GB(0.25)}` }}>
              <p style={{
                fontFamily: "'BentonSans', sans-serif",
                fontSize: 'clamp(2rem, 3.5vw, 2.8rem)',
                fontWeight: 900, color: CR, lineHeight: 1, marginBottom: 10, letterSpacing: '-0.01em',
              }}>
                {stat.value}
              </p>
              <p style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(240,234,224,0.55)', fontWeight: 600 }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 10, color: 'rgba(240,234,224,0.35)', marginTop: 20, letterSpacing: '0.08em' }}>
          Source: <a href="https://www150.statcan.gc.ca/" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(240,234,224,0.55)', textDecoration: 'underline' }}>Statistics Canada</a>
          {' · Fraser Valley Regional District'}
        </p>
      </div>
    </section>
  )
}
