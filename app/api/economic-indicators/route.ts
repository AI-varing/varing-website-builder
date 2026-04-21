import { NextResponse } from 'next/server'

export const revalidate = 3600

interface ScheduleItem {
  date: string
  isoDate: string
  hasMpr: boolean
  rate?: number | null
}

const BOC_SCHEDULE_2026: ScheduleItem[] = [
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

async function fetchBocRate() {
  try {
    // V39079 = overnight policy rate
    const r = await fetch('https://www.bankofcanada.ca/valet/observations/V39079?recent=730', {
      next: { revalidate: 3600 },
    })
    if (!r.ok) return { currentRate: null, lastUpdated: null, history: [] as { date: string; rate: number }[], historicalByDate: {} as Record<string, number> }
    const data: any = await r.json()
    const obs: any[] = data?.observations || []
    const history: { date: string; rate: number }[] = []
    const historicalByDate: Record<string, number> = {}
    for (const o of obs) {
      const d = o?.d
      const v = parseFloat(o?.V39079?.v)
      if (d && !isNaN(v)) {
        history.push({ date: d, rate: v })
        historicalByDate[d] = v
      }
    }
    // BoC Valet returns observations newest-first; sort chronologically so
    // `history[last]` is the most recent rate and step-chart renders correctly.
    history.sort((a, b) => a.date.localeCompare(b.date))
    const last = history[history.length - 1]
    return {
      currentRate: last?.rate ?? null,
      lastUpdated: last?.date ?? null,
      history,
      historicalByDate,
    }
  } catch {
    return { currentRate: null, lastUpdated: null, history: [] as { date: string; rate: number }[], historicalByDate: {} as Record<string, number> }
  }
}

export async function GET() {
  const { currentRate, lastUpdated, history, historicalByDate } = await fetchBocRate()

  const schedule = BOC_SCHEDULE_2026.map(item => {
    // For past dates, find the rate on or before that date (announcements change the rate on the day)
    let rate: number | null = null
    if (item.isoDate <= (lastUpdated || '')) {
      // look up rate on that exact date, or closest prior
      rate = historicalByDate[item.isoDate] ?? null
      if (rate === null) {
        const priorDates = Object.keys(historicalByDate).filter(d => d <= item.isoDate).sort()
        if (priorDates.length) rate = historicalByDate[priorDates[priorDates.length - 1]]
      }
    }
    return { ...item, rate }
  })

  return NextResponse.json({
    boc: {
      currentRate,
      lastUpdated,
      schedule,
      history,
    },
    fraserValley: FRASER_VALLEY_FALLBACK,
  }, {
    headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' },
  })
}
