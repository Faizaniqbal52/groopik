'use client'

import { useState, useEffect, Suspense, useRef, useCallback } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { BrandMark, SiteFooter } from '@/components/brand'
import './event.css'

type Photo = {
  id: string
  file_name: string
  storage_path: string
  public_url: string
  uploaded_by_name?: string
  session_token?: string
}

type EventInfo = {
  id: string
  name: string
  join_code: string
}

function EventPageContent() {
  const params = useParams()
  const searchParams = useSearchParams()
  const eventId = params.id as string
  const guestName = searchParams.get('name') || 'Guest'
  const sessionToken = searchParams.get('token') || ''
  const isHost = searchParams.get('name') === 'Host'

  const [event, setEvent] = useState<EventInfo | null>(null)
  const [eventMissing, setEventMissing] = useState(false)
  const [photos, setPhotos] = useState<Photo[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [deleting, setDeleting] = useState<string | null>(null)
  const [lightbox, setLightbox] = useState<Photo | null>(null)
  const [copied, setCopied] = useState(false)
  const cancelledRef = useRef(false)
  const abortControllerRef = useRef<AbortController | null>(null)

  const fetchEvent = useCallback(async () => {
    try {
      const response = await fetch(`/api/events?id=${eventId}`)
      const data = await response.json()
      if (response.ok) setEvent(data)
      else setEventMissing(true)
    } catch (err) {
      console.error('Failed to fetch event:', err)
    }
  }, [eventId])

  const fetchPhotos = useCallback(async () => {
    try {
      const response = await fetch(`/api/photos?eventId=${eventId}`)
      const data = await response.json()
      setPhotos(data.photos || [])
    } catch (err) {
      console.error('Failed to fetch photos:', err)
    }
  }, [eventId])

  useEffect(() => {
    // setState here only ever fires after an awaited fetch, never synchronously
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchEvent()
    fetchPhotos()
    const interval = setInterval(fetchPhotos, 5000)
    return () => clearInterval(interval)
  }, [fetchEvent, fetchPhotos])

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

  const cancelUpload = () => {
    cancelledRef.current = true
    abortControllerRef.current?.abort()
    setUploading(false)
    setUploadProgress(0)
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

    cancelledRef.current = false
    setUploading(true)
    setUploadProgress(0)

    const total = validFiles.length
    let done = 0

    for (const file of validFiles) {
      if (cancelledRef.current) break
      abortControllerRef.current = new AbortController()

      try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('eventId', eventId)
        formData.append('uploadedByName', guestName)
        formData.append('sessionToken', sessionToken)

        await fetch('/api/upload', {
          method: 'POST',
          body: formData,
          signal: abortControllerRef.current.signal
        })
      } catch (err) {
        if ((err as Error).name === 'AbortError') break
      }

      done++
      setUploadProgress(Math.round((done / total) * 100))
    }

    fetchPhotos()
    setUploading(false)
    setUploadProgress(0)
    e.target.value = ''
  }

  const deletePhoto = async (photo: Photo) => {
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

  const getPhotoUrl = (photo: Photo) => photo.public_url

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
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  const canDelete = (photo: Photo) => isHost || photo.session_token === sessionToken

  if (eventMissing) {
    return (
      <main className="event-page">
        <nav className="g-nav">
          <BrandMark />
        </nav>
        <div className="event-missing">
          <h1>We couldn&apos;t find that event.</h1>
          <p>The link may be wrong, or the event may have been removed. Check the join code with your host and try again.</p>
          <Link href="/join" className="g-btn g-btn-primary g-btn-lg">Join with a code</Link>
        </div>
        <SiteFooter />
      </main>
    )
  }

  return (
    <main className="event-page">
      {/* ─── Lightbox ─── */}
      {lightbox && (
        <div className="lightbox-overlay" onClick={() => setLightbox(null)}>
          <button className="lightbox-nav" onClick={e => { e.stopPropagation(); const idx = photos.findIndex(p => p.id === lightbox.id); if (idx > 0) setLightbox(photos[idx - 1]) }} style={{ left: 'var(--space-6)' }} aria-label="Previous photo">←</button>
          {/* eslint-disable-next-line @next/next/no-img-element -- R2-hosted user uploads, unknown dimensions */}
          <img src={getPhotoUrl(lightbox)} onClick={e => e.stopPropagation()} className="lightbox-img" alt={lightbox.file_name} />
          <button className="lightbox-nav" onClick={e => { e.stopPropagation(); const idx = photos.findIndex(p => p.id === lightbox.id); if (idx < photos.length - 1) setLightbox(photos[idx + 1]) }} style={{ right: 'var(--space-6)' }} aria-label="Next photo">→</button>

          <div className="lightbox-top" onClick={e => e.stopPropagation()}>
            <div>
              <div className="lightbox-name">{lightbox.file_name}</div>
              <div className="lightbox-by">by {lightbox.uploaded_by_name || 'Unknown'}</div>
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              <button className="g-btn g-btn-secondary" onClick={e => { e.stopPropagation(); downloadPhoto(getPhotoUrl(lightbox), lightbox.file_name) }}>Save</button>
              {canDelete(lightbox) && (
                <button className="g-btn g-btn-danger" onClick={e => { e.stopPropagation(); deletePhoto(lightbox) }}>Delete</button>
              )}
              <button className="g-btn g-btn-secondary" onClick={() => setLightbox(null)} aria-label="Close">✕</button>
            </div>
          </div>

          <div className="lightbox-counter">
            {photos.findIndex(p => p.id === lightbox.id) + 1} / {photos.length}
          </div>
        </div>
      )}

      {/* ─── Nav ─── */}
      <nav className="g-nav">
        <BrandMark />
        <div className="g-nav-actions">
          {event && (
            <div className="g-badge g-hide-mobile">
              <span>{event.name}</span>
              <span style={{ opacity: 0.5 }}>·</span>
              <span style={{ fontVariantNumeric: 'tabular-nums', letterSpacing: '0.08em' }}>{event.join_code}</span>
            </div>
          )}
          {isHost && <div className="g-badge">Host</div>}
          <button className="g-btn g-btn-secondary" onClick={shareLink}>
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M7 2v8M3 6l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            {copied ? 'Copied!' : 'Share link'}
          </button>
        </div>
      </nav>

      {/* ─── Main ─── */}
      <div className="event-main">
        <div className="event-header g-animate-in">
          <div>
            <h1 className="event-title">{event?.name || 'Loading…'}</h1>
            <p className="event-welcome">
              Welcome, <strong>{guestName}</strong>
              {photos.length > 0 && <span> · {photos.length} photo{photos.length !== 1 ? 's' : ''}</span>}
            </p>
          </div>
          <div className="event-actions">
            <label className="g-btn g-btn-secondary g-btn-lg" style={{ cursor: uploading ? 'not-allowed' : 'pointer', opacity: uploading ? 0.6 : 1 }}>
              {uploading ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 14 14" style={{ animation: 'g-spin 1s linear infinite' }}>
                    <circle cx="7" cy="7" r="5.5" fill="none" stroke="var(--line)" strokeWidth="1.5"/>
                    <path d="M7 1.5 A5.5 5.5 0 0 1 12.5 7" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  {uploadProgress}%
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M7 10V4M4 7l3-3 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 11h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  Upload photos
                </>
              )}
              <input id="upload-input-top" type="file" accept="image/*" multiple onChange={uploadPhotos} disabled={uploading} />
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
                Download all ({photos.length})
              </button>
            )}
          </div>
        </div>

        {uploading && (
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${uploadProgress}%` }} />
          </div>
        )}

        {selected.size > 0 && (
          <div className="g-card g-card-accent g-animate-in selection-bar">
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <span className="selection-count">{selected.size} photo{selected.size !== 1 ? 's' : ''} selected</span>
              <button className="g-btn g-btn-ghost" onClick={clearSelection}>Clear</button>
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              <button className="g-btn g-btn-secondary" onClick={selectAll}>Select all</button>
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
            <label className="drag-zone" htmlFor="upload-input-empty" style={{ width: '100%', maxWidth: 500 }}>
              <div className="drag-zone-icon">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <rect x="3" y="6" width="26" height="20" rx="4" stroke="currentColor" strokeWidth="1.5"/>
                  <circle cx="11" cy="13" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M3 22l8-6 5 5 4-3 9 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p style={{ fontFamily: 'var(--display)', fontSize: 'var(--text-lg)', fontWeight: 600, color: 'var(--ink)', margin: 0 }}>No photos yet</p>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-soft)', margin: 0 }}>Be the first — click here to upload</p>
              <span className="g-btn g-btn-primary g-btn-lg" style={{ marginTop: 'var(--space-2)', pointerEvents: 'none' }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 10V4M4 7l3-3 3 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Upload photos
              </span>
              <input id="upload-input-empty" type="file" accept="image/*" multiple onChange={uploadPhotos} />
            </label>
          </div>
        ) : (
          <div className="photo-grid">
            {photos.map((photo, i) => {
              const isSelected = selected.has(photo.id)
              const isDeleting = deleting === photo.id
              const showDelete = canDelete(photo)
              return (
                <div key={photo.id} className="photo-item g-settle-in" style={{ animationDelay: `${Math.min(i, 12) * 40}ms`, outline: isSelected ? '2px solid var(--sunset)' : 'none', outlineOffset: 2, opacity: isDeleting ? 0.4 : 1 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element -- R2-hosted user uploads, unknown dimensions */}
                  <img
                    src={getPhotoUrl(photo)}
                    alt={photo.file_name}
                    onClick={() => setLightbox(photo)}
                    style={{ filter: isSelected ? 'brightness(0.75)' : 'none' }}
                    loading="lazy"
                  />

                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={isSelected}
                    aria-label={isSelected ? 'Deselect photo' : 'Select photo'}
                    className={`checkbox-el${isSelected ? ' is-checked' : ''}`}
                    onClick={e => { e.stopPropagation(); toggleSelect(photo.id) }}
                  >
                    {isSelected && <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  </button>

                  {photo.uploaded_by_name && (
                    <div className={`photo-chip${photo.uploaded_by_name === guestName ? ' photo-chip--you' : ''}`}>
                      {photo.uploaded_by_name === guestName ? 'You' : photo.uploaded_by_name}
                    </div>
                  )}

                  <div className="photo-overlay">
                    <button className="g-btn g-btn-secondary photo-mini-btn" onClick={e => { e.stopPropagation(); downloadPhoto(getPhotoUrl(photo), photo.file_name) }}>
                      <svg width="11" height="11" viewBox="0 0 14 14" fill="none"><path d="M7 4v6M4 8l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 11h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                      Save
                    </button>
                    {showDelete && (
                      <button className="g-btn g-btn-danger photo-mini-btn" onClick={e => { e.stopPropagation(); deletePhoto(photo) }} disabled={isDeleting}>
                        <svg width="11" height="11" viewBox="0 0 14 14" fill="none"><path d="M2 4h10M5 4V2h4v2M6 7v4M8 7v4M3 4l1 8h6l1-8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        {isDeleting ? '…' : 'Delete'}
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <SiteFooter />
    </main>
  )
}

export default function EventPage() {
  return (
    <Suspense fallback={<div style={{ background: 'var(--paper)', minHeight: '100vh' }} />}>
      <EventPageContent />
    </Suspense>
  )
}
