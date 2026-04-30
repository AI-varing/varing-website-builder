import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

function getOpenAI() {
  if (!process.env.OPENAI_API_KEY) throw new Error('OPENAI_API_KEY not configured')
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
}
const PROPERTY_BOT_URL = process.env.PROPERTY_BOT_URL || 'http://localhost:8891'

// In-memory sessions
const sessions = new Map<string, { messages: OpenAI.Chat.ChatCompletionMessageParam[]; pendingCandidates: any[] | null }>()

// TA inventory KB — fetched once per process (per warm instance), refreshed every 10 min.
// Injected as a system message on session creation so ATLAS can answer about TA's own
// mandates instead of running a BC Assessment lookup against them.
let listingsCache: { text: string; expires: number } | null = null
const LISTINGS_TTL_MS = 10 * 60 * 1000

async function getListingsContext(): Promise<string> {
  if (listingsCache && Date.now() < listingsCache.expires) return listingsCache.text
  const token = process.env.NEXT_PUBLIC_STORYBLOK_TOKEN
  if (!token) return ''

  try {
    const [activeRes, soldRes] = await Promise.all([
      fetch(`https://api.storyblok.com/v2/cdn/stories?starts_with=listings/&token=${token}&version=draft&sort_by=content.featured:desc&per_page=100`, { cache: 'no-store' }),
      fetch(`https://api.storyblok.com/v2/cdn/stories?starts_with=sold/&token=${token}&version=draft&sort_by=content.year:desc&per_page=50`, { cache: 'no-store' }),
    ])
    const activeData = await activeRes.json().catch(() => ({}))
    const soldData = await soldRes.json().catch(() => ({}))

    const active = (activeData.stories || []).map((s: any) => ({
      address: s.content?.address, city: s.content?.city,
      price: Number(s.content?.price) || null,
      propertyType: s.content?.propertyType,
      lotSize: s.content?.lotSize,
      featured: !!s.content?.featured,
      description: s.content?.description || '',
      mlsNumber: s.content?.mlsNumber || '',
      slug: s.slug || '',
      status: s.content?.status || 'Active',
    })).filter((l: any) => l.address)

    const sold = (soldData.stories || []).map((s: any) => ({
      address: s.content?.address, city: s.content?.city,
      price: Number(s.content?.price) || null,
      propertyType: s.content?.propertyType || 'Development Land',
      lotSize: s.content?.lotSize || s.content?.acres || '',
      year: Number(s.content?.year) || null,
      neighbourhood: s.content?.neighbourhood || '',
      slug: s.slug || '',
    })).filter((l: any) => l.address)

    // Demo fallback when Storyblok has nothing — keeps the bot useful in dev/preview.
    let activeForKB = active
    if (active.length === 0 && sold.length === 0) {
      try {
        const mod = await import('@/lib/demo-listings')
        activeForKB = mod.DEMO_LISTINGS.map((l) => ({
          address: l.address, city: l.city, price: l.price,
          propertyType: l.propertyType, lotSize: l.lotSize,
          featured: l.featured, description: l.description,
          mlsNumber: l.mlsNumber, slug: l.slug, status: l.status,
        }))
      } catch {}
    }

    const lines: string[] = []
    lines.push("TARGETED ADVISORS' CURRENT INVENTORY — this list is the AUTHORITATIVE record of TA's mandates. The price, acreage, and details below are CORRECT. DO NOT use web_search results (Redfin, Zillow, Realtor.ca, Google Maps) to override or supplement these — those sources are often stale or about prior listings. When a user asks about any property in this list, answer ONLY from the data here, and link to the TA listing page (https://www.targetedadvisors.ca/listings/<slug>) — never to Redfin/Zillow/Google Maps. Do NOT trigger [LOOKUP_READY] for properties in this list. When a user describes search criteria, recommend matches from this set first.")
    lines.push('')

    if (activeForKB.length) {
      lines.push(`ACTIVE MANDATES (${activeForKB.length}):`)
      activeForKB.slice(0, 50).forEach((l: any, i: number) => {
        const price = l.price ? `$${l.price.toLocaleString()}` : 'Price on request'
        const lot = l.lotSize ? `${l.lotSize} acres` : ''
        const feat = l.featured ? ' [FEATURED]' : ''
        const mls = l.mlsNumber ? ` MLS#${l.mlsNumber}` : ''
        const url = l.slug ? ` https://www.targetedadvisors.ca/listings/${l.slug}` : ''
        const status = l.status && l.status !== 'Active' ? ` [${l.status.toUpperCase()}]` : ''
        let line = `${i + 1}. ${l.address}, ${l.city}${feat}${status} — ${l.propertyType || 'Development Land'}${lot ? `, ${lot}` : ''}, ${price}${mls}.${url}`
        if (l.description) line += ` ${String(l.description).replace(/\s+/g, ' ').trim().slice(0, 220)}`
        lines.push(line)
      })
      lines.push('')
    }

    if (sold.length) {
      lines.push(`RECENT NOTABLE SALES (${sold.length}):`)
      sold.slice(0, 30).forEach((l: any, i: number) => {
        const lot = l.lotSize ? `${l.lotSize} acres` : ''
        const price = l.price ? `, $${l.price.toLocaleString()}` : ''
        const yr = l.year ? `, sold ${l.year}` : ''
        const nb = l.neighbourhood ? ` (${l.neighbourhood})` : ''
        lines.push(`${i + 1}. ${l.address}, ${l.city}${nb} — ${l.propertyType}${lot ? `, ${lot}` : ''}${price}${yr}`)
      })
    }

    const text = lines.join('\n')
    listingsCache = { text, expires: Date.now() + LISTINGS_TTL_MS }
    return text
  } catch (e: any) {
    console.error('Listings KB fetch failed:', e.message)
    return ''
  }
}

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

