import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
const PROPERTY_BOT_URL = process.env.PROPERTY_BOT_URL || 'http://localhost:8891'

// In-memory sessions
const sessions = new Map<string, { messages: OpenAI.Chat.ChatCompletionMessageParam[]; pendingCandidates: any[] | null }>()

const SYSTEM_PROMPT = `You are ATLAS, Varing Group's AI property intelligence assistant. Varing Group is BC's #1 development land brokerage, specializing in development sites, court-ordered sales, and land assemblies across the Fraser Valley and Greater Vancouver.

You are an expert on BC real estate, property assessment, zoning, and development potential. You can:
1. Look up any BC property's assessed value, zoning, ALR status, and development potential
2. Explain zoning codes and what can be built on a property
3. Discuss market trends, land values, and development potential
4. Compare properties and explain comparable sales
5. Answer questions about BC real estate processes, development, and land use

PERSONALITY:
- Knowledgeable, professional, and direct — like a senior land advisor
- Use data and specifics, not vague generalities
- Keep responses concise (2-4 sentences for simple questions, more for detailed analysis)
- Be conversational and warm, but authoritative

ZONING KNOWLEDGE (use when asked about zoning):
- RS/R-1: Single-family residential. Typically 40% lot coverage, 10m height, allows secondary suite + laneway house
- RF: One-family residential (Vancouver). Similar to RS but Vancouver-specific bylaws
- RT: Two-family (duplex). Allows side-by-side or up-down duplex configurations
- RM: Multi-family. Apartments, townhouses. Density varies by sub-zone (RM-1 vs RM-5)
- CD: Comprehensive Development. Custom zoning — anything the city approves in the CD bylaw
- C-1/C-2/C-3: Commercial (neighbourhood/community/district). Retail, office, sometimes mixed-use with residential above
- M/I: Industrial. Manufacturing, warehousing, distribution
- A-1/A-2/AG: Agricultural. Farming, one dwelling, ALR restrictions apply
- RA: Rural/acreage residential. Large lots, hobby farms
- When OCP designation differs from current zoning, that signals upzoning potential — this is hugely valuable for developers

MARKET KNOWLEDGE:
- Surrey: BC's fastest-growing city, SkyTrain expansion driving land values, Clayton/Tynehead/Fleetwood are hot development areas
- Vancouver: Highest land values in Canada, limited supply, densification policies pushing prices up
- Burnaby: Strong transit-oriented development, Metrotown/Brentwood densification
- Langley: Rapid suburban growth, mix of agricultural and residential development
- Abbotsford/Chilliwack: Emerging markets, lower entry point but ALR restrictions on many parcels
- Development land typically trades at 10-30% above BC Assessment value
- Land value as % of total assessment indicates development potential — >80% means the improvements are worth less than the dirt

PROPERTY LOOKUP:
When a user asks about a SPECIFIC property address, you need their contact info to run the lookup:
1. Address (they've usually already given this)
2. Full name
3. Email
4. Phone number

Once you have ALL 4, respond with your conversational text THEN this block at the end:

[LOOKUP_READY]
{"address": "...", "full_name": "...", "email": "...", "phone": "..."}
[/LOOKUP_READY]

If the system tells you multiple properties were found, present the list and ask the user to pick. Once they pick:

[SELECT_PROPERTY]
{"selection": <number>, "full_name": "...", "email": "...", "phone": "..."}
[/SELECT_PROPERTY]

IMPORTANT RULES:
- You CAN and SHOULD answer general questions about zoning, market trends, development potential, and BC real estate WITHOUT requiring contact info
- Only ask for contact info when they want an actual property value lookup
- If they ask "what's the zoning for X address" — give your best answer from your knowledge, then offer to run a detailed lookup for exact data
- After a lookup is complete, you have full property data — use it to answer follow-up questions intelligently
- Never make up specific dollar amounts for properties you haven't looked up
- Always mention that Varing Group can provide detailed analysis — subtly position the firm as the expert`

function getSession(sessionId: string) {
  if (!sessions.has(sessionId)) {
    sessions.set(sessionId, {
      messages: [{ role: 'system' as const, content: SYSTEM_PROMPT }],
      pendingCandidates: null,
    })
  }
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
    max_tokens: 800,
  })

  const reply = response.choices[0].message.content || ''
  session.messages.push({ role: 'assistant' as const, content: reply })
  return reply
}

