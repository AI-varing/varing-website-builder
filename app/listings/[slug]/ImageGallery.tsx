'use client'

import { useState } from 'react'
import Image from 'next/image'

const G  = '#C67A3C'
const CR = '#F0EAE0'
const BG = '#080808'

interface ImageGalleryProps {
  images: string[]
  address: string
}

export default function ImageGallery({ images, address }: ImageGalleryProps) {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null)

  const openLightbox = (idx: number) => setLightboxIdx(idx)
  const closeLightbox = () => setLightboxIdx(null)
  const goPrev = () => setLightboxIdx(prev => prev !== null ? (prev - 1 + images.length) % images.length : null)
  const goNext = () => setLightboxIdx(prev => prev !== null ? (prev + 1) % images.length : null)

  return (
    <>
      {/* Main gallery grid */}
      <div style={{ padding: '0 56px 80px' }}>
        <div style={{ maxWidth: 1300, margin: '0 auto' }}>
          {/* First row: large + medium */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 4, marginBottom: 4 }}>
            <div
              onClick={() => openLightbox(0)}
              style={{ position: 'relative', height: 540, overflow: 'hidden', cursor: 'pointer' }}
            >
              <Image
                src={images[0]}
                alt={`${address} - Photo 1`}
                fill
                style={{ objectFit: 'cover', transition: 'transform 0.6s ease' }}
                sizes="(max-width: 768px) 100vw, 66vw"
                onMouseEnter={(e) => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.03)' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)' }}
              />
              <div style={{
                position: 'absolute', bottom: 16, right: 16,
                background: 'rgba(8,8,8,0.6)', backdropFilter: 'blur(8px)',
                padding: '8px 14px', fontSize: 10, letterSpacing: '0.15em',
                textTransform: 'uppercase', color: 'rgba(240,234,224,0.6)',
              }}>
                Click to enlarge
              </div>
            </div>
            {images[1] && (
              <div
                onClick={() => openLightbox(1)}
                style={{ position: 'relative', height: 540, overflow: 'hidden', cursor: 'pointer' }}
              >
                <Image
                  src={images[1]}
                  alt={`${address} - Photo 2`}
                  fill
                  style={{ objectFit: 'cover', transition: 'transform 0.6s ease' }}
                  sizes="(max-width: 768px) 100vw, 33vw"
                  onMouseEnter={(e) => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.03)' }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)' }}
                />
              </div>
            )}
          </div>

          {/* Remaining images: 3 per row */}
          {images.length > 2 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4 }}>
              {images.slice(2).map((img, i) => (
                <div
                  key={i}
                  onClick={() => openLightbox(i + 2)}
                  style={{ position: 'relative', height: 320, overflow: 'hidden', cursor: 'pointer' }}
                >
                  <Image
                    src={img}
                    alt={`${address} - Photo ${i + 3}`}
                    fill
                    style={{ objectFit: 'cover', transition: 'transform 0.6s ease' }}
                    sizes="(max-width: 768px) 100vw, 33vw"
                    onMouseEnter={(e) => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.03)' }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)' }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Lightbox overlay */}
      {lightboxIdx !== null && (
        <div
          onClick={closeLightbox}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(20px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'zoom-out',
          }}
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            style={{
              position: 'absolute', top: 24, right: 32,
              background: 'none', border: 'none', cursor: 'pointer',
              color: CR, fontSize: 28, fontWeight: 300,
              width: 48, height: 48,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={CR} strokeWidth="1.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {/* Previous */}
          {images.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); goPrev() }}
              style={{
                position: 'absolute', left: 24, top: '50%', transform: 'translateY(-50%)',
                background: 'rgba(240,234,224,0.08)', border: `1px solid rgba(240,234,224,0.15)`,
                color: CR, width: 52, height: 52, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.3s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(240,234,224,0.15)' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(240,234,224,0.08)' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={CR} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
          )}

          {/* Image */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              width: '80vw', height: '80vh',
              maxWidth: 1200,
              cursor: 'default',
            }}
          >
            <Image
              src={images[lightboxIdx]}
              alt={`${address} - Photo ${lightboxIdx + 1}`}
              fill
              style={{ objectFit: 'contain' }}
              sizes="80vw"
              priority
            />
          </div>

          {/* Next */}
          {images.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); goNext() }}
              style={{
                position: 'absolute', right: 24, top: '50%', transform: 'translateY(-50%)',
                background: 'rgba(240,234,224,0.08)', border: `1px solid rgba(240,234,224,0.15)`,
                color: CR, width: 52, height: 52, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.3s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(240,234,224,0.15)' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(240,234,224,0.08)' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={CR} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          )}

          {/* Counter */}
          <div style={{
            position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)',
            fontSize: 12, letterSpacing: '0.2em', color: 'rgba(240,234,224,0.4)',
            textTransform: 'uppercase',
          }}>
            {lightboxIdx + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  )
}
