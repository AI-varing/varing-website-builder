'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { G, CR, BG2, B, GB } from '@/lib/tokens'

interface RateAnnouncement {
  date: string
  isoDate: string
  hasMpr: boolean
  rate?: number | null
}

interface RatePoint {
  date: string
  rate: number
}

interface FraserValleyStat {
  value: string
  label: string
}

interface IndicatorsData {
  boc: {
    currentRate: number | null
    lastUpdated: string | null
    schedule: RateAnnouncement[]
    history: RatePoint[]
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
    history: [],
  },
  fraserValley: [
    { value: '480K', label: 'Total Acres of Land' },
    { value: '1.03M', label: 'Population of the Fraser Valley' },
    { value: '7.7%', label: 'Avg Population Increase Yr/Yr' },
    { value: '4.9%', label: 'Unemployment Rate' },
  ],
}

function mprUrl(isoDate: string, isPast: boolean) {
  if (!isPast) return 'https://www.bankofcanada.ca/publications/mpr/'
  const [y, m] = isoDate.split('-')
  return `https://www.bankofcanada.ca/${y}/${m}/mpr-${isoDate}/`
}

function announcementUrl(isoDate: string, isPast: boolean) {
  if (!isPast) return 'https://www.bankofcanada.ca/core-functions/monetary-policy/key-interest-rate/'
  const [y, m] = isoDate.split('-')
  return `https://www.bankofcanada.ca/${y}/${m}/fad-press-release-${isoDate}/`
}

function daysBetween(a: Date, b: Date) {
  return Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24))
}

