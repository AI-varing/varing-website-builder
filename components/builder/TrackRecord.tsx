'use client'

import React, { useEffect, useState } from 'react'
import { storyblokEditable } from '@storyblok/react'
import { G, CR, B, GRAD_SECTION } from '@/lib/tokens'
import { useFadeUp } from '@/lib/animations'
import { Label } from '@/lib/ui'

const MARQUEE_SIZE = 8

function fmtPrice(price: number) {
  return `$${price.toLocaleString()}`
}

function SoldCard({ item }: { item: any }) {
  return (
    <div
      style={{
        minWidth: 340, width: 340,
        flexShrink: 0,
        background: '#111',
        border: `1px solid ${B}`,
        overflow: 'hidden',
        cursor: 'default',
      }}
      className="track-record-card"
    >
      {/* Property image */}
      {item.image && (
        <div style={{ position: 'relative', height: 180, overflow: 'hidden' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.image}
            alt={item.address}
            style={{
              width: '100%', height: '100%', objectFit: 'cover',
              filter: 'grayscale(40%) brightness(0.7)',
              transition: 'filter 0.4s ease',
            }}
          />
        </div>
      )}
      <div style={{ padding: 20, position: 'relative' }}>
        <h3 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 17, fontWeight: 500, color: CR,
          lineHeight: 1.3, marginBottom: 4,
        }}>
          {item.address}
        </h3>
        <p style={{
          fontSize: 10, letterSpacing: '0.28em', textTransform: 'uppercase',
          color: 'rgba(240,234,224,0.5)', marginBottom: 6,
        }}>
          {item.neighbourhood || item.city}{item.city && item.neighbourhood ? `, ${item.city}` : ''} &middot; {item.year}
        </p>
        {item.propertyType && (
          <p style={{
            fontSize: 11, color: G, fontWeight: 700,
            letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6,
          }}>
            {item.propertyType}
          </p>
        )}
        <p style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 20, fontWeight: 500, color: CR,
        }}>
          {item.price ? fmtPrice(item.price) : item.acres ? `${item.acres} Acres` : ''}
        </p>
      </div>
    </div>
  )
}

function MarqueeStrip({ items, direction, speed = 40 }: { items: any[]; direction: 'left' | 'right'; speed?: number }) {
  // Duplicate items for seamless loop
  const doubled = [...items, ...items]
  const duration = items.length * speed

  return (
    <div style={{ overflow: 'hidden', padding: '8px 0' }}>
      <div
        className={`marquee-track marquee-${direction}`}
        style={{
          display: 'flex',
          gap: 16,
          width: 'max-content',
          animationDuration: `${duration}s`,
        }}
      >
        {doubled.map((item, i) => (
          <SoldCard key={`${item._id || item.address}-${i}`} item={item} />
        ))}
      </div>
    </div>
  )
}

export default function TrackRecord({ blok }: { blok?: any }) {
  const sectionTitle = blok?.sectionTitle || 'Our Track Record'
  const totalVolume = blok?.totalVolume || '$4B+'

  const [listings, setListings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/sold')
      .then(r => r.json())
      .then(data => {
        if (data?.length) setListings(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const headerFade = useFadeUp()

  // Split into marquee strips of MARQUEE_SIZE
  const strips: any[][] = []
  for (let i = 0; i < listings.length; i += MARQUEE_SIZE) {
    strips.push(listings.slice(i, i + MARQUEE_SIZE))
  }

  return (
    <section
      {...(blok ? storyblokEditable(blok) : {})}
      style={{
        background: GRAD_SECTION(0.3),
        padding: '96px 0',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="https://www.varinggroup.com/wp-content/uploads/bg-meet-joe-soil.jpg" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.05, filter: 'grayscale(100%)', pointerEvents: 'none' }} />
      <div
        ref={headerFade.ref}
        style={{ ...headerFade.style, maxWidth: 1300, margin: '0 auto', padding: '0 56px', marginBottom: 48 }}
      >
        <Label>Track Record</Label>
        <h2 style={{
          fontFamily: "'BentonSans', sans-serif",
          fontSize: 'clamp(1.8rem,3.2vw,2.6rem)',
          fontWeight: 900, color: CR,
          textTransform: 'uppercase', letterSpacing: '0.06em',
          marginBottom: 12,
        }}>
          {sectionTitle}
        </h2>
        <p style={{
          fontSize: 'clamp(1rem,1.6vw,1.25rem)',
          fontFamily: "'Cormorant Garamond', serif",
          color: 'rgba(240,234,224,0.72)',
          letterSpacing: '0.04em',
        }}>
          {totalVolume} in Total Transaction Volume &middot; {listings.length} Properties Sold
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {strips.map((strip, idx) => (
          <MarqueeStrip
            key={idx}
            items={strip}
            direction={idx % 2 === 0 ? 'left' : 'right'}
            speed={12}
          />
        ))}
      </div>

      <style jsx global>{`
        @keyframes marquee-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .marquee-left {
          animation: marquee-left linear infinite;
        }
        .marquee-right {
          animation: marquee-right linear infinite;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
        .track-record-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(0,0,0,0.5);
          transition: transform 0.4s cubic-bezier(.22,1,.36,1), box-shadow 0.4s cubic-bezier(.22,1,.36,1);
        }
      `}</style>
    </section>
  )
}
