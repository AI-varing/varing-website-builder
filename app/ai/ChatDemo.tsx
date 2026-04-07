'use client'

import React, { useState, useRef, useEffect } from 'react'
import { G, CR, BG, B, GB } from '@/lib/tokens'

interface Assessment {
  address: string
  assessed_value: number
  land_value: number
  building_value: number
  range_lower: number
  range_upper: number
  lot_size_sqft?: number
  description?: string
  context_tags?: {
    zoning_district?: string
    zoning_classification?: string
    ocp_designation?: string
    in_alr?: boolean
    near_creek?: boolean
    creek_name?: string
  }
  context_summary?: string
  dev_potential?: {
    score: number
    label: string
    factors: { name: string; impact: string; detail: string }[]
  }
  zoning_explanation?: {
    zone_code: string
    description: string
    permitted_uses: string[]
    max_density: string
    max_height: string
    lot_coverage: string
    notes: string
  }
  market_trends?: {
    land_value_ratio: number
    price_per_sqft: number | null
    area_insight: string
    sale_vs_assessed?: { ratio: number; interpretation: string }
  }
  comparables?: { address: string; assessed_value: number }[]
  comparables_summary?: string
}

interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
  typing?: boolean
  assessment?: Assessment
}

const SUGGESTIONS = [
  'What is 3352 200 St, Langley worth?',
  'Show me active court-ordered listings',
  'What\u2019s the zoning for 18737 72 Ave, Surrey?',
  'Compare land prices in Clayton vs Tynehead',
]

function fmt$(n: number) {
  if (n >= 1000000) return '$' + (n / 1000000).toFixed(2).replace(/\.00$/, '') + 'M'
  return '$' + n.toLocaleString('en-CA')
}

function DevScoreBar({ score, label }: { score: number; label: string }) {
  const color = score >= 75 ? '#34D399' : score >= 50 ? G : score >= 25 ? '#F59E0B' : '#EF4444'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
      <div style={{ flex: 1, height: 6, background: 'rgba(240,234,224,0.06)', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ width: `${score}%`, height: '100%', background: color, borderRadius: 3, transition: 'width 0.8s ease' }} />
      </div>
      <span style={{ fontSize: 12, fontWeight: 800, color, minWidth: 32 }}>{score}</span>
      <span style={{ fontSize: 10, color: 'rgba(240,234,224,0.4)', letterSpacing: '0.06em' }}>{label}</span>
    </div>
  )
}

