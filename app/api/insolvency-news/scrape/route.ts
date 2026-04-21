import { NextResponse } from 'next/server'
import OpenAI from 'openai'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

const SPACE_ID = process.env.STORYBLOK_SPACE_ID || '291268936642969'
const MGMT_TOKEN = process.env.STORYBLOK_MANAGEMENT_TOKEN || ''
const CDN_TOKEN = process.env.NEXT_PUBLIC_STORYBLOK_TOKEN || ''

// Get news folder ID
async function getNewsFolderId(): Promise<number> {
  const res = await fetch(
    `https://mapi.storyblok.com/v1/spaces/${SPACE_ID}/stories?with_slug=news`,
    { headers: { Authorization: MGMT_TOKEN } }
  )
  const data = await res.json()
  return data.stories?.[0]?.id || 0
}

// Get existing article URLs from Storyblok
async function getExistingUrls(): Promise<Set<string>> {
  const urls = new Set<string>()
  let page = 1
  while (true) {
    const res = await fetch(
      `https://api.storyblok.com/v2/cdn/stories?starts_with=news/&per_page=100&page=${page}&token=${CDN_TOKEN}&version=published`
    )
    if (!res.ok) break
    const data = await res.json()
    for (const s of data.stories || []) {
      if (s.content?.url) urls.add(s.content.url)
    }
    if ((data.stories || []).length < 100) break
    page++
  }
  return urls
}

// Push a new article to Storyblok
async function pushArticle(article: any, folderId: number): Promise<boolean> {
  const slug = article.url.split('/').pop()?.replace(/[^a-z0-9-]/g, '') || Date.now().toString()
  const res = await fetch(`https://mapi.storyblok.com/v1/spaces/${SPACE_ID}/stories`, {
    method: 'POST',
    headers: { Authorization: MGMT_TOKEN, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      story: {
        name: article.title,
        slug,
        parent_id: folderId,
        content: {
          component: 'news_article',
          title: article.title,
          date: article.date,
          author: article.author,
          category: article.category,
          url: article.url,
          summary: article.summary,
          image: article.image || '',
        },
      },
      publish: 1,
    }),
  })
  return res.ok
}

// Fetch article and generate AI summary
async function fetchAndSummarize(url: string, openai: OpenAI): Promise<any | null> {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'VaringNewsBot/1.0' },
      signal: AbortSignal.timeout(10000),
    })
    if (!res.ok) return null

    const html = await res.text()

    // Try OG title first, then <title>
    const ogTitleMatch = html.match(/property="og:title"[^>]*content="([^"]+)"/i)
      || html.match(/content="([^"]+)"[^>]*property="og:title"/i)
    const titleMatch = html.match(/<title>([^<]+)<\/title>/i)
    const title = (ogTitleMatch?.[1] || titleMatch?.[1] || '')
      .replace(/\s*[|\-–—]\s*(Insolvency Insider|Storeys|Business in Vancouver|BCBusiness|BIV).*$/i, '')
      .trim()
    if (!title) return null

    const rawText = html
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 3000)

    // Extract OG image
    const ogMatch = html.match(/property="og:image"[^>]*content="([^"]+)"/i)
      || html.match(/content="([^"]+)"[^>]*property="og:image"/i)
    const image = ogMatch?.[1] || ''

    const dateMatch = html.match(/datetime="(\d{4}-\d{2}-\d{2})/) || html.match(/(\d{4}-\d{2}-\d{2})/)
    const date = dateMatch?.[1] || new Date().toISOString().split('T')[0]

    const authorMatch = html.match(/"author"[^}]*"name"\s*:\s*"([^"]+)"/i)
      || html.match(/<meta[^>]*name="author"[^>]*content="([^"]+)"/i)
      || html.match(/property="article:author"[^>]*content="([^"]+)"/i)
      || html.match(/by\s+<[^>]*>([^<]+)/i)
    let author = authorMatch?.[1]?.trim() || ''
    if (!author) {
      // Fallback to domain name
      try {
        const host = new URL(url).hostname.replace('www.', '').split('.')[0]
        author = host.charAt(0).toUpperCase() + host.slice(1)
      } catch {
        author = 'News Source'
      }
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a legal news analyst specializing in BC real estate. Given an article, determine if it is specifically about British Columbia REAL ESTATE, LAND, DEVELOPMENT SITES, or PROPERTY (receiverships, foreclosures, court-ordered sales, CCAA involving real property). Return JSON: {"summary":"2-3 sentence factual summary","category":"Real Estate & Development|Court Decisions","isBCRealEstate":true/false}. Return isBCRealEstate=false for articles about non-property businesses like retail stores, restaurants, trucking companies, film production, breweries, automotive dealerships, etc. — even if they are BC-based insolvencies. Only keep articles where the core asset is land, buildings, development sites, or real property. Only return JSON.',
        },
        { role: 'user', content: `Title: ${title}\n\nText: ${rawText}` },
      ],
      temperature: 0.3,
    })

    const aiText = completion.choices[0]?.message?.content || '{}'
    let parsed: any = {}
    try {
      parsed = JSON.parse(aiText.replace(/```json?\n?/g, '').replace(/```/g, '').trim())
    } catch {
      return null
    }

    if (!parsed.isBCRealEstate) return null

    return { title, date, author, category: parsed.category || 'Real Estate & Development', url, summary: parsed.summary || '', image }
  } catch {
    return null
  }
}

