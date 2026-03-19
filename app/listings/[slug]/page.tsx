import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import NavBar from './NavBar'

async function getListing(slug: string) {
  const token = process.env.NEXT_PUBLIC_STORYBLOK_TOKEN
  const res = await fetch(
    `https://api.storyblok.com/v2/cdn/stories/listings/${slug}?token=${token}&version=draft`,
    { next: { revalidate: 60 } }
  )
  if (!res.ok) return null
  const data = await res.json()
  const c = data.story?.content
  if (!c) return null
  return {
    address: c.address || '',
    city: c.city || '',
    province: c.province || 'BC',
    price: Number(c.price) || null,
    propertyType: c.propertyType || '',
    lotSize: c.lotSize || null,
    buildingArea: Number(c.buildingArea) || null,
    mlsNumber: c.mlsNumber || '',
    description: c.description || '',
    status: c.status || 'Active',
    ctaLabel: c.ctaLabel || 'Send Inquiry',
    featured: c.featured || false,
    images: (c.images || []).map((img: any) => img.filename).filter(Boolean),
    brochureUrl: c.brochure?.filename || null,
  }
}

async function getSettings() {
  const token = process.env.NEXT_PUBLIC_STORYBLOK_TOKEN
  const res = await fetch(
    `https://api.storyblok.com/v2/cdn/stories/home?token=${token}&version=draft`,
    { next: { revalidate: 60 } }
  )
  if (!res.ok) return {}
  const data = await res.json()
  const nav = data.story?.content?.body?.find((b: any) => b.component === 'nav')
  return {
    companyName: nav?.companyName || 'Varing Group',
    phone: nav?.phone || '+1.604.565.3478',
    email: 'info@varinggroup.com',
  }
}

