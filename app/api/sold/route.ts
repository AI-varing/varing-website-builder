import { NextResponse } from 'next/server'

const FALLBACK_SOLD: any[] = []

export async function GET() {
  const token = process.env.NEXT_PUBLIC_STORYBLOK_TOKEN
  try {
    const res = await fetch(
      `https://api.storyblok.com/v2/cdn/stories?starts_with=sold/&token=${token}&version=published&sort_by=content.year:desc&per_page=100`,
      { next: { revalidate: 3600 } }
    )
    const data = await res.json()

    const sold = (data.stories || []).map((story: any) => ({
      _id: story.uuid,
      address: story.content.address,
      city: story.content.city,
      neighbourhood: story.content.neighbourhood || '',
      price: Number(story.content.price) || null,
      year: Number(story.content.year) || new Date().getFullYear(),
      propertyType: story.content.propertyType || 'Development Land',
      acres: story.content.acres || '',
      image: story.content.image?.filename || null,
    }))

    if (sold.length >= 3) return NextResponse.json(sold)
  } catch {}

  return NextResponse.json(FALLBACK_SOLD)
}
