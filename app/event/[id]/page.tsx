'use client'

import { useState, useEffect, Suspense, useRef } from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'


function EventPageContent() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const eventId = params.id as string
  const guestName = searchParams.get('name') || 'Guest'
  const sessionToken = searchParams.get('token') || ''
  const isHost = searchParams.get('name') === 'Host'

  const [event, setEvent] = useState<any>(null)
  const [photos, setPhotos] = useState<any[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [deleting, setDeleting] = useState<string | null>(null)
  const [lightbox, setLightbox] = useState<any | null>(null)
  const [cancelled, setCancelled] = useState(false)
  const abortControllerRef = useRef<AbortController | null>(null)

  useEffect(() => {
    fetchEvent()
    fetchPhotos()
    const interval = setInterval(fetchPhotos, 5000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(null)
      if (e.key === 'ArrowRight' && lightbox) {
        const idx = photos.findIndex(p => p.id === lightbox.id)
        if (idx < photos.length - 1) setLightbox(photos[idx + 1])
      }
      if (e.key === 'ArrowLeft' && lightbox) {
        const idx = photos.findIndex(p => p.id === lightbox.id)
        if (idx > 0) setLightbox(photos[idx - 1])
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [lightbox, photos])

  const fetchEvent = async () => {
    try {
      const response = await fetch(`/api/events?id=${eventId}`)
      const data = await response.json()
      if (response.ok) setEvent(data)
    } catch (err) {
      console.error('Failed to fetch event:', err)
    }
  }

  const fetchPhotos = async () => {
    try {
      const response = await fetch(`/api/photos?eventId=${eventId}`)
      const data = await response.json()
      setPhotos(data.photos || [])
    } catch (err) {
      console.error('Failed to fetch photos:', err)
    }
  }

  const cancelUpload = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      setCancelled(true)
      setUploading(false)
      setUploadProgress(0)
    }
  }

  const uploadPhotos = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/heic', 'image/heif']
    const maxSize = 15 * 1024 * 1024
    const maxPhotos = 20

    if (photos.filter(p => p.session_token === sessionToken).length >= maxPhotos) {
      alert(`You have reached the maximum of ${maxPhotos} photos per session.`)
      e.target.value = ''
      return
    }

    const validFiles: File[] = []
    const errors: string[] = []

    for (const file of Array.from(files)) {
      if (!allowedTypes.includes(file.type)) {
        errors.push(`${file.name} is not a supported image format`)
        continue
      }
      if (file.size > maxSize) {
        errors.push(`${file.name} is too large (max 15MB)`)
        continue
      }
      validFiles.push(file)
    }

    if (errors.length > 0) alert(`Some files were skipped:\n\n${errors.join('\n')}`)
    if (validFiles.length === 0) { e.target.value = ''; return }

    setCancelled(false)
    setUploading(true)
    setUploadProgress(0)

    const total = validFiles.length
    let done = 0

    for (const file of validFiles) {
      if (cancelled) break
      abortControllerRef.current = new AbortController()

      try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('eventId', eventId)
        formData.append('uploadedByName', guestName)
        formData.append('sessionToken', sessionToken)

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
          signal: abortControllerRef.current.signal
        })

        if (response.ok) {
          const { url, filePath } = await response.json()
        }
      } catch (err: any) {
        if (err.name === 'AbortError') break
      }

      done++
      setUploadProgress(Math.round((done / total) * 100))
    }

    fetchPhotos()
    setUploading(false)
    setUploadProgress(0)
    e.target.value = ''
  }

  const deletePhoto = async (photo: any) => {
    if (!confirm('Delete this photo? This cannot be undone.')) return
    setDeleting(photo.id)
    try {
      await fetch('/api/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filePath: photo.storage_path, eventId, photoId: photo.id })
      })
      setPhotos(prev => prev.filter(p => p.id !== photo.id))
      setSelected(prev => { const n = new Set(prev); n.delete(photo.id); return n })
      if (lightbox?.id === photo.id) setLightbox(null)
    } catch (err) {
      console.error('Delete error:', err)
    }
    setDeleting(null)
  }

  const getPhotoUrl = (photo: any) => photo.public_url

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

  const downloadAll = () => photos.forEach(p => downloadPhoto(getPhotoUrl(p), p.file_name))
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
  const downloadSelected = () => photos.filter(p => selected.has(p.id)).forEach(p => downloadPhoto(getPhotoUrl(p), p.file_name))
  const shareLink = () => {
    const link = `${window.location.origin}/join?code=${event?.join_code}`
    navigator.clipboard.writeText(link)
    alert('Link copied!')
  }
  const canDelete = (photo: any) => isHost || photo.session_token === sessionToken

  return (
    <main style={{ background: 'var(--color-bg-primary)', minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <style>{`
        .photo-item { position: relative; break-inside: avoid; margin-bottom: var(--space-3); border-radius: var(--radius-md); overflow: hidden; transition: transform var(--duration-normal) var(--ease-out); }
        .photo-item:hover { transform: scale(1.015); z-index: 2; }
        .photo-item .photo-overlay { opacity: 0; transition: opacity var(--duration-normal) var(--ease-out); }
        .photo-item:hover .photo-overlay { opacity: 1; }
        .photo-item .checkbox-el { opacity: 0; transition: opacity var(--duration-fast) var(--ease-out); }
        .photo-item:hover .checkbox-el { opacity: 1; }
        .photo-item .checkbox-el.is-checked { opacity: 1; }
        .photo-item img { width: 100%; display: block; transition: filter var(--duration-normal) var(--ease-out); }
        .lightbox-overlay { position: fixed; inset: 0; background: rgba(6,8,13,0.95); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); z-index: 100; display: flex; align-items: center; justify-content: center; animation: g-fade-in 0.25s ease; }
        .lightbox-img { max-width: 88vw; max-height: 85vh; object-fit: contain; border-radius: var(--radius-lg); box-shadow: var(--shadow-xl); }
        .lightbox-nav { position: absolute; background: var(--color-bg-surface); border: 1px solid var(--color-border); border-radius: var(--radius-md); color: var(--color-text-primary); padding: var(--space-3) var(--space-4); font-size: var(--text-lg); cursor: pointer; transition: all var(--duration-fast) var(--ease-out); font-family: var(--font-sans); }
        .lightbox-nav:hover { background: var(--color-bg-surface-hover); border-color: var(--color-border-hover); }
        .progress-bar { height: 4px; background: var(--color-bg-surface); border-radius: var(--radius-full); overflow: hidden; margin-bottom: var(--space-5); }
        .progress-fill { height: 100%; background: var(--gradient-accent); border-radius: var(--radius-full); transition: width 0.3s var(--ease-out); box-shadow: var(--shadow-glow); }
        .drag-zone { border: 2px dashed var(--color-border); border-radius: var(--radius-xl); padding: var(--space-16) var(--space-8); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: var(--space-4); cursor: pointer; transition: all var(--duration-normal) var(--ease-out); }
        .drag-zone:hover { border-color: var(--color-accent-border); background: var(--color-accent-dim); }
        @media (max-width: 768px) {
          .event-header { flex-direction: column !important; align-items: flex-start !important; gap: var(--space-4) !important; }
          .event-actions { width: 100%; }
          .event-actions > * { flex: 1; }
        }
      `}</style>

      <div className="g-bg-grid" />
      <div className="g-bg-glow g-bg-glow-1" />

      {/* ─── Lightbox ─── */}
      {lightbox && (
        <div className="lightbox-overlay" onClick={() => setLightbox(null)}>
          <button className="lightbox-nav" onClick={e => { e.stopPropagation(); const idx = photos.findIndex(p => p.id === lightbox.id); if (idx > 0) setLightbox(photos[idx - 1]) }} style={{ left: 'var(--space-6)' }}>←</button>
          <img src={getPhotoUrl(lightbox)} onClick={e => e.stopPropagation()} className="lightbox-img" alt={lightbox.file_name} />
          <button className="lightbox-nav" onClick={e => { e.stopPropagation(); const idx = photos.findIndex(p => p.id === lightbox.id); if (idx < photos.length - 1) setLightbox(photos[idx + 1]) }} style={{ right: 'var(--space-6)' }}>→</button>

          {/* Top bar */}
          <div onClick={e => e.stopPropagation()} style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: 'var(--space-4) var(--space-6)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(to bottom, rgba(6,8,13,0.8), transparent)' }}>
            <div>
              <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text-primary)' }}>{lightbox.file_name}</div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginTop: 2 }}>by {lightbox.uploaded_by_name || 'Unknown'}</div>
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              <button className="g-btn g-btn-secondary" onClick={e => { e.stopPropagation(); downloadPhoto(getPhotoUrl(lightbox), lightbox.file_name) }}>Save</button>
              {canDelete(lightbox) && (
                <button className="g-btn g-btn-danger" onClick={e => { e.stopPropagation(); deletePhoto(lightbox) }}>Delete</button>
              )}
              <button className="g-btn g-btn-secondary" onClick={() => setLightbox(null)}>✕</button>
            </div>
          </div>

          {/* Counter */}
          <div style={{ position: 'absolute', bottom: 'var(--space-6)', left: '50%', transform: 'translateX(-50%)', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', letterSpacing: 'var(--tracking-wide)', fontFamily: 'var(--font-mono)' }}>
            {photos.findIndex(p => p.id === lightbox.id) + 1} / {photos.length}
          </div>
        </div>
      )}

      {/* ─── Nav ─── */}
      <nav className="g-nav">
        <div className="g-nav-logo" onClick={() => router.push('/')}>
          <svg width="32" height="32" viewBox="0 0 44 44">
            <rect x="2" y="2" width="40" height="40" rx="10" fill="var(--color-accent)"/>
            <path d="M28,14 Q22,10 16,14 Q10,18 10,22 Q10,26 14,29 Q18,32 23,31 Q27,30 28,27 L28,22 L22,22" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div>
            <div className="g-nav-brand">GROOPIK</div>
            <div className="g-nav-tagline">Collect every moment</div>
          </div>
        </div>
        <div className="g-nav-actions">
          {event && (
            <div className="g-badge g-hide-mobile">
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-success)', boxShadow: '0 0 6px var(--color-success)', animation: 'g-pulse 2s infinite' }} />
              <span>{event.name}</span>
              <span style={{ color: 'var(--color-text-muted)' }}>·</span>
              <span style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.1em' }}>{event.join_code}</span>
            </div>
          )}
          {isHost && (
            <div className="g-badge" style={{ background: 'var(--color-accent-dim)', borderColor: 'var(--color-accent-border)' }}>Host</div>
          )}
          <button className="g-btn g-btn-secondary" onClick={shareLink}>
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M7 2v8M3 6l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Share Link
          </button>
        </div>
      </nav>

      {/* ─── Main Content ─── */}
      <div style={{ position: 'relative', zIndex: 10, flex: 1, maxWidth: 'var(--max-width)', margin: '0 auto', width: '100%', padding: 'var(--space-8) var(--content-padding)', boxSizing: 'border-box' }}>

        {/* Header */}
        <div className="event-header g-animate-in" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-8)' }}>
          <div>
            <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, letterSpacing: 'var(--tracking-tight)', color: 'var(--color-text-primary)', margin: 0, lineHeight: 'var(--leading-tight)' }}>
              {event?.name || 'Loading...'}
            </h1>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)', margin: 'var(--space-2) 0 0' }}>
              Welcome, <span style={{ color: 'var(--color-text-secondary)', fontWeight: 600 }}>{guestName}</span>
              {photos.length > 0 && <span> · {photos.length} photo{photos.length !== 1 ? 's' : ''}</span>}
            </p>
          </div>
          <div className="event-actions" style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
            <label className="g-btn g-btn-secondary g-btn-lg" style={{ cursor: uploading ? 'not-allowed' : 'pointer', opacity: uploading ? 0.6 : 1 }}>
              {uploading ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 14 14" style={{ animation: 'g-spin 1s linear infinite' }}>
                    <circle cx="7" cy="7" r="5.5" fill="none" stroke="var(--color-text-tertiary)" strokeWidth="1.5"/>
                    <path d="M7 1.5 A5.5 5.5 0 0 1 12.5 7" fill="none" stroke="var(--color-text-primary)" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  {uploadProgress}%
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M7 10V4M4 7l3-3 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 11h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  Upload Photos
                </>
              )}
              <input type="file" accept="image/*" multiple onChange={uploadPhotos} disabled={uploading} />
            </label>

            {uploading && (
              <button className="g-btn g-btn-danger g-btn-lg" onClick={cancelUpload}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
                Cancel
              </button>
            )}

            {photos.length > 0 && selected.size === 0 && !uploading && (
              <button className="g-btn g-btn-primary g-btn-lg" onClick={downloadAll}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 4v6M4 8l3 3 3-3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 11h10" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                Download All ({photos.length})
              </button>
            )}
          </div>
        </div>

        {/* Progress bar */}
        {uploading && (
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${uploadProgress}%` }} />
          </div>
        )}

        {/* Selection bar */}
        {selected.size > 0 && (
          <div className="g-card g-card-accent g-animate-in" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-5)', padding: 'var(--space-3) var(--space-4)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-accent-light)', fontWeight: 600 }}>{selected.size} photo{selected.size !== 1 ? 's' : ''} selected</span>
              <button className="g-btn g-btn-ghost" onClick={clearSelection}>Clear</button>
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              <button className="g-btn g-btn-secondary" onClick={selectAll}>Select All</button>
              <button className="g-btn g-btn-primary" onClick={downloadSelected}>
                <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M7 4v6M4 8l3 3 3-3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Download {selected.size}
              </button>
            </div>
          </div>
        )}

        {/* ─── Gallery ─── */}
        {photos.length === 0 ? (
          <div className="g-animate-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
            <label className="drag-zone" style={{ width: '100%', maxWidth: 500 }}>
              <div style={{ width: 72, height: 72, borderRadius: 'var(--radius-lg)', background: 'var(--color-accent-dim)', border: '1px solid var(--color-accent-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <rect x="3" y="6" width="26" height="20" rx="4" stroke="var(--color-accent-light)" strokeWidth="1.5"/>
                  <circle cx="11" cy="13" r="2.5" stroke="var(--color-accent-light)" strokeWidth="1.5"/>
                  <path d="M3 22l8-6 5 5 4-3 9 6" stroke="var(--color-accent-light)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--color-text-secondary)', margin: 0 }}>No photos yet</p>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)', margin: 0 }}>Click here or drag photos to upload</p>
              <button className="g-btn g-btn-primary g-btn-lg" style={{ marginTop: 'var(--space-2)', pointerEvents: 'none' }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 10V4M4 7l3-3 3 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Upload Photos
              </button>
              <input type="file" accept="image/*" multiple onChange={uploadPhotos} />
            </label>
          </div>
        ) : (
          <div className="g-animate-in g-animate-in-delay-1" style={{ columns: '4 220px', gap: 'var(--space-3)' }}>
            {photos.map((photo, i) => {
              const isSelected = selected.has(photo.id)
              const isDeleting = deleting === photo.id
              const showDelete = canDelete(photo)
              return (
                <div key={photo.id} className="photo-item" style={{ animation: `g-scale-in 0.4s var(--ease-out) ${i * 0.04}s both`, outline: isSelected ? '2px solid var(--color-accent)' : '2px solid transparent', outlineOffset: 2, opacity: isDeleting ? 0.4 : 1 }}>
                  <img
                    src={getPhotoUrl(photo)}
                    alt={photo.file_name}
                    onClick={() => setLightbox(photo)}
                    style={{ cursor: 'zoom-in', filter: isSelected ? 'brightness(0.7)' : 'brightness(1)', borderRadius: 'var(--radius-md)' }}
                    loading="lazy"
                  />

                  {/* Checkbox */}
                  <div className={`checkbox-el${isSelected ? ' is-checked' : ''}`} onClick={e => { e.stopPropagation(); toggleSelect(photo.id) }} style={{ position: 'absolute', top: 'var(--space-2)', left: 'var(--space-2)', width: 22, height: 22, borderRadius: 'var(--radius-sm)', background: isSelected ? 'var(--color-accent)' : 'rgba(0,0,0,0.5)', border: isSelected ? '2px solid var(--color-accent)' : '2px solid rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 3, transition: 'all var(--duration-fast) var(--ease-out)' }}>
                    {isSelected && <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  </div>

                  {/* Uploader badge */}
                  {photo.uploaded_by_name && (
                    <div style={{ position: 'absolute', top: 'var(--space-2)', right: 'var(--space-2)', background: 'rgba(6,8,13,0.7)', backdropFilter: 'blur(8px)', borderRadius: 'var(--radius-sm)', padding: '3px 8px', fontSize: '0.5625rem', color: 'var(--color-text-secondary)', fontWeight: 600, letterSpacing: '0.04em', zIndex: 3 }}>
                      {photo.uploaded_by_name === guestName ? 'You' : photo.uploaded_by_name}
                    </div>
                  )}

                  {/* Bottom actions overlay */}
                  <div className="photo-overlay" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 'var(--space-8) var(--space-2) var(--space-2)', background: 'linear-gradient(transparent, rgba(6,8,13,0.8))', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderRadius: '0 0 var(--radius-md) var(--radius-md)', zIndex: 2 }}>
                    <button className="g-btn g-btn-secondary" style={{ fontSize: '0.5625rem', padding: '4px 8px' }} onClick={e => { e.stopPropagation(); downloadPhoto(getPhotoUrl(photo), photo.file_name) }}>
                      <svg width="11" height="11" viewBox="0 0 14 14" fill="none"><path d="M7 4v6M4 8l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 11h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                      Save
                    </button>
                    {showDelete && (
                      <button className="g-btn g-btn-danger" style={{ fontSize: '0.5625rem', padding: '4px 8px' }} onClick={e => { e.stopPropagation(); deletePhoto(photo) }} disabled={isDeleting}>
                        <svg width="11" height="11" viewBox="0 0 14 14" fill="none"><path d="M2 4h10M5 4V2h4v2M6 7v4M8 7v4M3 4l1 8h6l1-8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
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

      {/* ─── Footer ─── */}
      <footer className="g-footer">
        <div className="g-footer-links">
          <span className="g-footer-link g-hide-mobile">No install</span>
          <span className="g-footer-link g-hide-mobile">Instant gallery</span>
          <span className="g-footer-link g-hide-mobile">Share via QR</span>
        </div>
        <span className="g-footer-copy">© 2026 Groopik</span>
      </footer>
    </main>
  )
}

export default function EventPage() {
  return (
    <Suspense fallback={<div style={{ background: 'var(--color-bg-primary)', minHeight: '100vh' }} />}>
      <EventPageContent />
    </Suspense>
  )
}