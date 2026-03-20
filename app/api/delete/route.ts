import { NextRequest, NextResponse } from 'next/server'
import { deleteFromR2 } from '@/lib/r2'

export async function POST(request: NextRequest) {
  try {
    const { filePath } = await request.json()

    if (!filePath) {
      return NextResponse.json({ error: 'Missing filePath' }, { status: 400 })
    }

    await deleteFromR2(filePath)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  }
}