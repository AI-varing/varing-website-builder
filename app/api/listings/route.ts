import { NextResponse } from 'next/server'
import { DEMO_LISTINGS } from '@/lib/demo-listings'

export async function GET() {
  const token = process.env.NEXT_PUBLIC_STORYBLOK_TOKEN
  try {
    // Fetch both active listings and sold court-ordered mandates.
    // per_page=100 — Storyblok defaults to 25, which silently truncated the
    // listings page + search corpus once inventory grew past 25 items.
    const [activeRes, soldRes] = await Promise.all([
      fetch(
        `https://api.storyblok.com/v2/cdn/stories?starts_with=listings/&token=${token}&version=draft&sort_by=content.featured:desc&per_page=100`,
        { cache: 'no-store' }
      ),
      fetch(
        `https://api.storyblok.com/v2/cdn/stories?starts_with=sold/&token=${token}&version=draft&per_page=100`,
        { cache: 'no-store' }
      ),
    ])
    const activeData = await activeRes.json()
    const soldData = await soldRes.json()

    // Only include sold stories that have a wpId (court-ordered from WP sync)
    const soldCourtOrdered = (soldData.stories || []).filter(
      (s: any) => s.content?.wpId
    )

    const allStories = [...(activeData.stories || []), ...soldCourtOrdered]

    const listings = allStories.map((story: any) => ({
      _id: story.uuid,
      address: story.content.address,
      city: story.content.city,
      neighbourhood: story.content.neighbourhood || '',
      price: Number(story.content.price) || null,
      propertyType: story.content.propertyType,
      lotSize: story.content.lotSize || null,
      status: story.content.status || 'Active',
      mlsNumber: story.content.mlsNumber || '',
      featured: story.content.featured || false,
      slug: story.slug,
      mainImage: story.content.images?.[0]?.filename || null,
      // Sync writes brochureUrl as a string; legacy CMS uploads stored a
      // Storyblok asset under content.brochure. Prefer the string, fall back
      // to the asset filename.
      brochureUrl: story.content.brochureUrl || story.content.brochure?.filename || null,
      description: story.content.description || '',
    }))

    if (listings.length > 3) return NextResponse.json(listings)
  } catch {}

  // Fallback to demo listings when Storyblok has few/no entries
  return NextResponse.json(DEMO_LISTINGS)
}
