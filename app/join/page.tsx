'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { BrandMark, SiteFooter } from '@/components/brand'
import './join.css'

function JoinContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [joinCode, setJoinCode] = useState(() => (searchParams.get('code') || '').toUpperCase())
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [error, setError] = useState('')

  const joinEvent = async () => {
    if (!joinCode.trim() || !name.trim() || !agreed) return
    setLoading(true)
    setError('')
    try {
      const response = await fetch(`/api/events?code=${joinCode.toUpperCase()}`)
      const data = await response.json()
      if (!response.ok || !data.id) {
        setError('Event not found. Check your code and try again.')
        setLoading(false)
        return
      }

      const storageKey = `groopik_${data.id}_${name.trim().toLowerCase()}`
      let sessionToken = localStorage.getItem(storageKey)
      if (!sessionToken) {
        sessionToken = `${name.trim().toLowerCase()}_${Math.random().toString(36).substring(2)}_${Date.now().toString(36)}`
        localStorage.setItem(storageKey, sessionToken)
      }

      router.push(`/event/${data.id}?name=${encodeURIComponent(name.trim())}&token=${sessionToken}`)
    } catch {
      setError('Could not reach the server. Check your connection and try again.')
    }
    setLoading(false)
  }

  const ready = joinCode.trim() && name.trim() && agreed

  return (
    <main className="join-page">
      <nav className="g-nav">
        <BrandMark />
        <div className="g-nav-actions">
          <Link href="/" className="g-btn g-btn-secondary">← Create an event</Link>
        </div>
      </nav>

      <div className="join-main">
        <div className="join-card-wrapper g-animate-in">
          <div className="join-card g-card">
            <div className="join-badge-wrapper">
              <span className="g-badge">Join an event</span>
            </div>

            <h1 className="join-headline">You&apos;re <em>invited</em>.</h1>
            <p className="join-subtitle">
              Enter your name and the event code to join the shared gallery.
            </p>

            <div className="join-form">
              <div className="join-field">
                <label className="g-label" htmlFor="join-name">Your name</label>
                <input
                  id="join-name"
                  className="g-input g-input-lg"
                  placeholder="e.g. Ayesha"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </div>

              <div className="join-field">
                <label className="g-label" htmlFor="join-code">Event code</label>
                <input
                  id="join-code"
                  className="g-input g-input-lg g-input-code"
                  placeholder="e.g. W27XY4"
                  value={joinCode}
                  onChange={e => setJoinCode(e.target.value.toUpperCase())}
                  onKeyDown={e => e.key === 'Enter' && joinEvent()}
                  maxLength={6}
                />
              </div>

              <div className="join-agreement">
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={agreed}
                  aria-label="Agree to the Terms of Service and Privacy Policy"
                  className={`join-checkbox ${agreed ? 'join-checkbox--checked' : ''}`}
                  onClick={() => setAgreed(!agreed)}
                >
                  {agreed && (
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </button>
                <p className="join-agreement-text" onClick={() => setAgreed(!agreed)}>
                  I agree to the{' '}
                  <Link href="/terms" onClick={e => e.stopPropagation()}>Terms of Service</Link>
                  {' '}and{' '}
                  <Link href="/privacy" onClick={e => e.stopPropagation()}>Privacy Policy</Link>
                  . I confirm I own or have permission to share any photos I upload.
                </p>
              </div>

              {error && <p className="join-error">{error}</p>}

              <button
                className="g-btn g-btn-primary g-btn-lg"
                onClick={joinEvent}
                disabled={loading || !ready}
                style={{ width: '100%', marginTop: 'var(--space-1)' }}
              >
                {loading ? 'Finding event…' : 'Join event →'}
              </button>
            </div>

            <p className="join-trust">
              No account needed · Your photos stay yours
            </p>
          </div>
        </div>
      </div>

      <SiteFooter />
    </main>
  )
}

export default function JoinPage() {
  return (
    <Suspense fallback={<div style={{ background: 'var(--paper)', minHeight: '100vh' }} />}>
      <JoinContent />
    </Suspense>
  )
}