function AssessmentCard({ assessment: a }: { assessment: Assessment }) {
  const ct = a.context_tags
  const dp = a.dev_potential
  const ze = a.zoning_explanation
  const mt = a.market_trends

  return (
    <div style={{ marginTop: 12, background: GB(0.04), border: `1px solid ${GB(0.15)}`, borderRadius: 10, overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '14px 18px', borderBottom: `1px solid ${GB(0.1)}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#34D399', boxShadow: '0 0 8px rgba(52,211,153,0.5)' }} />
          <span style={{ fontSize: 9, fontWeight: 900, letterSpacing: '0.2em', color: G, textTransform: 'uppercase' }}>Assessment Found</span>
        </div>
        <p style={{ fontSize: 14, fontWeight: 700, color: CR, margin: 0, letterSpacing: '0.02em' }}>{a.address}</p>
        {a.description && <p style={{ fontSize: 10, color: 'rgba(240,234,224,0.35)', margin: '4px 0 0' }}>{a.description}</p>}
      </div>

      {/* Core values */}
      <div style={{ padding: '14px 18px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 16px' }}>
        <div>
          <p style={{ fontSize: 8, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(240,234,224,0.35)', margin: '0 0 2px' }}>Assessed Value</p>
          <p style={{ fontSize: 16, fontWeight: 900, color: G, margin: 0 }}>{fmt$(a.assessed_value)}</p>
        </div>
        <div>
          <p style={{ fontSize: 8, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(240,234,224,0.35)', margin: '0 0 2px' }}>Value Range</p>
          <p style={{ fontSize: 13, fontWeight: 700, color: CR, margin: 0 }}>{fmt$(a.range_lower)} – {fmt$(a.range_upper)}</p>
        </div>
        <div>
          <p style={{ fontSize: 8, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(240,234,224,0.35)', margin: '0 0 2px' }}>Land Value</p>
          <p style={{ fontSize: 13, fontWeight: 600, color: 'rgba(240,234,224,0.6)', margin: 0 }}>{fmt$(a.land_value)}</p>
        </div>
        <div>
          <p style={{ fontSize: 8, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(240,234,224,0.35)', margin: '0 0 2px' }}>Building Value</p>
          <p style={{ fontSize: 13, fontWeight: 600, color: 'rgba(240,234,224,0.6)', margin: 0 }}>{fmt$(a.building_value)}</p>
        </div>
        {a.lot_size_sqft && (
          <div>
            <p style={{ fontSize: 8, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(240,234,224,0.35)', margin: '0 0 2px' }}>Lot Size</p>
            <p style={{ fontSize: 13, fontWeight: 600, color: 'rgba(240,234,224,0.6)', margin: 0 }}>{a.lot_size_sqft.toLocaleString()} sqft</p>
          </div>
        )}
        {mt?.price_per_sqft && (
          <div>
            <p style={{ fontSize: 8, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(240,234,224,0.35)', margin: '0 0 2px' }}>Land $/sqft</p>
            <p style={{ fontSize: 13, fontWeight: 600, color: 'rgba(240,234,224,0.6)', margin: 0 }}>${mt.price_per_sqft}/sqft</p>
          </div>
        )}
      </div>

      {/* Context tags row */}
      {ct && (
        <div style={{ padding: '0 18px 14px', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {ct.zoning_district && (
            <span style={{ fontSize: 10, padding: '4px 10px', borderRadius: 4, background: GB(0.08), border: `1px solid ${GB(0.15)}`, color: 'rgba(240,234,224,0.6)', fontWeight: 600 }}>
              {ct.zoning_district}{ct.zoning_classification ? ` — ${ct.zoning_classification}` : ''}
            </span>
          )}
          {ct.ocp_designation && (
            <span style={{ fontSize: 10, padding: '4px 10px', borderRadius: 4, background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)', color: '#34D399', fontWeight: 600 }}>
              OCP: {ct.ocp_designation}
            </span>
          )}
          {ct.in_alr && (
            <span style={{ fontSize: 10, padding: '4px 10px', borderRadius: 4, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#EF4444', fontWeight: 600 }}>
              ALR
            </span>
          )}
          {ct.near_creek && (
            <span style={{ fontSize: 10, padding: '4px 10px', borderRadius: 4, background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', color: '#3B82F6', fontWeight: 600 }}>
              {ct.creek_name || 'Creek Nearby'}
            </span>
          )}
        </div>
      )}

      {/* Dev potential */}
      {dp && (
        <div style={{ padding: '12px 18px', borderTop: `1px solid ${GB(0.08)}` }}>
          <p style={{ fontSize: 8, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(240,234,224,0.35)', margin: '0 0 6px' }}>Development Potential</p>
          <DevScoreBar score={dp.score} label={dp.label} />
          {dp.factors.length > 0 && (
            <div style={{ marginTop: 8 }}>
              {dp.factors.slice(0, 3).map((f, i) => (
                <p key={i} style={{ fontSize: 10, color: 'rgba(240,234,224,0.4)', margin: '3px 0', lineHeight: 1.4 }}>
                  <span style={{ color: f.impact === 'positive' ? '#34D399' : f.impact === 'negative' ? '#EF4444' : 'rgba(240,234,224,0.3)', marginRight: 4 }}>
                    {f.impact === 'positive' ? '+' : f.impact === 'negative' ? '-' : '~'}
                  </span>
                  {f.detail}
                </p>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Zoning explanation */}
      {ze && (
        <div style={{ padding: '12px 18px', borderTop: `1px solid ${GB(0.08)}` }}>
          <p style={{ fontSize: 8, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(240,234,224,0.35)', margin: '0 0 6px' }}>Zoning: {ze.zone_code}</p>
          <p style={{ fontSize: 11, color: 'rgba(240,234,224,0.5)', margin: '0 0 6px', lineHeight: 1.5 }}>{ze.description}</p>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            {ze.max_height !== 'Varies' && <span style={{ fontSize: 10, color: 'rgba(240,234,224,0.35)' }}>Height: <strong style={{ color: 'rgba(240,234,224,0.55)' }}>{ze.max_height}</strong></span>}
            {ze.lot_coverage !== 'Varies' && <span style={{ fontSize: 10, color: 'rgba(240,234,224,0.35)' }}>Coverage: <strong style={{ color: 'rgba(240,234,224,0.55)' }}>{ze.lot_coverage}</strong></span>}
            {ze.max_density !== 'Varies' && <span style={{ fontSize: 10, color: 'rgba(240,234,224,0.35)' }}>Density: <strong style={{ color: 'rgba(240,234,224,0.55)' }}>{ze.max_density}</strong></span>}
          </div>
        </div>
      )}

      {/* Market insight */}
      {mt?.area_insight && (
        <div style={{ padding: '10px 18px', borderTop: `1px solid ${GB(0.08)}` }}>
          <p style={{ fontSize: 10, color: 'rgba(240,234,224,0.35)', margin: 0, lineHeight: 1.5, fontStyle: 'italic' }}>{mt.area_insight}</p>
        </div>
      )}
    </div>
  )
}

export default function ChatDemo({ autoPlay = false }: { autoPlay?: boolean }) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Welcome to **ATLAS** \u2014 your intelligent property research assistant. Ask me about any property in the Fraser Valley.' },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const autoPlayTriggered = useRef(false)
  const sectionRef = useRef<HTMLDivElement>(null)
  const sessionIdRef = useRef(`atlas-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`)

  // Auto-play: trigger a demo query when scrolled into view
  useEffect(() => {
    if (!autoPlay || autoPlayTriggered.current) return
    const el = sectionRef.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !autoPlayTriggered.current) {
        autoPlayTriggered.current = true
        setTimeout(() => {
          const demoQuery = 'What\u2019s the zoning for 18737 72 Ave, Surrey?'
          // Simulate typing the query character by character
          let i = 0
          const typeId = setInterval(() => {
            i++
            if (i >= demoQuery.length) {
              clearInterval(typeId)
              // Auto-send after typing finishes
              setTimeout(() => {
                const fakeEvent = { target: { value: demoQuery } }
                setInput('')
                // Trigger send
                const userMsg: Message = { role: 'user', content: demoQuery }
                setMessages(prev => [...prev, userMsg])
                setIsTyping(true)
                setMessages(prev => [...prev, { role: 'assistant', content: '', typing: true }])

                fetch('/api/chat', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ message: demoQuery, sessionId: sessionIdRef.current }),
                }).then(r => r.json()).then(data => {
                  const reply = data.reply || 'Here are the zoning details for that property...'
                  let j = 0
                  const replyId = setInterval(() => {
                    j += 4
                    if (j >= reply.length) {
                      setMessages(prev => {
                        const u = [...prev]; u[u.length - 1] = { role: 'assistant', content: reply }; return u
                      })
                      setIsTyping(false)
                      clearInterval(replyId)
                    } else {
                      setMessages(prev => {
                        const u = [...prev]; u[u.length - 1] = { role: 'assistant', content: reply.slice(0, j), typing: true }; return u
                      })
                    }
                  }, 10)
                }).catch(() => {
                  setMessages(prev => {
                    const u = [...prev]; u[u.length - 1] = { role: 'assistant', content: 'Sorry, I couldn\u2019t reach the server.' }; return u
                  })
                  setIsTyping(false)
                })
              }, 400)
            } else {
              setInput(demoQuery.slice(0, i))
            }
          }, 45)
        }, 1200)
        obs.disconnect()
      }
    }, { threshold: 0.3 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [autoPlay])

  useEffect(() => {
    // Scroll only within the chat container, not the whole page
    const container = chatContainerRef.current
    if (container) {
      container.scrollTop = container.scrollHeight
    }
  }, [messages])

  const sendMessage = async (text?: string) => {
    const msg = text || input.trim()
    if (!msg || isTyping) return

    const userMsg: Message = { role: 'user', content: msg }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setIsTyping(true)

    // Add typing indicator
    setMessages(prev => [...prev, { role: 'assistant', content: '', typing: true }])

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, sessionId: sessionIdRef.current }),
      })

      const data = await res.json()
      const reply = data.reply || 'Sorry, something went wrong. Please try again.'
      const assessment = data.assessment || null

      // Type out response
      let i = 0
      const typeInterval = setInterval(() => {
        i += 4
        if (i >= reply.length) {
          setMessages(prev => {
            const updated = [...prev]
            updated[updated.length - 1] = { role: 'assistant', content: reply, assessment }
            return updated
          })
          setIsTyping(false)
          clearInterval(typeInterval)
        } else {
          setMessages(prev => {
            const updated = [...prev]
            updated[updated.length - 1] = { role: 'assistant', content: reply.slice(0, i), typing: true }
            return updated
          })
        }
      }, 10)
    } catch {
      setMessages(prev => {
        const updated = [...prev]
        updated[updated.length - 1] = { role: 'assistant', content: 'Sorry, I couldn\u2019t reach the server. Please try again.' }
        return updated
      })
      setIsTyping(false)
    }
  }

  const renderContent = (text: string) => {
    return text.split('\n').map((line, i) => {
      let processed = line
        .replace(/\*\*([^*]+)\*\*/g, '<strong style="color:#F0EAE0;font-weight:700">$1</strong>')
        .replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" style="color:#C67A3C;text-decoration:underline;text-underline-offset:3px">$1</a>')
        .replace(/(https?:\/\/[^\s)<]+)/g, (match) => {
          if (match.includes('href="')) return match
          return `<a href="${match}" target="_blank" rel="noopener noreferrer" style="color:#C67A3C;text-decoration:underline;text-underline-offset:3px">${match}</a>`
        })
        .replace(/^- /g, '<span style="color:#C67A3C">\u2022</span> ')
        .replace(/\u2022/g, '<span style="color:#C67A3C">\u2022</span>')
        .replace(/^### (.+)/g, '<strong style="color:#F0EAE0;font-weight:700;font-size:15px">$1</strong>')

      if (line.startsWith('|')) {
        const cells = line.split('|').filter(c => c.trim()).map(c => c.trim())
        if (line.includes('---')) return <div key={i} style={{ borderBottom: `1px solid ${B}`, margin: '4px 0' }} />
        return (
          <div key={i} style={{ display: 'flex', gap: 16, fontSize: 12, padding: '4px 0' }}>
            {cells.map((cell, j) => (
              <span key={j} style={{ flex: 1, color: j === 0 ? 'rgba(240,234,224,0.5)' : CR }} dangerouslySetInnerHTML={{ __html: cell.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>') }} />
            ))}
          </div>
        )
      }

      return (
        <p key={i} style={{ margin: line === '' ? '8px 0' : '2px 0', lineHeight: 1.7 }} dangerouslySetInnerHTML={{ __html: processed }} />
      )
    })
  }

  return (
    <div ref={sectionRef} style={{
      maxWidth: 800,
      margin: '0 auto',
      border: `1px solid ${B}`,
      borderRadius: 12,
      overflow: 'hidden',
      background: 'rgba(12,12,12,0.9)',
      backdropFilter: 'blur(20px)',
      boxShadow: `0 0 60px ${GB(0.08)}, 0 0 120px rgba(0,0,0,0.4)`,
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '16px 24px',
        borderBottom: `1px solid ${B}`,
        background: 'rgba(240,234,224,0.02)',
      }}>
        <div style={{
          width: 32, height: 32,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: GB(0.12), border: `1px solid ${GB(0.2)}`, borderRadius: 8,
        }}>
          <span style={{ fontSize: 14, fontWeight: 900, color: G, fontFamily: "'BentonSans', sans-serif" }}>AI</span>
        </div>
        <div>
          <p style={{ fontSize: 13, fontWeight: 700, color: CR, letterSpacing: '0.06em', margin: 0 }}>ATLAS</p>
          <p style={{ fontSize: 10, color: 'rgba(240,234,224,0.35)', letterSpacing: '0.08em', margin: 0 }}>Property Intelligence Assistant</p>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#34D399', boxShadow: '0 0 8px rgba(52,211,153,0.4)' }} />
          <span style={{ fontSize: 10, color: 'rgba(240,234,224,0.35)', letterSpacing: '0.06em' }}>Online</span>
        </div>
      </div>

      {/* Messages */}
      <div ref={chatContainerRef} style={{
        height: 420,
        overflowY: 'auto',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            display: 'flex',
            justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
            gap: 10,
          }}>
            {msg.role !== 'user' && (
              <div style={{
                width: 28, height: 28, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: GB(0.1), borderRadius: 6, marginTop: 2,
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={G} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
                </svg>
              </div>
            )}
            <div style={{
              maxWidth: '80%',
              padding: msg.role === 'user' ? '12px 18px' : '14px 18px',
              background: msg.role === 'user' ? GB(0.15) : 'rgba(240,234,224,0.03)',
              border: `1px solid ${msg.role === 'user' ? GB(0.25) : B}`,
              borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
              fontSize: 13,
              color: msg.role === 'user' ? CR : 'rgba(240,234,224,0.6)',
              lineHeight: 1.7,
              letterSpacing: '0.01em',
            }}>
              {msg.content && renderContent(msg.content)}
              {msg.assessment && <AssessmentCard assessment={msg.assessment} />}
              {msg.typing && !msg.content && (
                <span style={{ display: 'inline-flex', gap: 4, padding: '4px 0' }}>
                  <span className="typing-dot" style={{ width: 5, height: 5, borderRadius: '50%', background: G }} />
                  <span className="typing-dot" style={{ width: 5, height: 5, borderRadius: '50%', background: G, animationDelay: '0.2s' }} />
                  <span className="typing-dot" style={{ width: 5, height: 5, borderRadius: '50%', background: G, animationDelay: '0.4s' }} />
                </span>
              )}
              {msg.typing && msg.content && (
                <span style={{ opacity: 0.5, marginLeft: 2 }}>|</span>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      {messages.length <= 1 && (
        <div style={{ padding: '0 24px 16px', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {SUGGESTIONS.map(s => (
            <button
              key={s}
              onClick={() => sendMessage(s)}
              style={{
                fontSize: 11, color: GB(0.7),
                background: 'rgba(240,234,224,0.02)',
                border: `1px solid ${GB(0.15)}`,
                borderRadius: 20, padding: '8px 16px',
                cursor: 'pointer', transition: 'all 0.2s',
                fontFamily: 'inherit', letterSpacing: '0.02em',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = GB(0.4); e.currentTarget.style.color = CR; e.currentTarget.style.background = GB(0.06) }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = GB(0.15); e.currentTarget.style.color = GB(0.7); e.currentTarget.style.background = 'rgba(240,234,224,0.02)' }}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '16px 24px',
        borderTop: `1px solid ${B}`,
        background: 'rgba(240,234,224,0.015)',
      }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Ask about any property address..."
          disabled={isTyping}
          style={{
            flex: 1, background: 'transparent', border: 'none', outline: 'none',
            fontSize: 14, color: CR, fontFamily: 'inherit', letterSpacing: '0.02em',
          }}
        />
        <button
          onClick={() => sendMessage()}
          disabled={isTyping || !input.trim()}
          style={{
            width: 36, height: 36,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: input.trim() && !isTyping ? G : GB(0.15),
            border: 'none', borderRadius: 8,
            cursor: input.trim() && !isTyping ? 'pointer' : 'default',
            transition: 'all 0.2s',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={input.trim() && !isTyping ? '#080808' : GB(0.4)} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
        </button>
      </div>
    </div>
  )
}
