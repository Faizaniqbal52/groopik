import { NextRequest, NextResponse } from 'next/server'
import { getJson } from '@/lib/r2'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const eventId = searchParams.get('eventId')
    if (!eventId) {
      return NextResponse.json({ error: 'Missing eventId' }, { status: 400 })
    }

    const manifest = await getJson(`${eventId}/_manifest.json`)
    return NextResponse.json({ photos: manifest?.photos || [] })
  } catch (error) {
    console.error('List photos error:', error)
    return NextResponse.json({ photos: [] })
  }
}
