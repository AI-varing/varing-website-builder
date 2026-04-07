'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import Nav from '@/components/builder/Nav'
import Footer from '@/components/builder/Footer'
import ChatDemo from './ChatDemo'
import { G, GL, CR, BG, B, GB, GRAD_SECTION } from '@/lib/tokens'
import { useFadeUp, useStaggerReveal } from '@/lib/animations'

/* ═══════════════════════════════════════════════════════
   ANIMATED ORBITAL CONSTELLATION
   Central glowing node with capability satellites
   ═══════════════════════════════════════════════════════ */
function OrbitalConstellation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef = useRef(0)
  const nodesRef = useRef<{ x: number; y: number; r: number; label: string; angle: number; orbit: number; speed: number; icon: string }[]>([])

  const capabilities = [
    { label: 'Valuations', orbit: 140, speed: 0.0008, icon: '\u2261' },
    { label: 'Zoning', orbit: 140, speed: -0.0006, icon: '\u2316' },
    { label: 'Market Intel', orbit: 200, speed: 0.0005, icon: '\u2237' },
    { label: 'Creative AI', orbit: 200, speed: -0.0007, icon: '\u2726' },
    { label: 'Lead Capture', orbit: 260, speed: 0.0004, icon: '\u25C7' },
    { label: 'Analytics', orbit: 260, speed: -0.0005, icon: '\u25B3' },
  ]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const w = 600
    const h = 600
    canvas.width = w * dpr
    canvas.height = h * dpr
    canvas.style.width = `${w}px`
    canvas.style.height = `${h}px`
    ctx.scale(dpr, dpr)

    const cx = w / 2
    const cy = h / 2

    nodesRef.current = capabilities.map((c, i) => ({
      x: 0, y: 0, r: 24,
      label: c.label,
      angle: (Math.PI * 2 / (capabilities.length / 2)) * (i % 3) + (i >= 3 ? Math.PI / 3 : 0),
      orbit: c.orbit,
      speed: c.speed,
      icon: c.icon,
    }))

    let particles: { x: number; y: number; vx: number; vy: number; life: number; maxLife: number }[] = []

    const animate = (time: number) => {
      ctx.clearRect(0, 0, w, h)

      for (const orbitR of [140, 200, 260]) {
        ctx.beginPath()
        ctx.arc(cx, cy, orbitR, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(198,122,60,${0.08})`
        ctx.lineWidth = 1
        ctx.stroke()
      }

      const nodes = nodesRef.current
      nodes.forEach(n => {
        n.angle += n.speed
        n.x = cx + Math.cos(n.angle) * n.orbit
        n.y = cy + Math.sin(n.angle) * n.orbit
      })

      nodes.forEach(n => {
        const grad = ctx.createLinearGradient(cx, cy, n.x, n.y)
        grad.addColorStop(0, 'rgba(198,122,60,0.25)')
        grad.addColorStop(1, 'rgba(198,122,60,0.05)')
        ctx.beginPath()
        ctx.moveTo(cx, cy)
        ctx.lineTo(n.x, n.y)
        ctx.strokeStyle = grad
        ctx.lineWidth = 1
        ctx.stroke()
      })

      for (let i = 0; i < nodes.length; i++) {
        const next = nodes[(i + 1) % nodes.length]
        const dist = Math.hypot(nodes[i].x - next.x, nodes[i].y - next.y)
        if (dist < 320) {
          ctx.beginPath()
          ctx.moveTo(nodes[i].x, nodes[i].y)
          ctx.lineTo(next.x, next.y)
          ctx.strokeStyle = `rgba(198,122,60,${0.04 + (1 - dist / 320) * 0.08})`
          ctx.lineWidth = 0.5
          ctx.stroke()
        }
      }

      if (Math.random() < 0.1) {
        const n = nodes[Math.floor(Math.random() * nodes.length)]
        const dx = n.x - cx
        const dy = n.y - cy
        const len = Math.hypot(dx, dy)
        particles.push({
          x: cx, y: cy,
          vx: (dx / len) * 1.5,
          vy: (dy / len) * 1.5,
          life: 0, maxLife: len / 1.5,
        })
      }

      particles = particles.filter(p => {
        p.x += p.vx
        p.y += p.vy
        p.life++
        const alpha = 1 - p.life / p.maxLife
        if (alpha <= 0) return false
        ctx.beginPath()
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(198,122,60,${alpha * 0.8})`
        ctx.fill()
        return true
      })

      nodes.forEach(n => {
        const glow = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, 44)
        glow.addColorStop(0, 'rgba(198,122,60,0.12)')
        glow.addColorStop(1, 'transparent')
        ctx.fillStyle = glow
        ctx.fillRect(n.x - 44, n.y - 44, 88, 88)

        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(8,8,8,0.9)'
        ctx.fill()
        ctx.strokeStyle = 'rgba(198,122,60,0.45)'
        ctx.lineWidth = 1.5
        ctx.stroke()

        ctx.fillStyle = '#C67A3C'
        ctx.font = '16px serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(n.icon, n.x, n.y)

        ctx.fillStyle = 'rgba(240,234,224,0.6)'
        ctx.font = "600 9px 'BentonSans', sans-serif"
        ctx.textAlign = 'center'
        ctx.fillText(n.label.toUpperCase(), n.x, n.y + n.r + 16)
      })

      const pulse = Math.sin(time * 0.002) * 4
      const coreGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 70 + pulse)
      coreGlow.addColorStop(0, 'rgba(198,122,60,0.2)')
      coreGlow.addColorStop(0.5, 'rgba(198,122,60,0.06)')
      coreGlow.addColorStop(1, 'transparent')
      ctx.fillStyle = coreGlow
      ctx.fillRect(cx - 90, cy - 90, 180, 180)

      ctx.beginPath()
      ctx.arc(cx, cy, 36 + pulse * 0.3, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(12,10,8,0.95)'
      ctx.fill()
      ctx.strokeStyle = `rgba(198,122,60,${0.6 + Math.sin(time * 0.003) * 0.15})`
      ctx.lineWidth = 2
      ctx.stroke()

      ctx.fillStyle = '#C67A3C'
      ctx.font = "900 16px 'BentonSans', sans-serif"
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('AI', cx, cy)

      frameRef.current = requestAnimationFrame(animate)
    }

    frameRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frameRef.current)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ width: 600, height: 600, maxWidth: '100%', display: 'block', margin: '0 auto' }}
    />
  )
}

