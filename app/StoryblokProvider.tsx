'use client'

import { ReactNode } from 'react'
import { initStoryblok } from '@/lib/storyblok'

// Initialize Storyblok once on client side (registers components + bridge)
initStoryblok()

export default function StoryblokProvider({ children }: { children: ReactNode }) {
  return <>{children}</>
}
