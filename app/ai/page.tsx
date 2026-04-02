'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import Nav from '@/components/builder/Nav'
import Footer from '@/components/builder/Footer'
import ChatDemo from './ChatDemo'
import { G, GL, CR, BG, B, GB } from '@/lib/tokens'

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

    // Initialize node angles
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

      // Draw orbit rings
      for (const orbitR of [140, 200, 260]) {
        ctx.beginPath()
        ctx.arc(cx, cy, orbitR, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(198,122,60,${0.06})`
        ctx.lineWidth = 1
        ctx.stroke()
      }

      // Draw connection lines between nodes
      const nodes = nodesRef.current
      nodes.forEach(n => {
        n.angle += n.speed
        n.x = cx + Math.cos(n.angle) * n.orbit
        n.y = cy + Math.sin(n.angle) * n.orbit
      })

      // Lines from center to each node
      nodes.forEach(n => {
        const grad = ctx.createLinearGradient(cx, cy, n.x, n.y)
        grad.addColorStop(0, 'rgba(198,122,60,0.2)')
        grad.addColorStop(1, 'rgba(198,122,60,0.04)')
        ctx.beginPath()
        ctx.moveTo(cx, cy)
        ctx.lineTo(n.x, n.y)
        ctx.strokeStyle = grad
        ctx.lineWidth = 1
        ctx.stroke()
      })

      // Lines between adjacent nodes
      for (let i = 0; i < nodes.length; i++) {
        const next = nodes[(i + 1) % nodes.length]
        const dist = Math.hypot(nodes[i].x - next.x, nodes[i].y - next.y)
        if (dist < 320) {
          ctx.beginPath()
          ctx.moveTo(nodes[i].x, nodes[i].y)
          ctx.lineTo(next.x, next.y)
          ctx.strokeStyle = `rgba(198,122,60,${0.03 + (1 - dist / 320) * 0.06})`
          ctx.lineWidth = 0.5
          ctx.stroke()
        }
      }

      // Spawn data particles along connections
      if (Math.random() < 0.08) {
        const n = nodes[Math.floor(Math.random() * nodes.length)]
        const dx = n.x - cx
        const dy = n.y - cy
        const len = Math.hypot(dx, dy)
        particles.push({
          x: cx, y: cy,
          vx: (dx / len) * 1.2,
          vy: (dy / len) * 1.2,
          life: 0, maxLife: len / 1.2,
        })
      }

      // Draw & update particles
      particles = particles.filter(p => {
        p.x += p.vx
        p.y += p.vy
        p.life++
        const alpha = 1 - p.life / p.maxLife
        if (alpha <= 0) return false
        ctx.beginPath()
        ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(198,122,60,${alpha * 0.7})`
        ctx.fill()
        return true
      })

      // Draw satellite nodes
      nodes.forEach(n => {
        // Glow
        const glow = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, 40)
        glow.addColorStop(0, 'rgba(198,122,60,0.08)')
        glow.addColorStop(1, 'transparent')
        ctx.fillStyle = glow
        ctx.fillRect(n.x - 40, n.y - 40, 80, 80)

        // Node circle
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(8,8,8,0.9)'
        ctx.fill()
        ctx.strokeStyle = 'rgba(198,122,60,0.35)'
        ctx.lineWidth = 1.5
        ctx.stroke()

        // Icon
        ctx.fillStyle = '#C67A3C'
        ctx.font = '16px serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(n.icon, n.x, n.y)

        // Label below
        ctx.fillStyle = 'rgba(240,234,224,0.5)'
        ctx.font = "600 9px 'BentonSans', sans-serif"
        ctx.textAlign = 'center'
        ctx.letterSpacing = '2px'
        ctx.fillText(n.label.toUpperCase(), n.x, n.y + n.r + 16)
      })

      // Center node (ATLAS core)
      const pulse = Math.sin(time * 0.002) * 4
      // Outer glow
      const coreGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 60 + pulse)
      coreGlow.addColorStop(0, 'rgba(198,122,60,0.15)')
      coreGlow.addColorStop(0.5, 'rgba(198,122,60,0.04)')
      coreGlow.addColorStop(1, 'transparent')
      ctx.fillStyle = coreGlow
      ctx.fillRect(cx - 80, cy - 80, 160, 160)

      ctx.beginPath()
      ctx.arc(cx, cy, 36 + pulse * 0.3, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(12,10,8,0.95)'
      ctx.fill()
      ctx.strokeStyle = `rgba(198,122,60,${0.5 + Math.sin(time * 0.003) * 0.15})`
      ctx.lineWidth = 2
      ctx.stroke()

      // "AI" text in center
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
   ANIMATED DATA FLOW SVG
   Shows address → research → analysis → delivery
   ═══════════════════════════════════════════════════════ */
function DataFlowPipeline() {
  const [inView, setInView] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setInView(true); obs.disconnect() }
    }, { threshold: 0.2 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const steps = [
    {
      label: 'Address',
      sub: 'Any Fraser Valley property',
      svg: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={G} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    },
    {
      label: 'AI Research',
      sub: 'Multi-source data query',
      svg: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={G} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
    },
    {
      label: 'Analysis',
      sub: 'Value + Zoning + Market',
      svg: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={G} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
    },
    {
      label: 'Insights',
      sub: 'Full property snapshot',
      svg: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={G} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/></svg>,
    },
  ]

  return (
    <div ref={ref} style={{ position: 'relative', maxWidth: 900, margin: '0 auto', padding: '40px 0' }}>
      {/* Connection line */}
      <svg style={{ position: 'absolute', top: 32, left: '12%', width: '76%', height: 4, overflow: 'visible' }} viewBox="0 0 1000 4">
        <line x1="0" y1="2" x2="1000" y2="2" stroke="rgba(198,122,60,0.1)" strokeWidth="1" />
        {inView && (
          <line
            x1="0" y1="2" x2="1000" y2="2"
            stroke={GB(0.4)}
            strokeWidth="1.5"
            strokeDasharray="1000"
            strokeDashoffset="1000"
            style={{ animation: 'drawLine 2s ease-out forwards' }}
          />
        )}
        {inView && [0, 1, 2].map(i => (
          <circle key={i} r="2" fill={G} opacity="0.5">
            <animateMotion dur="3.5s" begin={`${i * 1.1}s`} repeatCount="indefinite" path="M0,2 L1000,2" />
          </circle>
        ))}
      </svg>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, position: 'relative', zIndex: 1 }}>
        {steps.map((s, i) => (
          <div key={s.label} style={{
            textAlign: 'center',
            opacity: inView ? 1 : 0,
            transform: inView ? 'translateY(0)' : 'translateY(16px)',
            transition: `all 0.6s ${0.3 + i * 0.15}s cubic-bezier(.22,1,.36,1)`,
          }}>
            <div style={{
              width: 64, height: 64,
              borderRadius: '50%',
              background: BG,
              border: `1.5px solid ${i === 3 ? G : GB(0.2)}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px',
              boxShadow: i === 3 ? `0 0 20px ${GB(0.25)}` : 'none',
            }}>
              {s.svg}
            </div>
            <p style={{
              fontFamily: "'BentonSans', sans-serif",
              fontSize: 11, fontWeight: 900,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: CR, marginBottom: 6,
            }}>{s.label}</p>
            <p style={{ fontSize: 11, color: 'rgba(240,234,224,0.3)', letterSpacing: '0.03em' }}>{s.sub}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   HEXAGONAL STATS DISPLAY
   ═══════════════════════════════════════════════════════ */
function HexStats() {
  const [inView, setInView] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const [counts, setCounts] = useState([0, 0, 0, 0, 0])
  const targets = [600, 4, 15, 75, 19]
  const suffixes = ['+', 'B+', '+', '%', '+']
  const prefixes = ['', '$', '', '', '']
  const labels = ['Sites Sold', 'Volume', 'Cities Mapped', 'Repeat Rate', 'Years']

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
    const dur = 2000
    const start = Date.now()
    const id = setInterval(() => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / dur, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCounts(targets.map(t => Math.floor(t * eased)))
      if (progress >= 1) clearInterval(id)
    }, 16)
    return () => clearInterval(id)
  }, [inView])

  return (
    <div ref={ref} style={{ display: 'flex', justifyContent: 'center', gap: 32, flexWrap: 'wrap', padding: '20px 0' }}>
      {targets.map((_, i) => (
        <div key={i} style={{
          width: 130, height: 150,
          position: 'relative',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          opacity: inView ? 1 : 0,
          transform: inView ? 'scale(1)' : 'scale(0.8)',
          transition: `all 0.5s ${i * 0.1}s cubic-bezier(.22,1,.36,1)`,
        }}>
          {/* Hexagon SVG background */}
          <svg width="130" height="150" viewBox="0 0 130 150" style={{ position: 'absolute', inset: 0 }}>
            <polygon
              points="65,2 126,38 126,112 65,148 4,112 4,38"
              fill="rgba(198,122,60,0.04)"
              stroke={GB(0.2)}
              strokeWidth="1"
            />
          </svg>
          <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
            <div style={{
              fontFamily: "'BentonSans', sans-serif",
              fontSize: 32, fontWeight: 900,
              color: G, lineHeight: 1,
            }}>
              {prefixes[i]}{counts[i].toLocaleString()}{suffixes[i]}
            </div>
            <p style={{
              fontSize: 9, letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: 'rgba(240,234,224,0.35)',
              fontWeight: 600, marginTop: 8,
            }}>{labels[i]}</p>
          </div>
        </div>
      ))}
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
   MAIN PAGE
   ═══════════════════════════════════════════════════════ */
export default function AIPage() {
  return (
    <div style={{ background: BG, minHeight: '100vh' }}>
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
      `}</style>

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
        {/* Animated grid */}
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
            border: `1px solid rgba(198,122,60,${0.06 - i * 0.015})`,
            pointerEvents: 'none',
          }} />
        ))}

        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 500, height: 500, borderRadius: '50%',
          background: `radial-gradient(circle, ${GB(0.1)} 0%, transparent 60%)`,
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 900, padding: '0 40px' }}>
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
              textTransform: 'uppercase', color: 'rgba(240,234,224,0.45)', fontWeight: 600,
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
            color: 'rgba(240,234,224,0.3)',
            marginBottom: 40,
          }}>
            Fast, Data-Driven Land Intelligence
          </p>

          <div style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(18px, 2.2vw, 26px)',
            fontStyle: 'italic',
            color: 'rgba(240,234,224,0.45)',
            lineHeight: 1.7,
            maxWidth: 680,
            margin: '0 auto 56px',
          }}>
            <TypeWriter text={"We built proprietary AI tools that analyze properties in seconds, not days \u2014 giving our clients a decisive edge in BC\u2019s fastest-moving land market."} speed={22} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
            <a href="#constellation" style={{
              fontFamily: "'BentonSans', sans-serif",
              fontSize: 10, fontWeight: 700,
              letterSpacing: '0.24em', textTransform: 'uppercase',
              color: BG, background: G,
              padding: '16px 44px', textDecoration: 'none',
              transition: 'all 0.3s ease',
              boxShadow: `0 0 40px ${GB(0.2)}`,
            }}>
              Explore Capabilities
            </a>
            <a href="#chat" style={{
              fontFamily: "'BentonSans', sans-serif",
              fontSize: 10, fontWeight: 700,
              letterSpacing: '0.24em', textTransform: 'uppercase',
              color: 'rgba(240,234,224,0.5)',
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
        {/* Scan line effect */}
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

      {/* ════════ ORBITAL CONSTELLATION ════════ */}
      <section id="constellation" style={{
        position: 'relative',
        padding: '80px 56px',
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
            color: 'rgba(240,234,224,0.35)',
            maxWidth: 500, margin: '0 auto',
          }}>
            Six interconnected AI systems working in concert to deliver comprehensive property intelligence.
          </p>
        </div>

        <OrbitalConstellation />

        {/* Capability detail cards below the constellation */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 1, maxWidth: 1000, margin: '40px auto 0',
          background: B,
        }}>
          {[
            { title: 'Instant Valuations', desc: 'Aggregate multiple data sources to deliver property valuations in seconds.', stat: '60s' },
            { title: 'Zoning Intelligence', desc: 'Automated lookups across 15+ Fraser Valley and Lower Mainland municipalities.', stat: '15+' },
            { title: 'Market Intelligence', desc: 'AI-powered analysis of trends, comparables, and pricing signals.', stat: '600+' },
            { title: 'AI Creative Production', desc: 'Strategic concepts and marketing visuals generated and delivered weekly.', stat: '52x' },
            { title: 'Lead Capture', desc: '24/7 property assessment chatbot that captures and qualifies leads automatically.', stat: '24/7' },
            { title: 'Predictive Analytics', desc: 'Identify emerging development corridors and pricing shifts before the market moves.', stat: '\u221E' },
          ].map((c, i) => (
            <div key={c.title} style={{
              padding: '36px 28px',
              background: BG,
              position: 'relative',
              overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', top: 16, right: 20,
                fontFamily: "'BentonSans', sans-serif",
                fontSize: 28, fontWeight: 900,
                color: GB(0.1), lineHeight: 1,
              }}>{c.stat}</div>
              <h3 style={{
                fontFamily: "'BentonSans', sans-serif",
                fontSize: 12, fontWeight: 900,
                letterSpacing: '0.14em', textTransform: 'uppercase',
                color: G, marginBottom: 10,
              }}>{c.title}</h3>
              <p style={{
                fontSize: 13, color: 'rgba(240,234,224,0.4)',
                lineHeight: 1.75, letterSpacing: '0.01em',
              }}>{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ════════ HEXAGONAL STATS ════════ */}
      <section style={{
        borderTop: `1px solid ${B}`,
        borderBottom: `1px solid ${B}`,
        padding: '80px 56px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: `radial-gradient(ellipse at 50% 50%, ${GB(0.04)} 0%, transparent 60%)`,
          pointerEvents: 'none',
        }} />
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <span style={{ fontSize: 10, letterSpacing: '0.38em', textTransform: 'uppercase', color: GB(0.5), fontWeight: 500 }}>By The Numbers</span>
        </div>
        <HexStats />
      </section>

      {/* ════════ DATA FLOW PIPELINE ════════ */}
      <section style={{
        position: 'relative',
        padding: '100px 56px',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `
            linear-gradient(rgba(198,122,60,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(198,122,60,0.02) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          pointerEvents: 'none',
        }} />
        <div style={{ textAlign: 'center', marginBottom: 56, position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18, marginBottom: 20 }}>
            <div style={{ width: 48, height: 1, background: G }} />
            <span style={{ fontSize: 10, letterSpacing: '0.38em', textTransform: 'uppercase', color: GB(0.6), fontWeight: 500 }}>The Pipeline</span>
            <div style={{ width: 48, height: 1, background: G }} />
          </div>
          <h2 style={{
            fontFamily: "'BentonSans', sans-serif",
            fontSize: 'clamp(28px, 3.5vw, 42px)',
            fontWeight: 900, letterSpacing: '0.06em',
            textTransform: 'uppercase', color: CR, margin: 0,
          }}>
            How It Works
          </h2>
        </div>
        <DataFlowPipeline />
      </section>

      {/* ════════ LIVE CHAT ════════ */}
      <section id="chat" style={{
        position: 'relative',
        padding: '80px 56px 100px',
        borderTop: `1px solid ${B}`,
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: `radial-gradient(ellipse at 50% 30%, ${GB(0.04)} 0%, transparent 50%)`,
          pointerEvents: 'none',
        }} />
        <div style={{ textAlign: 'center', marginBottom: 48, position: 'relative' }}>
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
            fontSize: 14, color: 'rgba(240,234,224,0.35)',
            maxWidth: 500, margin: '0 auto', lineHeight: 1.7,
          }}>
            Property valuations, zoning data, market comparables &mdash; get answers in seconds.
          </p>
        </div>
        <ChatDemo />
      </section>

      {/* ════════ TECH STRIP ════════ */}
      <section style={{
        borderTop: `1px solid ${B}`,
        padding: '48px 56px',
        textAlign: 'center',
      }}>
        <p style={{
          fontSize: 9, letterSpacing: '0.38em', textTransform: 'uppercase',
          color: 'rgba(240,234,224,0.2)', fontWeight: 600, marginBottom: 24,
        }}>Powered By</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8 }}>
          {['Machine Learning', 'Natural Language Processing', 'Predictive Analytics', 'Geospatial Intelligence', 'Computer Vision', 'Real-Time Pipelines', 'AI Creative Generation', 'Automated Lead Scoring'].map(t => (
            <span key={t} style={{
              fontFamily: "'SF Mono', 'Fira Code', monospace",
              fontSize: 10, fontWeight: 500,
              letterSpacing: '0.04em', color: GB(0.4),
              padding: '8px 16px',
              border: `1px solid ${GB(0.08)}`,
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
        {/* Rings */}
        {[200, 350, 500].map((s, i) => (
          <div key={s} style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: s, height: s, borderRadius: '50%',
            border: `1px solid rgba(198,122,60,${0.05 - i * 0.012})`,
            pointerEvents: 'none',
          }} />
        ))}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400, height: 400, borderRadius: '50%',
          background: `radial-gradient(circle, ${GB(0.08)} 0%, transparent 60%)`,
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
            fontSize: 15, color: 'rgba(240,234,224,0.4)',
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
