import { NextRequest, NextResponse } from 'next/server'
import { uploadToR2, getJson, putJson } from '@/lib/r2'
import { randomUUID } from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const eventId = formData.get('eventId') as string
    const uploadedByName = (formData.get('uploadedByName') as string) || 'Guest'
    const sessionToken = (formData.get('sessionToken') as string) || ''

    if (!file || !eventId) {
      return NextResponse.json({ error: 'Missing file or eventId' }, { status: 400 })
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/heic', 'image/heif']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 })
    }

    if (file.size > 15 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large. Max 15MB.' }, { status: 400 })
    }

    const photoId = randomUUID()
    const random = Math.random().toString(36).substring(2, 8)
    const filePath = `${eventId}/${Date.now()}_${random}_${file.name}`

    const buffer = Buffer.from(await file.arrayBuffer())
    const publicUrl = await uploadToR2(buffer, filePath, file.type)

    const manifest = (await getJson(`${eventId}/_manifest.json`)) || { photos: [] }
    manifest.photos.unshift({
      id: photoId,
      event_id: eventId,
      storage_path: filePath,
      file_name: file.name,
      file_size: file.size,
      uploaded_by_name: uploadedByName,
      session_token: sessionToken,
      public_url: publicUrl,
      uploaded_at: new Date().toISOString(),
    })
    await putJson(`${eventId}/_manifest.json`, manifest)

    return NextResponse.json({ url: publicUrl, filePath, photoId })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}