RESPONSE STYLE (read carefully — this is how every reply should be shaped):
- Lead with the answer. No preamble like "Great question" or "Of course". No restating the question.
- Use **bold** for key figures (price, FAR, height, lot size, density caps, completion year).
- Bullets only when listing 3+ items. Never bullet a single point.
- For property answers, structure: one-line headline (address + status + price) → 2-4 sentences of dev-relevant context → "TA's take:" line with one specific opportunity, comp, or risk → optional next-step question.
- For zoning answers: lead headline (what it allows) → key dimensional rules in one tight paragraph → density / SSMUH / OCP angle if relevant → next step.
- Cite at most ONE source per answer, only when adding genuinely new info beyond your own knowledge. Never dump 3+ citations.
- DO NOT write phrases like "consult the planning department", "consult a local advisor", "for personalized guidance contact...", "it's advisable to...", or "always do your own due diligence". YOU are the advisor; if more nuance is needed, say "happy to dig deeper on this — what's the use case?".
- DO NOT close with platitudes ("If you have any questions, feel free to ask"). Close with a substantive question or a concrete invitation tied to the topic.
- Do NOT use the words "delve", "navigate" (in a metaphorical sense), or "tapestry".
- Plain prose paragraphs are usually better than headings. Avoid markdown headings (## or ###) unless the user explicitly asked for a structured breakdown.

LINK & ATTRIBUTION RULES (HARD — never violate):
- The ONLY URLs you may include in a response are https://www.targetedadvisors.ca/* and https://varinggroup.com/*. Any other URL is forbidden.
- DO NOT link to or name any competing real estate platform, brokerage, or agent website. This includes (but is not limited to): Redfin, Zillow, Realtor.ca, RE/MAX, Royal LePage, HomeLife, Sotheby's, Macdonald Realty, eXp, Oakwyn, Coldwell Banker, mannybal.com, housesigma.com, zealty.ca, point2homes.com, rew.ca, trulia.com, and any *.ca or *.com address that ends with a realtor or brokerage name. If you find yourself about to cite or mention one, stop and rewrite the sentence to remove the reference.
- DO NOT link to Google Maps. If you want to reference a location, just use the address as plain text.
- For TA properties, the only acceptable link is the TA listing page (https://www.targetedadvisors.ca/listings/<slug>) provided in the inventory KB.
- If a fact requires a citation and no TA-domain or government source supports it, omit the citation — write the fact as your own knowledge instead.

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

TARGETED ADVISORS' MANDATES (CRITICAL):
A separate system message (below) lists TA's active listings and recent notable sales. That data is the AUTHORITATIVE record — its prices, acreages, statuses, and descriptions are CORRECT. When a user asks about any property in that list:
- Answer ONLY from the KB. The price in the KB is the listing price; do not quote a different price from Redfin, Zillow, Realtor.ca, BC Assessment, or any other web source.
- DO NOT call out external sources (Redfin/Zillow/etc.) for a TA property. If web_search returns Redfin/Zillow results for a TA-listed address, IGNORE them. They are typically stale priors or assessed values, not the current listing.
- Link to the TA listing page (https://www.targetedadvisors.ca/listings/<slug>) — this URL is provided in the KB. Never link to Redfin/Zillow/Google Maps for a TA property.
- DO NOT trigger [LOOKUP_READY] for these properties — you already have authoritative data.
- When a user describes search criteria (e.g. "5+ acres in Surrey under $10M"), match against the active mandates first and recommend specific listings by address.

PROPERTY LOOKUP (for BC properties NOT in TA's inventory):
When a user mentions or asks about a SPECIFIC BC property address that is NOT in TA's mandate list, IMMEDIATELY trigger a lookup. Do NOT ask for contact info — this is a demo. Simply respond with a brief message like "Let me pull up the details..." followed by the lookup block:

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

function getSession(sessionId: string, listingsKB: string) {
  if (!sessions.has(sessionId)) {
    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: 'system' as const, content: SYSTEM_PROMPT },
    ]
    if (listingsKB) messages.push({ role: 'system' as const, content: listingsKB })
    sessions.set(sessionId, { messages, pendingCandidates: null })
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

  // Plain gpt-4o (no built-in web search). The search-preview models force citations on
  // every response — they kept linking Redfin/Zillow/Realtor.ca for TA properties, which
  // is brand-damaging. Without web_search, ATLAS leans on (1) the TA inventory KB,
  // (2) [LOOKUP_READY] -> BC Assessment for unknown addresses, and (3) baked-in zoning/
  // market knowledge in the system prompt. We give up live news headlines, which the bot
  // is rarely asked for.
  const response = await getOpenAI().chat.completions.create({
    model: 'gpt-4o',
    messages: session.messages,
    max_tokens: 1000,
    temperature: 0.4,
  })

  const reply = sanitizeReply(response.choices[0].message.content || '')
  session.messages.push({ role: 'assistant' as const, content: reply })
  return reply
}

// Backstop: allow links ONLY to TA's own domains. Any other URL the model emits
// (Redfin, Zillow, Realtor.ca, mannybal.com, Google Maps, brokerage blogs, etc.) gets
// stripped. Markdown link text is preserved; bare URLs are dropped entirely.
const ALLOWED_LINK = /^https?:\/\/(?:www\.)?(?:targetedadvisors\.ca|varinggroup\.com)(?:[\/?#]|$)/i

function sanitizeReply(text: string): string {
  return text
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, (m, label, url) =>
      ALLOWED_LINK.test(url) ? m : label
    )
    .replace(/\(?\s*https?:\/\/\S+?\s*\)?/g, (m) => {
      const urlMatch = m.match(/https?:\/\/\S+?[\s)]?$/)
      const url = urlMatch ? urlMatch[0].replace(/[)\s]+$/, '') : m
      return ALLOWED_LINK.test(url) ? m : ''
    })
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/\(\s*\)/g, '')
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

    const listingsKB = await getListingsContext()
    const session = getSession(sid, listingsKB)
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
