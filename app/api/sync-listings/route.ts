import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { runScrape } from '../insolvency-news/scrape/route'

export const dynamic = 'force-dynamic'
export const maxDuration = 60 // seconds (Vercel Pro allows up to 300)

// Hash the listing fields we actually care about. The previous dedup compared
// `wpModified` strings, which never matched (likely format roundtrip through
// Storyblok), so every cron run rewrote all 14 stories. Hashing the meaningful
// fields gives a stable equality check that survives reformatting.
function listingHash(listing: any): string {
  const payload = JSON.stringify({
    address: listing.address, city: listing.city, neighbourhood: listing.neighbourhood,
    price: listing.price, propertyType: listing.propertyType,
    lotSize: listing.lotSize, status: listing.status, featured: listing.featured,
    description: listing.description, brochureUrl: listing.brochureUrl,
    mlsNumber: listing.mlsNumber, image: listing.image, wpId: listing.wpId,
  })
  return crypto.createHash('sha256').update(payload).digest('hex').slice(0, 16)
}

const WP_API = 'https://www.varinggroup.com/wp-json/wp/v2'
const MGMT_TOKEN = process.env.STORYBLOK_MANAGEMENT_TOKEN || ''
const SPACE_ID = process.env.STORYBLOK_SPACE_ID || '291268936642969'

async function fetchWPListings() {
  const all = []
  let page = 1
  while (true) {
    const res = await fetch(`${WP_API}/listing?per_page=100&page=${page}&_embed`, {
      headers: { 'User-Agent': 'VaringSync/1.0' },
      signal: AbortSignal.timeout(30000),
    })
    if (!res.ok) break
    const data = await res.json()
    all.push(...data)
    if (data.length < 100) break
    page++
  }
  return all
}

function parseWPListing(post: any) {
  const title = (post.title?.rendered || '').replace(/<[^>]*>/g, '')
  const meta = post.listing_meta || {}
  const address = meta._listing_address || post._listing_address || title
  const city = meta._listing_city || post._listing_city || ''
  const neighbourhood = meta._listing_state || post._listing_state || ''
  const lat = meta._listing_latitude || post._listing_latitude || null
  const lng = meta._listing_longitude || post._listing_longitude || null

  const priceStr = meta._listing_price || post._listing_price || ''
  let price: number | null = null
  if (priceStr) {
    price = parseFloat(priceStr.replace(/[$,\s]/g, '')) || null
  }

  const featuredMedia = post._embedded?.['wp:featuredmedia']?.[0]
  const image = featuredMedia?.source_url || ''

  const statusTerms = post._embedded?.['wp:term']?.[0] || []
  const locationTerms = post._embedded?.['wp:term']?.[1] || []
  const propertyTypeTerms = post._embedded?.['wp:term']?.[2] || []

  const statusNames = statusTerms.map((t: any) => t.name?.toLowerCase())
  let status = 'Active'
  if (statusNames.includes('sold')) status = 'Sold'
  else if (statusNames.includes('reduced')) status = 'Reduced'
  else if (statusNames.includes('firm')) status = 'Firm'

  const featured = statusNames.includes('featured')
  const propertyType = propertyTypeTerms[0]?.name || 'Development Land'
  const location = locationTerms[0]?.name || city
  const description = (post.excerpt?.rendered || '').replace(/<[^>]*>/g, '').trim()
  const brochureMatch = post.content?.rendered?.match(/href="([^"]*\.pdf)"/i)
  const slug = post.slug || address.toLowerCase().replace(/[^a-z0-9]+/g, '-')

  return {
    address, city: location || city, neighbourhood, price, propertyType,
    lotSize: post._listing_lotsize || null, status, featured, slug, image,
    description, brochureUrl: brochureMatch?.[1] || null, lat, lng,
    mlsNumber: post._listing_mls || null,
    wpId: post.id, wpModified: post.modified_gmt, wpLink: post.link,
  }
}