export async function POST() {
  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    const existingUrls = await getExistingUrls()
    const folderId = await getNewsFolderId()

    if (!folderId) {
      return NextResponse.json({ error: 'News folder not found in Storyblok' }, { status: 500 })
    }

    let newCount = 0

    // RSS feed sources — more reliable than HTML scraping
    const rssFeeds = [
      'https://storeys.com/feeds/feed.rss',
      'https://bcbusiness.ca/feed/',
      'https://howardchai.substack.com/feed',
    ]

    // Keywords to pre-filter RSS items before calling OpenAI (saves tokens)
    const relevantKeywords = /receivership|foreclosure|ccaa|insolvency|bankruptcy|distressed|court.ordered|land assembly|development site/i
    const bcKeywords = /british columbia|\bBC\b|vancouver|burnaby|surrey|richmond|langley|coquitlam|abbotsford|victoria|kelowna|fraser valley|lower mainland/i

    // Parse RSS: extract <item> blocks, get title, link, description, pubDate
    function parseRSS(xml: string) {
      const items: any[] = []
      const itemMatches = xml.matchAll(/<item[^>]*>([\s\S]*?)<\/item>/g)
      for (const m of itemMatches) {
        const item = m[1]
        const get = (tag: string) => {
          const mm = item.match(new RegExp(`<${tag}[^>]*>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?<\\/${tag}>`))
          return mm?.[1]?.trim() || ''
        }
        items.push({
          title: get('title'),
          link: get('link'),
          description: get('description').replace(/<[^>]+>/g, '').slice(0, 500),
          pubDate: get('pubDate'),
        })
      }
      return items
    }

    for (const feedUrl of rssFeeds) {
      try {
        const res = await fetch(feedUrl, {
          headers: { 'User-Agent': 'Mozilla/5.0 (compatible; VaringNewsBot/1.0)' },
          signal: AbortSignal.timeout(15000),
        })
        if (!res.ok) continue

        const xml = await res.text()
        const items = parseRSS(xml)

        // Pre-filter: must mention insolvency-related term AND BC location
        const candidates = items.filter(item => {
          const text = `${item.title} ${item.description}`
          return relevantKeywords.test(text) && bcKeywords.test(text)
        })

        // Process up to 3 candidates per feed (further filtered by AI)
        for (const item of candidates.slice(0, 3)) {
          if (existingUrls.has(item.link)) continue
          const article = await fetchAndSummarize(item.link, openai)
          if (article) {
            const ok = await pushArticle(article, folderId)
            if (ok) newCount++
            existingUrls.add(item.link)
          }
          await new Promise(r => setTimeout(r, 350))
        }
      } catch {
        continue
      }
    }

    return NextResponse.json({
      message: 'Scrape complete',
      newArticles: newCount,
      timestamp: new Date().toISOString(),
    })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
