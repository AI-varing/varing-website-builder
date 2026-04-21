import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

const SPACE_ID = process.env.STORYBLOK_SPACE_ID || '291268936642969'
const CDN_TOKEN = process.env.NEXT_PUBLIC_STORYBLOK_TOKEN || ''

// GET: Return all news articles from Storyblok
export async function GET() {
  try {
    const articles: any[] = []
    let page = 1

    while (true) {
      const res = await fetch(
        `https://api.storyblok.com/v2/cdn/stories?starts_with=news/&per_page=100&page=${page}&sort_by=content.date:desc&token=${CDN_TOKEN}&version=draft&cv=${Date.now()}`,
        { cache: 'no-store' }
      )

      if (!res.ok) break
      const data = await res.json()
      const stories = data.stories || []

      for (const s of stories) {
        const c = s.content || {}
        if (c.component !== 'news_article') continue
        articles.push({
          id: s.slug,
          title: c.title || s.name,
          date: c.date || '',
          author: c.author || 'Insolvency Insider',
          category: c.category || 'Real Estate & Development',
          url: c.url || '',
          summary: c.summary || '',
          image: c.image || '',
        })
      }

      if (stories.length < 100) break
      page++
    }

    // Sort by date descending
    articles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    return NextResponse.json(articles)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
