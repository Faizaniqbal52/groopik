'use client'

import { useState, useEffect, Suspense } from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

function EventPageContent() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const eventId = params.id as string
  const guestName = searchParams.get('name') || 'Guest'
  const sessionToken = searchParams.get('token') || ''


  const [event, setEvent] = useState<any>(null)
  const [photos, setPhotos] = useState<any[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    fetchEvent()
    fetchPhotos()
    const channel = supabase
      .channel('photos')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'photos', filter: `event_id=eq.${eventId}` }, () => { fetchPhotos() })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'photos', filter: `event_id=eq.${eventId}` }, () => { fetchPhotos() })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [])

  const fetchEvent = async () => {
    const { data } = await supabase.from('events').select('*').eq('id', eventId).single()
    setEvent(data)
  }

  const fetchPhotos = async () => {
    const { data } = await supabase.from('photos').select('*').eq('event_id', eventId).order('uploaded_at', { ascending: false })
    setPhotos(data || [])
  }

  const uploadPhotos = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    setUploading(true)
    setUploadProgress(0)
    const total = files.length
    let done = 0
    for (const file of Array.from(files)) {
      // Random string ensures duplicate files always get unique paths
      const random = Math.random().toString(36).substring(2, 8)
      const filePath = `${eventId}/${Date.now()}_${random}_${file.name}`
      const { error: uploadError } = await supabase.storage.from('photos').upload(filePath, file)
      if (!uploadError) {
        await supabase.from('photos').insert([{
          event_id: eventId,
          storage_path: filePath,
          file_name: file.name,
          file_size: file.size,
          uploaded_by_name: guestName,
          session_token: sessionToken
        }])
      }
      done++
      setUploadProgress(Math.round((done / total) * 100))
    }
    fetchPhotos()
    setUploading(false)
    setUploadProgress(0)
    // Reset input so same files can be uploaded again
    e.target.value = ''
  }

  const deletePhoto = async (photo: any) => {
    if (!confirm('Delete this photo? This cannot be undone.')) return
    setDeleting(photo.id)
    await supabase.storage.from('photos').remove([photo.storage_path])
    await supabase.from('photos').delete().eq('id', photo.id)
    setPhotos(prev => prev.filter(p => p.id !== photo.id))
    setSelected(prev => { const n = new Set(prev); n.delete(photo.id); return n })
    setDeleting(null)
  }

  const getPhotoUrl = (path: string) => {
    const { data } = supabase.storage.from('photos').getPublicUrl(path)
    return data.publicUrl
  }

  const downloadPhoto = async (url: string, fileName: string) => {
    try {
      const response = await fetch(url)
      const blob = await response.blob()
      const blobUrl = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = blobUrl
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(blobUrl)
    } catch {
      window.open(url, '_blank')
    }
  }

  const downloadAll = () => {
    photos.forEach(photo => downloadPhoto(getPhotoUrl(photo.storage_path), photo.file_name))
  }

  const toggleSelect = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const selectAll = () => setSelected(new Set(photos.map(p => p.id)))
  const clearSelection = () => setSelected(new Set())

  const downloadSelected = () => {
    photos.filter(p => selected.has(p.id)).forEach(p => downloadPhoto(getPhotoUrl(p.storage_path), p.file_name))
  }

  const shareLink = () => {
    const link = `${window.location.origin}/join?code=${event?.join_code}`
    navigator.clipboard.writeText(link)
    alert('Link copied to clipboard!')
  }

  return (
    <main style={{ fontFamily: "-apple-system,'Helvetica Neue',Helvetica,Arial,sans-serif", background: '#080c14', minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes photoIn{from{opacity:0;transform:scale(0.95)}to{opacity:1;transform:scale(1)}}
        .photo-item:hover .photo-actions{opacity:1!important;}
        .upload-btn:hover{background:rgba(59,130,246,0.1)!important;border-color:rgba(59,130,246,0.3)!important;}
        input[type=file]{display:none;}
      `}</style>

      <div style={{ position: 'fixed', inset: 0, backgroundImage: 'linear-gradient(rgba(59,130,246,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(59,130,246,0.02) 1px,transparent 1px)', backgroundSize: '48px 48px', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', top: -120, right: -80, width: 480, height: 480, background: 'radial-gradient(circle,rgba(59,130,246,0.06) 0%,transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      {/* Nav */}
      <nav style={{ position: 'relative', zIndex: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 48px', height: 64, borderBottom: '1px solid rgba(255,255,255,0.05)', flexShrink: 0 }}>
        <div onClick={() => router.push('/')} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
          <svg width="32" height="32" viewBox="0 0 44 44">
            <rect x="2" y="2" width="40" height="40" rx="10" fill="#3b82f6"/>
            <path d="M28,14 Q22,10 16,14 Q10,18 10,22 Q10,26 14,29 Q18,32 23,31 Q27,30 28,27 L28,22 L22,22" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, letterSpacing: '-0.04em', color: 'white', lineHeight: 1 }}>GROOPIK</div>
            <div style={{ fontSize: 8, letterSpacing: '0.15em', color: 'rgba(255,255,255,0.18)', textTransform: 'uppercase', marginTop: 1 }}>Collect every moment</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {event && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8, padding: '6px 14px' }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 5px #4ade80' }} />
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>{event.name}</span>
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)' }}>·</span>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace', letterSpacing: '0.1em' }}>{event.join_code}</span>
            </div>
          )}
          <button onClick={shareLink} style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', color: 'rgba(100,160,255,0.8)', padding: '7px 16px', borderRadius: 6, fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit' }}>
            Share link
          </button>
        </div>
      </nav>

      {/* Main */}
      <div style={{ position: 'relative', zIndex: 10, flex: 1, maxWidth: 1100, margin: '0 auto', width: '100%', padding: '32px 48px', boxSizing: 'border-box' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, opacity: 0, animation: 'fadeUp 0.5s ease 0.1s forwards' }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.04em', color: 'white', margin: 0, lineHeight: 1 }}>
              {event?.name || 'Loading...'}
            </h1>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', margin: '6px 0 0' }}>
              Welcome, <span style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>{guestName}</span>
              {photos.length > 0 && <span> · {photos.length} photo{photos.length !== 1 ? 's' : ''}</span>}
            </p>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <label className="upload-btn" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'white', cursor: uploading ? 'not-allowed' : 'pointer', transition: 'all 0.2s', opacity: uploading ? 0.6 : 1 }}>
              {uploading ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 14 14" style={{ animation: 'spin 1s linear infinite' }}>
                    <circle cx="7" cy="7" r="5.5" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5"/>
                    <path d="M7 1.5 A5.5 5.5 0 0 1 12.5 7" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  {uploadProgress}%
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M7 10V4M4 7l3-3 3 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 11h10" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  Upload photos
                </>
              )}
              <input type="file" accept="image/*" multiple onChange={uploadPhotos} disabled={uploading} />
            </label>

            {photos.length > 0 && selected.size === 0 && (
              <button onClick={downloadAll} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: '#3b82f6', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'white', cursor: 'pointer', fontFamily: 'inherit' }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 4v6M4 8l3 3 3-3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 11h10" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                Download all ({photos.length})
              </button>
            )}
          </div>
        </div>

        {/* Upload progress */}
        {uploading && (
          <div style={{ marginBottom: 20, background: 'rgba(255,255,255,0.04)', borderRadius: 4, overflow: 'hidden', height: 3 }}>
            <div style={{ height: '100%', background: '#3b82f6', width: `${uploadProgress}%`, transition: 'width 0.3s ease', borderRadius: 4 }} />
          </div>
        )}

        {/* Selection bar */}
        {selected.size > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, padding: '12px 16px', background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 10, animation: 'fadeUp 0.3s ease forwards' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 13, color: 'rgba(100,160,255,0.9)', fontWeight: 600 }}>{selected.size} photo{selected.size !== 1 ? 's' : ''} selected</span>
              <button onClick={clearSelection} style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Clear</button>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={selectAll} style={{ padding: '7px 14px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontFamily: 'inherit', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Select all
              </button>
              <button onClick={downloadSelected} style={{ padding: '7px 16px', background: '#3b82f6', border: 'none', borderRadius: 6, fontSize: 11, fontWeight: 700, color: 'white', cursor: 'pointer', fontFamily: 'inherit', letterSpacing: '0.06em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 6 }}>
                <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                  <path d="M7 4v6M4 8l3 3 3-3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Download {selected.size}
              </button>
            </div>
          </div>
        )}

        {/* Gallery */}
        {photos.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 360, opacity: 0, animation: 'fadeUp 0.5s ease 0.2s forwards' }}>
            <div style={{ width: 64, height: 64, borderRadius: 16, background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <rect x="2" y="5" width="24" height="18" rx="3" stroke="rgba(59,130,246,0.6)" strokeWidth="1.5"/>
                <circle cx="9" cy="11" r="2" stroke="rgba(59,130,246,0.6)" strokeWidth="1.5"/>
                <path d="M2 19l7-5 4 4 4-3 9 5" stroke="rgba(59,130,246,0.6)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <p style={{ fontSize: 16, fontWeight: 600, color: 'rgba(255,255,255,0.4)', margin: 0 }}>No photos yet</p>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.2)', margin: '6px 0 0' }}>Be the first to upload</p>
          </div>
        ) : (
          <div style={{ columns: '4 200px', gap: 10, opacity: 0, animation: 'fadeUp 0.5s ease 0.2s forwards' }}>
            {photos.map((photo, i) => {
              const isSelected = selected.has(photo.id)
              const isMine = photo.session_token === sessionToken
              const isDeleting = deleting === photo.id
              return (
                <div
                  key={photo.id}
                  className="photo-item"
                  onClick={() => toggleSelect(photo.id)}
                  style={{ breakInside: 'avoid', marginBottom: 10, borderRadius: 10, overflow: 'hidden', animation: `photoIn 0.4s ease ${i * 0.04}s both`, position: 'relative', cursor: 'pointer', outline: isSelected ? '2px solid #3b82f6' : '2px solid transparent', outlineOffset: 2, opacity: isDeleting ? 0.4 : 1, transition: 'opacity 0.2s' }}
                >
                  <img
                    src={getPhotoUrl(photo.storage_path)}
                    alt={photo.file_name}
                    style={{ width: '100%', display: 'block', borderRadius: 10, filter: isSelected ? 'brightness(0.7)' : 'brightness(1)', transition: 'filter 0.15s ease' }}
                    loading="lazy"
                  />

                  {/* Checkbox */}
                  <div style={{ position: 'absolute', top: 8, left: 8, width: 22, height: 22, borderRadius: 6, background: isSelected ? '#3b82f6' : 'rgba(0,0,0,0.5)', border: isSelected ? '2px solid #3b82f6' : '2px solid rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s ease' }}>
                    {isSelected && (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>

                  {/* Uploader name */}
                  {photo.uploaded_by_name && (
                    <div style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.6)', borderRadius: 5, padding: '3px 7px', fontSize: 9, color: 'rgba(255,255,255,0.7)', fontWeight: 600, letterSpacing: '0.04em' }}>
                      {isMine ? 'You' : photo.uploaded_by_name}
                    </div>
                  )}

                  {/* Actions — show on hover */}
                  <div className="photo-actions" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px 8px 8px', background: 'linear-gradient(transparent, rgba(0,0,0,0.7))', opacity: 0, transition: 'opacity 0.2s', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderRadius: '0 0 10px 10px' }}>
                    {/* Download single */}
                    <button
                      onClick={e => { e.stopPropagation(); downloadPhoto(getPhotoUrl(photo.storage_path), photo.file_name) }}
                      style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 6, padding: '5px 10px', fontSize: 10, fontWeight: 700, color: 'white', cursor: 'pointer', letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: 'inherit' }}
                    >
                      <svg width="11" height="11" viewBox="0 0 14 14" fill="none">
                        <path d="M7 4v6M4 8l3 3 3-3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M2 11h10" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                      Save
                    </button>

                    {/* Delete — only show for photos you uploaded */}
                    {isMine && (
                      <button
                        onClick={e => { e.stopPropagation(); deletePhoto(photo) }}
                        disabled={isDeleting}
                        style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 6, padding: '5px 10px', fontSize: 10, fontWeight: 700, color: 'rgba(255,100,100,0.9)', cursor: 'pointer', letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: 'inherit' }}
                      >
                        <svg width="11" height="11" viewBox="0 0 14 14" fill="none">
                          <path d="M2 4h10M5 4V2h4v2M6 7v4M8 7v4M3 4l1 8h6l1-8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        {isDeleting ? '...' : 'Delete'}
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ position: 'relative', zIndex: 10, borderTop: '1px solid rgba(255,255,255,0.05)', padding: '14px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: 32 }}>
          {['No install', 'Instant gallery', 'Share via QR'].map(t => (
            <span key={t} style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 500 }}>{t}</span>
          ))}
        </div>
        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.15)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>© 2025 Groopik</span>
      </div>
    </main>
  )
}

export default function EventPage() {
  return (
    <Suspense fallback={<div style={{ background: '#080c14', minHeight: '100vh' }} />}>
      <EventPageContent />
    </Suspense>
  )
}