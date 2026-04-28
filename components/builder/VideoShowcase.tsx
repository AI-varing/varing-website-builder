'use client'

import React, { useState, useRef } from 'react'
import { storyblokEditable } from '@storyblok/react'
import { G, GL, CR, BG, B, GB, GRAD_SECTION } from '@/lib/tokens'
import { useFadeUp } from '@/lib/animations'
import { Label } from '@/lib/ui'
import FluidGradient from './FluidGradient'
import { track } from '@/lib/analytics'

export default function VideoShowcase({ blok }: { blok?: any }) {
  const videoSrc = blok?.videoUrl?.filename || blok?.videoUrl || '/corporate-video.mp4'
  const heading = blok?.heading || 'See Us in Action'
  const subheading = blok?.subheading || 'A look at who we are, what we do, and how we deliver results.'
  const [playing, setPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const fade = useFadeUp(0)

  const handlePlay = () => {
    setPlaying(true)
    setTimeout(() => {
      videoRef.current?.play()
    }, 100)
  }

  const handleVideoEnd = () => {
    setPlaying(false)
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
  }

  return (
    <section
      id="video-showcase"
      {...(blok ? storyblokEditable(blok) : {})}
      style={{
        background: '#F5E6D3',
        borderTop: 'none',
        borderBottom: 'none',
        padding: '96px 56px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <FluidGradient />

      <div ref={fade.ref} style={{ ...fade.style, maxWidth: 1000, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16, justifyContent: 'center' }}>
            <div style={{ width: 36, height: 1, background: '#8B4513', flexShrink: 0 }} />
            <span style={{ fontSize: 10, letterSpacing: '0.38em', textTransform: 'uppercase', color: '#8B4513', fontWeight: 600 }}>Corporate Profile</span>
          </div>
          <h2 style={{
            fontFamily: "'BentonSans', sans-serif",
            fontSize: 'clamp(1.8rem, 3vw, 2.6rem)',
            fontWeight: 900, color: '#2A1508',
            textTransform: 'uppercase', letterSpacing: '0.06em',
            marginBottom: 12,
          }}>
            {heading}
          </h2>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 16,
            color: 'rgba(42,21,8,0.55)',
            maxWidth: 500, margin: '0 auto',
          }}>
            {subheading}
          </p>
        </div>

        {/* Video container — bobknakal style */}
        <div style={{
          position: 'relative',
          aspectRatio: '16/9',
          background: '#0a0a0a',
          border: `1px solid ${B}`,
          overflow: 'hidden',
          cursor: playing ? 'default' : 'pointer',
          boxShadow: '0 8px 40px rgba(42,21,8,0.2), 0 2px 12px rgba(0,0,0,0.1)',
          borderRadius: 4,
        }}
          onClick={!playing ? handlePlay : undefined}
        >
          {/* Video element */}
          <video
            ref={videoRef}
            src={videoSrc}
            controls={playing}
            onEnded={handleVideoEnd}
            playsInline
            preload="metadata"
            style={{
              width: '100%', height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />

          {/* Play overlay — shows when not playing */}
          {!playing && (
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              background: 'linear-gradient(180deg, rgba(8,8,8,0.3) 0%, rgba(8,8,8,0.6) 50%, rgba(8,8,8,0.8) 100%)',
              transition: 'all 0.3s ease',
            }}>
              {/* Play button */}
              <div style={{
                width: 80, height: 80,
                borderRadius: '50%',
                background: 'rgba(198,122,60,0.15)',
                border: `2px solid ${GB(0.4)}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backdropFilter: 'blur(8px)',
                marginBottom: 20,
                transition: 'all 0.3s ease',
                boxShadow: `0 0 30px ${GB(0.15)}`,
              }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill={G} stroke="none">
                  <polygon points="8,5 20,12 8,19" />
                </svg>
              </div>
              <p style={{
                fontFamily: "'BentonSans', sans-serif",
                fontSize: 11, fontWeight: 700,
                letterSpacing: '0.24em', textTransform: 'uppercase',
                color: 'rgba(240,234,224,0.72)',
              }}>
                Watch Corporate Profile
              </p>
            </div>
          )}
        </div>

        {/* Bottom info strip */}
        <div style={{
          display: 'flex', justifyContent: 'center', gap: 40,
          marginTop: 28, flexWrap: 'wrap',
        }}>
          {[
            { label: 'Duration', value: '1:31' },
            { label: 'Featuring', value: 'Joe' },
            { label: 'Year', value: '2026' },
          ].map(item => (
            <div key={item.label} style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(42,21,8,0.4)', marginBottom: 4 }}>{item.label}</p>
              <p style={{ fontSize: 13, fontWeight: 700, color: 'rgba(42,21,8,0.7)', letterSpacing: '0.06em' }}>{item.value}</p>
            </div>
          ))}
        </div>

        {/* CTA Button — opens user's email client with a pre-populated request */}
        <div style={{ textAlign: 'center', marginTop: 36 }}>
          <a
            href={`mailto:info@targetedadvisors.ca?subject=${encodeURIComponent('Request: Targeted Advisors Corporate Profile PDF')}&body=${encodeURIComponent("Hi,\n\nI'd like to receive the full Targeted Advisors corporate profile PDF — distressed real estate track record, court-ordered mandates, and capabilities.\n\nA bit about me:\n- Name: \n- Firm / Company: \n- Role (Lender / Lawyer / Receiver / etc.): \n\nThank you.")}`}
            onClick={() => track('corp_profile_request_open', { source: 'video_showcase' })}
            style={{
              display: 'inline-block',
              padding: '14px 36px',
              background: G,
              color: '#080808',
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              fontFamily: "'BentonSans', sans-serif",
              transition: 'background 0.3s',
              cursor: 'pointer',
              border: 'none',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = GL)}
            onMouseLeave={e => (e.currentTarget.style.background = G)}
          >
            Get Our Full Corporate Profile (PDF)
          </a>
        </div>
      </div>
    </section>
  )
}
