'use client'

import React, { useState, useRef, useEffect } from 'react'
import { G, CR, BG, B, GB } from '@/lib/tokens'

interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
  typing?: boolean
}

const SUGGESTIONS = [
  'What is 3352 200 St, Langley worth?',
  'Show me active court-ordered listings',
  'What\u2019s the zoning for 18737 72 Ave, Surrey?',
  'Compare land prices in Clayton vs Tynehead',
]

const DEMO_RESPONSES: Record<string, string> = {
  default: `I can help you with property valuations, zoning lookups, market analysis, and more across the Fraser Valley and Lower Mainland.\n\nTry asking me about a specific property address, zoning, or market trends.`,
  '3352': `**3352 200 St, Langley** \u2014 Brookswood\n\n\u2022 **Assessed Value:** $3,450,000\n\u2022 **Lot Size:** 4.79 acres\n\u2022 **Zoning:** RU-2 (Rural Residential)\n\u2022 **OCP Designation:** Residential \u2014 Low Density\n\u2022 **Status:** Active Court-Ordered Sale\n\u2022 **Estimated Value Range:** $3.2M \u2013 $3.8M\n\nThis parcel is positioned in the Brookswood corridor with strong redevelopment potential. Would you like a full comparable analysis?`,
  'court': `**Active Court-Ordered Listings:**\n\n1. **3352 + 3338 200 St, Langley** \u2014 4.79 ac, Brookswood\n2. **23638 Dewdney Trunk Rd, Maple Ridge** \u2014 1.23 ac, Cottonwood\n3. **18737 72 Ave, Surrey** \u2014 2.37 ac, Clayton Corridor\n4. **13698 113 Ave, Surrey** \u2014 0.51 ac\n5. **9341 177 St, Surrey** \u2014 2.41 ac, Tynehead\n\nWould you like details on any of these?`,
  '18737': `**18737 72 Ave, Surrey** \u2014 Clayton Corridor\n\n\u2022 **Zoning:** RA (Acreage Residential)\n\u2022 **OCP Designation:** Multiple Residential\n\u2022 **Lot Size:** 2.37 acres\n\u2022 **ALR Status:** Not in ALR\n\u2022 **Creek Setbacks:** None identified\n\u2022 **Development Potential:** High \u2014 OCP supports townhouse/rowhome density\n\nThe Clayton Corridor is one of Surrey\u2019s fastest-appreciating areas with the SkyTrain extension driving demand.`,
  'compare': `**Clayton vs Tynehead \u2014 Land Price Comparison**\n\n| Metric | Clayton | Tynehead |\n|--------|---------|----------|\n| Avg. $/acre | $4.2M | $2.8M |\n| Recent Sales (12mo) | 8 | 5 |\n| OCP Density | Townhouse/Row | Single Family |\n| Price Trend | \u2191 12% YoY | \u2191 8% YoY |\n\nClayton commands a premium due to SkyTrain proximity and higher-density OCP designations. Tynehead offers larger parcels at lower entry points with steady appreciation.`,
}

function getResponse(input: string): string {
  const lower = input.toLowerCase()
  if (lower.includes('3352') || lower.includes('200 st')) return DEMO_RESPONSES['3352']
  if (lower.includes('court') || lower.includes('listing') || lower.includes('active')) return DEMO_RESPONSES['court']
  if (lower.includes('18737') || lower.includes('72 ave') || lower.includes('zoning')) return DEMO_RESPONSES['18737']
  if (lower.includes('compare') || lower.includes('clayton') || lower.includes('tynehead')) return DEMO_RESPONSES['compare']
  return DEMO_RESPONSES['default']
}

