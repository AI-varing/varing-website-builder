'use client'

import React from 'react'
import { useParallax } from '@/lib/animations'
import { storyblokEditable } from '@storyblok/react'
import { GRAD_SECTION } from '@/lib/tokens'

const DEFAULT_IMAGES = [
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1800&q=80&auto=format',
  'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1800&q=80&auto=format',
  'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1800&q=80&auto=format',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1800&q=80&auto=format',
]

const OVERLAYS: Record<string, string> = {
  navy: 'linear-gradient(180deg, rgba(42,21,8,0.25) 0%, rgba(8,8,8,0.5) 100%)',
  dark: 'linear-gradient(180deg, rgba(8,8,8,0.3) 0%, rgba(8,8,8,0.6) 100%)',
  none: 'none',
}

export default function PhotoDivider({ blok }: { blok?: any }) {
  const src = blok?.src || DEFAULT_IMAGES[0]
  const height = blok?.height || '50vh'
  const overlay = blok?.overlay || 'navy'
  const parallaxRef = useParallax(0.15)

  return (
    <div
      className="photo-divider"
      {...(blok ? storyblokEditable(blok) : {})}
      style={{
        position: 'relative',
        overflow: 'hidden',
        height,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={parallaxRef as React.Ref<HTMLImageElement>}
        src={src}
        alt=""
        style={{
          position: 'absolute',
          width: '100%',
          height: '130%',
          top: '-15%',
          objectFit: 'cover',
        }}
      />
      {overlay !== 'none' && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: OVERLAYS[overlay] || OVERLAYS.navy,
            pointerEvents: 'none',
          }}
        />
      )}
    </div>
  )
}
