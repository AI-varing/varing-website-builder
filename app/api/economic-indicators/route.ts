import { NextResponse } from 'next/server'

export const revalidate = 3600 // cache 1 hour

const BOC_SCHEDULE_2026 = [
  { date: 'April 29', isoDate: '2026-04-29', hasMpr: true },
  { date: 'June 10', isoDate: '2026-06-10', hasMpr: false },
  { date: 'July 15', isoDate: '2026-07-15', hasMpr: true },
  { date: 'September 2', isoDate: '2026-09-02', hasMpr: false },
  { date: 'October 28', isoDate: '2026-10-28', hasMpr: true },
  { date: 'December 9', isoDate: '2026-12-09', hasMpr: false },
]

const FRASER_VALLEY_FALLBACK = [
  { value: '480K', label: 'Total Acres of Land' },
  { value: '1.03M', label: 'Population of the Fraser Valley' },
  { value: '7.7%', label: 'Avg Population Increase Yr/Yr' },
  { value: '4.9%', label: 'Unemployment Rate' },
]

async function fetchBocRate(): Promise<{ currentRate: number | null; lastUpdated: string | null; historicalByDate: Record<string, number> }> {
  try {
    // BoC Valet API — V39079 is the policy interest rate series
    const r = await fetch('https://www.bankofcanada.ca/valet/observations/V39079?recent=250', {
      next: { revalidate: 3600 },
    })
    if (!r.ok) return { currentRate: null, lastUpdated: null, historicalByDate: {} }
    const data: any = await r.json()
    const obs: any[] = data?.observations || []
    const historicalByDate: Record<string, number> = {}
    for (const o of obs) {
      const d = o?.d
      const v = parseFloat(o?.V39079?.v)
      if (d && !isNaN(v)) historicalByDate[d] = v
    }
    const last = obs[obs.length - 1]
    return {
      currentRate: last ? parseFloat(last?.V39079?.v) : null,
      lastUpdated: last?.d || null,
      historicalByDate,
    }
  } catch {
    return { currentRate: null, lastUpdated: null, historicalByDate: {} }
  }
}

export async function GET() {
  const { currentRate, lastUpdated, historicalByDate } = await fetchBocRate()

  // Match historical rates to schedule items whose announcement date has passed
  const schedule = BOC_SCHEDULE_2026.map(item => {
    const rate = historicalByDate[item.isoDate] ?? null
    return { ...item, rate }
  })

  return NextResponse.json({
    boc: {
      currentRate,
      lastUpdated,
      schedule,
    },
    fraserValley: FRASER_VALLEY_FALLBACK,
  }, {
    headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' },
  })
}
