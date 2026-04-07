import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
const PROPERTY_BOT_URL = process.env.PROPERTY_BOT_URL || 'http://localhost:8891'

// In-memory sessions (same pattern as server.js)
const sessions = new Map<string, { messages: OpenAI.Chat.ChatCompletionMessageParam[]; pendingCandidates: any[] | null }>()

const SYSTEM_PROMPT = `You are ATLAS, a focused property assessment assistant for Varing Group, a development land specialist firm in British Columbia, Canada. You ONLY help with BC property value estimates using BC Assessment data.

Your SOLE purpose is to collect 4 pieces of information and trigger a property lookup:
1. Property address (with city) - must be in BC
2. Full name
3. Email address
4. Phone number

STRICT RULES:
- You ONLY discuss BC property assessments. If the user asks about anything else, politely redirect: "I'm specifically designed to help with BC property value estimates. Would you like to look up a property?"
- Be conversational, warm, and concise. Keep responses to 1-3 sentences max.
- You can collect multiple pieces of info from a single message if the user provides them.
- If the user gives you an address right away, acknowledge it and ask for the next piece of info.
- Don't be robotic. If someone says "Hi, I'm John and I want to check 1234 Main St Vancouver", extract both the name and address from that.
- If someone provides info that doesn't look right (e.g., clearly not a valid email), gently ask them to correct it.
- The data source is BC Assessment (bcassessment.ca) public records only.
- Once you have ALL 4 pieces of info, you MUST respond with a JSON block at the very end of your message:

[LOOKUP_READY]
{"address": "...", "full_name": "...", "email": "...", "phone": "..."}
[/LOOKUP_READY]

- Only include the [LOOKUP_READY] block when you have ALL 4 pieces confirmed. Your conversational text should come BEFORE the block.
- Never make up or assume contact information. Always ask for what you don't have.
- After a lookup is complete and results are shown, continue chatting about that property or offer to look up another one.
- If the system tells you multiple properties were found, present the list and ask the user to pick. Once they pick, respond with:

[SELECT_PROPERTY]
{"selection": <number>, "full_name": "...", "email": "...", "phone": "..."}
[/SELECT_PROPERTY]`

function getSession(sessionId: string) {
  if (!sessions.has(sessionId)) {
    sessions.set(sessionId, {
      messages: [{ role: 'system' as const, content: SYSTEM_PROMPT }],
      pendingCandidates: null,
    })
  }
  // Clean old sessions (keep max 500)
  if (sessions.size > 500) {
    const first = sessions.keys().next().value
    if (first) sessions.delete(first)
  }
  return sessions.get(sessionId)!
}

async function chatWithAI(session: ReturnType<typeof getSession>, userMessage: string) {
  if (userMessage) {
    session.messages.push({ role: 'user' as const, content: userMessage })
  }

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: session.messages,
    temperature: 0.7,
    max_tokens: 500,
  })

  const reply = response.choices[0].message.content || ''
  session.messages.push({ role: 'assistant' as const, content: reply })
  return reply
}

// Try to proxy a lookup to the property bot server (for BC Assessment scraping)
async function proxyLookup(action: string, body: Record<string, any>): Promise<any | null> {
  try {
    const response = await fetch(`${PROPERTY_BOT_URL}/admin-ajax.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, ...body }),
      signal: AbortSignal.timeout(15000),
    })
    if (response.ok) {
      const data = await response.json()
      if (data.success) return data.data
    }
  } catch {
    // Bot not reachable
  }
  return null
}

export async function POST(req: NextRequest) {
  try {
    const { message, sessionId } = await req.json()
    const userMessage = (message || '').trim()
    const sid = sessionId || 'web-' + Date.now()

    if (!userMessage) {
      return NextResponse.json({ reply: 'Please type a message.' })
    }

    const session = getSession(sid)

    // First, try the property bot server directly (it handles the full flow)
    try {
      const botResponse = await fetch(`${PROPERTY_BOT_URL}/admin-ajax.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'vpb_chat', message: userMessage, session_id: sid }),
        signal: AbortSignal.timeout(12000),
      })
      if (botResponse.ok) {
        const data = await botResponse.json()
        if (data.success && data.data?.reply) {
          return NextResponse.json({
            reply: data.data.reply,
            assessment: data.data.assessment || null,
          })
        }
      }
    } catch {
      // Property bot not available — use direct OpenAI below
    }

    // Direct OpenAI chat (property bot offline)
    const reply = await chatWithAI(session, userMessage)

    // Check for lookup trigger
    const lookupMatch = reply.match(/\[LOOKUP_READY\]\s*(\{[\s\S]*?\})\s*\[\/LOOKUP_READY\]/)
    if (lookupMatch) {
      const info = JSON.parse(lookupMatch[1])
      const conversationalReply = reply.replace(/\[LOOKUP_READY\][\s\S]*\[\/LOOKUP_READY\]/, '').trim()

      // Try the property bot for the actual scraping
      const result = await proxyLookup('vpb_form_lookup', {
        address: info.address,
        full_name: info.full_name,
        email: info.email,
        phone: info.phone,
        session_id: sid,
      })

      if (result?.assessment) {
        session.messages.push({
          role: 'system' as const,
          content: `LOOKUP COMPLETE. Assessment data is now visible to the user. You can continue chatting about the property.`,
        })
        return NextResponse.json({
          reply: conversationalReply || "Here are your results!",
          assessment: result.assessment,
        })
      }

      // Bot unavailable — tell user we're working on it
      session.messages.push({
        role: 'system' as const,
        content: `The property lookup system is temporarily processing. Let the user know their assessment is being prepared and they will receive results shortly at their email. For now, they can ask any questions about the property or Varing Group's services.`,
      })
      const followUp = await chatWithAI(session, '')
      return NextResponse.json({ reply: followUp })
    }

    // Check for property selection
    const selectMatch = reply.match(/\[SELECT_PROPERTY\]\s*(\{[\s\S]*?\})\s*\[\/SELECT_PROPERTY\]/)
    if (selectMatch) {
      const cleanReply = reply.replace(/\[SELECT_PROPERTY\][\s\S]*\[\/SELECT_PROPERTY\]/, '').trim()
      return NextResponse.json({ reply: cleanReply })
    }

    // Normal conversational reply
    return NextResponse.json({ reply })
  } catch (e: any) {
    console.error('Chat route error:', e.message)
    return NextResponse.json({
      reply: "Welcome! I'm **ATLAS** — Varing Group's AI property intelligence system. I can provide **instant valuations**, **zoning analysis**, **ALR checks**, and **creek proximity** for any property in the Fraser Valley.\n\nJust type a property address to get started — for example: *18737 72 Ave, Surrey*",
    })
  }
}
