import { NextResponse } from 'next/server'

export async function GET() {
  const token = process.env.NEXT_PUBLIC_STORYBLOK_TOKEN
  const res = await fetch(
    `https://api.storyblok.com/v2/cdn/stories?starts_with=listings/&token=${token}&version=draft&sort_by=content.featured:desc`,
    { next: { revalidate: 60 } }
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

  return NextResponse.json(listings)
}
