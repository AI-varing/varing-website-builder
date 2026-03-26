import { NextResponse } from 'next/server'
import { DEMO_LISTINGS } from '@/lib/demo-listings'

export async function GET() {
  const token = process.env.NEXT_PUBLIC_STORYBLOK_TOKEN
  try {
    const res = await fetch(
      `https://api.storyblok.com/v2/cdn/stories?starts_with=listings/&token=${token}&version=draft&sort_by=content.featured:desc`,
      { cache: 'no-store' }
    )
    const data = await res.json()

    const listings = (data.stories || []).map((story: any) => ({
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
    }))

    if (listings.length > 3) return NextResponse.json(listings)
  } catch {}

  // Fallback to demo listings when Storyblok has few/no entries
  return NextResponse.json(DEMO_LISTINGS)
}
