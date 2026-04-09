#!/usr/bin/env node
/**
 * WordPress → Storyblok Listing Sync
 *
 * Pulls listings from varingroup.com WordPress REST API
 * and creates/updates them in Storyblok.
 *
 * Usage:
 *   node scripts/sync-wp-listings.js
 *
 * Environment:
 *   STORYBLOK_MANAGEMENT_TOKEN - Storyblok management API token
 *   STORYBLOK_SPACE_ID - Storyblok space ID
 *   WP_API_URL - WordPress REST API base URL (default: https://varingroup.com/wp-json/wp/v2)
 *
 * Can be run as a cron job (e.g. every hour) or manually.
 */

const WP_API = process.env.WP_API_URL || 'https://varingroup.com/wp-json/wp/v2'
const MGMT_TOKEN = process.env.STORYBLOK_MANAGEMENT_TOKEN || 'Ydr7SNxw0b9QsrPYZ5TxeQtt-156703142833794-BAXvNVGDALsnrCYhLcWy'
const SPACE_ID = process.env.STORYBLOK_SPACE_ID || '291268936642969'

// Storyblok content type for listings
const LISTING_CONTENT_TYPE = 'listing'
const LISTING_FOLDER = 'listings'
const SOLD_FOLDER = 'sold'

async function fetchJSON(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: { 'User-Agent': 'VaringSync/1.0', ...options.headers },
  })
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}: ${url}`)
  return res.json()
}

async function sbFetch(path, options = {}) {
  return fetchJSON(`https://mapi.storyblok.com/v1/spaces/${SPACE_ID}${path}`, {
    ...options,
    headers: { 'Authorization': MGMT_TOKEN, 'Content-Type': 'application/json', ...options.headers },
  })
}

// ==================== WORDPRESS ====================

async function fetchWPListings() {
  console.log('\n── Fetching from WordPress ──')
  const allPosts = []
  let page = 1

  while (true) {
    try {
      // Try custom post type 'listing' first, fall back to 'post' with category
      const url = `${WP_API}/posts?per_page=100&page=${page}&_embed`
      const posts = await fetchJSON(url)
      allPosts.push(...posts)
      console.log(`  Page ${page}: ${posts.length} posts`)
      if (posts.length < 100) break
      page++
    } catch (e) {
      if (page === 1) {
        console.log('  WordPress API not reachable:', e.message)
        return null
      }
      break
    }
  }

  // Also try custom post type 'listing' if it exists
  try {
    const customPosts = await fetchJSON(`${WP_API}/listing?per_page=100&_embed`)
    allPosts.push(...customPosts)
    console.log(`  Custom post type 'listing': ${customPosts.length} posts`)
  } catch {
    // Custom post type doesn't exist, that's fine
  }

  console.log(`  Total: ${allPosts.length} posts from WordPress`)
  return allPosts
}

function wpPostToListing(post) {
  // Extract featured image
  const featuredMedia = post._embedded?.['wp:featuredmedia']?.[0]
  const image = featuredMedia?.source_url || ''

  // Extract categories/tags for property type
  const categories = post._embedded?.['wp:term']?.[0] || []
  const tags = post._embedded?.['wp:term']?.[1] || []
  const propertyType = categories.find(c =>
    c.name?.match(/development|land|commercial|industrial|residential|agricultural|investment/i)
  )?.name || 'Development Land'

  // Parse title for address info
  const title = post.title?.rendered?.replace(/<[^>]*>/g, '') || ''

  // Try to extract city from content or categories
  const cityMatch = post.content?.rendered?.match(/(?:Surrey|Langley|Vancouver|Burnaby|Abbotsford|Chilliwack|Coquitlam|Delta|Richmond|Maple Ridge|Mission|White Rock|Port Coquitlam|Port Moody|New Westminster)/i)
  const city = cityMatch?.[0] || categories.find(c =>
    c.name?.match(/Surrey|Langley|Vancouver|Burnaby|Abbotsford|Chilliwack|Coquitlam|Delta/i)
  )?.name || ''

  // Extract price from content
  const priceMatch = post.content?.rendered?.match(/\$[\d,]+(?:\.\d+)?(?:\s*(?:M|million))?/i)
  let price = null
  if (priceMatch) {
    const cleaned = priceMatch[0].replace(/[$,]/g, '')
    price = parseFloat(cleaned)
    if (/M|million/i.test(priceMatch[0])) price *= 1000000
  }

  // Extract lot size/acres
  const acreMatch = post.content?.rendered?.match(/([\d.]+)\s*(?:acres?|ac)/i)
  const lotSize = acreMatch?.[1] || null

  // Determine status from tags/categories
  const isSold = tags.some(t => /sold/i.test(t.name)) ||
    categories.some(c => /sold/i.test(c.name)) ||
    post.content?.rendered?.match(/\bSOLD\b/i)

  const slug = post.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

  return {
    address: title,
    city,
    price,
    propertyType,
    lotSize,
    status: isSold ? 'Sold' : 'Active',
    mlsNumber: '',
    featured: post.sticky || false,
    slug,
    image,
    wpId: post.id,
    wpModified: post.modified,
  }
}