// Fields like _listing_acres and _listing_mls are stored in WP but the listings
// plugin doesn't register them for the REST API, so they come back null in JSON
// even though the public listing page renders them. Scrape the rendered HTML
// as a fallback. Pattern is consistent across the WP Listings plugin templates:
//   <li class="listing-acres"><span class="label">Acres: </span>2.39</li>
//   <tr class="wp_listings_listing_mls">…<td>R1234567</td></tr>
async function scrapePublicListing(url: string): Promise<{ acres: number | null; mls: string | null }> {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'VaringSync/1.0' },
      signal: AbortSignal.timeout(15000),
    })
    if (!res.ok) return { acres: null, mls: null }
    const html = await res.text()
    const acresMatch = html.match(/class="listing-acres"[^>]*>\s*<span[^>]*>\s*Acres:\s*<\/span>\s*([0-9]+(?:\.[0-9]+)?)/i)
      || html.match(/<tr class="wp_listings_listing_acres">[\s\S]*?<td[^>]*>\s*([0-9]+(?:\.[0-9]+)?)\s*<\/td>/i)
    const mlsMatch = html.match(/class="listing-mls"[^>]*>\s*<span[^>]*>\s*MLS[^<]*<\/span>\s*([^<]+)</i)
      || html.match(/<tr class="wp_listings_listing_mls">[\s\S]*?<td[^>]*>\s*([^<\s][^<]*?)\s*<\/td>/i)
    const acres = acresMatch ? parseFloat(acresMatch[1]) : null
    const mlsRaw = mlsMatch ? mlsMatch[1].trim() : ''
    return {
      acres: Number.isFinite(acres) && acres! > 0 ? acres : null,
      mls: mlsRaw && mlsRaw !== '-' && mlsRaw.toLowerCase() !== 'n/a' ? mlsRaw : null,
    }
  } catch {
    return { acres: null, mls: null }
  }
}

async function enrichListings(listings: any[]): Promise<void> {
  // Concurrency-limited scrape pass — 4 in flight is plenty for ~14 listings
  // and stays well clear of varinggroup.com's WAF without rate-limiting us.
  const concurrency = 4
  for (let i = 0; i < listings.length; i += concurrency) {
    const batch = listings.slice(i, i + concurrency)
    await Promise.all(
      batch.map(async (l) => {
        const needsAcres = !l.lotSize
        const needsMls = !l.mlsNumber
        if (!needsAcres && !needsMls) return
        if (!l.wpLink) return
        const scraped = await scrapePublicListing(l.wpLink)
        if (needsAcres && scraped.acres) l.lotSize = String(scraped.acres)
        if (needsMls && scraped.mls) l.mlsNumber = scraped.mls
      })
    )
  }
}

// Use the CDN API instead of mapi for existence/content checks: mapi's list
// response omits the `content` field, which made every dedup attempt fail
// (s.content?.wpHash was always undefined → every run rewrote all stories).
// CDN draft returns the published+draft content and is consistent within a
// few seconds of mapi writes.
const CDN_TOKEN = process.env.NEXT_PUBLIC_STORYBLOK_TOKEN || ''
async function getExistingStories() {
  const all: any[] = []
  for (const prefix of ['listings/', 'sold/']) {
    let page = 1
    while (true) {
      try {
        const res = await fetch(
          `https://api.storyblok.com/v2/cdn/stories?starts_with=${prefix}&per_page=100&page=${page}&token=${CDN_TOKEN}&version=draft`
        )
        if (!res.ok) break
        const data = await res.json()
        const stories = data.stories || []
        all.push(...stories)
        if (stories.length < 100) break
        page++
      } catch { break }
    }
  }
  return all
}

