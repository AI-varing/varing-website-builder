import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { DEMO_LISTINGS } from '@/lib/demo-listings'

export const dynamic = 'force-dynamic'
export const maxDuration = 30

const TRANSLATE_PROMPT = `You translate natural-language property search queries from a BC development land brokerage's website into structured filters.

Output ONLY a JSON object with any of these keys (omit ones that don't apply):
- city: string (e.g. "Surrey", "Langley", "Maple Ridge", "Vancouver", "Burnaby", "Coquitlam", "Abbotsford", "White Rock")
- minPrice: number (in dollars; "under $10M" -> maxPrice 10000000)
- maxPrice: number
- minAcres: number ("5+ acres" -> 5; "over 3 acres" -> 3)
- maxAcres: number
- propertyType: one of "Development Land", "Mixed Use", "Industrial", "Agricultural", "Commercial"
- status: one of "Active", "Reduced", "Firm", "Sold"
- keywords: string[] (concepts to match against address/description: townhouse, condo, transit, skytrain, foreclosure, court-ordered, mixed-use, OCP, rezoning, infill, assembly, multifamily, mid-rise)

Examples:
"5 acres in Surrey under $10M" => {"city":"Surrey","minAcres":5,"maxPrice":10000000}
"townhouse sites near transit" => {"keywords":["townhouse","transit"]}
"court-ordered land in Langley" => {"city":"Langley","keywords":["court-ordered"]}
"sold properties in the Fraser Valley" => {"status":"Sold"}
"anything in Maple Ridge" => {"city":"Maple Ridge"}
"big lots over 4 acres" => {"minAcres":4}
"reduced listings between $3M and $7M" => {"status":"Reduced","minPrice":3000000,"maxPrice":7000000}
"infill condo sites" => {"keywords":["condo","infill"]}

Output ONLY the JSON object. No prose, no fences.`

async function translateQuery(query: string): Promise<Record<string, any>> {
  if (!process.env.OPENAI_API_KEY) return {}
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: TRANSLATE_PROMPT },
        { role: 'user', content: query },
      ],
      temperature: 0.1,
      max_tokens: 200,
      response_format: { type: 'json_object' },
    })
    return JSON.parse(completion.choices[0]?.message?.content || '{}')
  } catch {
    return {}
  }
}

async function fetchAllListings(): Promise<any[]> {
  const token = process.env.NEXT_PUBLIC_STORYBLOK_TOKEN
  if (!token) return DEMO_LISTINGS as any[]
  try {
    const [activeRes, soldRes] = await Promise.all([
      fetch(`https://api.storyblok.com/v2/cdn/stories?starts_with=listings/&token=${token}&version=draft&per_page=100`, { cache: 'no-store' }),
      fetch(`https://api.storyblok.com/v2/cdn/stories?starts_with=sold/&token=${token}&version=draft&per_page=100`, { cache: 'no-store' }),
    ])
    const activeData = await activeRes.json().catch(() => ({}))
    const soldData = await soldRes.json().catch(() => ({}))

    const shape = (s: any, fallbackStatus: string) => ({
      _id: s.uuid,
      address: s.content?.address || '',
      city: s.content?.city || '',
      neighbourhood: s.content?.neighbourhood || '',
      price: Number(s.content?.price) || null,
      propertyType: s.content?.propertyType || 'Development Land',
      lotSize: s.content?.lotSize || s.content?.acres || null,
      status: s.content?.status || fallbackStatus,
      mlsNumber: s.content?.mlsNumber || '',
      featured: !!s.content?.featured,
      slug: s.slug,
      mainImage: s.content?.images?.[0]?.filename || s.content?.image?.filename || null,
      brochureUrl: s.content?.brochureUrl || null,
      description: s.content?.description || '',
    })

    const all = [
      ...(activeData.stories || []).map((s: any) => shape(s, 'Active')),
      ...(soldData.stories || []).filter((s: any) => s.content?.wpId).map((s: any) => shape(s, 'Sold')),
    ].filter((l: any) => l.address)

    return all.length > 3 ? all : (DEMO_LISTINGS as any[])
  } catch {
    return DEMO_LISTINGS as any[]
  }
}

function applyFilters(listings: any[], f: Record<string, any>): any[] {
  let out = [...listings]

  if (f.city) {
    const city = String(f.city).toLowerCase()
    out = out.filter(l => (l.city || '').toLowerCase().includes(city))
  }
  // Price filters EXCLUDE null-priced listings (sold-without-published-price,
  // price-on-request). A user typing "over $10M" is asking for known prices
  // above $10M — letting null prices through pads the result set with noise.
  if (typeof f.minPrice === 'number') {
    out = out.filter(l => typeof l.price === 'number' && l.price >= f.minPrice)
  }
  if (typeof f.maxPrice === 'number') {
    out = out.filter(l => typeof l.price === 'number' && l.price <= f.maxPrice)
  }
  // Acreage filters: include listings whose lotSize is unknown (Number(null) coerces
  // to 0, which would otherwise wrongly fail "minAcres" checks for every listing
  // with a missing lotSize field).
  if (typeof f.minAcres === 'number') {
    out = out.filter(l => {
      if (l.lotSize == null || l.lotSize === '') return true
      const a = Number(l.lotSize)
      return Number.isFinite(a) ? a >= f.minAcres : true
    })
  }
  if (typeof f.maxAcres === 'number') {
    out = out.filter(l => {
      if (l.lotSize == null || l.lotSize === '') return true
      const a = Number(l.lotSize)
      return Number.isFinite(a) ? a <= f.maxAcres : true
    })
  }
  if (f.propertyType) {
    const pt = String(f.propertyType).toLowerCase()
    out = out.filter(l => (l.propertyType || '').toLowerCase().includes(pt))
  }
  if (f.status) {
    out = out.filter(l => l.status === f.status)
  }
  if (Array.isArray(f.keywords) && f.keywords.length) {
    const kws = (f.keywords as string[]).map(k => String(k).toLowerCase())
    out = out
      .map(l => {
        const hay = `${l.address} ${l.city} ${l.neighbourhood} ${l.description} ${l.propertyType}`.toLowerCase()
        const score = kws.reduce((s, k) => s + (hay.includes(k) ? 1 : 0), 0)
        return { ...l, _score: score }
      })
      .filter(l => l._score > 0)
      .sort((a, b) => b._score - a._score)
  }

  return out
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const query = typeof body.query === 'string' ? body.query.trim() : ''
    if (!query) return NextResponse.json({ error: 'Query required' }, { status: 400 })
    if (query.length > 300) return NextResponse.json({ error: 'Query too long' }, { status: 400 })

    const [filters, listings] = await Promise.all([translateQuery(query), fetchAllListings()])

    // Gibberish guard: if the LLM couldn't extract a single recognizable filter
    // (city/price/acres/type/status/keywords), don't fall through to "show
    // everything". Return 0 with a hint so the UI can render an empty state
    // instead of dumping the whole catalog. Caught by the audit:
    // "asdfqwerty" was returning all 14 listings.
    const filterKeys = ['city', 'minPrice', 'maxPrice', 'minAcres', 'maxAcres', 'propertyType', 'status', 'keywords']
    const hasUsableFilter = filterKeys.some((k) => {
      const v = filters[k]
      if (Array.isArray(v)) return v.length > 0
      return v !== undefined && v !== null && v !== ''
    })
    if (!hasUsableFilter) {
      return NextResponse.json({
        query,
        filters,
        count: 0,
        results: [],
        unparseable: true,
      })
    }

    const results = applyFilters(listings, filters)

    return NextResponse.json({
      query,
      filters,
      count: results.length,
      results,
    })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
