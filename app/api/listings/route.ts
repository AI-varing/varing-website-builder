import { NextResponse } from 'next/server'
import { DEMO_LISTINGS } from '@/lib/demo-listings'

export async function GET() {
  const token = process.env.NEXT_PUBLIC_STORYBLOK_TOKEN
  try {
    // Fetch both active listings and sold court-ordered mandates
    const [activeRes, soldRes] = await Promise.all([
      fetch(
        `https://api.storyblok.com/v2/cdn/stories?starts_with=listings/&token=${token}&version=draft&sort_by=content.featured:desc`,
        { cache: 'no-store' }
      ),
      fetch(
        `https://api.storyblok.com/v2/cdn/stories?starts_with=sold/&token=${token}&version=draft`,
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
      price: Number(story.content.price) || null,
      propertyType: story.content.propertyType,
      lotSize: story.content.lotSize || null,
      status: story.content.status || 'Active',
      mlsNumber: story.content.mlsNumber,
      featured: story.content.featured || false,
      slug: story.slug,
      mainImage: story.content.images?.[0]?.filename || null,
      brochureUrl: story.content.brochure?.filename || null,
    }))

    if (listings.length > 3) return NextResponse.json(listings)
  } catch {}

  // Fallback to demo listings when Storyblok has few/no entries
  return NextResponse.json(DEMO_LISTINGS)
}
