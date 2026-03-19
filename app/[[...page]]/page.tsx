import { getStoryblokApi } from '@storyblok/react'
import { notFound } from 'next/navigation'
import StoryblokPageContent from './StoryblokPageContent'
import { initStoryblok } from '@/lib/storyblok'

// Initialize Storyblok on server side
initStoryblok()

interface PageProps {
  params: Promise<{ page?: string[] }>
}

export default async function CatchAllPage({ params }: PageProps) {
  const { page } = await params
  const slug = page?.join('/') || 'home'

  let story: any = null
  try {
    const storyblokApi = getStoryblokApi()
    const { data } = await storyblokApi.get(`cdn/stories/${slug}`, {
      version: 'draft',
    })
    story = data?.story
  } catch {
    // Story not found
  }

  if (!story) {
    if (slug === 'home') {
      return <SetupPage />
    }
    notFound()
  }

  return <StoryblokPageContent story={story} />
}

function SetupPage() {
  return (
    <main style={{ background: '#080808', color: '#F0EAE0', minHeight: '100vh', fontFamily: "'BentonSans', sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ maxWidth: 600, textAlign: 'center', padding: 48 }}>
        <div style={{ width: 36, height: 2, background: '#2952A3', margin: '0 auto 24px' }} />
        <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 24 }}>
          Storyblok Setup
        </h1>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: 'rgba(240,234,224,0.5)', marginBottom: 32 }}>
          This site is powered by Storyblok. To get started:
        </p>
        <ol style={{ textAlign: 'left', fontSize: 13, lineHeight: 2, color: 'rgba(240,234,224,0.6)', listStyle: 'decimal', paddingLeft: 20 }}>
          <li>Set your <code style={{ background: 'rgba(240,234,224,0.08)', padding: '2px 8px', fontSize: 12 }}>NEXT_PUBLIC_STORYBLOK_TOKEN</code> in <code style={{ background: 'rgba(240,234,224,0.08)', padding: '2px 8px', fontSize: 12 }}>.env.local</code></li>
          <li>In Storyblok Block Library, create blocks for each section (nav, hero, etc.)</li>
          <li>Create a &ldquo;home&rdquo; story using the &ldquo;page&rdquo; content type</li>
          <li>Add section blocks to the page body and publish</li>
        </ol>
        <p style={{ fontSize: 12, color: 'rgba(240,234,224,0.25)', marginTop: 40 }}>
          14 custom components are registered and ready to use.
        </p>
      </div>
    </main>
  )
}