export default function ChatDemo() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'system', content: 'Welcome to **VARING.AI** \u2014 your intelligent property research assistant. Ask me about any property in the Fraser Valley.' },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = (text?: string) => {
    const msg = text || input.trim()
    if (!msg || isTyping) return

    setMessages(prev => [...prev, { role: 'user', content: msg }])
    setInput('')
    setIsTyping(true)

    // Simulate AI thinking
    setTimeout(() => {
      const response = getResponse(msg)
      setMessages(prev => [...prev, { role: 'assistant', content: '', typing: true }])

      // Type out response character by character (fast)
      let i = 0
      const typeInterval = setInterval(() => {
        i += 3
        if (i >= response.length) {
          setMessages(prev => {
            const updated = [...prev]
            updated[updated.length - 1] = { role: 'assistant', content: response, typing: false }
            return updated
          })
          setIsTyping(false)
          clearInterval(typeInterval)
        } else {
          setMessages(prev => {
            const updated = [...prev]
            updated[updated.length - 1] = { role: 'assistant', content: response.slice(0, i), typing: true }
            return updated
          })
        }
      }, 12)
    }, 800)
  }

  const renderContent = (text: string) => {
    // Simple markdown-like rendering
    return text.split('\n').map((line, i) => {
      let processed = line
        .replace(/\*\*([^*]+)\*\*/g, '<strong style="color:#F0EAE0;font-weight:700">$1</strong>')
        .replace(/\u2022/g, '<span style="color:#C67A3C">\u2022</span>')

      if (line.startsWith('|')) {
        // Table row
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
    <div style={{
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
          width: 32,
          height: 32,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: GB(0.12),
          border: `1px solid ${GB(0.2)}`,
          borderRadius: 8,
        }}>
          <span style={{ fontSize: 14, fontWeight: 900, color: G, fontFamily: "'BentonSans', sans-serif" }}>AI</span>
        </div>
        <div>
          <p style={{ fontSize: 13, fontWeight: 700, color: CR, letterSpacing: '0.06em', margin: 0 }}>
            VARING.AI
          </p>
          <p style={{ fontSize: 10, color: 'rgba(240,234,224,0.35)', letterSpacing: '0.08em', margin: 0 }}>
            Property Intelligence Assistant
          </p>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#34D399', boxShadow: '0 0 8px rgba(52,211,153,0.4)' }} />
          <span style={{ fontSize: 10, color: 'rgba(240,234,224,0.35)', letterSpacing: '0.06em' }}>Online</span>
        </div>
      </div>

      {/* Messages */}
      <div style={{
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
                width: 28,
                height: 28,
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: GB(0.1),
                borderRadius: 6,
                marginTop: 2,
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
              {renderContent(msg.content)}
              {msg.typing && (
                <span style={{ display: 'inline-flex', gap: 3, marginLeft: 4, verticalAlign: 'middle' }}>
                  <span className="typing-dot" style={{ width: 4, height: 4, borderRadius: '50%', background: G, animation: 'pulse 1.2s infinite', animationDelay: '0s' }} />
                  <span className="typing-dot" style={{ width: 4, height: 4, borderRadius: '50%', background: G, animation: 'pulse 1.2s infinite', animationDelay: '0.2s' }} />
                  <span className="typing-dot" style={{ width: 4, height: 4, borderRadius: '50%', background: G, animation: 'pulse 1.2s infinite', animationDelay: '0.4s' }} />
                </span>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      {messages.length <= 1 && (
        <div style={{
          padding: '0 24px 16px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 8,
        }}>
          {SUGGESTIONS.map(s => (
            <button
              key={s}
              onClick={() => sendMessage(s)}
              style={{
                fontSize: 11,
                color: GB(0.7),
                background: 'rgba(240,234,224,0.02)',
                border: `1px solid ${GB(0.15)}`,
                borderRadius: 20,
                padding: '8px 16px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontFamily: 'inherit',
                letterSpacing: '0.02em',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = GB(0.4)
                e.currentTarget.style.color = CR
                e.currentTarget.style.background = GB(0.06)
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = GB(0.15)
                e.currentTarget.style.color = GB(0.7)
                e.currentTarget.style.background = 'rgba(240,234,224,0.02)'
              }}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '16px 24px',
        borderTop: `1px solid ${B}`,
        background: 'rgba(240,234,224,0.015)',
      }}>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Ask about any property address..."
          disabled={isTyping}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            fontSize: 14,
            color: CR,
            fontFamily: 'inherit',
            letterSpacing: '0.02em',
          }}
        />
        <button
          onClick={() => sendMessage()}
          disabled={isTyping || !input.trim()}
          style={{
            width: 36,
            height: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: input.trim() && !isTyping ? G : GB(0.15),
            border: 'none',
            borderRadius: 8,
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