// ==================== STORYBLOK ====================

async function getExistingListings() {
  console.log('\n── Fetching existing Storyblok listings ──')
  const allStories = []
  let page = 1

  while (true) {
    const data = await sbFetch(`/stories?starts_with=listings/&per_page=100&page=${page}`)
    allStories.push(...(data.stories || []))
    if ((data.stories || []).length < 100) break
    page++
  }

  // Also check sold folder
  page = 1
  while (true) {
    try {
      const data = await sbFetch(`/stories?starts_with=sold/&per_page=100&page=${page}`)
      allStories.push(...(data.stories || []))
      if ((data.stories || []).length < 100) break
      page++
    } catch { break }
  }

  console.log(`  Found ${allStories.length} existing listings in Storyblok`)
  return allStories
}

async function createOrUpdateListing(listing, existingStories) {
  const folder = listing.status === 'Sold' ? SOLD_FOLDER : LISTING_FOLDER
  const fullSlug = `${folder}/${listing.slug}`

  // Check if story already exists
  const existing = existingStories.find(s =>
    s.full_slug === fullSlug ||
    s.slug === listing.slug ||
    s.content?.wpId === String(listing.wpId)
  )

  const content = {
    component: LISTING_CONTENT_TYPE,
    address: listing.address,
    city: listing.city,
    price: listing.price ? String(listing.price) : '',
    propertyType: listing.propertyType,
    lotSize: listing.lotSize || '',
    status: listing.status,
    mlsNumber: listing.mlsNumber,
    featured: listing.featured,
    wpId: String(listing.wpId),
    wpModified: listing.wpModified,
  }

  // Add image if available
  if (listing.image) {
    content.images = [{ filename: listing.image, alt: listing.address }]
  }

  if (existing) {
    // Check if WP version is newer
    if (existing.content?.wpModified === listing.wpModified) {
      return { action: 'skipped', slug: fullSlug }
    }

    // Update
    try {
      await sbFetch(`/stories/${existing.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          story: { content },
          publish: 1,
        }),
      })
      return { action: 'updated', slug: fullSlug }
    } catch (e) {
      return { action: 'error', slug: fullSlug, error: e.message }
    }
  } else {
    // Create new
    // Find parent folder ID
    let parentId = 0
    try {
      const folderData = await sbFetch(`/stories?with_slug=${folder}`)
      if (folderData.stories?.[0]) parentId = folderData.stories[0].id
    } catch {}

    try {
      await sbFetch('/stories', {
        method: 'POST',
        body: JSON.stringify({
          story: {
            name: listing.address,
            slug: listing.slug,
            parent_id: parentId || undefined,
            content,
          },
          publish: 1,
        }),
      })
      return { action: 'created', slug: fullSlug }
    } catch (e) {
      return { action: 'error', slug: fullSlug, error: e.message }
    }
  }
}

// ==================== MAIN ====================

async function sync() {
  console.log('═══════════════════════════════════════')
  console.log('  WordPress → Storyblok Listing Sync')
  console.log('═══════════════════════════════════════')
  console.log(`  WP API: ${WP_API}`)
  console.log(`  Space:  ${SPACE_ID}`)
  console.log(`  Time:   ${new Date().toISOString()}`)

  // Step 1: Fetch from WordPress
  const wpPosts = await fetchWPListings()
  if (!wpPosts) {
    console.log('\n✗ WordPress not reachable. Sync aborted.')
    process.exit(1)
  }
  if (wpPosts.length === 0) {
    console.log('\n✓ No listings found in WordPress.')
    return
  }

  // Step 2: Convert to listing format
  const listings = wpPosts.map(wpPostToListing)
  console.log(`\n── Converted ${listings.length} listings ──`)
  listings.forEach(l => console.log(`  ${l.status.padEnd(6)} ${l.address} (${l.city || 'no city'})`))

  // Step 3: Get existing Storyblok stories
  const existingStories = await getExistingListings()

  // Step 4: Create/update each listing
  console.log('\n── Syncing to Storyblok ──')
  const results = { created: 0, updated: 0, skipped: 0, error: 0 }

  for (const listing of listings) {
    const result = await createOrUpdateListing(listing, existingStories)
    results[result.action]++
    if (result.action !== 'skipped') {
      console.log(`  ${result.action.toUpperCase()}: ${result.slug}${result.error ? ' — ' + result.error : ''}`)
    }
    // Rate limit: Storyblok allows 3 req/sec on starter plan
    await new Promise(r => setTimeout(r, 350))
  }

  console.log('\n═══════════════════════════════════════')
  console.log(`  Results:`)
  console.log(`    Created: ${results.created}`)
  console.log(`    Updated: ${results.updated}`)
  console.log(`    Skipped: ${results.skipped} (unchanged)`)
  console.log(`    Errors:  ${results.error}`)
  console.log('═══════════════════════════════════════\n')
}

sync().catch(e => {
  console.error('Sync failed:', e.message)
  process.exit(1)
})
