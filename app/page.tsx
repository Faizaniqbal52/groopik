'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { QRCodeSVG } from 'qrcode.react'

export default function Home() {
  const [eventName, setEventName] = useState('')
  const [loading, setLoading] = useState(false)
  const [eventCode, setEventCode] = useState('')
  const [eventId, setEventId] = useState('')
  const [copied, setCopied] = useState(false)
  const [photoCount, setPhotoCount] = useState(2847)
  const router = useRouter()

  useEffect(() => {
    const interval = setInterval(() => {
      setPhotoCount(n => n + Math.floor(Math.random() * 3 + 1))
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const createEvent = async () => {
    if (!eventName.trim()) return
    setLoading(true)
    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: eventName }),
      })
      const data = await response.json()
      if (!response.ok) {
        alert('Error: ' + (data.error || 'Failed to create event'))
      } else {
        setEventCode(data.join_code)
        setEventId(data.id)
      }
    } catch (err) {
      alert('Error: ' + (err as Error).message)
    }
    setLoading(false)
  }

  const copyLink = () => {
    const link = `${window.location.origin}/join?code=${eventCode}`
    navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const cards = [
    { title: 'Manali Trip', sub: '47 photos · 8 people', img: '/manali.png' },
    { title: 'The Wedding', sub: '213 photos · 34 people', img: '/wedding.png' },
    { title: 'Mood Fest', sub: '156 photos · 61 people', img: '/festival.png' },
    { title: 'Goa Trip', sub: '134 photos · 12 people', img: '/goa.png' },
    { title: 'Birthday Bash', sub: '72 photos · 18 people', img: '/birthday.png' },
    { title: 'NYE 2024', sub: '89 photos · 22 people', img: '/nye.png' },
  ]

  const Logo = () => (
    <svg width="34" height="34" viewBox="0 0 44 44">
      <defs>
        <linearGradient id="logo-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#6366f1"/>
          <stop offset="100%" stopColor="#a855f7"/>
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="40" height="40" rx="12" fill="url(#logo-grad)"/>
      <path d="M28,14 Q22,10 16,14 Q10,18 10,22 Q10,26 14,29 Q18,32 23,31 Q27,30 28,27 L28,22 L22,22" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )

  // ─── EVENT CREATED SUCCESS ───
  if (eventCode) {
    return (
      <main className="page-root">
        <style>{pageStyles}</style>
        <div className="g-bg-grid" />
        <div className="g-bg-glow g-bg-glow-1" />
        <div className="g-bg-glow g-bg-glow-2" />

        <nav className="g-nav">
          <div className="g-nav-logo" onClick={() => { setEventCode(''); setEventName(''); setEventId('') }}>
            <Logo />
            <div>
              <div className="g-nav-brand">GROOPIK</div>
              <div className="g-nav-tagline">Collect every moment</div>
            </div>
          </div>
        </nav>

        <div className="success-container g-animate-in">
          <div className="success-inner">
            <div className="g-badge" style={{ marginBottom: 24 }}>
              <div className="live-dot live-dot--green" />
              Event ready
            </div>

            <h1 className="success-title">{eventName}</h1>

            <div className="success-grid">
              <div className="g-card qr-card">
                <span className="g-label" style={{ marginBottom: 0 }}>Scan to join</span>
                <div className="qr-wrap">
                  <QRCodeSVG
                    value={`${typeof window !== 'undefined' ? window.location.origin : ''}/join?code=${eventCode}`}
                    size={148}
                    bgColor="white"
                    fgColor="#06080d"
                    level="M"
                  />
                </div>
                <span className="text-muted">Point camera to join instantly</span>
              </div>

              <div className="success-actions">
                <div className="g-card g-card-accent code-card">
                  <span className="g-label" style={{ marginBottom: 0 }}>Join code</span>
                  <div className="code-display">{eventCode}</div>
                  <span className="text-muted">Type this at groopik.com/join</span>
                </div>
                <button className="g-btn g-btn-primary g-btn-lg full-btn" onClick={copyLink}>
                  {copied ? '✓ Link Copied' : 'Copy Join Link'}
                </button>
                <button className="g-btn g-btn-secondary g-btn-lg full-btn" onClick={() => router.push(`/event/${eventId}?name=Host&token=host_${eventId}`)}>
                  Open My Event
                </button>
              </div>
            </div>

            <button className="g-btn g-btn-ghost" onClick={() => { setEventCode(''); setEventName(''); setEventId('') }} style={{ marginTop: 24 }}>
              Create another event
            </button>
          </div>
        </div>

        <footer className="g-footer">
          <div className="g-footer-links">
            <span className="g-footer-link" onClick={() => router.push('/terms')}>Terms</span>
            <span className="g-footer-link" onClick={() => router.push('/privacy')}>Privacy</span>
          </div>
          <span className="g-footer-copy">© 2026 Groopik</span>
        </footer>
      </main>
    )
  }

  // ─── MAIN LANDING ───
  return (
    <main className="page-root">
      <style>{pageStyles}</style>
      <div className="g-bg-grid" />
      <div className="g-bg-glow g-bg-glow-1" />
      <div className="g-bg-glow g-bg-glow-2" />

      {/* NAV */}
      <nav className="g-nav">
        <div className="g-nav-logo" onClick={() => router.push('/')}>
          <Logo />
          <div>
            <div className="g-nav-brand">GROOPIK</div>
            <div className="g-nav-tagline">Collect every moment</div>
          </div>
        </div>
        <div className="g-nav-actions">
          <button className="g-btn g-btn-ghost g-hide-mobile" onClick={() => router.push('/join')}>Join Event</button>
          <button className="g-btn g-btn-primary" onClick={() => document.getElementById('hero-input')?.focus()}>Create Event</button>
        </div>
      </nav>

      {/* ═══ HERO ═══ */}
      <section className="hero">
        {/* Background image */}
        <div className="hero-bg">
          <img src="/hero-bg.png" alt="" />
          <div className="hero-bg-overlay" />
        </div>

        <div className="hero-content g-animate-in">
          <div className="g-badge g-badge-live" style={{ marginBottom: 28 }}>
            Free · No account needed
          </div>

          <h1 className="hero-headline">
            The photos you<br />almost <span className="accent-word">never</span> got.
          </h1>

          <p className="hero-sub">
            Create an event. Share the link.<br />
            Everyone uploads. One gallery — yours to keep.
          </p>

          {/* BIG CTA */}
          <div className="cta-card">
            <span className="g-label">What are you celebrating?</span>
            <div className="cta-input-wrap">
              <input
                id="hero-input"
                className="cta-input"
                placeholder="Manali Trip, Birthday Photos..."
                value={eventName}
                onChange={e => setEventName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && createEvent()}
              />
              <button
                className="g-btn g-btn-primary g-btn-lg cta-btn"
                onClick={createEvent}
                disabled={loading || !eventName.trim()}
              >
                {loading ? (
                  <><svg width="14" height="14" viewBox="0 0 14 14" style={{ animation: 'g-spin 1s linear infinite' }}><circle cx="7" cy="7" r="5.5" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5"/><path d="M7 1.5 A5.5 5.5 0 0 1 12.5 7" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg> Creating...</>
                ) : 'Create Event →'}
              </button>
            </div>
            <div className="trust-row">
              {['No account needed', 'Free forever', 'Share via QR'].map(t => (
                <div key={t} className="trust-item">
                  <svg width="14" height="14" viewBox="0 0 14 14"><circle cx="7" cy="7" r="6" fill="none" stroke="var(--color-accent)" strokeWidth="1" opacity="0.4"/><path d="M4.5,7 L6,8.5 L9.5,5.5" stroke="var(--color-accent-light)" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  <span>{t}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="photo-counter">
            {photoCount.toLocaleString()} photos shared today
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section className="section section--alt">
        <div className="section-inner">
          <h2 className="section-title g-animate-in">How it works</h2>
          <p className="section-sub g-animate-in">Three steps. No apps. No sign-ups.</p>

          <div className="steps-grid">
            {[
              {
                num: '01', title: 'Create an event',
                desc: 'Name your event — wedding, trip, party, reunion. Takes 3 seconds.',
                icon: <><rect x="4" y="6" width="24" height="20" rx="4" stroke="currentColor" strokeWidth="1.5"/><circle cx="16" cy="16" r="5" stroke="currentColor" strokeWidth="1.5"/><circle cx="16" cy="16" r="2" fill="currentColor"/><circle cx="23" cy="10" r="1.5" fill="currentColor" opacity="0.5"/></>,
              },
              {
                num: '02', title: 'Share the link',
                desc: 'Send a QR code or link to everyone. They open it on any phone — no download needed.',
                icon: <><path d="M12 16h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M18 12l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><rect x="4" y="8" width="10" height="16" rx="3" stroke="currentColor" strokeWidth="1.5"/><rect x="18" y="8" width="10" height="16" rx="3" stroke="currentColor" strokeWidth="1.5"/></>,
              },
              {
                num: '03', title: 'Collect every photo',
                desc: 'Everyone uploads to one gallery. Download all photos anytime, for free.',
                icon: <><rect x="3" y="5" width="12" height="10" rx="2" stroke="currentColor" strokeWidth="1.5"/><rect x="17" y="5" width="12" height="10" rx="2" stroke="currentColor" strokeWidth="1.5"/><rect x="3" y="17" width="12" height="10" rx="2" stroke="currentColor" strokeWidth="1.5"/><rect x="17" y="17" width="12" height="10" rx="2" stroke="currentColor" strokeWidth="1.5"/></>,
              },
            ].map((step, i) => (
              <div key={i} className={`step-card g-card g-animate-in g-animate-in-delay-${i + 1}`}>
                <span className="step-num">{step.num}</span>
                <div className="step-icon">
                  <svg width="28" height="28" viewBox="0 0 32 32" fill="none">{step.icon}</svg>
                </div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SHOWCASE ═══ */}
      <section className="section">
        <div className="section-inner">
          <h2 className="section-title g-animate-in">Moments people collected</h2>
          <p className="section-sub g-animate-in">Real events. Real memories. All in one place.</p>

          <div className="showcase-grid g-animate-in g-animate-in-delay-1">
            {cards.map((card, i) => (
              <div key={i} className="showcase-card">
                <div className="showcase-img-wrap">
                  <img src={card.img} alt={card.title} className="showcase-img" loading="lazy" />
                  <div className="showcase-overlay" />
                </div>
                <div className="showcase-info">
                  <div>
                    <div className="showcase-title">{card.title}</div>
                    <div className="showcase-sub">{card.sub}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section className="section section--cta">
        <div className="section-inner cta-bottom g-animate-in">
          <h2 className="cta-headline">Ready to collect your moments?</h2>
          <p className="section-sub">Start for free. No sign-up required.</p>
          <div className="cta-input-wrap cta-input-wrap--centered">
            <input
              className="cta-input"
              placeholder="Name your event..."
              value={eventName}
              onChange={e => setEventName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && createEvent()}
            />
            <button
              className="g-btn g-btn-primary g-btn-lg cta-btn"
              onClick={createEvent}
              disabled={loading || !eventName.trim()}
            >
              {loading ? 'Creating...' : 'Create →'}
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="g-footer">
        <div className="g-footer-links">
          <span className="g-footer-link" onClick={() => router.push('/terms')}>Terms</span>
          <span className="g-footer-link" onClick={() => router.push('/privacy')}>Privacy</span>
        </div>
        <span className="g-footer-copy">© 2026 Groopik</span>
      </footer>
    </main>
  )
}

// ─── STYLES ───
const pageStyles = `
  .page-root {
    background: var(--color-bg-primary);
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;
  }

  /* ── Hero ── */
  .hero {
    position: relative;
    z-index: 10;
    min-height: 92vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--space-12) var(--content-padding);
  }
  .hero-bg {
    position: absolute;
    inset: 0;
    z-index: 0;
    overflow: hidden;
  }
  .hero-bg img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.12;
    filter: blur(2px);
  }
  .hero-bg-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, var(--color-bg-primary) 0%, transparent 30%, transparent 70%, var(--color-bg-primary) 100%);
  }
  .hero-content {
    position: relative;
    z-index: 2;
    text-align: center;
    max-width: 680px;
    width: 100%;
  }
  .hero-headline {
    font-size: clamp(2.5rem, 6vw, 4rem);
    font-weight: 900;
    letter-spacing: -0.04em;
    line-height: 1.05;
    color: white;
    margin: 0 0 var(--space-5);
  }
  .accent-word {
    color: var(--color-accent-light);
    font-style: italic;
  }
  .hero-sub {
    font-size: var(--text-lg);
    font-weight: 300;
    color: var(--color-text-secondary);
    line-height: 1.7;
    margin: 0 0 var(--space-10);
  }

  /* ── CTA Card ── */
  .cta-card {
    background: rgba(255,255,255,0.03);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-xl);
    padding: var(--space-8);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    text-align: left;
  }
  .cta-input-wrap {
    display: flex;
    border-radius: var(--radius-md);
    overflow: hidden;
    border: 1px solid var(--color-border);
    transition: border-color var(--duration-normal) var(--ease-out), box-shadow var(--duration-normal) var(--ease-out);
    background: rgba(0,0,0,0.3);
  }
  .cta-input-wrap:focus-within {
    border-color: var(--color-border-focus);
    box-shadow: 0 0 0 4px rgba(99,102,241,0.1), var(--shadow-glow);
  }
  .cta-input {
    flex: 1;
    padding: var(--space-4) var(--space-5);
    background: transparent;
    border: none;
    color: var(--color-text-primary);
    font-family: var(--font-sans);
    font-size: var(--text-base);
    min-width: 0;
  }
  .cta-input::placeholder { color: var(--color-text-tertiary); }
  .cta-input:focus { outline: none; }
  .cta-btn {
    border-radius: 0 !important;
    padding: var(--space-4) var(--space-6) !important;
    border-left: 1px solid var(--color-border) !important;
    white-space: nowrap;
  }
  .trust-row {
    display: flex;
    gap: var(--space-5);
    margin-top: var(--space-4);
    flex-wrap: wrap;
  }
  .trust-item {
    display: flex;
    align-items: center;
    gap: var(--space-1);
  }
  .trust-item span {
    font-size: var(--text-xs);
    color: var(--color-text-tertiary);
  }
  .photo-counter {
    margin-top: var(--space-6);
    font-size: var(--text-xs);
    color: var(--color-accent-light);
    font-weight: 500;
    letter-spacing: var(--tracking-wide);
    opacity: 0.6;
    animation: g-count-pulse 3s ease-in-out infinite;
  }

  /* ── Sections ── */
  .section {
    position: relative;
    z-index: 10;
    padding: var(--space-20) var(--content-padding);
  }
  .section--alt {
    background: var(--color-bg-elevated);
    border-top: 1px solid var(--color-border);
    border-bottom: 1px solid var(--color-border);
  }
  .section--cta {
    border-top: 1px solid var(--color-border);
  }
  .section-inner {
    max-width: var(--max-width);
    margin: 0 auto;
    width: 100%;
  }
  .section-title {
    font-size: var(--text-2xl);
    font-weight: 800;
    letter-spacing: var(--tracking-tight);
    color: var(--color-text-primary);
    text-align: center;
    margin-bottom: var(--space-2);
  }
  .section-sub {
    font-size: var(--text-sm);
    font-weight: 300;
    color: var(--color-text-tertiary);
    text-align: center;
    margin-bottom: var(--space-12);
  }

  /* ── Steps ── */
  .steps-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-5);
  }
  .step-card {
    text-align: center;
    padding: var(--space-10) var(--space-6);
  }
  .step-num {
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    font-weight: 700;
    letter-spacing: var(--tracking-wider);
    color: var(--color-accent-light);
    margin-bottom: var(--space-5);
    display: block;
    opacity: 0.6;
  }
  .step-icon {
    width: 64px;
    height: 64px;
    border-radius: var(--radius-lg);
    background: var(--color-accent-dim);
    border: 1px solid var(--color-accent-border);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto var(--space-5);
    color: var(--color-accent-light);
  }
  .step-title {
    font-size: var(--text-base);
    font-weight: 700;
    color: var(--color-text-primary);
    margin-bottom: var(--space-2);
  }
  .step-desc {
    font-size: var(--text-sm);
    font-weight: 300;
    color: var(--color-text-tertiary);
    line-height: var(--leading-normal);
  }

  /* ── Showcase ── */
  .showcase-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-4);
  }
  .showcase-card {
    border-radius: var(--radius-lg);
    overflow: hidden;
    border: 1px solid var(--color-border);
    cursor: pointer;
    transition: all var(--duration-normal) var(--ease-out);
    position: relative;
  }
  .showcase-card:hover {
    border-color: var(--color-border-hover);
    box-shadow: var(--shadow-lg);
    transform: translateY(-4px);
  }
  .showcase-img-wrap {
    position: relative;
    aspect-ratio: 16/10;
    overflow: hidden;
  }
  .showcase-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform var(--duration-slow) var(--ease-out);
  }
  .showcase-card:hover .showcase-img {
    transform: scale(1.05);
  }
  .showcase-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(transparent 50%, rgba(6,8,13,0.7) 100%);
  }
  .showcase-info {
    padding: var(--space-3) var(--space-4);
    background: var(--color-bg-elevated);
    border-top: 1px solid var(--color-border);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .showcase-title {
    font-size: var(--text-sm);
    font-weight: 700;
    color: var(--color-text-primary);
  }
  .showcase-sub {
    font-size: var(--text-xs);
    color: var(--color-text-tertiary);
    margin-top: 2px;
  }

  /* ── Bottom CTA ── */
  .cta-bottom {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .cta-headline {
    font-size: var(--text-2xl);
    font-weight: 800;
    letter-spacing: var(--tracking-tight);
    color: white;
    margin-bottom: var(--space-3);
  }
  .cta-input-wrap--centered {
    max-width: 480px;
    width: 100%;
  }

  /* ── Success ── */
  .success-container {
    position: relative;
    z-index: 10;
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: var(--space-10) var(--content-padding);
    text-align: center;
  }
  .success-inner { width: 100%; max-width: 640px; }
  .success-title {
    font-size: var(--text-3xl);
    font-weight: 800;
    letter-spacing: var(--tracking-tight);
    color: white;
    margin-bottom: var(--space-10);
  }
  .success-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-5);
    margin-bottom: var(--space-5);
  }
  .qr-card {
    padding: var(--space-8) var(--space-6);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-4);
  }
  .qr-wrap {
    background: white;
    padding: var(--space-3);
    border-radius: var(--radius-md);
  }
  .text-muted {
    font-size: var(--text-xs);
    color: var(--color-text-tertiary);
  }
  .success-actions {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }
  .code-card {
    padding: var(--space-6);
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--space-2);
  }
  .code-display {
    font-size: var(--text-3xl);
    font-weight: 900;
    letter-spacing: 0.12em;
    color: white;
    font-family: var(--font-mono);
  }
  .full-btn {
    width: 100%;
    justify-content: center;
    padding: var(--space-3) var(--space-4) !important;
  }
  .live-dot { width: 6px; height: 6px; border-radius: 50%; }
  .live-dot--green { background: var(--color-success); box-shadow: 0 0 8px var(--color-success); }

  /* ── Responsive ── */
  @media (max-width: 768px) {
    .hero { min-height: auto; padding: var(--space-16) var(--content-padding); }
    .hero-headline { font-size: 2.25rem !important; }
    .steps-grid { grid-template-columns: 1fr !important; }
    .showcase-grid { grid-template-columns: repeat(2, 1fr) !important; }
    .success-grid { grid-template-columns: 1fr !important; }
    .cta-card { padding: var(--space-5); }
    .cta-btn { font-size: 0.625rem !important; padding: var(--space-3) var(--space-4) !important; }
  }
  @media (max-width: 480px) {
    .showcase-grid { grid-template-columns: 1fr !important; }
    .trust-row { gap: var(--space-3); }
  }
`