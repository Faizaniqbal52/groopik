'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { QRCodeSVG } from 'qrcode.react'
import { DottedSurface } from '@/components/ui/dotted-surface'

export default function Home() {
  const [eventName, setEventName] = useState('')
  const [loading, setLoading] = useState(false)
  const [eventCode, setEventCode] = useState('')
  const [eventId, setEventId] = useState('')
  const [copied, setCopied] = useState(false)
  const [photoCount, setPhotoCount] = useState(2847)
  const [scrollY, setScrollY] = useState(0)
  const router = useRouter()

  useEffect(() => {
    const interval = setInterval(() => {
      setPhotoCount(n => n + Math.floor(Math.random() * 3 + 1))
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  // Scroll-triggered animations via IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
          }
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    )
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [eventCode])

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
    { title: 'Manali Trip', sub: '47 photos from 8 friends', img: '/manali.png' },
    { title: 'The Wedding', sub: '213 moments by 34 guests', img: '/wedding.png' },
    { title: 'Mood Fest', sub: '156 shots from 61 people', img: '/festival.png' },
    { title: 'Goa Trip', sub: '134 memories by 12 friends', img: '/goa.png' },
    { title: 'Birthday Bash', sub: '72 photos from 18 people', img: '/birthday.png' },
    { title: 'NYE 2024', sub: '89 moments by 22 people', img: '/nye.png' },
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
        <DottedSurface dotColor={[120, 120, 180]} surfaceOpacity={0.18} dotSize={4} />
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

        <div className="success-container">
          <div className="success-inner reveal is-visible">
            <div className="g-badge" style={{ marginBottom: 24 }}>
              <div className="live-dot live-dot--green" />
              Event created
            </div>
            <h1 className="success-title">{eventName}</h1>
            <div className="success-grid">
              <div className="g-card qr-card">
                <span className="g-label" style={{ marginBottom: 0 }}>Scan to join</span>
                <div className="qr-wrap">
                  <QRCodeSVG value={`${typeof window !== 'undefined' ? window.location.origin : ''}/join?code=${eventCode}`} size={148} bgColor="white" fgColor="#06080d" level="M" />
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
      <DottedSurface dotColor={[120, 120, 180]} surfaceOpacity={0.18} dotSize={4} />

      {/* NAV — with social proof */}
      <nav className="g-nav">
        <div className="g-nav-logo" onClick={() => router.push('/')}>
          <Logo />
          <div>
            <div className="g-nav-brand">GROOPIK</div>
            <div className="g-nav-tagline">Collect every moment</div>
          </div>
        </div>
        <div className="g-nav-actions">
          <div className="nav-stat g-hide-mobile">
            <div className="nav-stat-dot" />
            <span>{photoCount.toLocaleString()}+ photos shared</span>
          </div>
          <button className="g-btn g-btn-ghost g-hide-mobile" onClick={() => router.push('/join')}>Join Event</button>
          <button className="g-btn g-btn-primary" onClick={() => document.getElementById('hero-input')?.focus()}>Create Event</button>
        </div>
      </nav>

      {/* ═══ HERO ═══ */}
      <section className="hero">
        {/* Floating photos */}
        <div className="floating-photos" aria-hidden="true">
          <div className="float-photo float-photo--1"><img src="/wedding.png" alt="" /></div>
          <div className="float-photo float-photo--2"><img src="/manali.png" alt="" /></div>
          <div className="float-photo float-photo--3"><img src="/festival.png" alt="" /></div>
          <div className="float-photo float-photo--4"><img src="/birthday.png" alt="" /></div>
          <div className="float-photo float-photo--5"><img src="/goa.png" alt="" /></div>
          <div className="float-photo float-photo--6"><img src="/nye.png" alt="" /></div>
        </div>

        {/* Ambient glow */}
        <div className="hero-glow hero-glow--1" />
        <div className="hero-glow hero-glow--2" />

        <div className="hero-content">
          <div className="hero-badge reveal is-visible">
            <div className="g-badge g-badge-live">Free · No account needed</div>
          </div>

          <h1 className="hero-headline reveal is-visible">
            The photos you<br />almost <em>never</em> got.
          </h1>

          <p className="hero-sub reveal is-visible">
            Create an event. Share the link. Everyone uploads.<br />
            One gallery — yours to keep.
          </p>

          {/* CTA */}
          <div className="cta-wrap reveal is-visible">
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
                  className="cta-btn"
                  onClick={createEvent}
                  disabled={loading || !eventName.trim()}
                >
                  {loading ? (
                    <><svg width="16" height="16" viewBox="0 0 16 16" className="spin-icon"><circle cx="8" cy="8" r="6" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5"/><path d="M8 2 A6 6 0 0 1 14 8" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>Creating...</>
                  ) : (
                    <>Create Event <span className="cta-arrow">→</span></>
                  )}
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
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section className="section section--alt">
        <div className="section-inner">
          <div className="reveal">
            <p className="section-eyebrow">How it works</p>
            <h2 className="section-title">Three steps.<br /><em>Every</em> photo.</h2>
          </div>

          <div className="flow">
            {[
              {
                num: '01', title: 'Create an event',
                desc: 'Name your wedding, trip, party — anything. It takes 3 seconds. No sign-up needed.',
                img: '/manali.png',
              },
              {
                num: '02', title: 'Share the link',
                desc: 'Send a QR code or link to everyone. They tap it on any phone — no app to download.',
                img: '/wedding.png',
              },
              {
                num: '03', title: 'Collect every photo',
                desc: 'Everyone uploads to one gallery. Browse, download, or save them all — forever free.',
                img: '/festival.png',
              },
            ].map((step, i) => (
              <div key={i} className={`flow-step reveal`} style={{ animationDelay: `${i * 150}ms` }}>
                <div className="flow-img-wrap">
                  <img src={step.img} alt={step.title} className="flow-img" />
                  <div className="flow-img-overlay" />
                  <span className="flow-num">{step.num}</span>
                </div>
                <div className="flow-text">
                  <h3 className="flow-title">{step.title}</h3>
                  <p className="flow-desc">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SHOWCASE ═══ */}
      <section className="section">
        <div className="section-inner">
          <div className="reveal">
            <p className="section-eyebrow">Real events</p>
            <h2 className="section-title">Moments people <em>collected</em></h2>
            <p className="section-sub">Every card is a real event. Every photo is a real memory.</p>
          </div>

          <div className="showcase-grid">
            {cards.map((card, i) => (
              <div key={i} className="showcase-card reveal" style={{ animationDelay: `${i * 80}ms` }}>
                <div className="showcase-img-wrap">
                  <img src={card.img} alt={card.title} className="showcase-img" loading="lazy" />
                  <div className="showcase-img-overlay" />
                  <div className="showcase-label">
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
        <div className="section-inner cta-bottom reveal">
          <h2 className="cta-headline">Ready to collect<br />your <em>moments</em>?</h2>
          <p className="section-sub" style={{ marginBottom: 32 }}>Start for free. No sign-up required.</p>
          <div className="cta-input-wrap cta-input-wrap--centered">
            <input className="cta-input" placeholder="Name your event..." value={eventName} onChange={e => setEventName(e.target.value)} onKeyDown={e => e.key === 'Enter' && createEvent()} />
            <button className="cta-btn" onClick={createEvent} disabled={loading || !eventName.trim()}>
              {loading ? 'Creating...' : 'Create Event →'}
            </button>
          </div>
        </div>
      </section>

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

const pageStyles = `
  .page-root {
    background: var(--color-bg-primary);
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    position: relative;
    overflow-x: hidden;
  }

  /* ── Scroll reveal ── */
  .reveal {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1);
  }
  .reveal.is-visible {
    opacity: 1;
    transform: translateY(0);
  }

  /* ── Nav stat ── */
  .nav-stat {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: var(--text-xs);
    color: var(--color-text-tertiary);
    font-weight: 500;
    padding: 6px 14px;
    background: var(--color-bg-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-full);
  }
  .nav-stat-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--color-success);
    box-shadow: 0 0 6px var(--color-success);
    animation: g-pulse 2s ease-in-out infinite;
  }

  /* ═══ HERO ═══ */
  .hero {
    position: relative;
    z-index: 10;
    min-height: 94vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--space-12) var(--content-padding);
    overflow: hidden;
  }

  /* Floating polaroid photos */
  .floating-photos {
    position: absolute;
    inset: 0;
    z-index: 0;
    pointer-events: none;
  }
  .float-photo {
    position: absolute;
    border-radius: var(--radius-md);
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(0,0,0,0.6);
    border: 3px solid rgba(255,255,255,0.08);
    opacity: 0;
    animation: floatIn 1.2s cubic-bezier(0.16,1,0.3,1) forwards;
  }
  .float-photo img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
  .float-photo--1 { width: 180px; height: 130px; top: 8%; left: 3%; transform: rotate(-8deg); animation-delay: 0.3s; }
  .float-photo--2 { width: 160px; height: 110px; top: 5%; right: 5%; transform: rotate(6deg); animation-delay: 0.5s; }
  .float-photo--3 { width: 200px; height: 140px; bottom: 18%; left: 2%; transform: rotate(5deg); animation-delay: 0.7s; }
  .float-photo--4 { width: 150px; height: 110px; bottom: 12%; right: 3%; transform: rotate(-7deg); animation-delay: 0.9s; }
  .float-photo--5 { width: 130px; height: 95px; top: 40%; left: 6%; transform: rotate(-3deg); animation-delay: 0.6s; }
  .float-photo--6 { width: 140px; height: 100px; top: 35%; right: 4%; transform: rotate(4deg); animation-delay: 0.8s; }

  @keyframes floatIn {
    from { opacity: 0; transform: translateY(40px) rotate(var(--r, 0deg)) scale(0.85); }
    to { opacity: 0.35; transform: translateY(0) rotate(var(--r, 0deg)) scale(1); }
  }
  .float-photo--1 { --r: -8deg; }
  .float-photo--2 { --r: 6deg; }
  .float-photo--3 { --r: 5deg; }
  .float-photo--4 { --r: -7deg; }
  .float-photo--5 { --r: -3deg; }
  .float-photo--6 { --r: 4deg; }

  .hero-glow {
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
    filter: blur(100px);
    z-index: 0;
  }
  .hero-glow--1 {
    width: 600px; height: 600px;
    top: -200px; right: -100px;
    background: rgba(99,102,241,0.12);
    animation: g-float 8s ease-in-out infinite;
  }
  .hero-glow--2 {
    width: 500px; height: 500px;
    bottom: -200px; left: -100px;
    background: rgba(168,85,247,0.08);
    animation: g-float 10s ease-in-out infinite reverse;
  }

  .hero-content {
    position: relative;
    z-index: 2;
    text-align: center;
    max-width: 700px;
    width: 100%;
  }
  .hero-badge { margin-bottom: 28px; }

  .hero-headline {
    font-family: var(--font-display);
    font-size: clamp(2.75rem, 7vw, 4.5rem);
    font-weight: 900;
    letter-spacing: -0.02em;
    line-height: 1.08;
    color: white;
    margin: 0 0 var(--space-6);
  }
  .hero-headline em {
    font-style: italic;
    color: var(--color-accent-light);
  }
  .hero-sub {
    font-size: var(--text-lg);
    font-weight: 300;
    color: var(--color-text-secondary);
    line-height: 1.7;
    margin: 0 0 var(--space-10);
    letter-spacing: 0.01em;
  }

  /* ── CTA ── */
  .cta-wrap { max-width: 520px; margin: 0 auto; width: 100%; }
  .cta-card {
    background: rgba(255,255,255,0.03);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-xl);
    padding: var(--space-6) var(--space-8);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    text-align: left;
    transition: border-color 0.4s ease, box-shadow 0.4s ease;
  }
  .cta-card:hover {
    border-color: rgba(99,102,241,0.2);
    box-shadow: 0 0 40px rgba(99,102,241,0.06);
  }
  .cta-input-wrap {
    display: flex;
    border-radius: var(--radius-md);
    overflow: hidden;
    border: 1px solid var(--color-border);
    transition: all 0.35s cubic-bezier(0.16,1,0.3,1);
    background: rgba(0,0,0,0.3);
  }
  .cta-input-wrap:focus-within {
    border-color: var(--color-accent);
    box-shadow: 0 0 0 4px rgba(99,102,241,0.12), 0 0 30px rgba(99,102,241,0.1);
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
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: var(--space-4) var(--space-6);
    background: var(--gradient-accent);
    border: none;
    border-left: 1px solid rgba(255,255,255,0.06);
    color: white;
    font-family: var(--font-sans);
    font-size: var(--text-sm);
    font-weight: 700;
    letter-spacing: 0.02em;
    cursor: pointer;
    white-space: nowrap;
    transition: all 0.3s cubic-bezier(0.16,1,0.3,1);
    position: relative;
    overflow: hidden;
  }
  .cta-btn::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
    transform: translateX(-100%);
    transition: transform 0.6s ease;
  }
  .cta-btn:hover::before {
    transform: translateX(100%);
  }
  .cta-btn:hover {
    box-shadow: 0 0 24px rgba(99,102,241,0.3);
  }
  .cta-btn:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }
  .cta-btn:disabled:hover::before { transform: translateX(-100%); }
  .cta-arrow {
    display: inline-block;
    transition: transform 0.2s ease;
  }
  .cta-btn:hover .cta-arrow { transform: translateX(3px); }
  .spin-icon { animation: g-spin 1s linear infinite; }

  .trust-row {
    display: flex;
    gap: var(--space-5);
    margin-top: var(--space-4);
    flex-wrap: wrap;
  }
  .trust-item {
    display: flex;
    align-items: center;
    gap: 5px;
  }
  .trust-item span {
    font-size: var(--text-xs);
    color: var(--color-text-tertiary);
  }

  /* ── Sections ── */
  .section {
    position: relative;
    z-index: 10;
    padding: 100px var(--content-padding);
  }
  .section--alt {
    background: var(--color-bg-elevated);
    border-top: 1px solid var(--color-border);
    border-bottom: 1px solid var(--color-border);
  }
  .section--cta {
    border-top: 1px solid var(--color-border);
    padding: 80px var(--content-padding);
  }
  .section-inner {
    max-width: var(--max-width);
    margin: 0 auto;
    width: 100%;
  }
  .section-eyebrow {
    font-size: var(--text-xs);
    font-weight: 700;
    letter-spacing: var(--tracking-wider);
    text-transform: uppercase;
    color: var(--color-accent-light);
    text-align: center;
    margin-bottom: var(--space-3);
  }
  .section-title {
    font-family: var(--font-display);
    font-size: var(--text-3xl);
    font-weight: 900;
    letter-spacing: -0.02em;
    color: var(--color-text-primary);
    text-align: center;
    margin-bottom: var(--space-3);
    line-height: 1.15;
  }
  .section-title em {
    font-style: italic;
    color: var(--color-accent-light);
  }
  .section-sub {
    font-size: var(--text-sm);
    font-weight: 300;
    color: var(--color-text-tertiary);
    text-align: center;
    margin-bottom: var(--space-12);
  }

  /* ── How it works: flow cards ── */
  .flow {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-6);
  }
  .flow-step {
    border-radius: var(--radius-xl);
    overflow: hidden;
    border: 1px solid var(--color-border);
    transition: all 0.4s cubic-bezier(0.16,1,0.3,1);
    background: var(--color-bg-surface);
  }
  .flow-step:hover {
    border-color: var(--color-border-hover);
    transform: translateY(-6px);
    box-shadow: var(--shadow-lg), 0 0 30px rgba(99,102,241,0.05);
  }
  .flow-img-wrap {
    position: relative;
    aspect-ratio: 16/9;
    overflow: hidden;
  }
  .flow-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.6s cubic-bezier(0.16,1,0.3,1);
  }
  .flow-step:hover .flow-img { transform: scale(1.06); }
  .flow-img-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(transparent 40%, rgba(6,8,13,0.5) 100%);
  }
  .flow-num {
    position: absolute;
    top: var(--space-3);
    left: var(--space-3);
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    font-weight: 700;
    color: white;
    background: rgba(99,102,241,0.7);
    backdrop-filter: blur(8px);
    padding: 4px 10px;
    border-radius: var(--radius-sm);
    letter-spacing: var(--tracking-wide);
  }
  .flow-text {
    padding: var(--space-6);
  }
  .flow-title {
    font-family: var(--font-display);
    font-size: var(--text-lg);
    font-weight: 700;
    color: var(--color-text-primary);
    margin-bottom: var(--space-2);
  }
  .flow-desc {
    font-size: var(--text-sm);
    font-weight: 300;
    color: var(--color-text-tertiary);
    line-height: 1.65;
  }

  /* ── Showcase ── */
  .showcase-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-4);
  }
  .showcase-card {
    border-radius: var(--radius-xl);
    overflow: hidden;
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.16,1,0.3,1);
    position: relative;
    border: 1px solid transparent;
  }
  .showcase-card:hover {
    transform: translateY(-5px) scale(1.01);
    box-shadow: var(--shadow-xl);
    border-color: rgba(255,255,255,0.08);
  }
  .showcase-img-wrap {
    position: relative;
    aspect-ratio: 4/3;
    overflow: hidden;
  }
  .showcase-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.7s cubic-bezier(0.16,1,0.3,1);
  }
  .showcase-card:hover .showcase-img {
    transform: scale(1.08);
  }
  .showcase-img-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(transparent 30%, rgba(6,8,13,0.85) 100%);
  }
  .showcase-label {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: var(--space-4) var(--space-5);
  }
  .showcase-title {
    font-family: var(--font-display);
    font-size: var(--text-lg);
    font-weight: 700;
    color: white;
    margin-bottom: 3px;
  }
  .showcase-sub {
    font-size: var(--text-xs);
    color: rgba(255,255,255,0.55);
    font-weight: 300;
    letter-spacing: 0.02em;
  }

  /* ── Bottom CTA ── */
  .cta-bottom {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .cta-headline {
    font-family: var(--font-display);
    font-size: var(--text-3xl);
    font-weight: 900;
    letter-spacing: -0.02em;
    color: white;
    margin-bottom: var(--space-3);
    line-height: 1.15;
  }
  .cta-headline em {
    font-style: italic;
    color: var(--color-accent-light);
  }
  .cta-input-wrap--centered {
    max-width: 480px;
    width: 100%;
  }

  /* ── Success ── */
  .success-container { position: relative; z-index: 10; flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: var(--space-10) var(--content-padding); text-align: center; }
  .success-inner { width: 100%; max-width: 640px; }
  .success-title { font-family: var(--font-display); font-size: var(--text-3xl); font-weight: 900; letter-spacing: -0.02em; color: white; margin-bottom: var(--space-10); }
  .success-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-5); margin-bottom: var(--space-5); }
  .qr-card { padding: var(--space-8) var(--space-6); display: flex; flex-direction: column; align-items: center; gap: var(--space-4); }
  .qr-wrap { background: white; padding: var(--space-3); border-radius: var(--radius-md); }
  .text-muted { font-size: var(--text-xs); color: var(--color-text-tertiary); }
  .success-actions { display: flex; flex-direction: column; gap: var(--space-3); }
  .code-card { padding: var(--space-6); flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: var(--space-2); }
  .code-display { font-size: var(--text-3xl); font-weight: 900; letter-spacing: 0.12em; color: white; font-family: var(--font-mono); }
  .full-btn { width: 100%; justify-content: center; padding: var(--space-3) var(--space-4) !important; }
  .live-dot { width: 6px; height: 6px; border-radius: 50%; }
  .live-dot--green { background: var(--color-success); box-shadow: 0 0 8px var(--color-success); }

  /* ── Responsive ── */
  @media (max-width: 768px) {
    .hero { min-height: auto; padding: var(--space-16) var(--content-padding); }
    .floating-photos { display: none; }
    .hero-headline { font-size: 2.25rem !important; }
    .flow { grid-template-columns: 1fr !important; }
    .showcase-grid { grid-template-columns: repeat(2, 1fr) !important; }
    .success-grid { grid-template-columns: 1fr !important; }
    .cta-card { padding: var(--space-5); }
    .section { padding: 60px var(--content-padding); }
  }
  @media (max-width: 480px) {
    .showcase-grid { grid-template-columns: 1fr !important; }
    .trust-row { gap: var(--space-3); }
  }
`