/* ═══════════════════════════════════════════════════════
   INTERACTIVE PROPERTY MAP — canvas scatter
   ═══════════════════════════════════════════════════════ */
function PropertyMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [properties, setProperties] = useState<any[]>([])
  const [hovered, setHovered] = useState<number | null>(null)
  const [inView, setInView] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch('/api/sold')
      .then(r => r.json())
      .then(data => setProperties(data || []))
      .catch(() => {})
  }, [])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setInView(true); obs.disconnect() }
    }, { threshold: 0.2 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  // Map cities to approximate positions in a grid layout
  const cityPositions: Record<string, { x: number; y: number }> = {
    'Surrey': { x: 0.4, y: 0.45 },
    'Langley': { x: 0.6, y: 0.5 },
    'Maple Ridge': { x: 0.75, y: 0.3 },
    'Vancouver': { x: 0.15, y: 0.35 },
    'Burnaby': { x: 0.28, y: 0.38 },
    'Coquitlam': { x: 0.45, y: 0.28 },
    'Abbotsford': { x: 0.85, y: 0.6 },
    'Delta': { x: 0.25, y: 0.65 },
    'Richmond': { x: 0.2, y: 0.55 },
  }

  const getPos = (city: string, i: number) => {
    const base = cityPositions[city] || { x: 0.5 + (i % 5) * 0.08, y: 0.4 + (i % 3) * 0.1 }
    // Add slight jitter so pins don't overlap
    return {
      x: base.x + (Math.sin(i * 7.3) * 0.04),
      y: base.y + (Math.cos(i * 5.1) * 0.04),
    }
  }

  if (!properties.length) return null

  return (
    <div ref={containerRef} style={{
      maxWidth: 1100, margin: '0 auto', padding: '0 40px',
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : 'translateY(30px)',
      transition: 'all 0.8s cubic-bezier(.22,1,.36,1)',
    }}>
      <div style={{
        position: 'relative',
        height: 420,
        background: 'rgba(240,234,224,0.02)',
        border: `1px solid ${B}`,
        overflow: 'hidden',
      }}>
        {/* Grid lines */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `
            linear-gradient(rgba(198,122,60,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(198,122,60,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }} />

        {/* City labels */}
        {Object.entries(cityPositions).map(([city, pos]) => (
          <div key={city} style={{
            position: 'absolute',
            left: `${pos.x * 100}%`, top: `${pos.y * 100}%`,
            transform: 'translate(-50%, 16px)',
            fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase',
            color: 'rgba(240,234,224,0.2)', fontWeight: 600,
            pointerEvents: 'none', whiteSpace: 'nowrap',
          }}>
            {city}
          </div>
        ))}

        {/* Property pins */}
        {properties.map((p, i) => {
          const pos = getPos(p.city, i)
          const isHovered = hovered === i
          return (
            <div
              key={p._id || i}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{
                position: 'absolute',
                left: `${pos.x * 100}%`, top: `${pos.y * 100}%`,
                transform: `translate(-50%, -50%) scale(${isHovered ? 1.8 : 1})`,
                transition: 'all 0.3s cubic-bezier(.22,1,.36,1)',
                cursor: 'pointer', zIndex: isHovered ? 10 : 1,
              }}
            >
              {/* Pin */}
              <div style={{
                width: 10, height: 10, borderRadius: '50%',
                background: G,
                boxShadow: isHovered ? `0 0 20px ${GB(0.6)}` : `0 0 8px ${GB(0.3)}`,
                transition: 'all 0.3s ease',
              }} />
              {/* Pulse ring */}
              <div style={{
                position: 'absolute', top: -4, left: -4,
                width: 18, height: 18, borderRadius: '50%',
                border: `1px solid ${GB(isHovered ? 0.4 : 0.15)}`,
                transition: 'all 0.3s ease',
              }} />
              {/* Tooltip */}
              {isHovered && (
                <div style={{
                  position: 'absolute', bottom: '100%', left: '50%',
                  transform: 'translateX(-50%)',
                  marginBottom: 12,
                  padding: '10px 14px',
                  background: 'rgba(12,12,12,0.95)',
                  border: `1px solid ${GB(0.3)}`,
                  backdropFilter: 'blur(12px)',
                  whiteSpace: 'nowrap',
                  animation: 'fadeIn 0.2s ease',
                }}>
                  {p.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.image} alt="" style={{ width: 160, height: 80, objectFit: 'cover', marginBottom: 8, filter: 'brightness(0.85)' }} />
                  )}
                  <p style={{ fontSize: 11, fontWeight: 900, color: CR, letterSpacing: '0.06em', margin: 0 }}>{p.address}</p>
                  <p style={{ fontSize: 9, color: GB(0.6), letterSpacing: '0.1em', textTransform: 'uppercase', margin: '4px 0 0' }}>
                    {p.city} {p.propertyType ? `\u00B7 ${p.propertyType}` : ''} {p.acres ? `\u00B7 ${p.acres}ac` : ''}
                  </p>
                </div>
              )}
            </div>
          )
        })}

        {/* Legend */}
        <div style={{
          position: 'absolute', bottom: 16, right: 20,
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: G }} />
          <span style={{ fontSize: 9, color: 'rgba(240,234,224,0.3)', letterSpacing: '0.1em' }}>
            {properties.length} SOLD PROPERTIES
          </span>
        </div>

        {/* Title */}
        <div style={{ position: 'absolute', top: 20, left: 24 }}>
          <p style={{
            fontSize: 10, fontWeight: 900, letterSpacing: '0.2em',
            textTransform: 'uppercase', color: GB(0.5), margin: 0,
          }}>Fraser Valley Coverage</p>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   PROPERTY SHOWCASE — real sold properties with images
   ═══════════════════════════════════════════════════════ */
function PropertyShowcase() {
  const [properties, setProperties] = useState<any[]>([])
  const [activeIdx, setActiveIdx] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    fetch('/api/sold')
      .then(r => r.json())
      .then(data => {
        const withImages = (data || []).filter((p: any) => p.image)
        setProperties(withImages.slice(0, 8))
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setInView(true); obs.disconnect() }
    }, { threshold: 0.15 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [properties.length])

  // Auto-rotate
  useEffect(() => {
    if (!properties.length) return
    const id = setInterval(() => setActiveIdx(i => (i + 1) % properties.length), 4000)
    return () => clearInterval(id)
  }, [properties.length])

  if (!properties.length) return <div ref={ref} style={{ minHeight: 480 }} />

  const active = properties[activeIdx]

  return (
    <div ref={ref} style={{
      maxWidth: 1100, margin: '0 auto', padding: '0 40px',
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : 'translateY(40px)',
      transition: 'all 1s cubic-bezier(.22,1,.36,1)',
    }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, minHeight: 480 }}>
        {/* Main image */}
        <div style={{ position: 'relative', overflow: 'hidden', background: '#111' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={active?.image}
            src={active?.image}
            alt={active?.address}
            style={{
              width: '100%', height: '100%', objectFit: 'cover',
              filter: 'brightness(0.8) contrast(1.05)',
              transition: 'opacity 0.6s ease',
            }}
          />
          {/* AI analysis overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(180deg, transparent 40%, rgba(8,8,8,0.9) 100%)',
          }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '28px 32px' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '5px 14px', background: GB(0.2), border: `1px solid ${GB(0.3)}`,
              marginBottom: 14,
            }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#34D399', boxShadow: '0 0 8px rgba(52,211,153,0.5)' }} />
              <span style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: G, fontWeight: 700 }}>AI Analyzed</span>
            </div>
            <h3 style={{
              fontFamily: "'BentonSans', sans-serif",
              fontSize: 22, fontWeight: 900, color: CR,
              textTransform: 'uppercase', letterSpacing: '0.04em',
              margin: '0 0 6px',
            }}>
              {active?.address}
            </h3>
            <p style={{
              fontSize: 12, color: 'rgba(240,234,224,0.5)',
              letterSpacing: '0.12em', textTransform: 'uppercase',
            }}>
              {active?.city} &middot; {active?.propertyType} {active?.acres ? `\u00B7 ${active.acres} Acres` : ''}
            </p>
          </div>
          {/* Scan line */}
          <div style={{
            position: 'absolute', left: 0, right: 0, height: 1,
            background: `linear-gradient(90deg, transparent, ${G}, transparent)`,
            animation: 'scanLine 4s ease-in-out infinite',
            pointerEvents: 'none',
          }} />
        </div>

        {/* Thumbnail grid */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: 'repeat(4, 1fr)',
          gap: 2,
        }}>
          {properties.map((p, i) => (
            <div
              key={p._id || i}
              onClick={() => setActiveIdx(i)}
              style={{
                position: 'relative', overflow: 'hidden', cursor: 'pointer',
                border: i === activeIdx ? `2px solid ${G}` : '2px solid transparent',
                transition: 'all 0.3s ease',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.image}
                alt={p.address}
                style={{
                  width: '100%', height: '100%', objectFit: 'cover',
                  filter: i === activeIdx ? 'brightness(0.9)' : 'brightness(0.5) grayscale(40%)',
                  transition: 'filter 0.4s ease',
                }}
              />
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                padding: '8px 10px',
                background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
              }}>
                <p style={{
                  fontSize: 9, fontWeight: 700, color: i === activeIdx ? G : 'rgba(240,234,224,0.5)',
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>
                  {p.address}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   ANIMATED COUNTER STAT
   ═══════════════════════════════════════════════════════ */
function AnimStat({ target, prefix = '', suffix = '', label }: { target: number; prefix?: string; suffix?: string; label: string }) {
  const [count, setCount] = useState(0)
  const [inView, setInView] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setInView(true); obs.disconnect() }
    }, { threshold: 0.3 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    if (!inView) return
    const dur = 2200
    const start = Date.now()
    const id = setInterval(() => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / dur, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(target * eased))
      if (progress >= 1) clearInterval(id)
    }, 16)
    return () => clearInterval(id)
  }, [inView, target])

  return (
    <div ref={ref} style={{ textAlign: 'center' }}>
      <div style={{
        fontFamily: "'BentonSans', sans-serif",
        fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 900,
        color: G, lineHeight: 1,
      }}>
        {prefix}{count.toLocaleString()}{suffix}
      </div>
      <p style={{
        fontSize: 10, letterSpacing: '0.2em',
        textTransform: 'uppercase',
        color: 'rgba(240,234,224,0.4)',
        fontWeight: 600, marginTop: 12,
      }}>{label}</p>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   CAPABILITY CARDS — interactive hover
   ═══════════════════════════════════════════════════════ */
const CAPABILITIES = [
  {
    title: 'Instant Valuations',
    desc: 'BC Assessment data aggregated and delivered in under 60 seconds.',
    stat: '60s',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C67A3C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
      </svg>
    ),
  },
  {
    title: 'Zoning Intelligence',
    desc: 'Automated lookups across 15+ Fraser Valley municipalities.',
    stat: '15+',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C67A3C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
      </svg>
    ),
  },
  {
    title: 'Market Intelligence',
    desc: 'AI-powered analysis of trends, comparables, and pricing signals.',
    stat: '600+',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C67A3C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
  },
  {
    title: 'Creative Production',
    desc: 'Strategic marketing visuals and concepts generated weekly.',
    stat: '52x',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C67A3C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ),
  },
  {
    title: 'Lead Capture',
    desc: '24/7 chatbot that captures and qualifies leads automatically.',
    stat: '24/7',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C67A3C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
      </svg>
    ),
  },
  {
    title: 'Predictive Analytics',
    desc: 'Identify emerging corridors before the market moves.',
    stat: '\u221E',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C67A3C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/>
      </svg>
    ),
  },
]

function TiltCard({ cap }: { cap: typeof CAPABILITIES[0] }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [transform, setTransform] = useState('perspective(800px) rotateX(0deg) rotateY(0deg)')
  const [hovered, setHovered] = useState(false)

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const el = cardRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setTransform(`perspective(800px) rotateY(${x * 14}deg) rotateX(${-y * 14}deg) scale(1.03)`)
  }, [])

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setTransform('perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)') }}
      onMouseMove={handleMouseMove}
      style={{
        padding: '40px 32px',
        background: hovered ? GB(0.06) : BG,
        border: `1px solid ${hovered ? GB(0.25) : B}`,
        position: 'relative', overflow: 'hidden',
        cursor: 'default',
        transition: hovered ? 'none' : 'all 0.5s cubic-bezier(.22,1,.36,1)',
        transform,
        boxShadow: hovered ? `0 20px 60px ${GB(0.15)}` : 'none',
      }}
    >
      <div style={{
        position: 'absolute', top: 12, right: 16,
        fontFamily: "'BentonSans', sans-serif",
        fontSize: 48, fontWeight: 900,
        color: hovered ? GB(0.12) : GB(0.06),
        lineHeight: 1, transition: 'color 0.4s ease',
      }}>{cap.stat}</div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          width: 48, height: 48,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: GB(0.08), border: `1px solid ${GB(0.15)}`,
          borderRadius: 10, marginBottom: 20,
        }}>
          {cap.icon}
        </div>

        <h3 style={{
          fontFamily: "'BentonSans', sans-serif",
          fontSize: 13, fontWeight: 900,
          letterSpacing: '0.12em', textTransform: 'uppercase',
          color: hovered ? G : CR, marginBottom: 10,
          transition: 'color 0.3s ease',
        }}>{cap.title}</h3>
        <p style={{
          fontSize: 13, color: 'rgba(240,234,224,0.5)',
          lineHeight: 1.8, letterSpacing: '0.01em',
        }}>{cap.desc}</p>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   TYPING HERO TEXT
   ═══════════════════════════════════════════════════════ */
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

/* ═══════════════════════════════════════════════════════
   SPEED RACE — animated bar race
   ═══════════════════════════════════════════════════════ */
function SpeedRace() {
  const [racing, setRacing] = useState(false)
  const [atlasFinished, setAtlasFinished] = useState(false)
  const [tradProgress, setTradProgress] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const hasRun = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !hasRun.current) {
        hasRun.current = true
        setTimeout(() => setRacing(true), 600)
        obs.disconnect()
      }
    }, { threshold: 0.4 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    if (!racing) return
    // ATLAS finishes in 1.2s
    const atlasTimer = setTimeout(() => setAtlasFinished(true), 1200)
    // Traditional crawls slowly
    const tradId = setInterval(() => {
      setTradProgress(p => {
        if (p >= 18) { clearInterval(tradId); return 18 }
        return p + 0.15
      })
    }, 50)
    return () => { clearTimeout(atlasTimer); clearInterval(tradId) }
  }, [racing])

  const steps = ['BC Assessment', 'Zoning', 'Comparables', 'ALR Check', 'Report']

  return (
    <div ref={ref} style={{ maxWidth: 800, margin: '0 auto' }}>
      {/* ATLAS lane */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
          <span style={{ fontSize: 11, fontWeight: 900, letterSpacing: '0.2em', color: G, textTransform: 'uppercase', minWidth: 80 }}>ATLAS AI</span>
          <span style={{ fontSize: 10, color: 'rgba(240,234,224,0.3)', letterSpacing: '0.1em' }}>60 seconds</span>
        </div>
        <div style={{ position: 'relative', height: 48, background: 'rgba(240,234,224,0.03)', border: `1px solid ${B}`, overflow: 'hidden' }}>
          <div style={{
            position: 'absolute', top: 0, bottom: 0, left: 0,
            width: racing ? '100%' : '0%',
            background: `linear-gradient(90deg, ${GB(0.3)}, ${G})`,
            transition: racing ? 'width 1.2s cubic-bezier(.25,.46,.45,.94)' : 'none',
            boxShadow: racing ? `0 0 30px ${GB(0.4)}` : 'none',
          }} />
          {/* Step markers */}
          {steps.map((s, i) => (
            <div key={s} style={{
              position: 'absolute', top: 0, bottom: 0,
              left: `${(i + 1) * 20}%`,
              width: 1, background: 'rgba(240,234,224,0.06)',
            }} />
          ))}
          {atlasFinished && (
            <div style={{
              position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
              display: 'flex', alignItems: 'center', gap: 8,
              animation: 'fadeIn 0.3s ease',
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#34D399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              <span style={{ fontSize: 12, fontWeight: 900, color: '#34D399', letterSpacing: '0.1em' }}>COMPLETE</span>
            </div>
          )}
          <div style={{
            position: 'absolute', bottom: 2, left: 0, right: 0,
            display: 'flex', justifyContent: 'space-around',
          }}>
            {steps.map((s, i) => (
              <span key={s} style={{ fontSize: 8, color: 'rgba(240,234,224,0.25)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{s}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Traditional lane */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
          <span style={{ fontSize: 11, fontWeight: 900, letterSpacing: '0.2em', color: '#e74c3c', textTransform: 'uppercase', minWidth: 80, opacity: 0.7 }}>Traditional</span>
          <span style={{ fontSize: 10, color: 'rgba(240,234,224,0.3)', letterSpacing: '0.1em' }}>3–5 days</span>
        </div>
        <div style={{ position: 'relative', height: 48, background: 'rgba(240,234,224,0.03)', border: `1px solid ${B}`, overflow: 'hidden' }}>
          <div style={{
            position: 'absolute', top: 0, bottom: 0, left: 0,
            width: `${tradProgress}%`,
            background: 'linear-gradient(90deg, rgba(231,76,60,0.2), rgba(231,76,60,0.5))',
            transition: 'width 0.05s linear',
          }} />
          {steps.map((s, i) => (
            <div key={s} style={{
              position: 'absolute', top: 0, bottom: 0,
              left: `${(i + 1) * 20}%`,
              width: 1, background: 'rgba(240,234,224,0.06)',
            }} />
          ))}
          {atlasFinished && (
            <div style={{
              position: 'absolute', left: `${tradProgress}%`, top: '50%', transform: 'translate(-50%, -50%)',
              display: 'flex', alignItems: 'center', gap: 6,
              whiteSpace: 'nowrap',
              animation: 'fadeIn 0.3s ease',
            }}>
              <span style={{ fontSize: 10, color: 'rgba(231,76,60,0.7)', fontWeight: 700, letterSpacing: '0.08em' }}>Still working...</span>
            </div>
          )}
          <div style={{
            position: 'absolute', bottom: 2, left: 0, right: 0,
            display: 'flex', justifyContent: 'space-around',
          }}>
            {steps.map((s) => (
              <span key={s} style={{ fontSize: 8, color: 'rgba(240,234,224,0.25)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{s}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Result */}
      {atlasFinished && (
        <div style={{
          textAlign: 'center', marginTop: 40,
          animation: 'fadeIn 0.5s ease',
        }}>
          <p style={{
            fontFamily: "'BentonSans', sans-serif",
            fontSize: 'clamp(20px, 3vw, 28px)',
            fontWeight: 900, color: CR, letterSpacing: '0.04em',
          }}>
            ATLAS finished <span style={{ color: G }}>4,320x faster</span>
          </p>
          <p style={{ fontSize: 12, color: 'rgba(240,234,224,0.35)', marginTop: 6, letterSpacing: '0.06em' }}>
            60 seconds vs 3–5 business days
          </p>
        </div>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   CURSOR TRAIL — gold particles following mouse
   ═══════════════════════════════════════════════════════ */
function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const particlesRef = useRef<{ x: number; y: number; vx: number; vy: number; life: number; size: number }[]>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = document.documentElement.scrollHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const handleScroll = () => {
      canvas.height = document.documentElement.scrollHeight
    }
    window.addEventListener('scroll', handleScroll)

    const handleMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY + window.scrollY }
      // Spawn particles
      for (let i = 0; i < 2; i++) {
        particlesRef.current.push({
          x: mouseRef.current.x,
          y: mouseRef.current.y,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2 - 1,
          life: 1,
          size: Math.random() * 3 + 1,
        })
      }
    }
    window.addEventListener('mousemove', handleMouse)

    let frame = 0
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particlesRef.current = particlesRef.current.filter(p => {
        p.x += p.vx
        p.y += p.vy
        p.life -= 0.025
        if (p.life <= 0) return false
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(198,122,60,${p.life * 0.5})`
        ctx.fill()
        return true
      })
      frame = requestAnimationFrame(animate)
    }
    frame = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('mousemove', handleMouse)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute', top: 0, left: 0,
        width: '100%', height: '100%',
        pointerEvents: 'none', zIndex: 9999,
      }}
    />
  )
}

