import type { MetadataRoute } from 'next'

const SITE_URL = 'https://www.targetedadvisors.ca'

type StoryblokStory = {
  slug: string
  full_slug?: string
  published_at?: string | null
  created_at?: string
  updated_at?: string
}

async function fetchStorySlugs(folder: 'listings' | 'sold'): Promise<StoryblokStory[]> {
  const token = process.env.NEXT_PUBLIC_STORYBLOK_TOKEN
  if (!token) return []
  const all: StoryblokStory[] = []
  let page = 1
  // Cap pagination defensively; per_page=100 handles up to 1000 listings.
  for (let i = 0; i < 10; i++) {
    try {
      const res = await fetch(
        `https://api.storyblok.com/v2/cdn/stories?starts_with=${folder}/&per_page=100&page=${page}&token=${token}&version=draft`,
        { next: { revalidate: 3600 } }
      )
      if (!res.ok) break
      const data = await res.json()
      const stories: StoryblokStory[] = data?.stories || []
      if (!stories.length) break
      all.push(...stories)
      if (stories.length < 100) break
      page++
    } catch {
      break
    }
  }
  return all
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/ai`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/advisory`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/insights`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/insolvency-news`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/listings`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
  ]

  const [active, sold] = await Promise.all([
    fetchStorySlugs('listings'),
    fetchStorySlugs('sold'),
  ])

  // Every listing card on the site links to /listings/<slug> regardless of
  // whether the source folder is `listings/` or `sold/` (matches the lookup
  // logic in app/listings/[slug]/page.tsx). De-duplicate on slug.
  const seen = new Set<string>()
  const listingEntries: MetadataRoute.Sitemap = []
  for (const story of [...active, ...sold]) {
    const slug = story.slug
    if (!slug || seen.has(slug)) continue
    seen.add(slug)
    const lastModRaw = story.published_at || story.updated_at || story.created_at
    const lastModified = lastModRaw ? new Date(lastModRaw) : now
    listingEntries.push({
      url: `${SITE_URL}/listings/${slug}`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.7,
    })
  }

  return [...staticEntries, ...listingEntries]
}
