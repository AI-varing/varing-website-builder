import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ListingNav from './ListingNav'
import InquiryForm from './InquiryForm'
import ImageGallery from './ImageGallery'
import ListingActions from './DueDiligenceButton'
import { DEMO_LISTINGS } from '@/lib/demo-listings'

async function getListing(slug: string) {
  const token = process.env.NEXT_PUBLIC_STORYBLOK_TOKEN
  // Sync writes Sold mandates under `sold/<slug>` and Active under `listings/<slug>`,
  // but every listing card on the site links to `/listings/<slug>`. Try both
  // folders so Sold detail pages don't 404.
  for (const folder of ['listings', 'sold']) {
    try {
      const res = await fetch(
        `https://api.storyblok.com/v2/cdn/stories/${folder}/${slug}?token=${token}&version=draft`,
        { next: { revalidate: 60 } }
      )
      if (!res.ok) continue
      const data = await res.json()
      const c = data.story?.content
      if (c) return {
        address: c.address || '',
        city: c.city || '',
        province: c.province || 'BC',
        price: Number(c.price) || null,
        propertyType: c.propertyType || '',
        lotSize: c.lotSize || null,
        buildingArea: Number(c.buildingArea) || null,
        mlsNumber: c.mlsNumber || '',
        description: c.description || '',
        status: c.status || (folder === 'sold' ? 'Sold' : 'Active'),
        ctaLabel: c.ctaLabel || 'Send Inquiry',
        featured: c.featured || false,
        images: (c.images || []).map((img: any) => img.filename).filter(Boolean),
        brochureUrl: c.brochureUrl || c.brochure?.filename || null,
      }
    } catch {}
  }

  const demo = DEMO_LISTINGS.find(l => l.slug === slug)
  if (!demo) return null
  return {
    address: demo.address,
    city: demo.city,
    province: 'BC',
    price: demo.price,
    propertyType: demo.propertyType,
    lotSize: demo.lotSize,
    buildingArea: demo.buildingArea,
    mlsNumber: demo.mlsNumber,
    description: demo.description,
    status: demo.status,
    ctaLabel: 'Send Inquiry',
    featured: demo.featured,
    images: demo.images,
    brochureUrl: null,
  }
}

async function getSettings() {
  const token = process.env.NEXT_PUBLIC_STORYBLOK_TOKEN
  try {
    const res = await fetch(
      `https://api.storyblok.com/v2/cdn/stories/home?token=${token}&version=draft`,
      { next: { revalidate: 60 } }
    )
    if (!res.ok) return {}
    const data = await res.json()
    const nav = data.story?.content?.body?.find((b: any) => b.component === 'nav')
    return {
      companyName: nav?.companyName || 'Targeted Advisors',
      phone: nav?.phone || '+1.604.832.5766',
      email: 'info@targetedadvisors.ca',
      logoUrl: nav?.logoUrl || '',
    }
  } catch {
    return {}
  }
}

/* ── Color tokens ── */
const G  = '#C67A3C'
const GL = '#D4943E'
const CR = '#F0EAE0'
const BG = '#080808'
const B  = 'rgba(240,234,224,0.08)'

/* ── Status badge color mapping ── */
function statusColor(status: string) {
  switch (status) {
    case 'Active': return { bg: G, text: BG }
    case 'Reduced': return { bg: 'rgba(220,80,60,0.9)', text: '#fff' }
    case 'Firm': return { bg: 'rgba(60,140,80,0.9)', text: '#fff' }
    case 'Sold': return { bg: 'rgba(100,100,100,0.85)', text: '#fff' }
    default: return { bg: 'rgba(240,234,224,0.12)', text: CR }
  }
}