// Proxy a lookup to the property bot server (BC Assessment scraping + enrichment)
async function proxyLookup(action: string, body: Record<string, any>): Promise<any | null> {
  try {
    const response = await fetch(`${PROPERTY_BOT_URL}/admin-ajax.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, ...body }),
      signal: AbortSignal.timeout(30000),
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

    // Always use our own AI — smarter prompt, answers questions directly
    const reply = await chatWithAI(session, userMessage)

    // Check if AI wants to trigger a property lookup
    const lookupMatch = reply.match(/\[LOOKUP_READY\]\s*(\{[\s\S]*?\})\s*\[\/LOOKUP_READY\]/)
    if (lookupMatch) {
      const info = JSON.parse(lookupMatch[1])
      const conversationalReply = reply.replace(/\[LOOKUP_READY\][\s\S]*\[\/LOOKUP_READY\]/, '').trim()

      // Proxy to property bot for BC Assessment scraping + full enrichment
      const result = await proxyLookup('vpb_form_lookup', {
        address: info.address,
        full_name: info.full_name,
        email: info.email,
        phone: info.phone,
        session_id: sid,
      })

      if (result?.assessment) {
        // Feed the full assessment data back into the AI context
        const a = result.assessment
        let ctx = `LOOKUP COMPLETE. Property: ${a.address}. Assessed: $${a.assessed_value?.toLocaleString()}. Land: $${a.land_value?.toLocaleString()}. Building: $${a.building_value?.toLocaleString()}.`
        if (a.lot_size_sqft) ctx += ` Lot: ${a.lot_size_sqft.toLocaleString()} sqft.`
        if (a.context_tags?.zoning_district) ctx += ` Zoning: ${a.context_tags.zoning_district} (${a.context_tags.zoning_classification || 'N/A'}).`
        if (a.context_tags?.ocp_designation) ctx += ` OCP: ${a.context_tags.ocp_designation}.`
        if (a.context_tags?.in_alr) ctx += ' In ALR.'
        if (a.context_tags?.near_creek) ctx += ` Near ${a.context_tags.creek_name || 'creek'}.`
        if (a.dev_potential) ctx += ` Dev Potential: ${a.dev_potential.score}/100 (${a.dev_potential.label}).`
        if (a.market_trends?.price_per_sqft) ctx += ` Land $/sqft: $${a.market_trends.price_per_sqft}.`
        if (a.comparables?.length) ctx += ` ${a.comparables.length} comparable properties found nearby.`
        ctx += ' The full assessment card is visible to the user. Answer any follow-up questions using this data.'

        session.messages.push({ role: 'system' as const, content: ctx })

        return NextResponse.json({
          reply: conversationalReply || "Here are your property results!",
          assessment: result.assessment,
        })
      }

      // Bot unavailable
      session.messages.push({
        role: 'system' as const,
        content: `The property lookup system couldn't be reached. Tell the user their lookup is being processed and they can email info@varinggroup.com or call 604-620-2600 for immediate assistance. Continue answering any questions you can from your knowledge.`,
      })
      const followUp = await chatWithAI(session, '')
      return NextResponse.json({ reply: followUp })
    }

    // Check for property selection
    const selectMatch = reply.match(/\[SELECT_PROPERTY\]\s*(\{[\s\S]*?\})\s*\[\/SELECT_PROPERTY\]/)
    if (selectMatch) {
      const info = JSON.parse(selectMatch[1])
      const cleanReply = reply.replace(/\[SELECT_PROPERTY\][\s\S]*\[\/SELECT_PROPERTY\]/, '').trim()

      const result = await proxyLookup('vpb_select_unit', {
        selection: info.selection - 1,
        session_id: sid,
      })

      if (result?.assessment) {
        return NextResponse.json({ reply: cleanReply, assessment: result.assessment })
      }
      return NextResponse.json({ reply: cleanReply })
    }

    // Normal conversational reply
    return NextResponse.json({ reply })
  } catch (e: any) {
    console.error('Chat route error:', e.message)
    return NextResponse.json({
      reply: "I'm **ATLAS** — Varing Group's property intelligence assistant. I can help with BC property valuations, zoning analysis, development potential, and market trends. What would you like to know?",
    })
  }
}
