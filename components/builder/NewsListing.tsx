'use client'

import React, { useEffect, useState } from 'react'
import { storyblokEditable } from '@storyblok/react'
import { CR, B } from '@/lib/tokens'
import NewsPageClient from '@/app/insolvency-news/NewsPageClient'

export default function NewsListing({ blok }: { blok: any }) {
  const heading = blok?.heading
  const subheading = blok?.subheading
  const max = blok?.maxArticles || 30
  const [articles, setArticles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    fetch('/api/insolvency-news')
      .then(r => r.ok ? r.json() : { articles: [] })
      .then(d => {
        if (cancelled) return
        const list = Array.isArray(d?.articles) ? d.articles : Array.isArray(d) ? d : []
        setArticles(list.slice(0, max))
        setLoading(false)
      })
      .catch(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [max])

  return (
    <section
      {...storyblokEditable(blok)}
      style={{ padding: '40px 24px 96px', borderTop: `1px solid ${B}` }}
    >
      {(heading || subheading) && (
        <div style={{ maxWidth: 980, margin: '0 auto 32px', textAlign: 'center' }}>
          {heading && (
            <h2 style={{
              fontFamily: "'BentonSans', sans-serif",
              fontSize: 'clamp(22px, 2.4vw, 32px)',
              fontWeight: 900, letterSpacing: '0.08em', textTransform: 'uppercase',
              color: CR, margin: '0 0 12px',
            }}>{heading}</h2>
          )}
          {subheading && (
            <p style={{ fontSize: 14, color: 'rgba(240,234,224,0.6)', maxWidth: 620, margin: '0 auto', lineHeight: 1.7 }}>{subheading}</p>
          )}
        </div>
      )}
      {loading ? (
        <div style={{ textAlign: 'center', color: 'rgba(240,234,224,0.4)', padding: 40 }}>Loading…</div>
      ) : (
        <NewsPageClient articles={articles} />
      )}
    </section>
  )
}
