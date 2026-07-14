'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { QRCodeSVG } from 'qrcode.react'
import { BrandMark, SiteFooter } from '@/components/brand'
import './home.css'

export default function Home() {
  const [eventName, setEventName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [eventCode, setEventCode] = useState('')
  const [eventId, setEventId] = useState('')
  const [copied, setCopied] = useState(false)
  const router = useRouter()

  // Scroll-triggered reveals
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) entry.target.classList.add('is-visible')
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
    setError('')
    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: eventName }),
      })
      const data = await response.json()
      if (!response.ok) {
        setError(data.error || 'Something went wrong — please try again.')
      } else {
        setEventCode(data.join_code)
        setEventId(data.id)
      }
    } catch {
      setError('Could not reach the server. Check your connection and try again.')
    }
    setLoading(false)
  }

  const copyLink = () => {
    const link = `${window.location.origin}/join?code=${eventCode}`
    navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const samples = [
    { title: 'The Wedding', sub: 'every table, every toast', img: '/wedding.webp', tilt: '-2deg' },
    { title: 'Manali Trip', sub: 'eight friends, one gallery', img: '/manali.webp', tilt: '1.5deg' },
    { title: 'Fest Night', sub: 'the whole crowd’s view', img: '/festival.webp', tilt: '-1deg' },
    { title: 'Goa, Day 2', sub: 'sunburn included', img: '/goa.webp', tilt: '2deg' },
    { title: 'Birthday Bash', sub: 'cake from every angle', img: '/birthday.webp', tilt: '-1.5deg' },
    { title: 'New Year’s Eve', sub: 'midnight, captured', img: '/nye.webp', tilt: '1deg' },
  ]

  // ─── EVENT CREATED ───
  if (eventCode) {
    return (
      <main className="page-root">
        <nav className="g-nav">
          <BrandMark />
        </nav>

        <div className="success-container">
          <div className="success-inner reveal is-visible">
            <div className="g-badge g-badge-ok" style={{ marginBottom: 24 }}>
              Event created
            </div>
            <h1 className="success-title">{eventName}</h1>
            <div className="success-grid">
              <div className="g-card qr-card">
                <span className="g-label" style={{ marginBottom: 0 }}>Scan to join</span>
                <div className="qr-wrap">
                  <QRCodeSVG value={`${typeof window !== 'undefined' ? window.location.origin : ''}/join?code=${eventCode}`} size={148} bgColor="#FFFFFF" fgColor="#211D19" level="M" />
                </div>
                <span className="text-muted">Point a camera at it to join instantly</span>
              </div>
              <div className="success-actions">
                <div className="g-card g-card-accent code-card">
                  <span className="g-label" style={{ marginBottom: 0 }}>Join code</span>
                  <div className="code-display">{eventCode}</div>
                  <span className="text-muted">Type this at groopik.com/join</span>
                </div>
                <button className="g-btn g-btn-primary g-btn-lg full-btn" onClick={copyLink}>
                  {copied ? '✓ Link copied' : 'Copy join link'}
                </button>
                <button className="g-btn g-btn-secondary g-btn-lg full-btn" onClick={() => router.push(`/event/${eventId}?name=Host&token=host_${eventId}`)}>
                  Open my event
                </button>
              </div>
            </div>
            <button className="g-btn g-btn-ghost" onClick={() => { setEventCode(''); setEventName(''); setEventId('') }} style={{ marginTop: 24 }}>
              Create another event
            </button>
          </div>
        </div>

        <SiteFooter />
      </main>
    )
  }

  // ─── LANDING ───
  return (
    <main className="page-root">
      <nav className="g-nav">
        <BrandMark />
        <div className="g-nav-actions">
          <Link href="/join" className="g-btn g-btn-ghost g-hide-mobile">Join an event</Link>
          <button className="g-btn g-btn-primary" onClick={() => document.getElementById('hero-input')?.focus()}>Create event</button>
        </div>
      </nav>

      {/* ═══ HERO ═══ */}
      <section className="hero">
        <div className="hero-prints" aria-hidden="true">
          <div className="print hero-print hero-print--1">
            <Image src="/wedding.webp" alt="" width={176} height={176} priority />
            <div className="print-cap">The Wedding</div>
          </div>
          <div className="print hero-print hero-print--2">
            <Image src="/manali.webp" alt="" width={176} height={176} priority />
            <div className="print-cap">Manali Trip</div>
          </div>
          <div className="print hero-print hero-print--3">
            <Image src="/goa.webp" alt="" width={176} height={176} />
            <div className="print-cap">Goa, day 2</div>
          </div>
          <div className="print hero-print hero-print--4">
            <Image src="/birthday.webp" alt="" width={156} height={156} />
            <div className="print-cap">Birthday Bash</div>
          </div>
        </div>

        <div className="hero-content">
          <div className="hero-badge reveal is-visible">
            <div className="g-badge">Free · No account needed</div>
          </div>

          <h1 className="hero-headline reveal is-visible">
            The photos you<br />almost <em>never</em> got.
          </h1>

          <p className="hero-sub reveal is-visible">
            Create an event, share one link, and everyone&apos;s photos land in a single gallery — no app, no sign-up.
          </p>

          <div className="cta-wrap reveal is-visible">
            <div className="cta-card">
              <span className="g-label">What are you celebrating?</span>
              <div className="cta-input-wrap">
                <input
                  id="hero-input"
                  className="cta-input"
                  placeholder="Priya's wedding, Goa trip, fest night…"
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
                    <><svg width="16" height="16" viewBox="0 0 16 16" className="spin-icon"><circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" opacity="0.3" strokeWidth="1.5"/><path d="M8 2 A6 6 0 0 1 14 8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>Creating…</>
                  ) : (
                    <>Create event <span className="cta-arrow">→</span></>
                  )}
                </button>
              </div>
              {error && (
                <p style={{ color: 'var(--brick)', fontSize: 'var(--text-sm)', margin: 'var(--space-3) 0 0' }}>{error}</p>
              )}
              <div className="trust-row">
                {['No account needed', 'Free', 'Share via QR'].map(t => (
                  <div key={t} className="trust-item">
                    <svg width="14" height="14" viewBox="0 0 14 14"><path d="M4.5,7 L6,8.5 L9.5,5.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
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
                img: '/manali.webp',
              },
              {
                num: '02', title: 'Share the link',
                desc: 'Send a QR code or link to everyone. They tap it on any phone — no app to download.',
                img: '/wedding.webp',
              },
              {
                num: '03', title: 'Collect every photo',
                desc: 'Everyone uploads to one gallery. Browse, download, or save them all.',
                img: '/festival.webp',
              },
            ].map((step, i) => (
              <div key={step.num} className="flow-step reveal" style={{ transitionDelay: `${i * 100}ms` }}>
                <div className="flow-img-wrap">
                  <Image src={step.img} alt={step.title} width={600} height={375} />
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

      {/* ═══ SAMPLE GALLERIES ═══ */}
      <section className="section">
        <div className="section-inner">
          <div className="reveal">
            <p className="section-eyebrow">What it looks like</p>
            <h2 className="section-title">Prints on a table, <em>not</em> tiles in a feed</h2>
            <p className="section-sub">Every event becomes a gallery like these — one place for the whole group&apos;s photos.</p>
          </div>

          <div className="showcase-grid">
            {samples.map((card, i) => (
              <div key={card.title} className="print showcase-print reveal" style={{ ['--tilt' as string]: card.tilt, transitionDelay: `${i * 60}ms` }}>
                <Image src={card.img} alt={card.title} width={640} height={480} loading="lazy" />
                <div className="print-cap">
                  <div className="showcase-title">{card.title}</div>
                  <div className="showcase-sub">{card.sub}</div>
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
          <p className="section-sub" style={{ marginBottom: 32 }}>Start free. No sign-up required.</p>
          <div className="cta-input-wrap cta-input-wrap--centered">
            <input className="cta-input" placeholder="Name your event…" value={eventName} onChange={e => setEventName(e.target.value)} onKeyDown={e => e.key === 'Enter' && createEvent()} />
            <button className="cta-btn" onClick={createEvent} disabled={loading || !eventName.trim()}>
              {loading ? 'Creating…' : 'Create event →'}
            </button>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
