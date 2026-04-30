import { Metadata } from 'next'
import NewsPageClient from './NewsPageClient'

export const metadata: Metadata = {
  title: 'BC Insolvency & Receivership News',
  description:
    'BC insolvency and receivership news curated by Targeted Advisors — updates on receiverships, foreclosures, court-ordered sales, and distressed real estate activity across British Columbia.',
  alternates: { canonical: '/insolvency-news' },
  openGraph: {
    title: 'BC Insolvency & Receivership News | Targeted Advisors',
    description:
      'Updates on receiverships, foreclosures, court-ordered sales, and distressed real estate activity across British Columbia.',
    url: 'https://www.targetedadvisors.ca/insolvency-news',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BC Insolvency & Receivership News | Targeted Advisors',
    description:
      'Updates on receiverships, foreclosures, court-ordered sales, and distressed real estate activity across British Columbia.',
  },
}

export const dynamic = 'force-dynamic'

const CDN_TOKEN = process.env.NEXT_PUBLIC_STORYBLOK_TOKEN || ''

async function getArticles() {
  try {
    const articles: any[] = []
    let page = 1
    while (true) {
      const res = await fetch(
        `https://api.storyblok.com/v2/cdn/stories?starts_with=news/&per_page=100&page=${page}&token=${CDN_TOKEN}&version=draft&cv=${Date.now()}`,
        { cache: 'no-store' }
      )
      if (!res.ok) break
      const data = await res.json()
      for (const s of data.stories || []) {
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
      if ((data.stories || []).length < 100) break
      page++
    }
    articles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    return articles
  } catch {
    return []
  }
}

export default async function InsolvencyNewsPage() {
  const articles = await getArticles()
  return <NewsPageClient articles={articles} />
}
