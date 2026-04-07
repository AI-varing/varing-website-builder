import { NextRequest, NextResponse } from 'next/server'

const PROPERTY_BOT_URL = process.env.PROPERTY_BOT_URL || 'https://varinggroup.com'

export async function POST(req: NextRequest) {
  try {
    const { message, messages, sessionId } = await req.json()

    // Support both new format (message + sessionId) and legacy (messages array)
    const userMessage = message || messages?.[messages.length - 1]?.content || ''
    const session = sessionId || 'web-' + Date.now()

    if (!userMessage.trim()) {
      return NextResponse.json({ reply: 'Please type a message.' })
    }

    // Proxy to the real property bot
    const response = await fetch(`${PROPERTY_BOT_URL}/admin-ajax.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'vpb_chat',
        message: userMessage,
        session_id: session,
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      console.error('Property bot error:', err)
      return NextResponse.json({
        reply: 'Our property intelligence system is currently being updated. Please try again in a moment, or contact us at **604.565.3478** for immediate assistance.',
      })
    }

    const data = await response.json()

    if (data.success && data.data) {
      return NextResponse.json({
        reply: data.data.reply || 'Sorry, I couldn\'t process that request.',
        assessment: data.data.assessment || null,
      })
    }

    return NextResponse.json({
      reply: data.data?.message || data.data?.reply || 'Sorry, something went wrong. Please try again.',
    })
  } catch (e: any) {
    console.error('Chat route error:', e.message)
    return NextResponse.json({
      reply: 'Our AI system is currently offline. Please contact us directly at **604.565.3478** or **info@varinggroup.com** for property inquiries.',
    })
  }
}