async function syncListing(listing: any, existing: any[]) {
  const folder = listing.status === 'Sold' ? 'sold' : 'listings'
  const normalize = (s: string) => (s || '').toLowerCase().replace(/[^a-z0-9]/g, '')
  const match = existing.find((s: any) =>
    s.slug === listing.slug ||
    s.content?.wpId === String(listing.wpId) ||
    normalize(s.content?.address) === normalize(listing.address)
  )

  const hash = listingHash(listing)
  const content: any = {
    component: 'listing',
    address: listing.address, city: listing.city, neighbourhood: listing.neighbourhood,
    price: listing.price ? String(listing.price) : '', propertyType: listing.propertyType,
    lotSize: listing.lotSize || '', status: listing.status, featured: listing.featured,
    description: listing.description, brochureUrl: listing.brochureUrl || '',
    mlsNumber: listing.mlsNumber || '',
    latitude: listing.lat || '', longitude: listing.lng || '',
    wpId: String(listing.wpId), wpModified: listing.wpModified, wpLink: listing.wpLink || '',
    wpHash: hash,
  }
  if (listing.image) content.images = [{ filename: listing.image, alt: listing.address }]

  if (match) {
    if (match.content?.wpHash === hash) return 'skipped'
    const res = await fetch(`https://mapi.storyblok.com/v1/spaces/${SPACE_ID}/stories/${match.id}`, {
      method: 'PUT',
      headers: { 'Authorization': MGMT_TOKEN, 'Content-Type': 'application/json' },
      body: JSON.stringify({ story: { content }, publish: 1 }),
    })
    return res.ok ? 'updated' : 'error'
  } else {
    let parentId = 0
    try {
      const res = await fetch(`https://mapi.storyblok.com/v1/spaces/${SPACE_ID}/stories?with_slug=${folder}`, {
        headers: { 'Authorization': MGMT_TOKEN },
      })
      const data = await res.json()
      if (data.stories?.[0]) parentId = data.stories[0].id
    } catch {}

    const res = await fetch(`https://mapi.storyblok.com/v1/spaces/${SPACE_ID}/stories`, {
      method: 'POST',
      headers: { 'Authorization': MGMT_TOKEN, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        story: { name: listing.address, slug: listing.slug, parent_id: parentId || undefined, content },
        publish: 1,
      }),
    })
    return res.ok ? 'created' : 'error'
  }
}

export async function GET(req: NextRequest) {
  // Auth — Vercel cron sends `Authorization: Bearer ${CRON_SECRET}` automatically
  // when CRON_SECRET is set on the project. Reject anything else so the endpoint
  // can't be hammered from the open internet (forcing wasteful Storyblok writes
  // or interfering with concurrent CMS edits).
  const expected = process.env.CRON_SECRET
  if (expected) {
    const got = req.headers.get('authorization') || ''
    if (got !== `Bearer ${expected}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  try {
    const wpListings = await fetchWPListings()
    if (!wpListings.length) return NextResponse.json({ message: 'No WP listings found', synced: 0 })

    // Only sync court-ordered mandate listings (matching /court-ordered-mandates/ page)
    const courtOrdered = wpListings.filter((p: any) =>
      (p.class_list || []).some((c: string) => c.includes('listing-category-court-order-mandate'))
    )

    const listings = courtOrdered.map(parseWPListing)

    // Backfill acres + MLS from the rendered listing page for any record where
    // the REST API returned null (the WP Listings plugin doesn't expose
    // `_listing_acres` / `_listing_mls` over REST even though both are entered).
    await enrichListings(listings)

    const existing = await getExistingStories()

    const counts = { created: 0, updated: 0, skipped: 0, error: 0 }
    for (const listing of listings) {
      const result = await syncListing(listing, existing)
      counts[result as keyof typeof counts]++
      await new Promise(r => setTimeout(r, 350))
    }

    // Scrape new insolvency news in-process (was an HTTP hop to ${VERCEL_URL}
    // which hit Vercel deployment-protection and silently 404'd).
    let newsResult = { scraped: 0, error: null as string | null }
    try {
      const r = await runScrape()
      newsResult.scraped = r.newArticles || 0
    } catch (e: any) {
      newsResult.error = e.message
    }

    return NextResponse.json({
      message: `Synced ${listings.length} listings`,
      ...counts,
      news: newsResult,
      timestamp: new Date().toISOString(),
    })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