export default async function ListingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [listing, settings] = await Promise.all([getListing(slug), getSettings()])
  if (!listing) notFound()

  const companyName = settings?.companyName || 'Varing Group'
  const fullAddress = `${listing.address}${listing.city ? ', ' + listing.city : ''}, BC`
  const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(fullAddress)}&z=15&output=embed`

  const G  = '#2952A3'
  const CR = '#F0EAE0'
  const BG = '#080808'
  const B  = 'rgba(240,234,224,0.08)'

  const pills = [
    listing.buildingArea && { icon: 'area', value: listing.buildingArea.toLocaleString() + ' SF', label: 'Building Area' },
    listing.lotSize && { icon: 'lot', value: listing.lotSize + ' AC', label: 'Lot Size' },
    listing.price && { icon: 'price', value: '$' + listing.price.toLocaleString(), label: 'Asking Price' },
  ].filter(Boolean) as { icon: string; value: string; label: string }[]

  const metaItems = [
    listing.propertyType && { label: 'Type', value: listing.propertyType },
    listing.lotSize && { label: 'Lot Size', value: listing.lotSize + ' Acres' },
    listing.city && { label: 'Location', value: listing.city + ', BC' },
    { label: 'Status', value: listing.status || 'Active' },
  ].filter(Boolean) as { label: string; value: string }[]

  return (
    <main style={{ background: BG, color: CR, minHeight: '100vh', fontFamily: "'BentonSans', sans-serif" }}>
      <NavBar companyName={companyName} />

      {/* HERO */}
      <section style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
        {listing.images?.[0] ? (
          <Image src={listing.images[0]} alt={listing.address} fill priority style={{ objectFit: 'cover', objectPosition: 'center' }} />
        ) : (
          <div style={{ position: 'absolute', inset: 0, background: '#141414', backgroundImage: `radial-gradient(circle, ${G}22 1px, transparent 1px)`, backgroundSize: '44px 44px' }} />
        )}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'linear-gradient(to bottom, rgba(8,8,8,0.65) 0%, transparent 40%)' }} />
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'linear-gradient(to top, rgba(8,8,8,1) 0%, rgba(8,8,8,0.72) 28%, transparent 60%)' }} />

        <div style={{ position: 'absolute', bottom: 92, left: 0, right: 0, padding: '0 56px' }}>
          {(listing.propertyType || listing.city) && (
            <p style={{ fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', color: G, marginBottom: 20, fontWeight: 600 }}>
              {[listing.propertyType, listing.city && `${listing.city}, BC`].filter(Boolean).join('  \u00b7  ')}
            </p>
          )}
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2.6rem, 5.5vw, 5.2rem)', fontWeight: 500, lineHeight: 1.0, color: CR, marginBottom: 36, letterSpacing: '-0.01em', maxWidth: 960 }}>
            {listing.address}
          </h1>
          {pills.length > 0 && (
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {pills.map((pill) => (
                <div key={pill.icon} style={{ display: 'flex', alignItems: 'center', gap: 14, background: 'rgba(8,8,8,0.62)', backdropFilter: 'blur(14px)', border: '1px solid rgba(240,234,224,0.14)', borderRadius: 999, padding: '13px 26px' }}>
                  {pill.icon === 'area' && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={G} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="1.5"/><path d="M3 9h18M9 9v12"/></svg>}
                  {pill.icon === 'lot' && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={G} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>}
                  {pill.icon === 'price' && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={G} strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="9"/><path d="M15 9.3C14.3 8.5 13.3 8 12 8c-1.8 0-3 1-3 2.5s1.2 2.5 3 2.5 3 1 3 2.5-1.2 2.5-3 2.5c-1.3 0-2.3-.5-3-1.3M12 6v2M12 16v2"/></svg>}
                  <div>
                    <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, fontWeight: 600, color: CR, lineHeight: 1 }}>{pill.value}</p>
                    <p style={{ fontSize: 8, letterSpacing: '0.22em', color: 'rgba(240,234,224,0.45)', textTransform: 'uppercase', marginTop: 4 }}>{pill.label}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {metaItems.length > 0 && (
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, display: 'flex', alignItems: 'center', padding: '14px 56px', background: 'rgba(8,8,8,0.88)', backdropFilter: 'blur(10px)', borderTop: '1px solid rgba(240,234,224,0.09)' }}>
            {metaItems.map((item, i) => (
              <div key={i} style={{ flex: 1, paddingRight: 32, borderRight: i < metaItems.length - 1 ? '1px solid rgba(240,234,224,0.1)' : 'none', marginRight: i < metaItems.length - 1 ? 32 : 0 }}>
                <span style={{ display: 'block', fontSize: 8, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(240,234,224,0.32)', marginBottom: 4 }}>{item.label}</span>
                <span style={{ fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase', color: CR, fontWeight: 500 }}>{item.value}</span>
              </div>
            ))}
            {listing.mlsNumber && (
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <span style={{ display: 'block', fontSize: 8, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(240,234,224,0.32)', marginBottom: 4 }}>MLS&reg;</span>
                <span style={{ fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase', color: G, fontWeight: 500 }}>{listing.mlsNumber}</span>
              </div>
            )}
          </div>
        )}
      </section>

      {/* OVERVIEW */}
      <section id="overview" style={{ padding: '88px 56px 112px', background: BG }}>
        <div style={{ maxWidth: 1320, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 420px', gap: 88, alignItems: 'start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
              <div style={{ width: 32, height: 1, background: G }} />
              <span style={{ fontSize: 10, letterSpacing: '0.32em', textTransform: 'uppercase', color: 'rgba(240,234,224,0.32)' }}>Overview</span>
            </div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.9rem, 3.5vw, 3.2rem)', fontWeight: 400, color: CR, lineHeight: 1.1, marginBottom: 8 }}>{listing.address}</h2>
            {listing.city && <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1rem, 1.8vw, 1.4rem)', fontWeight: 300, fontStyle: 'italic', color: 'rgba(240,234,224,0.38)', marginBottom: 40 }}>{listing.city}, British Columbia</p>}
            {listing.price && (
              <div style={{ marginBottom: 40, paddingBottom: 36, borderBottom: `1px solid ${B}` }}>
                <p style={{ fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: G, marginBottom: 12, fontWeight: 600 }}>Asking Price</p>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2.2rem, 4vw, 3.4rem)', fontWeight: 500, color: CR, lineHeight: 1 }}>${listing.price.toLocaleString()}</p>
              </div>
            )}
            {(listing.buildingArea || listing.lotSize) && (
              <div style={{ display: 'flex', border: `1px solid ${B}`, marginBottom: 52 }}>
                {listing.buildingArea && (
                  <div style={{ flex: 1, padding: '26px 30px', borderRight: listing.lotSize ? `1px solid ${B}` : 'none' }}>
                    <p style={{ fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(240,234,224,0.32)', marginBottom: 12 }}>Building Area</p>
                    <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 500, color: CR }}>{listing.buildingArea.toLocaleString()}<span style={{ fontSize: 14, color: 'rgba(240,234,224,0.4)', marginLeft: 6 }}>SF</span></p>
                  </div>
                )}
                {listing.lotSize && (
                  <div style={{ flex: 1, padding: '26px 30px' }}>
                    <p style={{ fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(240,234,224,0.32)', marginBottom: 12 }}>Lot Size</p>
                    <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 500, color: CR }}>{listing.lotSize}<span style={{ fontSize: 14, color: 'rgba(240,234,224,0.4)', marginLeft: 6 }}>AC</span></p>
                  </div>
                )}
              </div>
            )}
            {listing.description && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
                  <div style={{ width: 32, height: 1, background: G }} />
                  <span style={{ fontSize: 10, letterSpacing: '0.32em', textTransform: 'uppercase', color: 'rgba(240,234,224,0.32)' }}>Description</span>
                </div>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 300, lineHeight: 1.9, color: 'rgba(240,234,224,0.78)', whiteSpace: 'pre-line' }}>{listing.description}</p>
              </div>
            )}
          </div>

          {/* Inquiry panel */}
          <div style={{ position: 'sticky', top: 92 }}>
            <div style={{ border: '1px solid rgba(240,234,224,0.14)', background: '#111', padding: '36px 32px' }}>
              <div style={{ marginBottom: 28, paddingBottom: 24, borderBottom: `1px solid ${B}` }}>
                <span style={{ fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: G, display: 'block', marginBottom: 10, fontWeight: 600 }}>Listing Inquiry</span>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 19, fontWeight: 400, color: CR, lineHeight: 1.3 }}>{listing.address}</p>
                {listing.price && <p style={{ fontSize: 14, color: 'rgba(240,234,224,0.45)', marginTop: 6 }}>${listing.price.toLocaleString()}</p>}
              </div>
              <form style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {['First Name', 'Last Name'].map(label => (
                    <div key={label}>
                      <label style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(240,234,224,0.45)', display: 'block', marginBottom: 6, fontWeight: 500 }}>{label} *</label>
                      <input type="text" required style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(240,234,224,0.18)', padding: '10px 12px', fontSize: 13, color: CR, fontFamily: "'BentonSans', sans-serif" }} />
                    </div>
                  ))}
                </div>
                <div>
                  <label style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(240,234,224,0.45)', display: 'block', marginBottom: 6, fontWeight: 500 }}>Email *</label>
                  <input type="email" required style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(240,234,224,0.18)', padding: '10px 12px', fontSize: 13, color: CR, fontFamily: "'BentonSans', sans-serif" }} />
                </div>
                <div>
                  <label style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(240,234,224,0.45)', display: 'block', marginBottom: 6, fontWeight: 500 }}>Phone</label>
                  <input type="tel" style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(240,234,224,0.18)', padding: '10px 12px', fontSize: 13, color: CR, fontFamily: "'BentonSans', sans-serif" }} />
                </div>
                <div>
                  <label style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(240,234,224,0.45)', display: 'block', marginBottom: 6, fontWeight: 500 }}>Message</label>
                  <textarea rows={4} defaultValue={`I'm interested in ${listing.address}. Please contact me.`}
                    style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(240,234,224,0.18)', padding: '10px 12px', fontSize: 13, color: CR, fontFamily: "'BentonSans', sans-serif", resize: 'none', lineHeight: 1.65 }} />
                </div>
                <button type="submit" style={{ width: '100%', background: G, color: BG, padding: '14px', fontSize: 11, letterSpacing: '0.24em', textTransform: 'uppercase', fontWeight: 700, border: 'none', cursor: 'pointer', fontFamily: "'BentonSans', sans-serif", marginTop: 4 }}>
                  {listing.ctaLabel || 'Send Inquiry'}
                </button>
              </form>
              {listing.brochureUrl && (
                <a href={listing.brochureUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 12, width: '100%', border: `1px solid ${G}`, padding: '13px', fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: G, textDecoration: 'none', fontWeight: 500 }}>&darr; Download Brochure (PDF)</a>
              )}
              {(settings?.phone || settings?.email) && (
                <div style={{ marginTop: 24, paddingTop: 20, borderTop: `1px solid ${B}` }}>
                  <p style={{ fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(240,234,224,0.28)', marginBottom: 12, fontWeight: 500 }}>Or contact directly</p>
                  {settings.phone && <a href={`tel:${settings.phone}`} style={{ display: 'block', fontSize: 13, color: 'rgba(240,234,224,0.55)', textDecoration: 'none', marginBottom: 6 }}>{settings.phone}</a>}
                  {settings.email && <a href={`mailto:${settings.email}`} style={{ display: 'block', fontSize: 13, color: 'rgba(240,234,224,0.55)', textDecoration: 'none' }}>{settings.email}</a>}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* GALLERY */}
      {listing.images?.length > 1 && (
        <section id="gallery" style={{ borderTop: `1px solid ${B}`, background: BG }}>
          <div style={{ padding: '80px 56px 48px' }}>
            <div style={{ maxWidth: 1320, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 32, height: 1, background: G }} />
              <span style={{ fontSize: 10, letterSpacing: '0.32em', textTransform: 'uppercase', color: 'rgba(240,234,224,0.32)' }}>Gallery</span>
              <span style={{ marginLeft: 'auto', fontSize: 10, color: 'rgba(240,234,224,0.18)' }}>{listing.images.length} photos</span>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 3, marginBottom: 3 }}>
            <div style={{ position: 'relative', height: 520, overflow: 'hidden' }}>
              <Image src={listing.images[0]} alt={`${listing.address} — photo 1`} fill style={{ objectFit: 'cover' }} />
            </div>
            {listing.images[1] && (
              <div style={{ position: 'relative', height: 520, overflow: 'hidden' }}>
                <Image src={listing.images[1]} alt={`${listing.address} — photo 2`} fill style={{ objectFit: 'cover' }} />
              </div>
            )}
          </div>
          {listing.images.length > 2 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 3 }}>
              {listing.images.slice(2).map((img: string, i: number) => (
                <div key={i} style={{ position: 'relative', height: 300, overflow: 'hidden' }}>
                  <Image src={img} alt={`${listing.address} — photo ${i + 3}`} fill style={{ objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* LOCATION */}
      <section id="location" style={{ padding: '88px 56px 100px', borderTop: `1px solid ${B}`, background: BG }}>
        <div style={{ maxWidth: 1320, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 36 }}>
            <div style={{ width: 32, height: 1, background: G }} />
            <span style={{ fontSize: 10, letterSpacing: '0.32em', textTransform: 'uppercase', color: 'rgba(240,234,224,0.32)' }}>Location</span>
          </div>
          <div style={{ border: `1px solid ${B}`, overflow: 'hidden', position: 'relative' }}>
            <iframe src={mapSrc} width="100%" height="480" style={{ border: 0, display: 'block', filter: 'grayscale(1) brightness(0.65) contrast(1.15)' }} loading="lazy" />
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(8,8,8,0.12)', pointerEvents: 'none' }} />
          </div>
          <p style={{ fontSize: 11, color: 'rgba(240,234,224,0.24)', marginTop: 14, letterSpacing: '0.06em' }}>{fullAddress}</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: `1px solid ${B}`, padding: '22px 56px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: BG }}>
        <Link href="/" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 15, letterSpacing: '0.12em', color: 'rgba(240,234,224,0.18)', textDecoration: 'none', textTransform: 'uppercase' }}>{companyName}</Link>
        <div style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
          <Link href="/#listings" style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(240,234,224,0.2)', textDecoration: 'none' }}>All Listings</Link>
          <span style={{ fontSize: 10, color: 'rgba(240,234,224,0.12)' }}>&copy; {new Date().getFullYear()}</span>
        </div>
      </footer>
    </main>
  )
}
