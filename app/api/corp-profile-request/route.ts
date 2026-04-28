import { NextResponse } from 'next/server'

type Payload = {
  fullName: string
  email: string
  firm?: string
  role?: string
}

export async function POST(req: Request) {
  let body: Payload
  try { body = await req.json() } catch { return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 }) }
  if (!body.fullName || !body.email) {
    return NextResponse.json({ ok: false, error: 'Missing required fields' }, { status: 400 })
  }

  const submittedAt = new Date().toISOString()
  const errors: string[] = []

  // Forward to n8n webhook if configured. Reuses MANDATE_WEBHOOK_URL pattern but with a
  // type marker so the workflow can branch (or use a separate CORP_PROFILE_WEBHOOK_URL later).
  const webhook = process.env.CORP_PROFILE_WEBHOOK_URL || process.env.MANDATE_WEBHOOK_URL
  const secret = process.env.CORP_PROFILE_WEBHOOK_SECRET || process.env.MANDATE_WEBHOOK_SECRET
  if (webhook) {
    try {
      await fetch(webhook, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(secret ? { 'x-webhook-secret': secret } : {}),
        },
        body: JSON.stringify({
          requestType: 'corp_profile_pdf',
          fullName: body.fullName,
          email: body.email,
          firm: body.firm || '',
          role: body.role || '',
          assetType: 'Corporate Profile Request',
          status: 'pending',
          city: '',
          submittedAt,
          notes: 'Requested corporate profile PDF download via website CTA.',
        }),
      })
    } catch (e: any) {
      errors.push(e?.message || 'webhook failed')
    }
  }

  console.log('[corp-profile-request]', JSON.stringify({ submittedAt, ...body, errors }))
  return NextResponse.json({ ok: true })
}
