'use client'

const G = '#c67a3c'

const ICONS = {
  call: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.11 2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>,
  calendar: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  doc: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  lock: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>,
}

const btnStyle: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 10,
  padding: '14px 24px',
  background: 'rgba(198,122,60,0.08)',
  border: '1px solid rgba(198,122,60,0.2)',
  color: G, fontSize: 11, fontWeight: 700,
  letterSpacing: '0.14em', textTransform: 'uppercase',
  textDecoration: 'none',
  transition: 'all 0.3s ease',
  fontFamily: "'BentonSans', sans-serif",
}

export default function ListingActions({ address }: { address: string }) {
  const buttons = [
    { label: 'Schedule a Call', icon: ICONS.call, subject: `Schedule a Call — ${address}` },
    { label: 'Book a Showing', icon: ICONS.calendar, subject: `Book a Showing — ${address}` },
    { label: 'Make an Offer', icon: ICONS.doc, subject: `Offer Inquiry — ${address}` },
  ]

  return (
    <div style={{ display: 'flex', gap: 12, marginBottom: 48, flexWrap: 'wrap' }}>
      {buttons.map(btn => (
        <a
          key={btn.label}
          href={`mailto:team@varinggroup.com?subject=${encodeURIComponent(btn.subject)}&body=${encodeURIComponent(`Hi,\n\nI would like to ${btn.label.toLowerCase()} for the property at ${address}.\n\nPlease let me know available times.\n\nThank you.`)}`}
          style={btnStyle}
          onMouseEnter={(e) => { e.currentTarget.style.background = G; e.currentTarget.style.color = '#080808' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(198,122,60,0.08)'; e.currentTarget.style.color = G }}
        >
          {btn.icon}
          {btn.label}
        </a>
      ))}
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault()
          const link = document.createElement('a')
          link.href = '/Varing-Group-NDA.pdf'
          link.download = 'Varing-Group-NDA.pdf'
          link.click()
          setTimeout(() => {
            window.location.href = `mailto:team@varinggroup.com?subject=${encodeURIComponent(`Due Diligence Request — ${address}`)}&body=${encodeURIComponent(`Hi,\n\nI am interested in accessing the due diligence documents for the property at ${address}.\n\nPlease find the signed NDA attached to this email.\n\nOnce reviewed, kindly send over the Schedule A and any available due diligence materials.\n\nThank you.`)}`
          }, 500)
        }}
        style={btnStyle}
        onMouseEnter={(e) => { e.currentTarget.style.background = G; e.currentTarget.style.color = '#080808' }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(198,122,60,0.08)'; e.currentTarget.style.color = G }}
      >
        {ICONS.lock}
        Due Diligence
      </a>
    </div>
  )
}
