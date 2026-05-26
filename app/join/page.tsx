'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'


function JoinContent() {
  const [joinCode, setJoinCode] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const code = searchParams.get('code')
    if (code) setJoinCode(code.toUpperCase())
  }, [searchParams])

  const joinEvent = async () => {
    if (!joinCode.trim() || !name.trim() || !agreed) return
    setLoading(true)
    try {
      const response = await fetch(`/api/events?code=${joinCode.toUpperCase()}`)
      const data = await response.json()
      if (!response.ok || !data.id) {
        alert('Event not found. Check your code and try again.')
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
    } catch (err) {
      alert('Error: ' + (err as Error).message)
    }
    setLoading(false)
  }

  const ready = joinCode.trim() && name.trim() && agreed

  return (
    <main className="join-page">
      <style>{`
        .join-page {
          background: var(--color-bg-primary);
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
          font-family: var(--font-sans);
        }

        .join-main {
          position: relative;
          z-index: 10;
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--space-10) var(--space-6);
        }

        .join-card-wrapper {
          width: 100%;
          max-width: 440px;
        }

        .join-card {
          padding: var(--space-12);
        }

        .join-headline {
          font-size: var(--text-3xl);
          font-weight: 800;
          letter-spacing: var(--tracking-tight);
          color: var(--color-text-primary);
          line-height: var(--leading-tight);
          margin: 0 0 var(--space-3);
        }

        .join-subtitle {
          font-size: var(--text-sm);
          color: var(--color-text-secondary);
          line-height: var(--leading-normal);
          margin: 0 0 var(--space-8);
        }

        .join-form {
          display: flex;
          flex-direction: column;
          gap: var(--space-5);
        }

        .join-field {
          display: flex;
          flex-direction: column;
        }

        .join-agreement {
          display: flex;
          align-items: flex-start;
          gap: var(--space-3);
          padding: var(--space-2) 0;
        }

        .join-checkbox {
          width: 18px;
          height: 18px;
          border-radius: var(--radius-sm);
          border: 2px solid var(--color-border-hover);
          background: transparent;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          flex-shrink: 0;
          margin-top: 2px;
          transition: all var(--duration-fast) var(--ease-out);
        }

        .join-checkbox--checked {
          background: var(--color-accent);
          border-color: var(--color-accent);
          box-shadow: 0 0 8px rgba(99, 102, 241, 0.3);
        }

        .join-agreement-text {
          font-size: var(--text-xs);
          color: var(--color-text-tertiary);
          line-height: var(--leading-normal);
          cursor: pointer;
        }

        .join-agreement-link {
          color: var(--color-accent-light);
          cursor: pointer;
          text-decoration: none;
          transition: color var(--duration-fast) var(--ease-out);
        }
        .join-agreement-link:hover {
          color: white;
          text-decoration: underline;
        }

        .join-trust {
          margin-top: var(--space-5);
          font-size: var(--text-xs);
          color: var(--color-text-muted);
          text-align: center;
          letter-spacing: var(--tracking-wide);
        }

        .join-badge-wrapper {
          margin-bottom: var(--space-6);
        }

        @media (max-width: 480px) {
          .join-card {
            padding: var(--space-8) var(--space-6);
          }
        }
      `}</style>

      {/* Background effects */}
      <div className="g-bg-grid" />
      <div className="g-bg-glow g-bg-glow-1" />
      <div className="g-bg-glow g-bg-glow-2" />

      {/* Navigation */}
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
          <button className="g-btn g-btn-secondary" onClick={() => router.push('/')}>
            ← Create event
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="join-main">
        <div className="join-card-wrapper g-animate-in">
          <div className="join-card g-card">

            {/* Badge */}
            <div className="join-badge-wrapper">
              <span className="g-badge g-badge-live">Join an event</span>
            </div>

            {/* Headline */}
            <h1 className="join-headline">You&apos;re invited.</h1>
            <p className="join-subtitle">
              Enter your name and the event code<br />to join the shared gallery.
            </p>

            {/* Form */}
            <div className="join-form">

              {/* Name field */}
              <div className="join-field">
                <label className="g-label">Your name</label>
                <input
                  className="g-input g-input-lg"
                  placeholder="e.g. John Doe"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </div>

              {/* Code field */}
              <div className="join-field">
                <label className="g-label">Event code</label>
                <input
                  className="g-input g-input-lg g-input-code"
                  placeholder="e.g. W27YXY"
                  value={joinCode}
                  onChange={e => setJoinCode(e.target.value.toUpperCase())}
                  onKeyDown={e => e.key === 'Enter' && joinEvent()}
                  maxLength={6}
                />
              </div>

              {/* Agreement checkbox */}
              <div className="join-agreement">
                <div
                  className={`join-checkbox ${agreed ? 'join-checkbox--checked' : ''}`}
                  onClick={() => setAgreed(!agreed)}
                >
                  {agreed && (
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <p className="join-agreement-text" onClick={() => setAgreed(!agreed)}>
                  I agree to the{' '}
                  <span className="join-agreement-link" onClick={e => { e.stopPropagation(); router.push('/terms') }}>Terms of Service</span>
                  {' '}and{' '}
                  <span className="join-agreement-link" onClick={e => { e.stopPropagation(); router.push('/privacy') }}>Privacy Policy</span>
                  . I confirm I own or have permission to share any photos I upload.
                </p>
              </div>

              {/* Join button */}
              <button
                className="g-btn g-btn-primary g-btn-lg"
                onClick={joinEvent}
                disabled={loading || !ready}
                style={{ width: '100%', marginTop: 'var(--space-1)' }}
              >
                {loading ? 'Finding event...' : 'Join Event →'}
              </button>
            </div>

            {/* Trust line */}
            <p className="join-trust">
              No account needed · Your photos stay yours
            </p>

          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="g-footer">
        <div className="g-footer-links">
          <span className="g-footer-link g-hide-mobile">No install</span>
          <span className="g-footer-link g-hide-mobile">Instant gallery</span>
          <span className="g-footer-link g-hide-mobile">Share via QR</span>
          <span className="g-footer-link" onClick={() => router.push('/terms')}>Terms</span>
          <span className="g-footer-link" onClick={() => router.push('/privacy')}>Privacy</span>
        </div>
        <span className="g-footer-copy">© 2025 Groopik</span>
      </footer>
    </main>
  )
}

export default function JoinPage() {
  return (
    <Suspense fallback={<div style={{ background: 'var(--color-bg-primary)', minHeight: '100vh' }} />}>
      <JoinContent />
    </Suspense>
  )
}
