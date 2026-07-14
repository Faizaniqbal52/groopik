import { NextRequest, NextResponse } from 'next/server'
import { deleteFromR2, getJson, putJson } from '@/lib/r2'

export async function POST(request: NextRequest) {
  try {
    const { filePath, eventId, photoId } = await request.json()

    if (!filePath) {
      return NextResponse.json({ error: 'Missing filePath' }, { status: 400 })
    }

    await deleteFromR2(filePath)

    if (eventId) {
      const manifest = await getJson(`${eventId}/_manifest.json`)
      if (manifest) {
        manifest.photos = manifest.photos.filter((p: { id?: string; storage_path?: string }) =>
          photoId ? p.id !== photoId : p.storage_path !== filePath
        )
        await putJson(`${eventId}/_manifest.json`, manifest)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  }
}