/* ═══════════════════════════════════════════════════════
   IMAGE DIVIDER — full-bleed photo with centered label
   ═══════════════════════════════════════════════════════ */
function ImageDivider({ src, label }: { src: string; label: string }) {
  return (
    <div style={{ position: 'relative', height: 240, overflow: 'hidden' }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" style={{
        position: 'absolute', inset: 0,
        width: '100%', height: '140%', objectFit: 'cover',
        filter: 'grayscale(50%) brightness(0.35)',
        transform: 'translateY(-15%)',
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        background: `linear-gradient(180deg, ${BG} 0%, transparent 25%, transparent 75%, ${BG} 100%)`,
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 48, height: 1, background: G, margin: '0 auto 14px' }} />
          <span style={{
            fontSize: 11, letterSpacing: '0.4em', textTransform: 'uppercase',
            color: 'rgba(240,234,224,0.6)', fontWeight: 600,
          }}>{label}</span>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════ */
export default function AIPage() {
  const heroFade = useFadeUp()
  const capsFade = useFadeUp()
  const chatFade = useFadeUp()

  return (
    <div style={{ background: BG, minHeight: '100vh', position: 'relative' }}>
      <style>{`
        @keyframes drawLine { to { stroke-dashoffset: 0; } }
        @keyframes scanLine {
          0% { top: -2px; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: calc(100% + 2px); opacity: 0; }
        }
        @keyframes gridPulse {
          0%, 100% { opacity: 0.03; }
          50% { opacity: 0.08; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 768px) {
          .atlas-grid-3 { grid-template-columns: 1fr !important; }
          .atlas-grid-2 { grid-template-columns: 1fr !important; }
          .atlas-stats { flex-direction: column !important; gap: 40px !important; }
        }
      `}</style>

      {/* Cursor trail */}
      <CursorTrail />

      <Nav />

      {/* ════════ HERO ════════ */}
      <section style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}>
        {/* Video background */}
        <video
          autoPlay muted loop playsInline
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover',
            filter: 'brightness(0.2) grayscale(40%)',
            pointerEvents: 'none',
          }}
        >
          <source src="/timelapse-bg.mp4" type="video/mp4" />
        </video>
        {/* Grid overlay on top of video */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `
            linear-gradient(rgba(198,122,60,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(198,122,60,0.04) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
          animation: 'gridPulse 8s ease-in-out infinite',
          maskImage: 'radial-gradient(ellipse at 50% 50%, black 20%, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(ellipse at 50% 50%, black 20%, transparent 70%)',
        }} />

        {/* Concentric glow rings */}
        {[400, 600, 800].map((size, i) => (
          <div key={size} style={{
            position: 'absolute',
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: size, height: size,
            borderRadius: '50%',
            border: `1px solid rgba(198,122,60,${0.08 - i * 0.02})`,
            pointerEvents: 'none',
          }} />
        ))}

        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 500, height: 500, borderRadius: '50%',
          background: `radial-gradient(circle, ${GB(0.12)} 0%, transparent 60%)`,
          pointerEvents: 'none',
        }} />

        <div ref={heroFade.ref} style={{
          ...heroFade.style,
          position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 900, padding: '0 40px',
        }}>
          {/* Live badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            padding: '10px 28px',
            background: 'rgba(240,234,224,0.02)',
            border: `1px solid ${GB(0.15)}`,
            backdropFilter: 'blur(16px)',
            marginBottom: 48,
          }}>
            <div style={{
              width: 8, height: 8, borderRadius: '50%',
              background: '#34D399',
              boxShadow: '0 0 12px rgba(52,211,153,0.5)',
            }} />
            <span style={{
              fontSize: 10, letterSpacing: '0.3em',
              textTransform: 'uppercase', color: 'rgba(240,234,224,0.55)', fontWeight: 600,
            }}>
              AI-Powered &middot; Live
            </span>
          </div>

          <h1 style={{
            fontFamily: "'BentonSans', sans-serif",
            fontSize: 'clamp(48px, 7vw, 96px)',
            fontWeight: 900,
            letterSpacing: '-0.01em',
            color: CR,
            margin: '0 0 8px',
            lineHeight: 0.95,
          }}>
            ATLAS<span style={{ color: G }}>.AI</span>
          </h1>

          <div style={{
            width: 64, height: 2, background: `linear-gradient(90deg, transparent, ${G}, transparent)`,
            margin: '24px auto',
          }} />

          <p style={{
            fontFamily: "'BentonSans', sans-serif",
            fontSize: 'clamp(12px, 1.4vw, 16px)',
            fontWeight: 700,
            letterSpacing: '0.3em',
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
            color: 'rgba(240,234,224,0.55)',
            lineHeight: 1.7,
            maxWidth: 680,
            margin: '0 auto 56px',
          }}>
            <TypeWriter text={"We built proprietary AI tools that analyze properties in seconds, not days \u2014 giving our clients a decisive edge in BC\u2019s fastest-moving land market."} speed={22} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
            <a href="#showcase" style={{
              fontFamily: "'BentonSans', sans-serif",
              fontSize: 10, fontWeight: 700,
              letterSpacing: '0.24em', textTransform: 'uppercase',
              color: BG, background: G,
              padding: '16px 44px', textDecoration: 'none',
              transition: 'all 0.3s ease',
              boxShadow: `0 0 40px ${GB(0.2)}`,
            }}>
              See It In Action
            </a>
            <a href="#chat" style={{
              fontFamily: "'BentonSans', sans-serif",
              fontSize: 10, fontWeight: 700,
              letterSpacing: '0.24em', textTransform: 'uppercase',
              color: 'rgba(240,234,224,0.6)',
              background: 'transparent',
              border: `1px solid ${GB(0.2)}`,
              padding: '16px 44px', textDecoration: 'none',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(8px)',
            }}>
              Try It Live
            </a>
          </div>
        </div>
      </section>

      {/* ════════ POSITIONING BAND ════════ */}
      <section style={{
        background: G,
        padding: '32px 56px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', left: 0, right: 0, height: 1,
          background: 'rgba(255,255,255,0.3)',
          animation: 'scanLine 4s ease-in-out infinite',
          pointerEvents: 'none',
        }} />
        <p style={{
          fontFamily: "'BentonSans', sans-serif",
          fontSize: 'clamp(0.8rem, 1.5vw, 1.1rem)',
          fontWeight: 900, letterSpacing: '0.28em',
          textTransform: 'uppercase', color: '#fff',
          lineHeight: 1.6, margin: 0,
          maxWidth: 900, marginLeft: 'auto', marginRight: 'auto',
        }}>
          While others wait for reports, our clients already have the data
        </p>
      </section>

      {/* ════════ STATS STRIP ════════ */}
      <section style={{
        borderBottom: `1px solid ${B}`,
        padding: '72px 56px',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: `radial-gradient(ellipse at 50% 50%, ${GB(0.04)} 0%, transparent 60%)`,
          pointerEvents: 'none',
        }} />
        <div className="atlas-stats" style={{
          display: 'flex', justifyContent: 'center', gap: 80,
          maxWidth: 1000, margin: '0 auto', position: 'relative',
        }}>
          <AnimStat target={600} suffix="+" label="Development Sites Sold" />
          <div style={{ width: 1, background: B, alignSelf: 'stretch' }} />
          <AnimStat target={4} prefix="$" suffix="B+" label="Total Volume" />
          <div style={{ width: 1, background: B, alignSelf: 'stretch' }} />
          <AnimStat target={15} suffix="+" label="Cities Mapped" />
          <div style={{ width: 1, background: B, alignSelf: 'stretch' }} />
          <AnimStat target={60} suffix="s" label="Analysis Time" />
        </div>
      </section>

      {/* ════════ LIVE CHAT — moved up for engagement ════════ */}
      <section id="chat" style={{
        position: 'relative',
        padding: '96px 56px 100px',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: `radial-gradient(ellipse at 50% 30%, ${GB(0.05)} 0%, transparent 50%)`,
          pointerEvents: 'none',
        }} />
        <div ref={chatFade.ref} style={{ ...chatFade.style, textAlign: 'center', marginBottom: 48, position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18, marginBottom: 20 }}>
            <div style={{ width: 48, height: 1, background: G }} />
            <span style={{ fontSize: 10, letterSpacing: '0.38em', textTransform: 'uppercase', color: GB(0.6), fontWeight: 500 }}>Try It Live</span>
            <div style={{ width: 48, height: 1, background: G }} />
          </div>
          <h2 style={{
            fontFamily: "'BentonSans', sans-serif",
            fontSize: 'clamp(24px, 3vw, 36px)',
            fontWeight: 900, letterSpacing: '0.06em',
            textTransform: 'uppercase', color: CR, margin: '0 0 12px',
          }}>
            Ask ATLAS Anything
          </h2>
          <p style={{
            fontSize: 14, color: 'rgba(240,234,224,0.45)',
            maxWidth: 500, margin: '0 auto', lineHeight: 1.7,
          }}>
            Property valuations, zoning data, market comparables &mdash; get answers in seconds.
          </p>
        </div>
        <ChatDemo autoPlay />
      </section>

      {/* ════════ IMAGE DIVIDER ════════ */}
      <ImageDivider src="/vancouver-waterfront.jpg" label="The Speed Advantage" />

      {/* ════════ SPEED RACE ════════ */}
      <section style={{
        position: 'relative',
        padding: '96px 56px',
        overflow: 'hidden',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18, marginBottom: 20 }}>
            <div style={{ width: 48, height: 1, background: G }} />
            <span style={{ fontSize: 10, letterSpacing: '0.38em', textTransform: 'uppercase', color: GB(0.6), fontWeight: 500 }}>The Race</span>
            <div style={{ width: 48, height: 1, background: G }} />
          </div>
          <h2 style={{
            fontFamily: "'BentonSans', sans-serif",
            fontSize: 'clamp(28px, 3.5vw, 42px)',
            fontWeight: 900, letterSpacing: '0.06em',
            textTransform: 'uppercase', color: CR, margin: 0,
          }}>
            Days to Seconds
          </h2>
        </div>
        <SpeedRace />
      </section>

      {/* ════════ IMAGE DIVIDER ════════ */}
      <ImageDivider src="/mandates-bg.jpg" label="Real Results" />

      {/* ════════ PROPERTY SHOWCASE ════════ */}
      <section id="showcase" style={{
        position: 'relative',
        padding: '96px 0',
        overflow: 'hidden',
      }}>
        <div style={{
          textAlign: 'center', marginBottom: 56,
          padding: '0 56px', position: 'relative',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18, marginBottom: 20 }}>
            <div style={{ width: 48, height: 1, background: G }} />
            <span style={{ fontSize: 10, letterSpacing: '0.38em', textTransform: 'uppercase', color: GB(0.6), fontWeight: 500 }}>Portfolio</span>
            <div style={{ width: 48, height: 1, background: G }} />
          </div>
          <h2 style={{
            fontFamily: "'BentonSans', sans-serif",
            fontSize: 'clamp(28px, 3.5vw, 42px)',
            fontWeight: 900, letterSpacing: '0.06em',
            textTransform: 'uppercase', color: CR, margin: '0 0 12px',
          }}>
            AI-Analyzed Properties
          </h2>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 16, fontStyle: 'italic',
            color: 'rgba(240,234,224,0.45)',
            maxWidth: 520, margin: '0 auto',
          }}>
            Every property in our portfolio is analyzed by ATLAS in under 60 seconds. Click any property to explore.
          </p>
        </div>
        <div style={{ position: 'relative' }}>
          <PropertyShowcase />
        </div>

        {/* Interactive map below showcase */}
        <div style={{ padding: '0 56px', position: 'relative' }}>
          <div style={{ textAlign: 'center', margin: '64px 0 32px' }}>
            <span style={{ fontSize: 10, letterSpacing: '0.38em', textTransform: 'uppercase', color: GB(0.4), fontWeight: 500 }}>Hover to explore</span>
          </div>
          <PropertyMap />
        </div>
      </section>

      {/* ════════ IMAGE DIVIDER ════════ */}
      <ImageDivider src="/we-sell-dirt-bg.png" label="AI Capabilities" />

      {/* ════════ ORBITAL CONSTELLATION ════════ */}
      <section id="constellation" style={{
        position: 'relative',
        padding: '80px 56px',
        borderTop: `1px solid ${B}`,
        overflow: 'hidden',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18, marginBottom: 20 }}>
            <div style={{ width: 48, height: 1, background: G }} />
            <span style={{ fontSize: 10, letterSpacing: '0.38em', textTransform: 'uppercase', color: GB(0.6), fontWeight: 500 }}>Neural Network</span>
            <div style={{ width: 48, height: 1, background: G }} />
          </div>
          <h2 style={{
            fontFamily: "'BentonSans', sans-serif",
            fontSize: 'clamp(28px, 3.5vw, 42px)',
            fontWeight: 900, letterSpacing: '0.06em',
            textTransform: 'uppercase', color: CR, margin: '0 0 8px',
          }}>
            AI Capabilities
          </h2>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 16, fontStyle: 'italic',
            color: 'rgba(240,234,224,0.45)',
            maxWidth: 500, margin: '0 auto',
          }}>
            Six interconnected AI systems working in concert.
          </p>
        </div>

        <OrbitalConstellation />

        {/* Capability cards */}
        <div ref={capsFade.ref} style={{ ...capsFade.style }}>
          <div className="atlas-grid-3" style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 2, maxWidth: 1100, margin: '40px auto 0',
          }}>
            {CAPABILITIES.map((cap, i) => (
              <TiltCard key={cap.title} cap={cap} />
            ))}
          </div>
        </div>
      </section>

      {/* ════════ TECH STRIP ════════ */}
      <section style={{
        borderTop: `1px solid ${B}`,
        padding: '48px 56px',
        textAlign: 'center',
      }}>
        <p style={{
          fontSize: 9, letterSpacing: '0.38em', textTransform: 'uppercase',
          color: 'rgba(240,234,224,0.25)', fontWeight: 600, marginBottom: 24,
        }}>Powered By</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8 }}>
          {['Machine Learning', 'Natural Language Processing', 'Predictive Analytics', 'Geospatial Intelligence', 'Computer Vision', 'Real-Time Pipelines', 'AI Creative Generation', 'Automated Lead Scoring'].map(t => (
            <span key={t} style={{
              fontFamily: "'SF Mono', 'Fira Code', monospace",
              fontSize: 10, fontWeight: 500,
              letterSpacing: '0.04em', color: GB(0.5),
              padding: '8px 16px',
              border: `1px solid ${GB(0.1)}`,
            }}>{t}</span>
          ))}
        </div>
      </section>

      {/* ════════ BOTTOM CTA ════════ */}
      <section style={{
        position: 'relative',
        overflow: 'hidden',
        padding: '120px 56px',
        textAlign: 'center',
      }}>
        {[200, 350, 500].map((s, i) => (
          <div key={s} style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: s, height: s, borderRadius: '50%',
            border: `1px solid rgba(198,122,60,${0.06 - i * 0.015})`,
            pointerEvents: 'none',
          }} />
        ))}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400, height: 400, borderRadius: '50%',
          background: `radial-gradient(circle, ${GB(0.1)} 0%, transparent 60%)`,
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{
            fontFamily: "'BentonSans', sans-serif",
            fontSize: 'clamp(32px, 4.5vw, 56px)',
            fontWeight: 900, letterSpacing: '0.04em',
            textTransform: 'uppercase', color: CR,
            margin: '0 0 20px', lineHeight: 1.05,
          }}>
            Ready for<br />Faster Insights?
          </h2>
          <p style={{
            fontSize: 15, color: 'rgba(240,234,224,0.5)',
            lineHeight: 1.8, maxWidth: 500,
            margin: '0 auto 48px', letterSpacing: '0.02em',
          }}>
            Whether you&apos;re a developer, lender, or landowner &mdash; our AI tools deliver answers in seconds, not days.
          </p>
          <a href="/contact" style={{
            fontFamily: "'BentonSans', sans-serif",
            fontSize: 11, fontWeight: 700,
            letterSpacing: '0.24em', textTransform: 'uppercase',
            color: BG, background: G,
            padding: '18px 52px', textDecoration: 'none',
            boxShadow: `0 0 40px ${GB(0.25)}`,
            transition: 'all 0.3s ease',
          }}>
            Get Your 60-Second Assessment
          </a>
        </div>
      </section>

      <Footer />
    </div>
  )
}
