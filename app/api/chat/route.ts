import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

function getOpenAI() {
  if (!process.env.OPENAI_API_KEY) throw new Error('OPENAI_API_KEY not configured')
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
}
const PROPERTY_BOT_URL = process.env.PROPERTY_BOT_URL || 'http://localhost:8891'

// In-memory sessions
const sessions = new Map<string, { messages: OpenAI.Chat.ChatCompletionMessageParam[]; pendingCandidates: any[] | null }>()

const SYSTEM_PROMPT = `You are ATLAS, Targeted Advisors' AI property intelligence assistant. Targeted Advisors is BC's #1 development land brokerage, specializing in development sites, court-ordered sales, and land assemblies across the Fraser Valley and Greater Vancouver.

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
- When OCP designation differs from current zoning, that signals upzoning potential — hugely valuable for developers

MARKET KNOWLEDGE:
- Surrey: BC's fastest-growing city, SkyTrain expansion driving land values, Clayton/Tynehead/Fleetwood are hot development areas
- Vancouver: Highest land values in Canada, limited supply, densification policies pushing prices up
- Burnaby: Strong transit-oriented development, Metrotown/Brentwood densification
- Langley: Rapid suburban growth, mix of agricultural and residential development
- Abbotsford/Chilliwack: Emerging markets, lower entry point but ALR restrictions on many parcels
- Development land typically trades at 10-30% above BC Assessment value
- Land value as % of total assessment indicates development potential — >80% means the improvements are worth less than the dirt

PROPERTY LOOKUP:
When a user mentions or asks about a SPECIFIC BC property address, IMMEDIATELY trigger a lookup. Do NOT ask for contact info — this is a demo. Simply respond with a brief message like "Let me pull up the details..." followed by the lookup block:

[LOOKUP_READY]
{"address": "the full address including city"}
[/LOOKUP_READY]

If the user gives a partial address (missing city), ask which city. Otherwise, trigger the lookup right away.

If the system tells you multiple properties were found, present the numbered list and ask the user to pick one. Once they pick:

[SELECT_PROPERTY]
{"selection": <number>}
[/SELECT_PROPERTY]

IMPORTANT RULES:
- NEVER ask for name, email, or phone number — this is a live demo
- When someone says "tell me about [address]" or "what's [address] worth" — trigger the lookup immediately
- You CAN answer general questions (zoning, market, development) without a lookup
- If asked "what's the zoning for X address" — give your best answer from knowledge AND trigger a lookup for exact data
- After a lookup is complete, you have full property data — use it for follow-up questions
- Never make up specific dollar amounts for properties you haven't looked up
- Mention that Targeted Advisors can provide deeper analysis when relevant`

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

  // gpt-4o-mini-search-preview includes built-in web search — model decides when to query
  // the web (e.g. fresh news, address lookups outside BC, market headlines) vs answer from
  // its own knowledge or trigger our [LOOKUP_READY] BC-property pipeline.
  const response = await getOpenAI().chat.completions.create({
    model: 'gpt-4o-mini-search-preview',
    messages: session.messages,
    max_tokens: 800,
    web_search_options: {},
  } as any)

  const reply = response.choices[0].message.content || ''
  session.messages.push({ role: 'assistant' as const, content: reply })
  return reply
}

// Proxy a lookup to the property bot server
async function proxyLookup(action: string, body: Record<string, any>): Promise<any | null> {
  try {
    const response = await fetch(`${PROPERTY_BOT_URL}/admin-ajax.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, ...body }),
      signal: AbortSignal.timeout(45000),
    })
    if (response.ok) {
      const data = await response.json()
      if (data.success) return data.data
    }
  } catch (e: any) {
    console.error('Proxy lookup error:', e.message)
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
    const reply = await chatWithAI(session, userMessage)

    // Check if AI wants to trigger a property lookup
    const lookupMatch = reply.match(/\[LOOKUP_READY\]\s*(\{[\s\S]*?\})\s*\[\/LOOKUP_READY\]/)
    if (lookupMatch) {
      const info = JSON.parse(lookupMatch[1])
      const conversationalReply = reply.replace(/\[LOOKUP_READY\][\s\S]*\[\/LOOKUP_READY\]/, '').trim()

      // Proxy to property bot — no contact info needed for demo
      const result = await proxyLookup('vpb_form_lookup', {
        address: info.address,
        full_name: 'ATLAS Demo User',
        email: 'demo@targetedadvisors.com',
        phone: '0000000000',
        session_id: sid,
      })

      // Handle multi-unit results
      if (result?.multiple && result?.candidates) {
        session.pendingCandidates = result.candidates
        const list = result.candidates.map((c: any, i: number) => `${i + 1}. ${c.label}`).join('\n')
        session.messages.push({
          role: 'system' as const,
          content: `MULTIPLE UNITS FOUND at "${info.address}". Ask the user which unit they mean:\n${list}\n\nPresent these numbered options.`,
        })
        const multiReply = await chatWithAI(session, '')
        return NextResponse.json({ reply: multiReply })
      }

      if (result?.assessment) {
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
        ctx += ' The full assessment card is now visible to the user. Answer any follow-up questions using this data.'

        session.messages.push({ role: 'system' as const, content: ctx })

        return NextResponse.json({
          reply: conversationalReply || 'Here are the details I found:',
          assessment: result.assessment,
        })
      }

      // Lookup failed — retry once with normalized address
      const retryResult = await proxyLookup('vpb_form_lookup', {
        address: info.address.replace(/,/g, '').trim(),
        full_name: 'ATLAS Demo User',
        email: 'demo@targetedadvisors.com',
        phone: '0000000000',
        session_id: sid + '-retry',
      })

      if (retryResult?.assessment) {
        const a = retryResult.assessment
        let ctx = `LOOKUP COMPLETE. Property: ${a.address}. Assessed: $${a.assessed_value?.toLocaleString()}.`
        if (a.context_tags?.zoning_district) ctx += ` Zoning: ${a.context_tags.zoning_district}.`
        if (a.dev_potential) ctx += ` Dev Potential: ${a.dev_potential.score}/100.`
        ctx += ' The assessment card is visible. Answer follow-ups using this data.'
        session.messages.push({ role: 'system' as const, content: ctx })

        return NextResponse.json({
          reply: conversationalReply || 'Here are the details I found:',
          assessment: retryResult.assessment,
        })
      }

      // Both attempts failed
      session.messages.push({
        role: 'system' as const,
        content: `The lookup for "${info.address}" failed. Possible reasons: address not found in BC Assessment, or the service is temporarily slow. Tell the user the address wasn't found and ask them to double-check it or try a slightly different format (e.g. include the city). Don't blame the system — just say the address may need to be more specific.`,
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

    return NextResponse.json({ reply })
  } catch (e: any) {
    console.error('Chat route error:', e.message)
    return NextResponse.json({
      reply: "I'm **ATLAS** — Targeted Advisors' property intelligence assistant. I can look up any BC property instantly — just give me an address. I also answer questions about zoning, market trends, and development potential.",
    })
  }
}
