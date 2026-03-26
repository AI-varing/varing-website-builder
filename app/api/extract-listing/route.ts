import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const getClient = () => new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

/* ── Upload file to Storyblok ── */
async function uploadToStoryblok(fileBuffer: Buffer | ArrayBuffer, filename: string, contentType = 'application/pdf'): Promise<string | null> {
  const sbToken = process.env.STORYBLOK_MANAGEMENT_TOKEN!
  const spaceId = process.env.STORYBLOK_SPACE_ID!

  try {
    const signRes = await fetch(`https://mapi.storyblok.com/v1/spaces/${spaceId}/assets`, {
      method: 'POST',
      headers: { 'Authorization': sbToken, 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename, size: `${fileBuffer instanceof ArrayBuffer ? fileBuffer.byteLength : fileBuffer.length}` })
    })
    if (!signRes.ok) return null
    const signData = await signRes.json()

    const formData = new FormData()
    const fields = signData.fields || {}
    for (const [key, value] of Object.entries(fields)) {
      formData.append(key, value as string)
    }
    const blob = new Blob([fileBuffer instanceof ArrayBuffer ? new Uint8Array(fileBuffer) : fileBuffer], { type: contentType })
    formData.append('file', blob, filename)

    const uploadRes = await fetch(signData.post_url, { method: 'POST', body: formData })
    if (uploadRes.ok || uploadRes.status === 204) {
      return signData.pretty_url || `https://a.storyblok.com/${fields.key}`
    }
    return null
  } catch {
    return null
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('pdf') as File | null
    const autoCreate = formData.get('autoCreate') === 'true'

    if (!file) {
      return NextResponse.json({ error: 'No PDF file provided' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const base64 = Buffer.from(bytes).toString('base64')
    const dataUrl = `data:application/pdf;base64,${base64}`

    // Extract text data via GPT-4o
    const response = await getClient().responses.create({
      model: 'gpt-4o',
      input: [
        {
          role: 'user',
          content: [
            { type: 'input_file', filename: file.name || 'brochure.pdf', file_data: dataUrl },
            {
              type: 'input_text',
              text: `Extract listing information from this property brochure PDF. Return ONLY a valid JSON object with these fields (omit any field you cannot find):

{
  "address": "full street address",
  "city": "city name",
  "province": "BC",
  "price": 1234567,
  "propertyType": "Land" | "Income Property" | "Commercial" | "Court-Ordered",
  "lotSize": 1.5,
  "buildingArea": 5000,
  "mlsNumber": "R1234567",
  "description": "a concise 3-5 sentence description of the property for the listing page"
}

Rules:
- price, lotSize, and buildingArea must be numbers (no $ or commas)
- lotSize is in acres
- buildingArea is in square feet
- Write description as compelling copy for a luxury real estate website
- Return ONLY the JSON object, no markdown, no explanation`,
            },
          ],
        },
      ],
    })

    const text = response.output_text ?? ''
    const clean = text.replace(/```(?:json)?/g, '').trim()
    const data = JSON.parse(clean)

    // Upload PDF as brochure asset
    let brochureUrl: string | null = null
    try {
      const pdfFilename = `${(data.address || 'brochure').replace(/[^a-zA-Z0-9 ]/g, '').replace(/\s+/g, '-')}.pdf`
      brochureUrl = await uploadToStoryblok(bytes, pdfFilename, 'application/pdf')
      if (brochureUrl) console.log('Uploaded brochure:', brochureUrl)
    } catch (e: any) {
      console.log('Brochure upload note:', e.message)
    }

    // Auto-create in Storyblok
    if (autoCreate) {
      const sbToken = process.env.STORYBLOK_MANAGEMENT_TOKEN
      const spaceId = process.env.STORYBLOK_SPACE_ID
      if (!sbToken || !spaceId) {
        return NextResponse.json({ success: true, data, storyblok: { error: 'Missing Storyblok management credentials' } })
      }

      const fRes = await fetch(`https://mapi.storyblok.com/v1/spaces/${spaceId}/stories?with_slug=listings&is_folder=1`, {
        headers: { 'Authorization': sbToken }
      })
      const { stories: folders } = await fRes.json()
      const folderId = folders?.[0]?.id
      const baseSlug = (data.address || 'listing').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '')
      const slug = `${baseSlug}-${Date.now().toString(36)}`

      const storyContent: any = {
        component: 'listing',
        address: data.address || '',
        city: data.city || '',
        province: data.province || 'BC',
        price: data.price ? String(data.price) : '',
        status: 'Active',
        propertyType: data.propertyType || '',
        lotSize: data.lotSize ? String(data.lotSize) : '',
        buildingArea: data.buildingArea ? String(data.buildingArea) : '',
        mlsNumber: data.mlsNumber || '',
        description: data.description || '',
        featured: false,
        ctaLabel: 'Send Inquiry',
      }

      if (brochureUrl) {
        storyContent.brochure = { filename: brochureUrl, id: null }
      }

      const createRes = await fetch(`https://mapi.storyblok.com/v1/spaces/${spaceId}/stories`, {
        method: 'POST',
        headers: { 'Authorization': sbToken, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          story: {
            name: data.address || 'New Listing',
            slug,
            parent_id: folderId,
            content: storyContent,
            publish: 1,
          }
        })
      })

      if (createRes.ok) {
        const { story } = await createRes.json()
        return NextResponse.json({
          success: true, data, brochureUrl,
          storyblok: { created: true, storyId: story.id, slug: story.slug }
        })
      } else {
        const err = await createRes.json()
        return NextResponse.json({ success: true, data, brochureUrl, storyblok: { error: JSON.stringify(err) } })
      }
    }

    return NextResponse.json({ success: true, data, brochureUrl })
  } catch (err: any) {
    console.error('extract-listing error:', err)
    return NextResponse.json({ error: err.message || 'Extraction failed' }, { status: 500 })
  }
}
