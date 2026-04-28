import { NextResponse } from 'next/server'

type Payload = {
  assetType: string
  status: string
  city: string
  address: string
  estValue: string
  documents: string[]
  timeline: string
  notes: string
  fullName: string
  role: string
  firm: string
  email: string
  phone: string
}

function buildSummary(p: Payload): string {
  return [
    `New mandate submitted via targetedadvisors.ca`,
    ``,
    `── Asset ──`,
    `Type: ${p.assetType}`,
    `Status: ${p.status}`,
    `Location: ${[p.address, p.city].filter(Boolean).join(', ')}`,
    `Estimated value / debt: ${p.estValue || 'not provided'}`,
    `Timeline: ${p.timeline}`,
    `Documents available: ${p.documents.length ? p.documents.join(', ') : 'none indicated'}`,
    ``,
    `── Submitter ──`,
    `Name: ${p.fullName}`,
    `Role: ${p.role}`,
    `Firm: ${p.firm || '—'}`,
    `Email: ${p.email}`,
    `Phone: ${p.phone || '—'}`,
    ``,
    `── Notes ──`,
    p.notes || '(none)',
  ].join('\n')
}

export async function POST(req: Request) {
  let body: Payload
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 })
  }

  if (!body.fullName || !body.email || !body.assetType || !body.status) {
    return NextResponse.json({ ok: false, error: 'Missing required fields' }, { status: 400 })
  }

  const summary = buildSummary(body)
  const submittedAt = new Date().toISOString()
  const errors: string[] = []

  // Forward to n8n webhook if configured (logs to Data Table + sends notification email)
  const webhook = process.env.MANDATE_WEBHOOK_URL
  const secret = process.env.MANDATE_WEBHOOK_SECRET
  if (webhook) {
    try {
      const res = await fetch(webhook, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(secret ? { 'x-webhook-secret': secret } : {}),
        },
        body: JSON.stringify({ ...body, summary, submittedAt }),
      })
      if (!res.ok) errors.push(`webhook ${res.status}`)
    } catch (e: any) {
      errors.push(`webhook: ${e?.message || 'failed'}`)
    }
  }

  // Always log so it's recoverable from Vercel runtime logs even if webhook fails
  console.log('[mandate]', JSON.stringify({ submittedAt, ...body, errors }))

  return NextResponse.json({ ok: true, errors: errors.length ? errors : undefined })
}
