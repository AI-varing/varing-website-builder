#!/usr/bin/env node
/**
 * WordPress → Storyblok Listing Sync
 *
 * Pulls listings from varingroup.com WordPress REST API (custom post type 'listing')
 * and creates/updates them in Storyblok.
 *
 * Usage:  node scripts/sync-wp-listings.js
 * Cron:   0 * * * * cd /path/to/project && node scripts/sync-wp-listings.js >> /tmp/wp-sync.log 2>&1
 */

// Allow self-signed/mismatched SSL certs (varingroup.com has cert issues)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

const WP_API = process.env.WP_API_URL || 'https://www.varinggroup.com/wp-json/wp/v2'
const MGMT_TOKEN = process.env.STORYBLOK_MANAGEMENT_TOKEN || 'Ydr7SNxw0b9QsrPYZ5TxeQtt-156703142833794-BAXvNVGDALsnrCYhLcWy'
const SPACE_ID = process.env.STORYBLOK_SPACE_ID || '291268936642969'

async function fetchJSON(url) {
  const res = await fetch(url, { headers: { 'User-Agent': 'VaringSync/1.0' } })
  if (!res.ok) throw new Error(`${res.status} ${url}`)
  return res.json()
}

async function sbFetch(path, options = {}) {
  return fetchJSON(`https://mapi.storyblok.com/v1/spaces/${SPACE_ID}${path}`, {
    ...options,
    headers: { 'Authorization': MGMT_TOKEN, 'Content-Type': 'application/json', ...options.headers },
  }).catch(async () => {
    // Retry with full fetch for non-GET
    const res = await fetch(`https://mapi.storyblok.com/v1/spaces/${SPACE_ID}${path}`, {
      ...options,
      headers: { 'Authorization': MGMT_TOKEN, 'Content-Type': 'application/json' },
    })
    return res.json()
  })
}

// ==================== WORDPRESS ====================

async function fetchAllWPListings() {
  console.log('\n── Fetching from WordPress ──')
  const all = []
  let page = 1

  while (true) {
    try {
      const url = `${WP_API}/listing?per_page=100&page=${page}&_embed`
      const listings = await fetchJSON(url)
      all.push(...listings)
      console.log(`  Page ${page}: ${listings.length} listings`)
      if (listings.length < 100) break
      page++
    } catch (e) {
      if (page === 1) {
        console.log('  WordPress API error:', e.message)
        return null
      }
      break
    }
  }

  console.log(`  Total: ${all.length} listings`)
  return all
}

function isCourtOrderMandate(post) {
  return (post.class_list || []).some(c => c.includes('listing-category-court-order-mandate'))
}

function parseWPListing(post) {
  const title = (post.title?.rendered || '').replace(/<[^>]*>/g, '')

  // Custom fields from WP listing plugin
  const meta = post.listing_meta || {}
  const address = meta._listing_address || post._listing_address || title
  const city = meta._listing_city || post._listing_city || ''
  const neighbourhood = meta._listing_state || post._listing_state || '' // WP uses 'state' for neighbourhood
  const lat = meta._listing_latitude || post._listing_latitude || null
  const lng = meta._listing_longitude || post._listing_longitude || null

  // Price — comes as "$5,500,000" string
  const priceStr = meta._listing_price || post._listing_price || ''
  let price = null
  if (priceStr) {
    const cleaned = priceStr.replace(/[$,\s]/g, '')
    price = parseFloat(cleaned) || null
  }

  // Featured image
  const featuredMedia = post._embedded?.['wp:featuredmedia']?.[0]
  const image = featuredMedia?.source_url || ''

  // Taxonomies
  const statusTerms = post._embedded?.['wp:term']?.[0] || [] // listing-status taxonomy
  const locationTerms = post._embedded?.['wp:term']?.[1] || [] // locations taxonomy
  const propertyTypeTerms = post._embedded?.['wp:term']?.[2] || [] // property-types taxonomy

  // Determine status
  const statusNames = statusTerms.map(t => t.name?.toLowerCase())
  let status = 'Active'
  if (statusNames.includes('sold')) status = 'Sold'
  else if (statusNames.includes('reduced')) status = 'Reduced'
  else if (statusNames.includes('firm')) status = 'Firm'

  const featured = statusNames.includes('featured')

  // Property type
  const propertyType = propertyTypeTerms[0]?.name || 'Development Land'

  // Location
  const location = locationTerms[0]?.name || city

  // Description from content
  const description = (post.excerpt?.rendered || '').replace(/<[^>]*>/g, '').trim()

  // Lot size from custom fields
  const lotSize = post._listing_lotsize || post._listing_lot_sqft || null

  // Brochure URL from content
  const brochureMatch = post.content?.rendered?.match(/href="([^"]*\.pdf)"/i)
  const brochureUrl = brochureMatch?.[1] || null

  const slug = post.slug || address.toLowerCase().replace(/[^a-z0-9]+/g, '-')

  return {
    address,
    city: location || city,
    neighbourhood,
    price,
    propertyType,
    lotSize,
    status,
    featured,
    slug,
    image,
    description,
    brochureUrl,
    lat, lng,
    wpId: post.id,
    wpModified: post.modified_gmt,
    wpLink: post.link,
  }
}

