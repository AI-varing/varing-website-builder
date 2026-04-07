import { NextResponse } from 'next/server'

const FALLBACK_SOLD = [
  { _id: 's1', address: '4272 176 St', city: 'Surrey', neighbourhood: 'Cloverdale', propertyType: 'Development Land', acres: '4.2', year: 2025, image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&h=400&fit=crop' },
  { _id: 's2', address: '9010 156A St', city: 'Surrey', neighbourhood: 'Fleetwood', propertyType: 'Development Land', acres: '2.8', year: 2025, image: 'https://images.unsplash.com/photo-1625244724120-1fd1d34d00f6?w=600&h=400&fit=crop' },
  { _id: 's3', address: '15738 North Bluff Rd', city: 'White Rock', neighbourhood: 'North Bluff', propertyType: 'Development Land', acres: '1.1', year: 2025, image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=400&fit=crop' },
  { _id: 's4', address: '14318 60 Ave', city: 'Surrey', neighbourhood: 'South Newton', propertyType: 'Development Land', acres: '3.5', year: 2025, image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&h=400&fit=crop' },
  { _id: 's5', address: '18737 72 Ave', city: 'Surrey', neighbourhood: 'Clayton', propertyType: 'Development Land', acres: '2.4', year: 2024, image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop' },
  { _id: 's6', address: '3338 200 St', city: 'Langley', neighbourhood: 'Brookswood', propertyType: 'Development Land', acres: '4.8', year: 2024, image: 'https://images.unsplash.com/photo-1448630360428-65456885c650?w=600&h=400&fit=crop' },
  { _id: 's7', address: '23638 Dewdney Trunk Rd', city: 'Maple Ridge', neighbourhood: 'Cottonwood', propertyType: 'Development Land', acres: '1.2', year: 2024, image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=400&fit=crop' },
  { _id: 's8', address: '9341 177 St', city: 'Surrey', neighbourhood: 'Tynehead', propertyType: 'Development Land', acres: '2.4', year: 2024, image: 'https://images.unsplash.com/photo-1582407947092-5e4cab8b1d68?w=600&h=400&fit=crop' },
  { _id: 's9', address: '2301 152 St', city: 'Surrey', neighbourhood: 'Semiahmoo', propertyType: 'Mixed Use', acres: '0.8', year: 2024, image: 'https://images.unsplash.com/photo-1460317442991-0ec209397118?w=600&h=400&fit=crop' },
  { _id: 's10', address: '36263 North Parallel Rd', city: 'Abbotsford', neighbourhood: 'Sumas Prairie', propertyType: 'Agricultural', acres: '12.5', year: 2023, image: 'https://images.unsplash.com/photo-1416331108676-a22ccb276e35?w=600&h=400&fit=crop' },
  { _id: 's11', address: '10556 140 St', city: 'Surrey', neighbourhood: 'Guildford', propertyType: 'Development Land', acres: '0.6', year: 2023, image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop' },
  { _id: 's12', address: '1156 Fremont-Devon St', city: 'Coquitlam', neighbourhood: 'Burke Mountain', propertyType: 'Development Land', acres: '0.5', year: 2023, image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop' },
]

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
