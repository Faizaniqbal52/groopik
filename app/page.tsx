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

  const tiltCard = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const cx = rect.width / 2
    const cy = rect.height / 2
    const rotX = ((y - cy) / cy) * -8
    const rotY = ((x - cx) / cx) * 8
    el.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.03)`
  }

  const resetCard = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)'
  }

  const cards = [
    {
      title: 'Manali Trip', sub: '47 photos · 8 people', dot: '#22c55e',
      scene: (
        <svg viewBox="0 0 200 120" width="100%" height="120" preserveAspectRatio="xMidYMid slice">
          <defs><linearGradient id="g1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0d1a2e"/><stop offset="55%" stopColor="#162a16"/><stop offset="100%" stopColor="#0c160c"/></linearGradient></defs>
          <rect width="200" height="120" fill="url(#g1)"/>
          <circle cx="165" cy="16" r="9" fill="rgba(255,240,200,0.1)"/>
          <circle cx="18" cy="10" r="1.5" fill="rgba(255,255,255,0.5)"/>
          <circle cx="52" cy="7" r="1" fill="rgba(255,255,255,0.4)"/>
          <circle cx="88" cy="14" r="1" fill="rgba(255,255,255,0.3)"/>
          <circle cx="125" cy="6" r="1.5" fill="rgba(255,255,255,0.4)"/>
          <polygon points="0,120 0,82 22,56 44,72 65,36 90,58 112,44 136,62 158,32 185,50 200,40 200,120" fill="#1c2e1c"/>
          <polygon points="0,120 0,92 16,78 38,90 60,70 85,84 108,68 132,82 155,64 178,76 200,66 200,120" fill="#0f180f"/>
          <polygon points="62,36 66,27 70,36" fill="rgba(255,255,255,0.14)"/>
          <polygon points="155,32 159,23 163,32" fill="rgba(255,255,255,0.1)"/>
        </svg>
      )
    },
    {
      title: 'The Wedding', sub: '213 photos · 34 people', dot: '#f59e0b',
      scene: (
        <svg viewBox="0 0 200 120" width="100%" height="120" preserveAspectRatio="xMidYMid slice">
          <defs><linearGradient id="g2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#1c0f06"/><stop offset="100%" stopColor="#0e0806"/></linearGradient></defs>
          <rect width="200" height="120" fill="url(#g2)"/>
          <ellipse cx="100" cy="42" rx="65" ry="22" fill="rgba(255,160,50,0.05)"/>
          <rect x="0" y="110" width="200" height="10" fill="#0a0504"/>
          <rect x="84" y="62" width="8" height="48" fill="#0e0808"/>
          <circle cx="88" cy="57" r="8" fill="#0e0808"/>
          <rect x="100" y="66" width="7" height="44" fill="#0e0808"/>
          <circle cx="103" cy="62" r="7" fill="#0e0808"/>
          <polygon points="89,78 85,110 93,110 97,78" fill="#0e0808"/>
          <path d="M40,110 L40,40 Q40,8 100,8 Q160,8 160,40 L160,110" fill="none" stroke="rgba(255,180,80,0.1)" strokeWidth="1.5"/>
          <circle cx="56" cy="24" r="1.5" fill="rgba(255,220,100,0.55)"/>
          <circle cx="100" cy="10" r="1.5" fill="rgba(255,220,100,0.6)"/>
          <circle cx="144" cy="24" r="1.5" fill="rgba(255,220,100,0.55)"/>
        </svg>
      )
    },
    {
      title: 'Mood Fest', sub: '156 photos · 61 people', dot: '#a855f7',
      scene: (
        <svg viewBox="0 0 200 120" width="100%" height="120" preserveAspectRatio="xMidYMid slice">
          <rect width="200" height="120" fill="#06040f"/>
          <line x1="32" y1="0" x2="62" y2="120" stroke="rgba(168,85,247,0.14)" strokeWidth="28"/>
          <line x1="100" y1="0" x2="100" y2="120" stroke="rgba(236,72,153,0.1)" strokeWidth="20"/>
          <line x1="168" y1="0" x2="138" y2="120" stroke="rgba(168,85,247,0.12)" strokeWidth="24"/>
          <rect x="0" y="94" width="200" height="26" fill="#030208"/>
          <circle cx="22" cy="105" r="3" fill="rgba(255,255,255,0.1)"/>
          <circle cx="50" cy="109" r="2" fill="rgba(255,255,255,0.07)"/>
          <circle cx="80" cy="103" r="3" fill="rgba(255,255,255,0.1)"/>
          <circle cx="110" cy="107" r="2" fill="rgba(255,255,255,0.07)"/>
          <circle cx="140" cy="104" r="3" fill="rgba(255,255,255,0.1)"/>
          <circle cx="170" cy="108" r="2" fill="rgba(255,255,255,0.07)"/>
        </svg>
      )
    },
    {
      title: 'Goa Trip', sub: '134 photos · 12 people', dot: '#38bdf8',
      scene: (
        <svg viewBox="0 0 200 120" width="100%" height="120" preserveAspectRatio="xMidYMid slice">
          <defs><linearGradient id="g4" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0d1825"/><stop offset="100%" stopColor="#0a1018"/></linearGradient></defs>
          <rect width="200" height="120" fill="url(#g4)"/>
          <line x1="0" y1="60" x2="200" y2="60" stroke="rgba(255,150,80,0.07)" strokeWidth="0.8"/>
          <ellipse cx="100" cy="58" rx="42" ry="5" fill="rgba(255,150,50,0.05)"/>
          <rect x="0" y="60" width="200" height="60" fill="#050d18"/>
          <path d="M0,70 Q26,66 52,70 Q78,74 104,70 Q130,66 156,70 Q178,73 200,70" fill="none" stroke="rgba(100,160,220,0.08)" strokeWidth="1"/>
          <polygon points="78,58 82,50 86,58" fill="rgba(0,0,0,0.5)"/>
          <rect x="81" y="38" width="1.5" height="20" fill="rgba(0,0,0,0.4)"/>
          <rect x="0" y="100" width="200" height="20" fill="#0a0c08"/>
        </svg>
      )
    },
    {
      title: 'Birthday Bash', sub: '72 photos · 18 people', dot: '#fbbf24',
      scene: (
        <svg viewBox="0 0 200 120" width="100%" height="120" preserveAspectRatio="xMidYMid slice">
          <rect width="200" height="120" fill="#080503"/>
          <circle cx="28" cy="20" r="16" fill="rgba(255,180,50,0.06)"/>
          <circle cx="100" cy="16" r="20" fill="rgba(255,160,40,0.05)"/>
          <circle cx="172" cy="20" r="14" fill="rgba(255,180,50,0.06)"/>
          <rect x="52" y="82" width="96" height="34" rx="3" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
          <rect x="57" y="70" width="86" height="15" rx="2" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
          <rect x="66" y="50" width="5" height="21" fill="rgba(255,255,255,0.1)"/>
          <rect x="82" y="46" width="5" height="25" fill="rgba(255,255,255,0.1)"/>
          <rect x="98" y="50" width="5" height="21" fill="rgba(255,255,255,0.1)"/>
          <rect x="114" y="48" width="5" height="23" fill="rgba(255,255,255,0.1)"/>
          <ellipse cx="68" cy="48" rx="4" ry="6.5" fill="rgba(255,200,60,0.85)"/>
          <ellipse cx="68" cy="45" rx="2" ry="4" fill="rgba(255,240,150,0.9)"/>
          <ellipse cx="84" cy="44" rx="4" ry="6.5" fill="rgba(255,200,60,0.85)"/>
          <ellipse cx="84" cy="41" rx="2" ry="4" fill="rgba(255,240,150,0.9)"/>
          <ellipse cx="100" cy="48" rx="4" ry="6.5" fill="rgba(255,200,60,0.85)"/>
          <ellipse cx="100" cy="45" rx="2" ry="4" fill="rgba(255,240,150,0.9)"/>
          <ellipse cx="116" cy="46" rx="4" ry="6.5" fill="rgba(255,200,60,0.85)"/>
          <ellipse cx="116" cy="43" rx="2" ry="4" fill="rgba(255,240,150,0.9)"/>
          <circle cx="68" cy="48" r="10" fill="rgba(255,180,30,0.07)"/>
          <circle cx="84" cy="44" r="10" fill="rgba(255,180,30,0.07)"/>
          <circle cx="100" cy="48" r="10" fill="rgba(255,180,30,0.07)"/>
          <circle cx="116" cy="46" r="10" fill="rgba(255,180,30,0.07)"/>
        </svg>
      )
    },
    {
      title: 'NYE 2024', sub: '89 photos · 22 people', dot: '#ec4899',
      scene: (
        <svg viewBox="0 0 200 120" width="100%" height="120" preserveAspectRatio="xMidYMid slice">
          <defs><linearGradient id="g6" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#050510"/><stop offset="100%" stopColor="#0a0a22"/></linearGradient></defs>
          <rect width="200" height="120" fill="url(#g6)"/>
          <rect x="16" y="50" width="16" height="70" fill="rgba(255,200,50,0.1)"/>
          <rect x="44" y="34" width="20" height="86" fill="rgba(255,200,50,0.08)"/>
          <rect x="76" y="20" width="26" height="100" fill="rgba(255,200,50,0.07)"/>
          <rect x="118" y="38" width="18" height="82" fill="rgba(255,200,50,0.09)"/>
          <rect x="150" y="46" width="16" height="74" fill="rgba(255,200,50,0.1)"/>
          <rect x="18" y="52" width="3" height="3" fill="rgba(255,220,100,0.5)"/>
          <rect x="46" y="36" width="3" height="3" fill="rgba(255,220,100,0.45)"/>
          <rect x="78" y="22" width="3.5" height="3.5" fill="rgba(255,220,100,0.4)"/>
          <rect x="86" y="34" width="3" height="3" fill="rgba(255,220,100,0.35)"/>
          <rect x="120" y="40" width="3" height="3" fill="rgba(255,220,100,0.45)"/>
          <rect x="152" y="48" width="3" height="3" fill="rgba(255,220,100,0.4)"/>
          <circle cx="38" cy="12" r="1.5" fill="rgba(255,255,255,0.4)"/>
          <circle cx="100" cy="8" r="2" fill="rgba(255,255,255,0.5)"/>
          <circle cx="160" cy="14" r="1.5" fill="rgba(255,255,255,0.3)"/>
          <circle cx="185" cy="8" r="1" fill="rgba(255,255,255,0.4)"/>
        </svg>
      )
    },
  ]

  const steps = [
    {
      num: '01',
      title: 'Create an event',
      desc: 'Name your event — wedding, trip, party. It takes 3 seconds.',
      icon: (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <rect x="4" y="6" width="24" height="20" rx="4" stroke="var(--color-accent-light)" strokeWidth="1.5"/>
          <circle cx="16" cy="16" r="5" stroke="var(--color-accent-light)" strokeWidth="1.5"/>
          <circle cx="16" cy="16" r="2" fill="var(--color-accent-light)"/>
          <circle cx="23" cy="10" r="1.5" fill="var(--color-accent-light)" opacity="0.6"/>
        </svg>
      ),
    },
    {
      num: '02',
      title: 'Share the link',
      desc: 'Send a QR code or link. No app downloads, no sign-ups.',
      icon: (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <path d="M12 16h8" stroke="var(--color-accent-light)" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M18 12l4 4-4 4" stroke="var(--color-accent-light)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <rect x="4" y="8" width="10" height="16" rx="3" stroke="var(--color-accent-light)" strokeWidth="1.5"/>
          <rect x="18" y="8" width="10" height="16" rx="3" stroke="var(--color-accent-light)" strokeWidth="1.5"/>
        </svg>
      ),
    },
    {
      num: '03',
      title: 'Collect every photo',
      desc: 'Everyone uploads to one gallery. Download all, anytime.',
      icon: (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <rect x="3" y="5" width="12" height="10" rx="2" stroke="var(--color-accent-light)" strokeWidth="1.5"/>
          <rect x="17" y="5" width="12" height="10" rx="2" stroke="var(--color-accent-light)" strokeWidth="1.5"/>
          <rect x="3" y="17" width="12" height="10" rx="2" stroke="var(--color-accent-light)" strokeWidth="1.5"/>
          <rect x="17" y="17" width="12" height="10" rx="2" stroke="var(--color-accent-light)" strokeWidth="1.5"/>
          <path d="M7 12l2-2 3 3" stroke="var(--color-accent-light)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
  ]

  const Logo = () => (
    <svg width="32" height="32" viewBox="0 0 44 44">
      <rect x="2" y="2" width="40" height="40" rx="10" fill="var(--color-accent)"/>
      <path d="M28,14 Q22,10 16,14 Q10,18 10,22 Q10,26 14,29 Q18,32 23,31 Q27,30 28,27 L28,22 L22,22" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )

  // ─── EVENT CREATED SUCCESS SCREEN ───
  if (eventCode) {
    return (
      <main style={{ background: 'var(--color-bg-primary)', minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
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

        <div style={{ position: 'relative', zIndex: 10, flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-10) var(--content-padding)', textAlign: 'center' }}>
          <div className="g-animate-in" style={{ width: '100%', maxWidth: 640 }}>
            <div className="g-badge" style={{ marginBottom: 'var(--space-6)' }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-success)', boxShadow: '0 0 8px var(--color-success)' }} />
              Event ready
            </div>

            <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, letterSpacing: 'var(--tracking-tight)', color: 'var(--color-text-primary)', marginBottom: 'var(--space-10)' }}>{eventName}</h1>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-5)', width: '100%', marginBottom: 'var(--space-5)' }}>
              {/* QR Code */}
              <div className="g-card" style={{ padding: 'var(--space-8) var(--space-6)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-4)' }}>
                <span className="g-label" style={{ marginBottom: 0 }}>Scan to join</span>
                <div style={{ background: 'white', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)' }}>
                  <QRCodeSVG
                    value={`${typeof window !== 'undefined' ? window.location.origin : ''}/join?code=${eventCode}`}
                    size={148}
                    bgColor="white"
                    fgColor="#06080d"
                    level="M"
                  />
                </div>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>Point camera to join instantly</span>
              </div>

              {/* Code + Actions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                <div className="g-card g-card-accent" style={{ padding: 'var(--space-6)', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-2)' }}>
                  <span className="g-label" style={{ marginBottom: 0 }}>Join code</span>
                  <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 900, letterSpacing: '0.12em', color: 'white', fontFamily: 'var(--font-mono)' }}>{eventCode}</div>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>Type this at groopik.com/join</span>
                </div>

                <button className="g-btn g-btn-primary g-btn-lg" onClick={copyLink} style={{ width: '100%', justifyContent: 'center', padding: 'var(--space-3) var(--space-4)' }}>
                  {copied ? '✓ Link Copied' : 'Copy Join Link'}
                </button>

                <button className="g-btn g-btn-secondary g-btn-lg" onClick={() => router.push(`/event/${eventId}?name=Host&token=host_${eventId}`)} style={{ width: '100%', justifyContent: 'center', padding: 'var(--space-3) var(--space-4)' }}>
                  Open My Event
                </button>
              </div>
            </div>

            <button className="g-btn g-btn-ghost" onClick={() => { setEventCode(''); setEventName(''); setEventId('') }} style={{ marginTop: 'var(--space-4)' }}>
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

  // ─── MAIN LANDING PAGE ───
  return (
    <main style={{ background: 'var(--color-bg-primary)', minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      <style>{`
        .hero-headline {
          font-size: var(--text-4xl);
          font-weight: 900;
          letter-spacing: var(--tracking-tight);
          line-height: var(--leading-tight);
          margin: 0 0 var(--space-5);
          background: linear-gradient(135deg, #ffffff 0%, var(--color-accent-light) 50%, #c084fc 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .hero-grid {
          display: grid;
          grid-template-columns: minmax(320px, 480px) 1fr;
          gap: var(--space-12);
          align-items: center;
        }
        .steps-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--space-5);
        }
        .step-card {
          text-align: center;
          padding: var(--space-8) var(--space-6);
        }
        .step-num {
          font-family: var(--font-mono);
          font-size: var(--text-xs);
          font-weight: 700;
          letter-spacing: var(--tracking-wider);
          background: var(--gradient-accent);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: var(--space-4);
          display: block;
        }
        .showcase-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--space-4);
        }
        .showcase-card {
          border-radius: var(--radius-lg);
          overflow: hidden;
          transition: transform 0.2s var(--ease-out), box-shadow 0.2s var(--ease-out);
          cursor: pointer;
          border: 1px solid var(--color-border);
        }
        .showcase-card:hover {
          box-shadow: var(--shadow-lg);
        }
        .input-wrap {
          display: flex;
          border-radius: var(--radius-md);
          overflow: hidden;
          border: 1px solid var(--color-border);
          transition: border-color var(--duration-normal) var(--ease-out), box-shadow var(--duration-normal) var(--ease-out);
          max-width: 420px;
        }
        .input-wrap:focus-within {
          border-color: var(--color-border-focus);
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }
        .section {
          position: relative;
          z-index: 10;
          padding: var(--space-20) var(--content-padding);
          max-width: var(--max-width);
          margin: 0 auto;
          width: 100%;
        }
        .section-title {
          font-size: var(--text-xl);
          font-weight: 800;
          letter-spacing: var(--tracking-tight);
          color: var(--color-text-primary);
          text-align: center;
          margin-bottom: var(--space-2);
        }
        .section-sub {
          font-size: var(--text-sm);
          color: var(--color-text-tertiary);
          text-align: center;
          margin-bottom: var(--space-12);
        }
        .separator {
          height: 1px;
          background: var(--color-border);
          max-width: var(--max-width);
          margin: 0 auto;
          width: 90%;
        }
        .trust-item {
          display: flex;
          align-items: center;
          gap: var(--space-1);
        }
        .cta-section {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .hero-cards { display: none !important; }
          .steps-grid { grid-template-columns: 1fr !important; }
          .showcase-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .hero-headline { font-size: var(--text-3xl) !important; }
        }
        @media (max-width: 480px) {
          .showcase-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div className="g-bg-grid" />
      <div className="g-bg-glow g-bg-glow-1" />
      <div className="g-bg-glow g-bg-glow-2" />

      {/* ─── NAVBAR ─── */}
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

      {/* ═══════════════════════════════════
          SECTION 1: HERO — The Emotional Hook
          ═══════════════════════════════════ */}
      <section className="section" style={{ paddingTop: 'var(--space-16)', paddingBottom: 'var(--space-16)' }}>
        <div className="hero-grid">
          {/* Left: Content */}
          <div className="g-animate-in">
            <div className="g-badge g-badge-live" style={{ marginBottom: 'var(--space-8)' }}>
              Free · No account needed
            </div>

            <h1 className="hero-headline">
              The photos you<br />almost never got.
            </h1>

            <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-secondary)', lineHeight: 'var(--leading-normal)', margin: '0 0 var(--space-10)', maxWidth: 380 }}>
              Create an event. Share the link.<br />
              Everyone uploads. One gallery — yours to keep.
            </p>

            <span className="g-label">What are you celebrating?</span>
            <div className="input-wrap">
              <input
                id="hero-input"
                className="g-input"
                placeholder="Manali Trip, Birthday Photos..."
                value={eventName}
                onChange={e => setEventName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && createEvent()}
                style={{ border: 'none', borderRadius: 0, background: 'transparent', flex: 1 }}
              />
              <button
                className="g-btn g-btn-primary"
                onClick={createEvent}
                disabled={loading || !eventName.trim()}
                style={{ borderRadius: 0, padding: 'var(--space-3) var(--space-5)', borderLeft: '1px solid var(--color-border)' }}
              >
                {loading ? 'Creating...' : 'Create →'}
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)', marginTop: 'var(--space-5)', flexWrap: 'wrap' }}>
              {['No account', 'Free forever', 'Share via QR'].map(t => (
                <div key={t} className="trust-item">
                  <svg width="14" height="14" viewBox="0 0 14 14">
                    <circle cx="7" cy="7" r="6" fill="none" stroke="var(--color-accent)" strokeWidth="1" opacity="0.4"/>
                    <path d="M4.5,7 L6,8.5 L9.5,5.5" stroke="var(--color-accent)" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>{t}</span>
                </div>
              ))}
              <span style={{ width: 1, height: 12, background: 'var(--color-border)', display: 'inline-block' }} />
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-accent-light)', animation: 'g-count-pulse 3s ease-in-out infinite' }}>
                {photoCount.toLocaleString()} photos shared today
              </span>
            </div>
          </div>

          {/* Right: Event Cards */}
          <div className="hero-cards g-animate-in g-animate-in-delay-2">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-3)', maxWidth: 420, margin: '0 auto' }}>
              {cards.slice(0, 4).map((card, i) => (
                <div key={i} className="showcase-card" onMouseMove={tiltCard} onMouseLeave={resetCard}>
                  <div style={{ overflow: 'hidden' }}>{card.scene}</div>
                  <div style={{ background: 'var(--color-bg-elevated)', borderTop: '1px solid var(--color-border)', padding: 'var(--space-2) var(--space-3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '0.625rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>{card.title}</div>
                      <div style={{ fontSize: '0.5rem', color: 'var(--color-text-tertiary)', marginTop: 1 }}>{card.sub}</div>
                    </div>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: card.dot, boxShadow: `0 0 6px ${card.dot}`, flexShrink: 0 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="separator" />

      {/* ═══════════════════════════════════
          SECTION 2: HOW IT WORKS — The Solution
          ═══════════════════════════════════ */}
      <section className="section">
        <div className="g-animate-in">
          <div className="section-title">Three steps. Every photo.</div>
          <div className="section-sub">No apps to install. No accounts to create. Just photos.</div>
        </div>

        <div className="steps-grid">
          {steps.map((step, i) => (
            <div key={i} className={`g-card step-card g-animate-in g-animate-in-delay-${i + 1}`}>
              <span className="step-num">{step.num}</span>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--space-5)' }}>
                <div style={{ width: 56, height: 56, borderRadius: 'var(--radius-md)', background: 'var(--color-accent-dim)', border: '1px solid var(--color-accent-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {step.icon}
                </div>
              </div>
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>{step.title}</h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)', lineHeight: 'var(--leading-normal)' }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="separator" />

      {/* ═══════════════════════════════════
          SECTION 3: SHOWCASE — Social Proof
          ═══════════════════════════════════ */}
      <section className="section">
        <div className="g-animate-in">
          <div className="section-title">Moments people collected</div>
          <div className="section-sub">Real events. Real memories. All in one place.</div>
        </div>

        <div className="showcase-grid g-animate-in g-animate-in-delay-1">
          {cards.map((card, i) => (
            <div key={i} className="showcase-card" onMouseMove={tiltCard} onMouseLeave={resetCard}>
              <div style={{ overflow: 'hidden' }}>{card.scene}</div>
              <div style={{ background: 'var(--color-bg-elevated)', borderTop: '1px solid var(--color-border)', padding: 'var(--space-3) var(--space-4)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-text-primary)' }}>{card.title}</div>
                  <div style={{ fontSize: '0.5625rem', color: 'var(--color-text-tertiary)', marginTop: 2 }}>{card.sub}</div>
                </div>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: card.dot, boxShadow: `0 0 6px ${card.dot}`, flexShrink: 0 }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="separator" />

      {/* ═══════════════════════════════════
          SECTION 4: FINAL CTA — Close the Loop
          ═══════════════════════════════════ */}
      <section className="section cta-section">
        <div className="g-animate-in">
          <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, letterSpacing: 'var(--tracking-tight)', color: 'var(--color-text-primary)', marginBottom: 'var(--space-3)' }}>
            Ready to collect your moments?
          </h2>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-8)' }}>
            Start for free. No sign-up required.
          </p>
          <div className="input-wrap" style={{ margin: '0 auto' }}>
            <input
              className="g-input"
              placeholder="Name your event..."
              value={eventName}
              onChange={e => setEventName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && createEvent()}
              style={{ border: 'none', borderRadius: 0, background: 'transparent', flex: 1 }}
            />
            <button
              className="g-btn g-btn-primary"
              onClick={createEvent}
              disabled={loading || !eventName.trim()}
              style={{ borderRadius: 0, padding: 'var(--space-3) var(--space-5)', borderLeft: '1px solid var(--color-border)' }}
            >
              {loading ? 'Creating...' : 'Create →'}
            </button>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="g-footer">
        <div className="g-footer-links">
          <span className="g-footer-link g-hide-mobile">No install</span>
          <span className="g-footer-link g-hide-mobile">Instant gallery</span>
          <span className="g-footer-link g-hide-mobile">Share via QR</span>
          <span style={{ width: 1, height: 12, background: 'var(--color-border)', display: 'inline-block' }} className="g-hide-mobile" />
          <span className="g-footer-link" onClick={() => router.push('/terms')}>Terms</span>
          <span className="g-footer-link" onClick={() => router.push('/privacy')}>Privacy</span>
        </div>
        <span className="g-footer-copy">© 2026 Groopik</span>
      </footer>
    </main>
  )
}