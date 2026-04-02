'use client'

import React, { useState, useRef } from 'react'
import { storyblokEditable } from '@storyblok/react'
import { G, GL, CR, BG, B, GB, GRAD_SECTION } from '@/lib/tokens'
import { useFadeUp } from '@/lib/animations'
import { Label } from '@/lib/ui'

export default function VideoShowcase({ blok }: { blok?: any }) {
  const videoSrc = blok?.videoUrl || '/corporate-video.mp4'
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
      {...(blok ? storyblokEditable(blok) : {})}
      style={{
        background: GRAD_SECTION(0.3),
        borderTop: `1px solid ${B}`,
        borderBottom: `1px solid ${B}`,
        padding: '96px 56px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background texture */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://www.varinggroup.com/wp-content/uploads/bg-meet-joe-recognition.jpg"
        alt=""
        style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          objectFit: 'cover', opacity: 0.04, filter: 'grayscale(100%)',
          pointerEvents: 'none',
        }}
      />

      <div ref={fade.ref} style={{ ...fade.style, maxWidth: 1000, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <Label>Corporate Profile</Label>
          <h2 style={{
            fontFamily: "'BentonSans', sans-serif",
            fontSize: 'clamp(1.8rem, 3vw, 2.6rem)',
            fontWeight: 900, color: CR,
            textTransform: 'uppercase', letterSpacing: '0.06em',
            marginBottom: 12,
          }}>
            {heading}
          </h2>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 16, fontStyle: 'italic',
            color: 'rgba(240,234,224,0.4)',
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
          boxShadow: `0 0 60px rgba(0,0,0,0.5), 0 0 30px ${GB(0.05)}`,
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
                color: 'rgba(240,234,224,0.5)',
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
            { label: 'Duration', value: '1:15' },
            { label: 'Featuring', value: 'Joe Varing' },
            { label: 'Year', value: '2026' },
          ].map(item => (
            <div key={item.label} style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(240,234,224,0.3)', marginBottom: 4 }}>{item.label}</p>
              <p style={{ fontSize: 13, fontWeight: 700, color: 'rgba(240,234,224,0.5)', letterSpacing: '0.06em' }}>{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
