'use client'

import { useState, useEffect, Suspense } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

function EventPageContent() {
  const params = useParams()
  const searchParams = useSearchParams()
  const eventId = params.id as string
  const guestName = searchParams.get('name') || 'Guest'

  const [event, setEvent] = useState<any>(null)
  const [photos, setPhotos] = useState<any[]>([])
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetchEvent()
    fetchPhotos()
  }, [])

  const fetchEvent = async () => {
    const { data } = await supabase
      .from('events')
      .select('*')
      .eq('id', eventId)
      .single()
    setEvent(data)
  }

  const fetchPhotos = async () => {
    const { data } = await supabase
      .from('photos')
      .select('*')
      .eq('event_id', eventId)
      .order('uploaded_at', { ascending: false })
    setPhotos(data || [])
  }

  const uploadPhotos = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    setUploading(true)
    for (const file of Array.from(files)) {
      const filePath = `${eventId}/${Date.now()}_${file.name}`
      const { error: uploadError } = await supabase.storage
        .from('photos')
        .upload(filePath, file)
      if (!uploadError) {
        await supabase.from('photos').insert([{
          event_id: eventId,
          storage_path: filePath,
          file_name: file.name,
          file_size: file.size
        }])
      }
    }
    fetchPhotos()
    setUploading(false)
  }

  const getPhotoUrl = (path: string) => {
    const { data } = supabase.storage.from('photos').getPublicUrl(path)
    return data.publicUrl
  }

  const downloadAll = () => {
    photos.forEach((photo) => {
      const link = document.createElement('a')
      link.href = getPhotoUrl(photo.storage_path)
      link.download = photo.file_name
      link.target = '_blank'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    })
  }

  return (
    <main className="min-h-screen bg-black text-white px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-1">{event?.name || 'Loading...'}</h1>
        <p className="text-gray-400 mb-6">Welcome, {guestName}</p>
        <div className="flex gap-3 mb-8">
          <label className="flex-1 py-3 rounded-xl bg-white text-black font-semibold text-center cursor-pointer hover:bg-gray-200 transition">
            {uploading ? 'Uploading...' : 'Upload Photos'}
            <input type="file" accept="image/*" multiple className="hidden" onChange={uploadPhotos} disabled={uploading} />
          </label>
          {photos.length > 0 && (
            <button onClick={downloadAll} className="flex-1 py-3 rounded-xl bg-gray-800 text-white font-semibold hover:bg-gray-700 transition">
              Download All ({photos.length})
            </button>
          )}
        </div>
        {photos.length === 0 ? (
          <p className="text-gray-500 text-center mt-20">No photos yet. Be the first to upload.</p>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {photos.map((photo) => (
              <div key={photo.id} className="relative group">
                <img src={getPhotoUrl(photo.storage_path)} alt={photo.file_name} className="w-full h-32 object-cover rounded-lg" />
                <a href={getPhotoUrl(photo.storage_path)} download={photo.file_name} target="_blank" rel="noopener noreferrer" className="absolute bottom-1 right-1 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition">save</a>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

export default function EventPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>}>
      <EventPageContent />
    </Suspense>
  )
}