// ==================== STORYBLOK ====================

async function getExistingStories() {
  console.log('\n── Fetching existing Storyblok listings ──')
  const all = []

  for (const prefix of ['listings/', 'sold/']) {
    let page = 1
    while (true) {
      try {
        const data = await sbFetch(`/stories?starts_with=${prefix}&per_page=100&page=${page}`)
        all.push(...(data.stories || []))
        if ((data.stories || []).length < 100) break
        page++
      } catch { break }
    }
  }

  console.log(`  Found ${all.length} existing stories`)
  return all
}

async function syncListing(listing, existingStories) {
  const folder = listing.status === 'Sold' ? 'sold' : 'listings'
  const fullSlug = `${folder}/${listing.slug}`

  const existing = existingStories.find(s =>
    s.slug === listing.slug ||
    s.content?.wpId === String(listing.wpId)
  )

  const content = {
    component: 'listing',
    address: listing.address,
    city: listing.city,
    neighbourhood: listing.neighbourhood,
    price: listing.price ? String(listing.price) : '',
    propertyType: listing.propertyType,
    lotSize: listing.lotSize || '',
    status: listing.status,
    featured: listing.featured,
    description: listing.description,
    brochureUrl: listing.brochureUrl || '',
    latitude: listing.lat || '',
    longitude: listing.lng || '',
    wpId: String(listing.wpId),
    wpModified: listing.wpModified,
    wpLink: listing.wpLink || '',
  }

  if (listing.image) {
    content.images = [{ filename: listing.image, alt: listing.address }]
  }

  if (existing) {
    if (existing.content?.wpModified === listing.wpModified) {
      return 'skipped'
    }
    try {
      await fetch(`https://mapi.storyblok.com/v1/spaces/${SPACE_ID}/stories/${existing.id}`, {
        method: 'PUT',
        headers: { 'Authorization': MGMT_TOKEN, 'Content-Type': 'application/json' },
        body: JSON.stringify({ story: { content }, publish: 1 }),
      })
      return 'updated'
    } catch { return 'error' }
  } else {
    // Find parent folder
    let parentId = 0
    try {
      const folderData = await sbFetch(`/stories?with_slug=${folder}`)
      if (folderData.stories?.[0]) parentId = folderData.stories[0].id
    } catch {}

    try {
      await fetch(`https://mapi.storyblok.com/v1/spaces/${SPACE_ID}/stories`, {
        method: 'POST',
        headers: { 'Authorization': MGMT_TOKEN, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          story: { name: listing.address, slug: listing.slug, parent_id: parentId || undefined, content },
          publish: 1,
        }),
      })
      return 'created'
    } catch { return 'error' }
  }
}

// ==================== MAIN ====================

async function main() {
  console.log('═══════════════════════════════════════')
  console.log('  WordPress → Storyblok Listing Sync')
  console.log(`  ${new Date().toISOString()}`)
  console.log('═══════════════════════════════════════')

  const wpListings = await fetchAllWPListings()
  if (!wpListings) { console.log('\n✗ Aborted.'); process.exit(1) }
  if (!wpListings.length) { console.log('\n✓ No listings.'); return }

  // Only sync court-ordered mandate listings (matching /court-ordered-mandates/ page)
  const courtOrdered = wpListings.filter(isCourtOrderMandate)
  console.log(`\n── Filtered: ${wpListings.length} total → ${courtOrdered.length} court-ordered mandates ──`)

  const allParsed = courtOrdered.map(parseWPListing)

  // Deduplicate: keep newest WP entry (highest wpId) per address
  const byAddress = new Map()
  allParsed.forEach(l => {
    const key = l.address.toLowerCase()
    const existing = byAddress.get(key)
    if (!existing || l.wpId > existing.wpId) {
      byAddress.set(key, l)
    }
  })
  const listings = [...byAddress.values()]
  if (listings.length < allParsed.length) {
    console.log(`\n── Deduped: ${allParsed.length} → ${listings.length} (removed ${allParsed.length - listings.length} duplicates) ──`)
  }

  console.log(`\n── ${listings.length} listings ──`)
  listings.forEach(l => {
    const p = l.price ? `$${(l.price/1000000).toFixed(1)}M` : 'no price'
    console.log(`  ${l.status.padEnd(7)} ${l.address} — ${l.city} (${p})`)
  })

  const existing = await getExistingStories()

  console.log('\n── Syncing ──')
  const counts = { created: 0, updated: 0, skipped: 0, error: 0 }

  for (const listing of listings) {
    const result = await syncListing(listing, existing)
    counts[result]++
    if (result !== 'skipped') console.log(`  ${result.toUpperCase()}: ${listing.address}`)
    await new Promise(r => setTimeout(r, 350)) // rate limit
  }

  console.log('\n═══════════════════════════════════════')
  console.log(`  Created: ${counts.created} | Updated: ${counts.updated} | Skipped: ${counts.skipped} | Errors: ${counts.error}`)
  console.log('═══════════════════════════════════════\n')
}

main().catch(e => { console.error('Fatal:', e.message); process.exit(1) })
