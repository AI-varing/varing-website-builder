import { NextResponse } from 'next/server'

export async function GET() {
  const token = process.env.NEXT_PUBLIC_STORYBLOK_TOKEN
  const res = await fetch(
    `https://api.storyblok.com/v2/cdn/stories?starts_with=testimonials/&token=${token}&version=draft`,
    { next: { revalidate: 60 } }
  )
  const data = await res.json()

  const testimonials = (data.stories || []).map((story: any) => ({
    _id: story.uuid,
    name: story.content.name,
    role: story.content.role,
    company: story.content.company,
    logo: story.content.logo?.filename || story.content.logo || '',
    quote: story.content.quote,
    rating: Number(story.content.rating) || 5,
    photo: story.content.photo?.filename || '',
  }))

  return NextResponse.json(testimonials)
}
