'use client'

import { useEffect, useState } from 'react'
import { StoryblokComponent, useStoryblokBridge } from '@storyblok/react'
import { initStoryblok } from '@/lib/storyblok'

initStoryblok()

export default function StoryblokPageContent({ story: initialStory }: { story: any }) {
  const [story, setStory] = useState(initialStory)

  // Enable live editing bridge — when content changes in Storyblok's
  // visual editor, this callback fires and re-renders instantly
  useStoryblokBridge(story.id, (newStory) => {
    setStory(newStory)
  })

  if (!story?.content) return null

  return <StoryblokComponent blok={story.content} />
}
