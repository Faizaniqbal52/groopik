import { NextRequest, NextResponse } from 'next/server'
import { putJson, getJson } from '@/lib/r2'
import { randomUUID } from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const { name } = await request.json()
    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Event name is required' }, { status: 400 })
    }

    const id = randomUUID()
    const joinCode = Math.random().toString(36).substring(2, 8).toUpperCase()
    const event = {
      id,
      name: name.trim(),
      join_code: joinCode,
      created_at: new Date().toISOString(),
    }

    await putJson(`_meta/events/${id}.json`, event)
    await putJson(`_meta/codes/${joinCode}.json`, { event_id: id })
    await putJson(`${id}/_manifest.json`, { photos: [] })

    return NextResponse.json(event)
  } catch (error) {
    console.error('Create event error:', error)
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const code = searchParams.get('code')

    if (id) {
      const event = await getJson(`_meta/events/${id}.json`)
      if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 })
      return NextResponse.json(event)
    }

    if (code) {
      const codeLookup = await getJson(`_meta/codes/${code.toUpperCase()}.json`)
      if (!codeLookup) return NextResponse.json({ error: 'Event not found' }, { status: 404 })
      const event = await getJson(`_meta/events/${codeLookup.event_id}.json`)
      if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 })
      return NextResponse.json(event)
    }

    return NextResponse.json({ error: 'Provide id or code parameter' }, { status: 400 })
  } catch (error) {
    console.error('Get event error:', error)
    return NextResponse.json({ error: 'Failed to get event' }, { status: 500 })
  }
}
