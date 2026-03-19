'use client'

import { StoryblokComponent } from '@storyblok/react'
import { initStoryblok } from '@/lib/storyblok'

// Initialize Storyblok on client side (registers components)
initStoryblok()

export default function StoryblokPageContent({ story }: { story: any }) {
  return <StoryblokComponent blok={story.content} />
}
