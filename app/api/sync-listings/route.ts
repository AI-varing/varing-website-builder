import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const maxDuration = 60 // seconds (Vercel Pro allows up to 300)

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
    wpId: post.id, wpModified: post.modified_gmt, wpLink: post.link,
  }
}

async function getExistingStories() {
  const all = []
  for (const prefix of ['listings/', 'sold/']) {
    let page = 1
    while (true) {
      try {
        const res = await fetch(
          `https://mapi.storyblok.com/v1/spaces/${SPACE_ID}/stories?starts_with=${prefix}&per_page=100&page=${page}`,
          { headers: { 'Authorization': MGMT_TOKEN } }
        )
        const data = await res.json()
        all.push(...(data.stories || []))
        if ((data.stories || []).length < 100) break
        page++
      } catch { break }
    }
  }
  return all
}

async function syncListing(listing: any, existing: any[]) {
  const folder = listing.status === 'Sold' ? 'sold' : 'listings'
  const match = existing.find((s: any) => s.slug === listing.slug || s.content?.wpId === String(listing.wpId))

  const content: any = {
    component: 'listing',
    address: listing.address, city: listing.city, neighbourhood: listing.neighbourhood,
    price: listing.price ? String(listing.price) : '', propertyType: listing.propertyType,
    lotSize: listing.lotSize || '', status: listing.status, featured: listing.featured,
    description: listing.description, brochureUrl: listing.brochureUrl || '',
    latitude: listing.lat || '', longitude: listing.lng || '',
    wpId: String(listing.wpId), wpModified: listing.wpModified, wpLink: listing.wpLink || '',
  }
  if (listing.image) content.images = [{ filename: listing.image, alt: listing.address }]

  if (match) {
    if (match.content?.wpModified === listing.wpModified) return 'skipped'
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

export async function GET() {
  // Allow SSL bypass for varinggroup.com cert issues
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

  try {
    const wpListings = await fetchWPListings()
    if (!wpListings.length) return NextResponse.json({ message: 'No WP listings found', synced: 0 })

    const listings = wpListings.map(parseWPListing)
    const existing = await getExistingStories()

    const counts = { created: 0, updated: 0, skipped: 0, error: 0 }
    for (const listing of listings) {
      const result = await syncListing(listing, existing)
      counts[result as keyof typeof counts]++
      await new Promise(r => setTimeout(r, 350))
    }

    return NextResponse.json({
      message: `Synced ${listings.length} listings`,
      ...counts,
      timestamp: new Date().toISOString(),
    })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