export default function EconomicIndicators() {
  const [data, setData] = useState<IndicatorsData>(FALLBACK)

  useEffect(() => {
    let cancelled = false
    fetch('/api/economic-indicators')
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (cancelled || !d) return
        setData({
          ...FALLBACK,
          ...d,
          boc: { ...FALLBACK.boc, ...(d.boc || {}) },
        })
      })
      .catch(() => {})
    return () => { cancelled = true }
  }, [])

  const today = new Date()
  const todayIso = today.toISOString().slice(0, 10)

  // Partition schedule
  const nextItem = useMemo(
    () => data.boc.schedule.find(s => s.isoDate >= todayIso) || data.boc.schedule[data.boc.schedule.length - 1],
    [data.boc.schedule, todayIso]
  )
  const past = data.boc.schedule.filter(s => s.isoDate < todayIso)
  const upcoming = data.boc.schedule.filter(s => s.isoDate >= todayIso)

  const nextDate = nextItem ? new Date(nextItem.isoDate + 'T09:00:00-04:00') : null
  const daysTo = nextDate ? daysBetween(today, nextDate) : null

  // For each past announcement, find the rate that was in force BEFORE it so
  // we can render "rose / fell / stayed the same" deltas. Schedule order isn't
  // guaranteed, so sort by isoDate first.
  const pastWithRate = data.boc.schedule
    .filter((s) => s.isoDate < todayIso && s.rate != null)
    .sort((a, b) => a.isoDate.localeCompare(b.isoDate))
  const priorRate = new Map<string, number | null>()
  for (let i = 0; i < pastWithRate.length; i++) {
    priorRate.set(pastWithRate[i].isoDate, i > 0 ? (pastWithRate[i - 1].rate ?? null) : null)
  }
  function rateDelta(curr: number, prior: number | null) {
    if (prior == null) return null
    const d = Math.round((curr - prior) * 100) / 100
    if (d === 0) return { text: 'stayed the same', color: 'rgba(240,234,224,0.6)', icon: '→' }
    if (d > 0)  return { text: `rose ${Math.abs(d).toFixed(2)}%`, color: '#e07a5f', icon: '↑' }
    return         { text: `fell ${Math.abs(d).toFixed(2)}%`, color: '#7fb069', icon: '↓' }
  }

  return (
    <section style={{ padding: '0 40px', maxWidth: 1300, margin: '0 auto 48px' }}>
      <div style={{ padding: '48px 0 16px', borderBottom: `1px solid ${B}` }}>
        <p style={{ fontSize: 10, letterSpacing: '0.38em', textTransform: 'uppercase', color: 'rgba(240,234,224,0.35)', marginBottom: 8 }}>
          Bank of Canada · 2026 Schedule
        </p>
        <h2 style={{ fontSize: 'clamp(1.4rem, 2.5vw, 1.8rem)', fontWeight: 800, letterSpacing: '0.04em', textTransform: 'uppercase', lineHeight: 1.2, marginBottom: 32 }}>
          Interest Rate Tracker
        </h2>

        {/* ─── Featured Next Announcement + Rate Chart ─── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 340px) 1fr', gap: 24, marginBottom: 40, alignItems: 'stretch' }}>
          {/* NEXT UP CARD */}
          <div style={{
            padding: '28px 28px 32px',
            background: `linear-gradient(135deg, rgba(198,122,60,0.12) 0%, rgba(198,122,60,0.03) 100%)`,
            border: `1px solid ${GB(0.35)}`,
            display: 'flex', flexDirection: 'column', gap: 14,
          }}>
            <p style={{ fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: G, fontWeight: 700 }}>
              Next Announcement
            </p>
            {nextItem ? (
              <>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2rem,3.2vw,2.8rem)', color: CR, fontWeight: 500, lineHeight: 1.05, letterSpacing: '-0.01em' }}>
                  {nextItem.date}
                </p>
                {daysTo !== null && daysTo >= 0 && (
                  <p style={{ fontSize: 12, color: 'rgba(240,234,224,0.65)', letterSpacing: '0.1em' }}>
                    in <strong style={{ color: CR }}>{daysTo}</strong> day{daysTo === 1 ? '' : 's'}
                  </p>
                )}
                <div style={{ width: 36, height: 1, background: GB(0.4), margin: '4px 0 2px' }} />
                <p style={{ fontSize: 12, color: 'rgba(240,234,224,0.75)', lineHeight: 1.55 }}>
                  {nextItem.hasMpr
                    ? 'Rate decision published with the quarterly Monetary Policy Report — a ~40-page analysis of the economy, inflation, and rate outlook.'
                    : 'Rate decision only — short press release, no quarterly report.'}
                </p>
                <div style={{ display: 'flex', gap: 10, marginTop: 'auto', flexWrap: 'wrap' }}>
                  <a href={announcementUrl(nextItem.isoDate, false)} target="_blank" rel="noopener noreferrer" style={{
                    fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 700,
                    padding: '8px 14px', background: G, color: '#080808', textDecoration: 'none',
                  }}>
                    BoC Rate Page →
                  </a>
                  {nextItem.hasMpr && (
                    <a href={mprUrl(nextItem.isoDate, false)} target="_blank" rel="noopener noreferrer" style={{
                      fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 700,
                      padding: '8px 14px', border: `1px solid ${G}`, color: G, textDecoration: 'none',
                    }}>
                      MPR Archive →
                    </a>
                  )}
                </div>
              </>
            ) : (
              <p style={{ color: 'rgba(240,234,224,0.5)' }}>No upcoming announcements.</p>
            )}
          </div>

          {/* RATE CHART */}
          <RateChart
            history={data.boc.history}
            schedule={data.boc.schedule}
            currentRate={data.boc.currentRate}
          />
        </div>

        {/* ─── Timeline list ─── */}
        <div style={{ display: 'grid', gap: 0 }}>
          {data.boc.schedule.map(item => {
            const isPast = item.isoDate < todayIso
            const isNext = item.isoDate === nextItem?.isoDate
            return (
              <div key={item.isoDate} style={{
                display: 'grid', gridTemplateColumns: '160px 110px 1fr auto', gap: 20, alignItems: 'center',
                padding: '18px 12px', borderTop: `1px solid ${B}`,
                background: isNext ? 'rgba(198,122,60,0.04)' : 'transparent',
                opacity: isPast ? 0.62 : 1,
              }}>
                <p style={{
                  fontFamily: "'Cormorant Garamond', serif", fontSize: 18,
                  color: CR, fontWeight: 500, letterSpacing: '-0.01em',
                }}>
                  {item.date}
                </p>
                <div>
                  {item.hasMpr
                    ? <span style={{ fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: G, fontWeight: 700, border: `1px solid ${GB(0.5)}`, padding: '3px 8px' }}>Rate + MPR</span>
                    : <span style={{ fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(240,234,224,0.5)', fontWeight: 700, border: `1px solid ${B}`, padding: '3px 8px' }}>Rate Only</span>
                  }
                </div>
                <p style={{ fontSize: 11, color: 'rgba(240,234,224,0.55)', letterSpacing: '0.08em' }}>
                  {isPast && item.rate != null
                    ? (() => {
                        const d = rateDelta(item.rate, priorRate.get(item.isoDate) ?? null)
                        return (
                          <>
                            Set rate to <strong style={{ color: CR, fontWeight: 700 }}>{item.rate.toFixed(2)}%</strong>
                            {d && (
                              <span style={{ marginLeft: 12, color: d.color, fontWeight: 700, letterSpacing: '0.04em' }}>
                                {d.icon} {d.text}
                              </span>
                            )}
                          </>
                        )
                      })()
                    : isNext
                      ? <span style={{ color: G, letterSpacing: '0.2em', textTransform: 'uppercase', fontSize: 10, fontWeight: 700 }}>↑ Next Up</span>
                      : <span style={{ letterSpacing: '0.2em', textTransform: 'uppercase', fontSize: 10 }}>Upcoming</span>
                  }
                </p>
                <div style={{ display: 'flex', gap: 14 }}>
                  {item.hasMpr && (
                    <a href={mprUrl(item.isoDate, isPast)} target="_blank" rel="noopener noreferrer" style={{
                      fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: G, textDecoration: 'none', fontWeight: 700,
                    }}>
                      MPR →
                    </a>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        <p style={{ fontSize: 10, color: 'rgba(240,234,224,0.35)', marginTop: 20, letterSpacing: '0.08em', paddingBottom: 24 }}>
          Source: <a href="https://www.bankofcanada.ca/core-functions/monetary-policy/key-interest-rate/" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(240,234,224,0.55)', textDecoration: 'underline' }}>Bank of Canada</a>
          {data.boc.lastUpdated && ` · Rate data updated ${new Date(data.boc.lastUpdated).toLocaleDateString('en-CA')}`}
        </p>
      </div>

      {/* ─── Fraser Valley Stats ─── */}
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

/* ───── Rate trajectory chart ───── */
function RateChart({ history, schedule, currentRate }: {
  history: RatePoint[]
  schedule: RateAnnouncement[]
  currentRate: number | null
}) {
  const W = 620
  const H = 240
  const PAD = { top: 24, right: 20, bottom: 36, left: 36 }

  // Define time window: 18 months back to end of 2026
  const today = new Date()
  const start = new Date(today)
  start.setMonth(start.getMonth() - 18)
  const end = new Date('2026-12-31')
  const startMs = start.getTime()
  const endMs = end.getTime()

  const recentHistory = history.filter(h => {
    const d = new Date(h.date).getTime()
    return d >= startMs
  })

  // Reduce daily observations to rate-change points only (BoC holds between decisions)
  const changePoints = recentHistory.filter((p, i) => i === 0 || p.rate !== recentHistory[i - 1].rate)

  // Y domain
  const rates = recentHistory.map(h => h.rate)
  // Prefer the last plotted observation as the source of truth — that way the
  // header's "Current" figure can never disagree with where the step-line ends.
  const effectiveCurrent = rates.length ? rates[rates.length - 1] : currentRate
  const rateMin = rates.length ? Math.min(...rates) : 2
  const rateMax = rates.length ? Math.max(...rates) : 5
  const yMin = Math.max(0, Math.floor((rateMin - 0.5) * 2) / 2)
  const yMax = Math.ceil((rateMax + 0.5) * 2) / 2

  const xScale = (ms: number) => PAD.left + ((ms - startMs) / (endMs - startMs)) * (W - PAD.left - PAD.right)
  const yScale = (v: number) => PAD.top + (1 - (v - yMin) / (yMax - yMin)) * (H - PAD.top - PAD.bottom)

  // Build step-path for historical rate (step-after shape since BoC holds between decisions)
  let path = ''
  changePoints.forEach((p, i) => {
    const x = xScale(new Date(p.date).getTime())
    const y = yScale(p.rate)
    if (i === 0) path += `M ${x} ${y}`
    else {
      const prevY = yScale(changePoints[i - 1].rate)
      path += ` L ${x} ${prevY} L ${x} ${y}`
    }
  })

  // Extend the last known rate horizontally up to "today" so the line reaches the present
  const todayMs = today.getTime()
  const todayX = xScale(todayMs)
  if (changePoints.length && effectiveCurrent !== null) {
    const last = changePoints[changePoints.length - 1]
    path += ` L ${todayX} ${yScale(last.rate)}`
  }

  // Y-axis ticks
  const yTicks: number[] = []
  for (let v = yMin; v <= yMax; v += 0.5) yTicks.push(v)

  return (
    <div style={{
      background: `linear-gradient(135deg, rgba(198,122,60,0.10) 0%, rgba(198,122,60,0.02) 55%, ${BG2} 100%)`,
      border: `1px solid ${B}`,
      padding: '16px 20px',
      overflow: 'hidden',
      position: 'relative',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
        <p style={{ fontSize: 10, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'rgba(240,234,224,0.55)', fontWeight: 600 }}>
          Policy Rate · Last 18 mo → Year End 2026
        </p>
        {effectiveCurrent !== null && (
          <p style={{ fontSize: 14, color: G, fontWeight: 700 }}>
            Current: {effectiveCurrent.toFixed(2)}%
          </p>
        )}
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }}>
        {/* Y grid + labels */}
        {yTicks.map(v => (
          <g key={v}>
            <line x1={PAD.left} y1={yScale(v)} x2={W - PAD.right} y2={yScale(v)} stroke="rgba(240,234,224,0.06)" strokeWidth={1} />
            <text x={PAD.left - 8} y={yScale(v) + 3} fontSize={10} fill="rgba(240,234,224,0.4)" textAnchor="end" fontFamily="sans-serif">{v.toFixed(1)}%</text>
          </g>
        ))}

        {/* X axis baseline */}
        <line x1={PAD.left} y1={H - PAD.bottom} x2={W - PAD.right} y2={H - PAD.bottom} stroke="rgba(240,234,224,0.12)" strokeWidth={1} />

        {/* Month labels (every 3 months) */}
        {Array.from({ length: 30 }).map((_, i) => {
          const d = new Date(start.getFullYear(), start.getMonth() + i * 3, 1)
          if (d.getTime() > endMs) return null
          const x = xScale(d.getTime())
          if (x < PAD.left || x > W - PAD.right) return null
          return (
            <text key={i} x={x} y={H - PAD.bottom + 16} fontSize={9} fill="rgba(240,234,224,0.4)" textAnchor="middle" fontFamily="sans-serif">
              {d.toLocaleDateString('en-CA', { month: 'short', year: '2-digit' })}
            </text>
          )
        })}

        {/* Today vertical divider */}
        <line x1={todayX} y1={PAD.top} x2={todayX} y2={H - PAD.bottom} stroke="rgba(240,234,224,0.25)" strokeWidth={1} strokeDasharray="3 3" />
        <text x={todayX + 4} y={PAD.top + 10} fontSize={9} fill="rgba(240,234,224,0.55)" fontFamily="sans-serif">TODAY</text>

        {/* Dotted forward projection at current rate (held until next decision) */}
        {effectiveCurrent !== null && (
          <line
            x1={todayX}
            y1={yScale(effectiveCurrent)}
            x2={W - PAD.right}
            y2={yScale(effectiveCurrent)}
            stroke={CR}
            strokeWidth={1.2}
            strokeDasharray="3 4"
            opacity={0.55}
          />
        )}

        {/* Historical rate step-line */}
        <path d={path} stroke={CR} strokeWidth={2} fill="none" strokeLinejoin="round" />

        {/* Rate-change data points (dots on the Y axis values) */}
        {changePoints.map(p => {
          const x = xScale(new Date(p.date).getTime())
          const y = yScale(p.rate)
          return (
            <g key={p.date}>
              <circle cx={x} cy={y} r={3} fill={CR} stroke="#080808" strokeWidth={1.5} />
              <title>{`${p.date}: ${p.rate.toFixed(2)}%`}</title>
            </g>
          )
        })}

        {/* Current rate dot — sits at the end of the history line */}
        {effectiveCurrent !== null && (
          <g>
            <circle cx={todayX} cy={yScale(effectiveCurrent)} r={5} fill={G} stroke="#080808" strokeWidth={2} />
            <title>{`Today: ${effectiveCurrent.toFixed(2)}%`}</title>
          </g>
        )}

      </svg>
      {/* Legend */}
      <div style={{ display: 'flex', gap: 20, marginTop: 10, fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(240,234,224,0.55)', fontWeight: 600, flexWrap: 'wrap' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 14, height: 2, background: CR }} /> Rate History</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 14, height: 0, borderTop: `2px dashed ${CR}`, opacity: 0.6 }} /> Projected Hold</span>
      </div>
    </div>
  )
}
