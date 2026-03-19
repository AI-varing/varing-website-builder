'use client'

import React, { useState, useRef } from 'react'

const G = '#2952A3'
const GL = '#4A7FD4'
const CR = '#F0EAE0'
const BG = '#080808'
const B = 'rgba(240,234,224,0.08)'

export default function ExtractPage() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleExtract = async () => {
    if (!file) return
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const formData = new FormData()
      formData.append('pdf', file)
      formData.append('autoCreate', 'true')

      const res = await fetch('/api/extract-listing', { method: 'POST', body: formData })
      const data = await res.json()

      if (data.error) {
        setError(data.error)
      } else {
        setResult(data)
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main style={{ background: BG, color: CR, minHeight: '100vh', fontFamily: "'BentonSans', sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ maxWidth: 640, width: '100%', padding: 48 }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 40 }}>
          <div style={{ width: 36, height: 2, background: G }} />
          <span style={{ fontSize: 10, letterSpacing: '0.38em', textTransform: 'uppercase', color: 'rgba(240,234,224,0.35)', fontWeight: 500 }}>Admin Tool</span>
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 12 }}>
          PDF Brochure Extractor
        </h1>
        <p style={{ fontSize: 13, lineHeight: 1.8, color: 'rgba(240,234,224,0.45)', marginBottom: 40 }}>
          Upload a property brochure PDF. GPT-4o will extract the listing details and automatically create it in Storyblok.
        </p>

        {/* Upload area */}
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); e.stopPropagation() }}
          onDrop={(e) => {
            e.preventDefault()
            const f = e.dataTransfer.files[0]
            if (f?.type === 'application/pdf') setFile(f)
          }}
          style={{
            border: `2px dashed ${file ? G : 'rgba(240,234,224,0.15)'}`,
            padding: '48px 32px',
            textAlign: 'center',
            cursor: 'pointer',
            marginBottom: 24,
            transition: 'border-color 0.2s',
            background: file ? 'rgba(41,82,163,0.06)' : 'transparent',
          }}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            style={{ display: 'none' }}
          />
          {file ? (
            <>
              <p style={{ fontSize: 14, color: CR, marginBottom: 8 }}>{file.name}</p>
              <p style={{ fontSize: 11, color: 'rgba(240,234,224,0.3)' }}>{(file.size / 1024 / 1024).toFixed(2)} MB — Click to change</p>
            </>
          ) : (
            <>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(240,234,224,0.25)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 16 }}>
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <p style={{ fontSize: 12, color: 'rgba(240,234,224,0.3)', letterSpacing: '0.08em' }}>
                Drop PDF here or click to browse
              </p>
            </>
          )}
        </div>

        {/* Extract button */}
        <button
          onClick={handleExtract}
          disabled={!file || loading}
          style={{
            width: '100%',
            background: !file || loading ? 'rgba(41,82,163,0.3)' : G,
            color: !file || loading ? 'rgba(8,8,8,0.5)' : BG,
            padding: '16px',
            fontSize: 11,
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            fontWeight: 700,
            border: 'none',
            cursor: !file || loading ? 'not-allowed' : 'pointer',
            fontFamily: "'BentonSans', sans-serif",
            transition: 'background 0.2s',
            marginBottom: 32,
          }}
        >
          {loading ? 'Extracting & Creating Listing...' : 'Extract & Create Listing'}
        </button>

        {/* Error */}
        {error && (
          <div style={{ border: '1px solid rgba(220,50,50,0.3)', background: 'rgba(220,50,50,0.08)', padding: '16px 20px', marginBottom: 24 }}>
            <p style={{ fontSize: 12, color: '#e55' }}>{error}</p>
          </div>
        )}

        {/* Result */}
        {result && (
          <div style={{ border: `1px solid ${B}`, background: '#0e0e0e' }}>
            {/* Success banner */}
            {result.storyblok?.created && (
              <div style={{ background: 'rgba(41,82,163,0.12)', borderBottom: `1px solid ${B}`, padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ color: '#4ade80', fontSize: 18 }}>&#10003;</span>
                <div>
                  <p style={{ fontSize: 12, fontWeight: 700, color: CR, letterSpacing: '0.08em' }}>Listing Created in Storyblok</p>
                  <p style={{ fontSize: 11, color: 'rgba(240,234,224,0.4)', marginTop: 4 }}>
                    Go to Content &rarr; Listings in your Storyblok dashboard to view it.
                  </p>
                </div>
              </div>
            )}
            {/* Error banner */}
            {result.storyblok?.error && (
              <div style={{ background: 'rgba(220,50,50,0.08)', borderBottom: `1px solid ${B}`, padding: '16px 24px' }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: '#e55', letterSpacing: '0.08em', marginBottom: 4 }}>Storyblok Error</p>
                <p style={{ fontSize: 11, color: 'rgba(240,234,224,0.4)' }}>{result.storyblok.error}</p>
              </div>
            )}

            {/* Extracted data */}
            <div style={{ padding: '24px' }}>
              <p style={{ fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: G, marginBottom: 16, fontWeight: 700 }}>Extracted Data</p>
              {Object.entries(result.data || {}).map(([key, value]) => (
                <div key={key} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: `1px solid ${B}` }}>
                  <span style={{ fontSize: 11, color: 'rgba(240,234,224,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{key}</span>
                  <span style={{ fontSize: 12, color: CR, maxWidth: '60%', textAlign: 'right' }}>
                    {typeof value === 'number' ? (key === 'price' ? `$${value.toLocaleString()}` : value.toLocaleString()) : String(value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Next steps */}
        {result?.storyblok?.created && (
          <div style={{ border: `1px solid ${B}`, background: '#0e0e0e', marginTop: 16, padding: 24 }}>
            <p style={{ fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: G, marginBottom: 16, fontWeight: 700 }}>Next Steps</p>
            <div style={{ fontSize: 12, lineHeight: 2, color: 'rgba(240,234,224,0.5)' }}>
              <p>1. Go to <strong style={{ color: CR }}>Content &rarr; Listings</strong> in Storyblok</p>
              <p>2. Open the new listing and add <strong style={{ color: CR }}>property images</strong> by dragging photos into the Images field</p>
              {result.brochureUrl && <p>3. Brochure PDF has been uploaded and attached automatically</p>}
            </div>
          </div>
        )}

        {/* Back link */}
        <div style={{ marginTop: 40, textAlign: 'center' }}>
          <a href="/" style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(240,234,224,0.2)', textDecoration: 'none' }}>
            &larr; Back to Site
          </a>
        </div>
      </div>
    </main>
  )
}
