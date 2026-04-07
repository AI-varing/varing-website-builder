import { NextRequest, NextResponse } from 'next/server'

const PROPERTY_BOT_URL = process.env.PROPERTY_BOT_URL || 'http://localhost:8891'

// Demo responses when property bot is not reachable
const DEMO_FLOW: Record<string, { match: RegExp; reply: string; assessment?: any }> = {
  address: {
    match: /\d+.*(?:ave|st|street|road|rd|blvd|dr|way|cres|pl|ct|lane)/i,
    reply: "I'm specifically designed to help with BC property value estimates. Could you please provide your **full name** so I can prepare your report?",
  },
  greeting: {
    match: /^(hi|hello|hey|good|what|how|can)/i,
    reply: "Welcome! I'm **ATLAS** — Varing Group's AI property intelligence system. I can provide **instant valuations**, **zoning analysis**, **ALR checks**, and **creek proximity** for any property in the Fraser Valley.\n\nJust type a property address to get started — for example: *18737 72 Ave, Surrey*",
  },
}

function getDemoReply(message: string): { reply: string; assessment?: any } {
  const msg = message.trim().toLowerCase()

  // Check for address pattern first
  if (DEMO_FLOW.address.match.test(msg)) {
    return { reply: DEMO_FLOW.address.reply }
  }

  // Check greeting
  if (DEMO_FLOW.greeting.match.test(msg)) {
    return { reply: DEMO_FLOW.greeting.reply }
  }

  // Default
  return {
    reply: "I can help with property valuations across **15+ cities** in the Fraser Valley. Just enter any property address — for example:\n\n• *18737 72 Ave, Surrey*\n• *4272 176 St, Surrey*\n• *3338 200 St, Langley*\n\nI'll pull the latest BC Assessment data, zoning, ALR status, and more in under 60 seconds.",
  }
}

export async function POST(req: NextRequest) {
  try {
    const { message, messages, sessionId } = await req.json()
    const userMessage = message || messages?.[messages.length - 1]?.content || ''
    const session = sessionId || 'web-' + Date.now()

    if (!userMessage.trim()) {
      return NextResponse.json({ reply: 'Please type a message.' })
    }

    // Try the real property bot first
    try {
      const response = await fetch(`${PROPERTY_BOT_URL}/admin-ajax.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'vpb_chat',
          message: userMessage,
          session_id: session,
        }),
        signal: AbortSignal.timeout(8000),
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success && data.data) {
          return NextResponse.json({
            reply: data.data.reply || 'Sorry, I couldn\'t process that request.',
            assessment: data.data.assessment || null,
          })
        }
        if (data.data?.reply || data.data?.message) {
          return NextResponse.json({
            reply: data.data.reply || data.data.message,
            assessment: data.data.assessment || null,
          })
        }
      }
    } catch {
      // Property bot not reachable — fall through to demo mode
    }

    // Demo mode fallback
    return NextResponse.json(getDemoReply(userMessage))
  } catch (e: any) {
    console.error('Chat route error:', e.message)
    return NextResponse.json(getDemoReply(''))
  }
}