export default async function ListingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [listing, settings] = await Promise.all([getListing(slug), getSettings()])
  if (!listing) notFound()

  const companyName = settings?.companyName || 'Targeted Advisors'
  const phone = settings?.phone || '+1.604.832.5766'
  const email = settings?.email || 'info@targetedadvisors.ca'
  const logoUrl = (settings as any)?.logoUrl || ''
  const fullAddress = `${listing.address}${listing.city ? ', ' + listing.city : ''}, BC`
  const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(fullAddress)}&z=15&output=embed`

  const sc = statusColor(listing.status)

  /* Detail grid items */
  const detailCards = [
    listing.propertyType && { label: 'Property Type', value: listing.propertyType, icon: 'type' },
    listing.lotSize && { label: 'Lot Size', value: `${listing.lotSize} Acres`, icon: 'lot' },
    listing.buildingArea && { label: 'Building Area', value: `${listing.buildingArea.toLocaleString()} SF`, icon: 'area' },
    { label: 'Status', value: listing.status || 'Active', icon: 'status' },
    listing.mlsNumber && { label: 'MLS Number', value: listing.mlsNumber, icon: 'mls' },
    listing.city && { label: 'Location', value: `${listing.city}, BC`, icon: 'location' },
  ].filter(Boolean) as { label: string; value: string; icon: string }[]

  return (
    <main style={{ background: BG, color: CR, minHeight: '100vh', fontFamily: "'BentonSans', sans-serif" }}>
      <ListingNav companyName={companyName} logoUrl={logoUrl} phone={phone} />

      {/* ════════════════════════════════════════════
          BACK TO LISTINGS
          ════════════════════════════════════════════ */}
      <div style={{
        position: 'fixed', top: 84, left: 56, zIndex: 150,
      }}>
        <Link href="/#listings" style={{
          display: 'inline-flex', alignItems: 'center', gap: 10,
          fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase',
          color: 'rgba(240,234,224,0.5)', textDecoration: 'none',
          fontFamily: "'BentonSans', sans-serif", fontWeight: 600,
          background: 'rgba(8,8,8,0.7)', backdropFilter: 'blur(12px)',
          padding: '10px 20px 10px 16px',
          border: '1px solid rgba(240,234,224,0.08)',
          transition: 'color 0.3s ease, border-color 0.3s ease',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5" /><path d="M12 19l-7-7 7-7" />
          </svg>
          All Listings
        </Link>
      </div>

      {/* ════════════════════════════════════════════
          HERO SECTION — Full viewport height
          ════════════════════════════════════════════ */}
      <section style={{ position: 'relative', height: '100vh', minHeight: 640, overflow: 'hidden' }}>
        {listing.images?.[0] ? (
          <Image
            src={listing.images[0]}
            alt={listing.address}
            fill
            priority
            style={{ objectFit: 'cover', objectPosition: 'center' }}
            sizes="100vw"
          />
        ) : (
          <div style={{
            position: 'absolute', inset: 0, background: '#111',
            backgroundImage: `radial-gradient(circle, ${G}18 1px, transparent 1px)`,
            backgroundSize: '48px 48px',
          }} />
        )}

        {/* Overlays */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(8,8,8,0.55) 0%, rgba(8,8,8,0.15) 35%, rgba(8,8,8,0.2) 55%, rgba(8,8,8,0.92) 85%, rgba(8,8,8,1) 100%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(8,8,8,0.5) 0%, transparent 50%)', pointerEvents: 'none' }} />

        {/* Status badge — top right */}
        <div style={{ position: 'absolute', top: 96, right: 56, zIndex: 10 }}>
          {listing.featured && (
            <span style={{
              fontSize: 10, letterSpacing: '0.28em', textTransform: 'uppercase', fontWeight: 700,
              border: `1px solid rgba(198,122,60,0.5)`, color: G,
              padding: '8px 20px', marginRight: 12,
              backdropFilter: 'blur(8px)', background: 'rgba(8,8,8,0.4)',
              display: 'inline-block',
            }}>
              Featured
            </span>
          )}
          <span style={{
            fontSize: 10, letterSpacing: '0.28em', textTransform: 'uppercase', fontWeight: 700,
            background: sc.bg, color: sc.text,
            padding: '8px 20px', display: 'inline-block',
          }}>
            {listing.status}
          </span>
        </div>

        {/* Hero text content */}
        <div style={{
          position: 'absolute', bottom: 100, left: 0, right: 0,
          padding: '0 56px', maxWidth: 1400, margin: '0 auto',
        }}>
          {/* Eyebrow */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
            <div style={{ width: 40, height: 2, background: G }} />
            <span style={{
              fontSize: 12, letterSpacing: '0.4em', textTransform: 'uppercase',
              color: G, fontWeight: 700,
            }}>
              {[listing.propertyType, listing.city && `${listing.city}, BC`].filter(Boolean).join('  //  ')}
            </span>
          </div>

          {/* Address heading */}
          <h1 style={{
            fontFamily: "'BentonSans', sans-serif",
            fontSize: 'clamp(2.8rem, 6vw, 5.6rem)',
            fontWeight: 900,
            lineHeight: 1.0,
            color: CR,
            textTransform: 'uppercase',
            letterSpacing: '-0.01em',
            maxWidth: 1000,
            marginBottom: 32,
          }}>
            {listing.address}
          </h1>

          {/* Price + key stats row */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 48, flexWrap: 'wrap' }}>
            {listing.price && (
              <div>
                <p style={{ fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(240,234,224,0.4)', marginBottom: 8, fontWeight: 600 }}>
                  Asking Price
                </p>
                <p style={{
                  fontFamily: "'BentonSans', sans-serif",
                  fontSize: 'clamp(2rem, 4vw, 3.4rem)',
                  fontWeight: 900, color: CR, lineHeight: 1,
                }}>
                  ${listing.price.toLocaleString()}
                </p>
              </div>
            )}
            {listing.lotSize && (
              <div>
                <p style={{ fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(240,234,224,0.4)', marginBottom: 8, fontWeight: 600 }}>
                  Lot Size
                </p>
                <p style={{
                  fontFamily: "'BentonSans', sans-serif",
                  fontSize: 'clamp(1.6rem, 3vw, 2.4rem)',
                  fontWeight: 700, color: CR, lineHeight: 1,
                }}>
                  {listing.lotSize} <span style={{ fontSize: '0.55em', color: 'rgba(240,234,224,0.5)' }}>Acres</span>
                </p>
              </div>
            )}
            {listing.buildingArea && (
              <div>
                <p style={{ fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(240,234,224,0.4)', marginBottom: 8, fontWeight: 600 }}>
                  Building Area
                </p>
                <p style={{
                  fontFamily: "'BentonSans', sans-serif",
                  fontSize: 'clamp(1.6rem, 3vw, 2.4rem)',
                  fontWeight: 700, color: CR, lineHeight: 1,
                }}>
                  {listing.buildingArea.toLocaleString()} <span style={{ fontSize: '0.55em', color: 'rgba(240,234,224,0.5)' }}>SF</span>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
          opacity: 0.3,
        }}>
          <span style={{ fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: CR }}>Scroll</span>
          <div style={{ width: 1, height: 28, background: `linear-gradient(to bottom, ${CR}, transparent)` }} />
        </div>
      </section>

      {/* ════════════════════════════════════════════
          PROPERTY DETAILS GRID
          ════════════════════════════════════════════ */}
      <section style={{
        padding: '80px 56px',
        background: BG,
        borderTop: `1px solid ${B}`,
      }}>
        <div style={{ maxWidth: 1300, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 48 }}>
            <div style={{ width: 40, height: 2, background: G }} />
            <span style={{
              fontSize: 12, letterSpacing: '0.38em', textTransform: 'uppercase',
              color: 'rgba(240,234,224,0.4)', fontWeight: 600,
            }}>
              Property Details
            </span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: 2,
          }}>
            {detailCards.map((card, i) => (
              <div key={i} style={{
                background: '#0e0e0e',
                border: '1px solid rgba(240,234,224,0.06)',
                padding: '32px 28px',
                transition: 'border-color 0.3s ease',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                  {card.icon === 'type' && (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={G} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                  )}
                  {card.icon === 'lot' && (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={G} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
                  )}
                  {card.icon === 'area' && (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={G} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="1.5"/><path d="M3 9h18M9 9v12"/></svg>
                  )}
                  {card.icon === 'status' && (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={G} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                  )}
                  {card.icon === 'mls' && (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={G} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                  )}
                  {card.icon === 'location' && (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={G} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  )}
                  <span style={{
                    fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase',
                    color: 'rgba(240,234,224,0.35)', fontWeight: 600,
                  }}>
                    {card.label}
                  </span>
                </div>
                <p style={{
                  fontFamily: "'BentonSans', sans-serif",
                  fontSize: 20, fontWeight: 700, color: CR,
                  lineHeight: 1.3, textTransform: 'uppercase',
                  letterSpacing: '0.02em',
                }}>
                  {card.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          DESCRIPTION + INQUIRY FORM — Two columns
          ════════════════════════════════════════════ */}
      <section id="overview" style={{
        padding: '88px 56px 100px',
        background: BG,
        borderTop: `1px solid ${B}`,
      }}>
        <div style={{
          maxWidth: 1300, margin: '0 auto',
          display: 'grid', gridTemplateColumns: '1fr 420px', gap: 80,
          alignItems: 'start',
        }}>
          {/* Left — Description */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
              <div style={{ width: 40, height: 2, background: G }} />
              <span style={{
                fontSize: 12, letterSpacing: '0.38em', textTransform: 'uppercase',
                color: 'rgba(240,234,224,0.4)', fontWeight: 600,
              }}>
                Overview
              </span>
            </div>

            <h2 style={{
              fontFamily: "'BentonSans', sans-serif",
              fontSize: 'clamp(2rem, 3.5vw, 3rem)',
              fontWeight: 900, color: CR, lineHeight: 1.1,
              textTransform: 'uppercase', letterSpacing: '0.01em',
              marginBottom: 12,
            }}>
              {listing.address}
            </h2>

            {listing.city && (
              <p style={{
                fontSize: 18, fontWeight: 400, color: 'rgba(240,234,224,0.4)',
                marginBottom: 48, letterSpacing: '0.04em',
              }}>
                {listing.city}, British Columbia
              </p>
            )}

            {/* Price callout */}
            {listing.price && (
              <div style={{
                marginBottom: 48, paddingBottom: 40,
                borderBottom: `1px solid ${B}`,
              }}>
                <p style={{
                  fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase',
                  color: G, marginBottom: 14, fontWeight: 700,
                }}>
                  Asking Price
                </p>
                <p style={{
                  fontFamily: "'BentonSans', sans-serif",
                  fontSize: 'clamp(2.4rem, 4.5vw, 3.6rem)',
                  fontWeight: 900, color: CR, lineHeight: 1,
                }}>
                  ${listing.price.toLocaleString()}
                </p>
              </div>
            )}

            {/* Action Buttons — Schedule Call, Book Showing, Make Offer, Due Diligence */}
            <ListingActions address={listing.address} />

            {/* Area / lot stats */}
            {(listing.buildingArea || listing.lotSize) && (
              <div style={{
                display: 'flex', gap: 0, marginBottom: 56,
                border: `1px solid rgba(240,234,224,0.08)`,
              }}>
                {listing.buildingArea && (
                  <div style={{
                    flex: 1, padding: '28px 32px',
                    borderRight: listing.lotSize ? `1px solid rgba(240,234,224,0.08)` : 'none',
                  }}>
                    <p style={{
                      fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase',
                      color: 'rgba(240,234,224,0.35)', marginBottom: 14, fontWeight: 600,
                    }}>
                      Building Area
                    </p>
                    <p style={{
                      fontFamily: "'BentonSans', sans-serif",
                      fontSize: 28, fontWeight: 900, color: CR,
                    }}>
                      {listing.buildingArea.toLocaleString()}
                      <span style={{ fontSize: 14, color: 'rgba(240,234,224,0.4)', marginLeft: 8 }}>SF</span>
                    </p>
                  </div>
                )}
                {listing.lotSize && (
                  <div style={{ flex: 1, padding: '28px 32px' }}>
                    <p style={{
                      fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase',
                      color: 'rgba(240,234,224,0.35)', marginBottom: 14, fontWeight: 600,
                    }}>
                      Lot Size
                    </p>
                    <p style={{
                      fontFamily: "'BentonSans', sans-serif",
                      fontSize: 28, fontWeight: 900, color: CR,
                    }}>
                      {listing.lotSize}
                      <span style={{ fontSize: 14, color: 'rgba(240,234,224,0.4)', marginLeft: 8 }}>Acres</span>
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Description text */}
            {listing.description && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
                  <div style={{ width: 40, height: 2, background: G }} />
                  <span style={{
                    fontSize: 12, letterSpacing: '0.38em', textTransform: 'uppercase',
                    color: 'rgba(240,234,224,0.4)', fontWeight: 600,
                  }}>
                    Description
                  </span>
                </div>
                <p style={{
                  fontSize: 18, fontWeight: 300, lineHeight: 2.0,
                  color: 'rgba(240,234,224,0.75)',
                  whiteSpace: 'pre-line',
                  maxWidth: 720,
                }}>
                  {listing.description}
                </p>
              </div>
            )}
          </div>

          {/* Right — Inquiry form (sticky). Brochure hidden on Sold listings. */}
          <div style={{ position: 'sticky', top: 96 }}>
            <InquiryForm
              address={listing.address}
              price={listing.price}
              ctaLabel={listing.ctaLabel || 'Send Inquiry'}
              brochureUrl={listing.status === 'Sold' ? null : listing.brochureUrl}
              phone={phone}
              email={email}
            />
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          IMAGE GALLERY
          ════════════════════════════════════════════ */}
      {listing.images && listing.images.length > 1 && (
        <section id="gallery" style={{
          borderTop: `1px solid ${B}`,
          background: BG,
        }}>
          <div style={{ padding: '80px 56px 48px' }}>
            <div style={{ maxWidth: 1300, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 40, height: 2, background: G }} />
                <span style={{
                  fontSize: 12, letterSpacing: '0.38em', textTransform: 'uppercase',
                  color: 'rgba(240,234,224,0.4)', fontWeight: 600,
                }}>
                  Gallery
                </span>
              </div>
              <span style={{ fontSize: 12, color: 'rgba(240,234,224,0.25)', letterSpacing: '0.1em' }}>
                {listing.images.length} Photos
              </span>
            </div>
          </div>

          <ImageGallery images={listing.images} address={listing.address} />
        </section>
      )}

      {/* ════════════════════════════════════════════
          LOCATION MAP
          ════════════════════════════════════════════ */}
      <section id="location" style={{
        padding: '88px 56px 100px',
        borderTop: `1px solid ${B}`,
        background: BG,
      }}>
        <div style={{ maxWidth: 1300, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 40 }}>
            <div style={{ width: 40, height: 2, background: G }} />
            <span style={{
              fontSize: 12, letterSpacing: '0.38em', textTransform: 'uppercase',
              color: 'rgba(240,234,224,0.4)', fontWeight: 600,
            }}>
              Location
            </span>
          </div>
          <div style={{
            border: `1px solid rgba(240,234,224,0.06)`,
            overflow: 'hidden', position: 'relative',
          }}>
            <iframe
              src={mapSrc}
              width="100%" height="500"
              style={{ border: 0, display: 'block', filter: 'grayscale(1) brightness(0.6) contrast(1.2)' }}
              loading="lazy"
            />
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(8,8,8,0.08)', pointerEvents: 'none' }} />
          </div>
          <p style={{
            fontSize: 13, color: 'rgba(240,234,224,0.3)', marginTop: 16,
            letterSpacing: '0.06em',
          }}>
            {fullAddress}
          </p>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          BOTTOM CTA BAND
          ════════════════════════════════════════════ */}
      <section style={{
        padding: '72px 56px',
        borderTop: `1px solid ${B}`,
        background: BG,
        textAlign: 'center',
      }}>
        <p style={{
          fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase',
          color: 'rgba(198,122,60,0.5)', marginBottom: 20,
          fontFamily: "'BentonSans', sans-serif", fontWeight: 700,
        }}>
          INTERESTED IN THIS PROPERTY?
        </p>
        <p style={{
          fontFamily: "'BentonSans', sans-serif",
          fontSize: 'clamp(1.4rem, 2.5vw, 2.2rem)',
          fontWeight: 900, color: CR, marginBottom: 36,
          textTransform: 'uppercase', letterSpacing: '0.04em',
        }}>
          CONTACT OUR TEAM FOR A CONFIDENTIAL BRIEFING.
        </p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href={`mailto:${email}?subject=Inquiry: ${listing.address}&body=I am interested in the property at ${listing.address}. Please contact me.`} style={{
            display: 'inline-block', padding: '16px 48px',
            background: G, color: BG, fontSize: 12, letterSpacing: '0.24em',
            textTransform: 'uppercase', fontWeight: 700, textDecoration: 'none',
            fontFamily: "'BentonSans', sans-serif",
          }}>
            Email Us
          </a>
          <a href={`tel:${phone.replace(/[^+\d]/g, '')}`} style={{
            display: 'inline-block', padding: '16px 48px',
            background: 'transparent', color: G, fontSize: 12, letterSpacing: '0.24em',
            textTransform: 'uppercase', fontWeight: 700, textDecoration: 'none',
            fontFamily: "'BentonSans', sans-serif",
            border: `1px solid ${G}`,
          }}>
            {phone}
          </a>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          FOOTER
          ════════════════════════════════════════════ */}
      <footer style={{
        borderTop: `1px solid ${B}`,
        padding: '24px 56px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: BG,
      }}>
        <Link href="/" style={{
          fontFamily: "'BentonSans', sans-serif",
          fontSize: 13, fontWeight: 700, letterSpacing: '0.18em',
          color: 'rgba(240,234,224,0.2)', textDecoration: 'none',
          textTransform: 'uppercase',
        }}>
          {companyName}
        </Link>
        <div style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
          <Link href="/#listings" style={{
            fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase',
            color: 'rgba(240,234,224,0.25)', textDecoration: 'none',
          }}>
            All Listings
          </Link>
          <span style={{ fontSize: 11, color: 'rgba(240,234,224,0.15)' }}>
            &copy; {new Date().getFullYear()}
          </span>
        </div>
      </footer>
    </main>
  )
}
