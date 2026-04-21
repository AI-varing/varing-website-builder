'use client'

import { useEffect, useState } from 'react'
import { StoryblokComponent, useStoryblokBridge } from '@storyblok/react'
import { initStoryblok } from '@/lib/storyblok'

initStoryblok()

// Bridge hook accesses `window` synchronously, so it only works after mount.
function BridgedStoryContent({ initialStory }: { initialStory: any }) {
  const [story, setStory] = useState(initialStory)
  useStoryblokBridge(story.id, (newStory) => setStory(newStory))
  if (!story?.content) return null
  return <StoryblokComponent blok={story.content} />
}

export default function StoryblokPageContent({ story }: { story: any }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!story?.content) return null
  if (!mounted) return <StoryblokComponent blok={story.content} />
  return <BridgedStoryContent initialStory={story} />
}
